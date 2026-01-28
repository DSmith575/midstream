import os
from dotenv import load_dotenv
from openai import OpenAI
from io import BytesIO
from app.lib.constants.gptCompletions import GPT_COMPLETION_SECTIONS
from app.lib.processing.pdfProcessing.pdf_processing import create_pdf, generate_full_referral_form
from app.lib.processing.audio.audio_processing import transcribe_audio_to_paragraphs
from typing import List
import fitz
from fastapi.responses import StreamingResponse

load_dotenv()

api_key = os.getenv('OPENAI_API_KEY')

client = OpenAI(api_key=api_key)

async def process_referral_with_openai(metadata: dict, pdf_paths: List[str]):
    extracted_text = []

    # Extract text from structured referral data fields
    referral_fields = ['communication', 'disability', 'additionalInformation']
    for field_name in referral_fields:
        if field_name in metadata and metadata[field_name]:
            field_data = metadata[field_name]
            if isinstance(field_data, dict):
                print(f"Processing {field_name} data")
                for key, value in field_data.items():
                    if key != 'id' and value:
                        label = key.replace('_', ' ').title()
                        extracted_text.append(f"{label}: {value}")

    # Extract text from notes if available
    if 'notes' in metadata and metadata['notes']:
        print(f"Processing {len(metadata['notes'])} notes")
        for note in metadata['notes']:
            if 'content' in note and note['content']:
                extracted_text.append(f"Note: {note['content']}")

    # Extract text from documents' transcribedContent if available
    if 'documents' in metadata and metadata['documents']:
        for doc in metadata['documents']:
            if 'transcribedContent' in doc and doc['transcribedContent']:
                print(f"Using transcribed content from document: {doc.get('name', 'unknown')}")
                extracted_text.append(doc['transcribedContent'])
    
    # Fallback: Process any PDF files if provided (for backwards compatibility)
    for pdf_path in pdf_paths:
        print(f"Extracting text from PDF: {pdf_path}")
        with fitz.open(pdf_path) as doc:
            for page in doc:
                extracted_text.append(page.get_text())
    
    extracted_text = "\n".join(extracted_text)
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
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"Error getting response from OpenAI: {e}")
        return None
    

async def analyze_completions_for_form(text):
    form_data = {}

    print("Analyzing PDF for form data...")

    for section, items in GPT_COMPLETION_SECTIONS.items():
        if section not in form_data:
            form_data[section] = {}
        
        for item in items:
            print(f"Looking for item: {item}") 
            response = await get_relevant_information(item, text)
            
            if response is None:
                print(f"Warning: No relevant information found for {item}")
            else:
                print(f"Found relevant information for {item}: {response}")

            form_data[section][item] = response  # Update the item-response pair
    print('FORM_DATA',form_data)

    return form_data


async def generate_pdf_summary(form_data: dict) -> str:
    """
    Generate a comprehensive summary of all form data for PDF inclusion.
    
    Args:
        form_data: Dictionary containing all the analyzed form sections and responses
    
    Returns:
        A summarized narrative suitable for PDF inclusion
    """
    # Build a structured text from form data
    structured_text = "REFERRAL ASSESSMENT SUMMARY\n\n"
    
    for section, items in form_data.items():
        structured_text += f"\n{section.upper()}:\n"
        for item, response in items.items():
            if response and response != "No information found":
                structured_text += f"• {item}: {response}\n"
    
    prompt = (
        "You are a professional social worker creating a concise summary for a PDF referral document. "
        "Based on the following assessment data, create a well-organized, professional summary (2-3 paragraphs) "
        "that provides a clear overview of the person's needs, abilities, and circumstances. "
        "The summary should be suitable for a formal PDF document and easy to understand by healthcare professionals.\n\n"
        f"Assessment Data:\n{structured_text}"
    )
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professional social worker and healthcare advocate creating formal assessments."},
                {"role": "user", "content": prompt}
            ],
        )
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        print(f"Error generating PDF summary: {e}")
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
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a healthcare professional. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ],
        )
        
        response_text = response.choices[0].message.content.strip()
        
        # Parse JSON response
        import json
        support_data = json.loads(response_text)
        
        return support_data
    
    except Exception as e:
        print(f"Error extracting support keywords: {e}")
        return {
            "primary_needs": [
                {"category": "Assessment Required", "description": "Full assessment needed to determine support areas"}
            ]
        }