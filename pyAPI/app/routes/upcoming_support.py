import json

from fastapi import APIRouter, Form
from fastapi.responses import JSONResponse

from app.lib.aiCompletions.upcoming_support import extract_upcoming_support_notifications
from app.lib.constants.routes import APIRoutes

router = APIRouter()


@router.post(APIRoutes.UPCOMING_SUPPORT.value)
async def upcoming_support(metadata: str = Form(...)):
    try:
        parsed = json.loads(metadata)
    except json.JSONDecodeError:
        return JSONResponse(status_code=400, content={"error": "Invalid JSON in metadata"})

    items = parsed.get("items")
    if not isinstance(items, list):
        return JSONResponse(status_code=400, content={"error": "metadata.items must be an array"})

    notifications = await extract_upcoming_support_notifications(
        items=items,
        today_iso=parsed.get("today"),
    )

    return JSONResponse(content={"data": notifications})
