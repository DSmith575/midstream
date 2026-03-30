import json
import logging

from fastapi import APIRouter, Form
from fastapi.responses import JSONResponse

from app.lib.aiCompletions.upcoming_support import extract_upcoming_support_notifications
from app.lib.constants.routes import APIRoutes

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post(APIRoutes.UPCOMING_SUPPORT.value)
async def upcoming_support(metadata: str = Form(...)):
    try:
        parsed = json.loads(metadata)
    except json.JSONDecodeError:
        logger.warning("Rejected upcoming-support request with invalid metadata JSON")
        return JSONResponse(status_code=400, content={"error": "Invalid JSON in metadata"})

    items = parsed.get("items")
    if not isinstance(items, list):
        logger.warning("Rejected upcoming-support request with non-list items")
        return JSONResponse(status_code=400, content={"error": "metadata.items must be an array"})

    try:
        notifications = await extract_upcoming_support_notifications(
            items=items,
            today_iso=parsed.get("today"),
        )
    except Exception:
        logger.exception("Unexpected failure while extracting upcoming support notifications")
        return JSONResponse(status_code=500, content={"error": "Failed to extract upcoming support notifications"})

    return JSONResponse(content={"data": notifications})
