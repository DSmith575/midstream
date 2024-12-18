from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from app.lib.constants.routes import APIRoutes
from app.lib.utils.utils import allowed_file, sanitize_filename, split_filename_from_extension
from app.lib.constants.constants import ALLOWED_EXTENSIONS_AUDIO
from app.lib.aiCompletions.gpt_completions import process_client_audio
from app.lib.processing.audio.audio_processing import convert_to_wav
from app.lib.processing.pdfProcessing.pdf_processing import generate_pdf_with_audio_transcript


router = APIRouter()

@router.post(APIRoutes.UPLOAD_AUDIO.value)
async def upload_audio(file: UploadFile = File(default=None)):
    if file is None or not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    if not allowed_file(filename=file.filename, allowed_extensions=ALLOWED_EXTENSIONS_AUDIO):
        return {"message": "Invalid file type"}
    
    try:
        print("File received:", file.filename)
        sanitize_file = sanitize_filename(file.filename) + '.' + file.filename.rsplit('.', 1)[1].lower()
        filename = split_filename_from_extension(sanitize_file)
        wav_buffer = convert_to_wav(file, filename)
        transcription = await process_client_audio(wav_buffer)

        pdf_buffer = generate_pdf_with_audio_transcript(transcription, filename)


        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={pdf_buffer.name}"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")
    