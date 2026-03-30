"""Audio upload route for processing audio files and generating PDF transcripts."""
import logging
import os

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, File, UploadFile, HTTPException, Form

from app.lib.constants.routes import APIRoutes
from app.lib.utils.utils import allowed_file, sanitize_filename, split_filename_from_extension
from app.lib.constants.constants import ALLOWED_EXTENSIONS_AUDIO
from app.lib.aiCompletions.gpt_completions import process_client_audio
from app.lib.processing.audio.audio_processing import convert_to_wav
from app.lib.processing.pdfProcessing.pdf_processing import generate_pdf_with_audio_transcript

# Configure logging
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
BASE_API_URL = os.getenv('NODE_API_URL')
if not BASE_API_URL:
    logger.error("NODE_API_URL environment variable not set")
    raise ValueError("NODE_API_URL environment variable must be set")

NODE_API_URL = f"{BASE_API_URL}referral-documents/upload-audio"

router = APIRouter()


def _validate_upload_payload(file: UploadFile | None, referral_id: str) -> None:
    if not referral_id:
        logger.warning("Upload attempt made without referral ID")
        raise HTTPException(status_code=400, detail="Referral ID is required")

    if file is None or not file.filename:
        logger.warning("Upload attempt for referralId %s with no file", referral_id)
        raise HTTPException(status_code=400, detail="No file provided")

    if not allowed_file(filename=file.filename, allowed_extensions=ALLOWED_EXTENSIONS_AUDIO):
        logger.warning("Invalid file type: %s for referralId %s", file.filename, referral_id)
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type, allowed types are: {', '.join(ALLOWED_EXTENSIONS_AUDIO)}",
        )


def _build_service_headers() -> dict[str, str]:
    service_api_key = os.getenv('SERVICE_API_KEY')
    if not service_api_key:
        logger.error("SERVICE_API_KEY environment variable not set")
        raise HTTPException(status_code=500, detail="Server configuration error")
    return {"x-api-key": service_api_key}


@router.post(APIRoutes.UPLOAD_AUDIO.value)
async def upload_audio(
    file: UploadFile = File(default=None),
    referralId: str = Form(...)
) -> dict[str, str]:
    """
    Process an audio file, generate a transcript, and upload as PDF.
    
    Args:
        file: The audio file to process (mp3, wav, m4a, etc.)
        referralId: The referral document ID to associate with the upload
    
    Returns:
        Dictionary with success message
    
    Raises:
        HTTPException: If file validation, processing, or upload fails
    """
    _validate_upload_payload(file, referralId)
    
    try:
        logger.info("Processing audio file %s for referralId %s", file.filename, referralId)
        
        # Convert to WAV format
        sanitize_file = sanitize_filename(file.filename) + '.' + file.filename.rsplit('.', 1)[1].lower()
        filename = split_filename_from_extension(sanitize_file)
        wav_buffer = convert_to_wav(file, filename)
        
        # Transcribe audio to paragraphs
        transcription = await process_client_audio(wav_buffer)
        logger.info("Successfully transcribed %s: %s paragraphs", filename, len(transcription))
        
        # Convert transcription list to string
        transcribed_text = "\n\n".join(transcription)
        
        # Prepare upload payload with transcribed content
        payload = {
            "name": filename,
            "referralId": referralId,
            "type": "PDF",
            "transcribedContent": transcribed_text,
        }
        
        # Upload to Node backend (sending JSON)
        async with httpx.AsyncClient() as client:
            headers = _build_service_headers()
            
            response = await client.post(NODE_API_URL, json=payload, headers=headers)
            response.raise_for_status()

            # Update checklist flag on Node backend
            checklist_url = f"{BASE_API_URL}referralForms/checklist/{referralId}"
            checklist_resp = await client.patch(checklist_url, json={"audio": True}, headers=headers)
            checklist_resp.raise_for_status()

        logger.info("Uploaded transcription and updated checklist for referralId %s", referralId)
        return {"detail": "Audio file processed and uploaded successfully"}

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error("Error processing audio for referralId %s: %s", referralId, str(e), exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error processing audio: {str(e)}"
        )
    