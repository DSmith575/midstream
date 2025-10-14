import os
from dotenv import load_dotenv
from openai import OpenAI
from io import BytesIO
from app.lib.constants.gptCompletions import GPT_COMPLETION_SECTIONS
from app.lib.processing.pdfProcessing.pdf_processing import create_pdf, generate_full_referral_form
from typing import List
import fitz
from fastapi.responses import StreamingResponse

load_dotenv()

api_key = os.getenv('OPENAI_API_KEY')

client = OpenAI(api_key=api_key)

async def process_referral_with_openai(metadata: dict, pdf_paths: List[str]):
    extracted_text = []

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
    

async def process_client_audio(audio_buffer: BytesIO) -> str:
    """Main processing function: chunk audio, process, transcribe, and convert."""
    try:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_buffer,
            response_format="text"
        )
        return transcript
    
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