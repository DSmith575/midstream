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
    
    # prioity list, suggest what services the person may need
    
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