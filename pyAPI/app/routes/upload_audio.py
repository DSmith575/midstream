import httpx
from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from fastapi.responses import StreamingResponse
from app.lib.constants.routes import APIRoutes
from app.lib.utils.utils import allowed_file, sanitize_filename, split_filename_from_extension
from app.lib.constants.constants import ALLOWED_EXTENSIONS_AUDIO
from app.lib.aiCompletions.gpt_completions import process_client_audio
from app.lib.processing.audio.audio_processing import convert_to_wav
from app.lib.processing.pdfProcessing.pdf_processing import generate_pdf_with_audio_transcript
import os
from dotenv import load_dotenv

load_dotenv()
BASE_API_URL = os.getenv('NODE_API_URL')
NODE_API_URL = f"{BASE_API_URL}referral-documents/upload-audio"

router = APIRouter()

# url + referral-documents/upload-audio

@router.post(APIRoutes.UPLOAD_AUDIO.value)
async def upload_audio(file: UploadFile = File(default=None), referralId: str = Form(...)):

    if not referralId:
        raise HTTPException(status_code=400, detail="Referral ID is required")
    
    if file is None or not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    if not allowed_file(filename=file.filename, allowed_extensions=ALLOWED_EXTENSIONS_AUDIO):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type, allowed types are: {', '.join(ALLOWED_EXTENSIONS_AUDIO)}"
    )
    
    try:
        print("File received:", file.filename)
        sanitize_file = sanitize_filename(file.filename) + '.' + file.filename.rsplit('.', 1)[1].lower()
        filename = split_filename_from_extension(sanitize_file)
        wav_buffer = convert_to_wav(file, filename)
        transcription = await process_client_audio(wav_buffer)

        pdf_buffer = generate_pdf_with_audio_transcript(transcription, filename)
        pdf_bytes = pdf_buffer.getvalue()

        files = {
            "pdf": (f"{filename}.pdf", pdf_bytes, "application/pdf"),
        }

        data = {
            "name": filename,
            "referralId": referralId,
            "type": "PDF",
        }

        print(data)

        print(referralId)

        async with httpx.AsyncClient() as client:
            response = await client.post(NODE_API_URL, files=files, data=data)
            response.raise_for_status()

            print("File uploaded successfully")

        return {"detail": "Audio file processed and uploaded successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")
    