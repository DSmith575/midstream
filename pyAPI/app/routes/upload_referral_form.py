from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from app.lib.constants.routes import APIRoutes
from typing import List
import json
from pathlib import Path
from fastapi.responses import JSONResponse
import tempfile
from app.lib.aiCompletions.gpt_completions import process_referral_with_openai

router = APIRouter()

@router.post(APIRoutes.GENERATE_REFERRAL.value)
async def generate_referral(
  metadata: str = Form(...)
):
  
  """
  Receives:
  - metadata: Json str from Node containing referral info (includes documents with transcribedContent)
  """

  try:
    metadata_dict = json.loads(metadata)
  except json.JSONDecodeError:
    return JSONResponse(status_code=400, content={"error": "Invalid JSON in metadata"})
  
  # No need to handle files anymore - documents are included as transcribedContent in metadata
  built_pdf = await process_referral_with_openai(metadata_dict, [])
  return built_pdf

# upload referralForm data from prisma database and the audio file pdf
# then process the audio file and generate a pdf with the audio transcript