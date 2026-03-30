import json
import logging
import os
from io import BytesIO
from typing import List

import fitz
from dotenv import load_dotenv
from fastapi.responses import StreamingResponse
from openai import OpenAI

from app.lib.constants.gptCompletions import GPT_COMPLETION_SECTIONS
from app.lib.processing.audio.audio_processing import transcribe_audio_to_paragraphs
from app.lib.processing.pdfProcessing.pdf_processing import generate_full_referral_form
from app.lib.utils.color_mapping import detect_categories_in_text, get_primary_category

load_dotenv()

api_key = os.getenv('OPENAI_API_KEY')

client = OpenAI(api_key=api_key)
logger = logging.getLogger(__name__)

DEFAULT_CHAT_MODEL = "gpt-3.5-turbo"


def _chat_completion(
    system_prompt: str,
    user_prompt: str,
    model: str = DEFAULT_CHAT_MODEL,
    temperature: float | None = None,
):
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    }
    if temperature is not None:
        payload["temperature"] = temperature

    return client.chat.completions.create(**payload)


def _extract_referral_fields_text(metadata: dict) -> list[str]:
    extracted_text: list[str] = []
    referral_fields = ['communication', 'disability', 'additionalInformation', 'goals']

    for field_name in referral_fields:
        field_data = metadata.get(field_name)
        if not isinstance(field_data, dict):
            continue

        logger.info("Processing %s data", field_name)
        for key, value in field_data.items():
            if key != 'id' and value:
                label = key.replace('_', ' ').title()
                extracted_text.append(f"{label}: {value}")

    return extracted_text


def _extract_notes_text(metadata: dict) -> list[str]:
    extracted_text: list[str] = []
    notes = metadata.get('notes')
    if not notes:
        return extracted_text

    logger.info("Processing %s notes", len(notes))
    for note in notes:
        content = note.get('content') if isinstance(note, dict) else None
        if content:
            extracted_text.append(f"Note: {content}")

    return extracted_text


def _extract_documents_text(metadata: dict) -> list[str]:
    extracted_text: list[str] = []
    documents = metadata.get('documents')
    if not documents:
        return extracted_text

    for doc in documents:
        if not isinstance(doc, dict):
            continue
        transcribed_content = doc.get('transcribedContent')
        if transcribed_content:
            logger.info("Using transcribed content from document: %s", doc.get('name', 'unknown'))
            extracted_text.append(transcribed_content)

    return extracted_text


def _extract_pdf_paths_text(pdf_paths: List[str]) -> list[str]:
    extracted_text: list[str] = []
    for pdf_path in pdf_paths:
        logger.info("Extracting text from PDF: %s", pdf_path)
        with fitz.open(pdf_path) as doc:
            for page in doc:
                extracted_text.append(page.get_text())
    return extracted_text


def _build_structured_assessment_text(form_data: dict) -> str:
    parts = ["REFERRAL ASSESSMENT SUMMARY\n"]
    for section, items in form_data.items():
        if not isinstance(items, dict):
            continue
        parts.append(f"\n{section.upper()}:\n")
        for item, response in items.items():
            if response and response != "No information found":
                parts.append(f"- {item}: {response}\n")
    return "".join(parts)

async def process_referral_with_openai(metadata: dict, pdf_paths: List[str]):
    extracted_parts = []
    extracted_parts.extend(_extract_referral_fields_text(metadata))
    extracted_parts.extend(_extract_notes_text(metadata))
    extracted_parts.extend(_extract_documents_text(metadata))
    extracted_parts.extend(_extract_pdf_paths_text(pdf_paths))

    extracted_text = "\n".join(extracted_parts)
    form_data = await analyze_completions_for_form(extracted_text)
    
    # Generate summary and support keywords
    pdf_summary = await generate_pdf_summary(form_data)
    support_keywords = await extract_support_keywords(pdf_summary, form_data)
    
    # Add summary and keywords to metadata for PDF generation
    metadata['pdf_summary'] = pdf_summary
    metadata['support_keywords'] = support_keywords
    
    built_pdf_data = generate_full_referral_form(metadata, form_data)
    built_pdf_data.seek(0)
    return StreamingResponse(built_pdf_data, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename={built_pdf_data.name}"})
    

async def process_client_audio(audio_buffer: BytesIO) -> list[str]:
    """
    Process audio file: transcribe using Whisper and return as formatted paragraphs.
    
    Args:
        audio_buffer: BytesIO buffer containing audio data
    
    Returns:
        List of paragraphs from transcription
    
    Raises:
        RuntimeError: If audio processing fails
    """
    try:
        # Create a proper UploadFile-like object for the transcription function
        class AudioWrapper:
            def __init__(self, buffer):
                self.file = buffer
                # Ensure the buffer has a name attribute for the transcription
                if not hasattr(buffer, 'name'):
                    buffer.name = "audio.wav"
                self.filename = getattr(buffer, 'name', 'audio.wav')
        
        audio_wrapper = AudioWrapper(audio_buffer)
        paragraphs = transcribe_audio_to_paragraphs(audio_wrapper)
        return paragraphs
    
    except Exception as e:
        raise RuntimeError(f"Unexpected error processing audio: {e}")

async def get_relevant_information(section, text):
    prompt = (f"Based on the following text, does the person mentioned have any issues related to {section}? do not include asking if there are any issues, just provide the information.\n\n"
              f"If yes, provide details. Text: {text} try to turn it into a usable narrative.\n\n"
              f"If there is nothing related to {section}, please just return No information found."
              )
    
    try:
        response = _chat_completion(
            system_prompt="You are a helpful assistant.",
            user_prompt=prompt,
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        logger.error("Error getting response from OpenAI: %s", e)
        return None
    

async def analyze_completions_for_form(text):
    form_data = {}
    category_mapping = {}  # Track which category each response belongs to

    logger.info("Analyzing PDF for form data")

    for section, items in GPT_COMPLETION_SECTIONS.items():
        if section not in form_data:
            form_data[section] = {}
        
        for item in items:
            logger.info("Looking for item: %s", item)
            response = await get_relevant_information(item, text)
            
            if response is None:
                logger.warning("No relevant information found for %s", item)
            else:
                logger.info("Found relevant information for %s", item)
                # Detect categories mentioned in the response
                detected_categories = detect_categories_in_text(response)
                if detected_categories:
                    primary_category = get_primary_category(response)
                    category_mapping[f"{section}:{item}"] = primary_category

            form_data[section][item] = response  # Update the item-response pair
    
    logger.debug('FORM_DATA %s', form_data)
    logger.debug('CATEGORY_MAPPING %s', category_mapping)

    # Store category mapping in form_data for PDF generation
    form_data['_category_mapping'] = category_mapping

    return form_data


async def generate_pdf_summary(form_data: dict) -> str:
    """
    Generate a comprehensive summary of all form data for PDF inclusion.
    
    Args:
        form_data: Dictionary containing all the analyzed form sections and responses
    
    Returns:
        A summarized narrative suitable for PDF inclusion
    """
    structured_text = _build_structured_assessment_text(form_data)
    
    prompt = (
        "You are a professional social worker creating a concise summary for a PDF referral document. "
        "Based on the following assessment data, create a well-organized, professional summary (2-3 paragraphs) "
        "that provides a clear overview of the person's needs, abilities, and circumstances. "
        "The summary should be suitable for a formal PDF document and easy to understand by healthcare professionals.\n\n"
        f"Assessment Data:\n{structured_text}"
    )
    
    try:
        response = _chat_completion(
            system_prompt="You are a professional social worker and healthcare advocate creating formal assessments.",
            user_prompt=prompt,
        )
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        logger.error("Error generating PDF summary: %s", e)
        return "Summary could not be generated at this time."


async def extract_support_keywords(summary: str, form_data: dict) -> dict:
    """
    Extract key areas of support needed based on the summary and form data.
    
    Args:
        summary: The generated PDF summary
        form_data: The original form data dictionary
    
    Returns:
        Dictionary containing support categories and recommended help areas
    """
    prompt = (
        "You are a healthcare professional identifying support needs. "
        "Based on the following assessment summary and data, identify the TOP 5-7 key areas "
        "where this person could benefit from support or assistance. "
        "Format your response as a JSON object with 'primary_needs' as an array of objects, "
        "each containing 'category' and 'description'. "
        "Categories should be specific, actionable, and based on identified challenges.\n\n"
        f"Summary:\n{summary}\n\n"
        f"Full Assessment Data:\n{str(form_data)}\n\n"
        "Respond ONLY with valid JSON, no additional text."
    )
    
    try:
        response = _chat_completion(
            system_prompt="You are a healthcare professional. Always respond with valid JSON only.",
            user_prompt=prompt,
        )
        
        response_text = response.choices[0].message.content.strip()
        
        support_data = json.loads(response_text)
        
        return support_data
    
    except Exception as e:
        logger.error("Error extracting support keywords: %s", e)
        return {
            "primary_needs": [
                {"category": "Assessment Required", "description": "Full assessment needed to determine support areas"}
            ]
        }