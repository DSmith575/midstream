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
  metadata: str = Form(...),
  files: List[UploadFile] = File(...)
):
  
  """
  Receives:
  - metadata: Json str from Node containing referral info
  - files: list of uploaded PDFs
  """

  try:
    metadata_dict = json.loads(metadata)
  except json.JSONDecodeError:
    return JSONResponse(status_code=400, content={"error": "Invalid JSON in metadata"})
  
  saved_files = []
  for file in files:
    suffix = Path(file.filename).suffix
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
      content = await file.read()
      temp_file.write(content)
      saved_files.append(temp_file.name)
  built_pdf = await process_referral_with_openai(metadata_dict, saved_files)
  return built_pdf

# upload referralForm data from prisma database and the audio file pdf
# then process the audio file and generate a pdf with the audio transcript