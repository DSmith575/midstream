import json

from fastapi import APIRouter, Form
from fastapi.responses import JSONResponse

from app.lib.aiCompletions.gpt_completions import process_referral_with_openai
from app.lib.constants.routes import APIRoutes

router = APIRouter()


@router.post(APIRoutes.GENERATE_REFERRAL.value)
async def generate_referral(metadata: str = Form(...)):
    """
    Receives metadata JSON from Node containing referral info.
    """

    try:
        metadata_dict = json.loads(metadata)
    except json.JSONDecodeError:
        return JSONResponse(status_code=400, content={"error": "Invalid JSON in metadata"})

    return await process_referral_with_openai(metadata_dict, [])