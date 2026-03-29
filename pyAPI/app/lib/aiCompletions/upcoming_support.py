import base64
import io
import json
import os
import re
from datetime import datetime, timezone
from typing import Any

import fitz
from dotenv import load_dotenv
from openai import OpenAI
from PIL import Image

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
MODEL_NAME = os.getenv("OPENAI_MODEL_UPCOMING_SUPPORT", "gpt-4o-mini")
MAX_SOURCE_CHARS = 5000
MAX_IMAGE_DIMENSION = 1600
MAX_IMAGE_BYTES = 1_000_000

MONTHS = {
    "january": 1,
    "february": 2,
    "march": 3,
    "april": 4,
    "may": 5,
    "june": 6,
    "july": 7,
    "august": 8,
    "september": 9,
    "october": 10,
    "november": 11,
    "december": 12,
}

MONTH_ALIASES = {
    "jan": 1,
    "january": 1,
    "feb": 2,
    "february": 2,
    "mar": 3,
    "march": 3,
    "apr": 4,
    "april": 4,
    "may": 5,
    "jun": 6,
    "june": 6,
    "jul": 7,
    "july": 7,
    "aug": 8,
    "august": 8,
    "sep": 9,
    "sept": 9,
    "september": 9,
    "oct": 10,
    "october": 10,
    "nov": 11,
    "november": 11,
    "dec": 12,
    "december": 12,
}

DATE_PATTERN = re.compile(
    r"\b(?P<day>\d{1,2})(?:st|nd|rd|th)?\s+(?P<month>jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\.?)(?:\s+(?P<year>\d{2,4}))?\b",
    re.IGNORECASE,
)

DATE_PATTERN_MONTH_DAY = re.compile(
    r"\b(?P<month>jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\.?)[,\s]+(?P<day>\d{1,2})(?:st|nd|rd|th)?(?:[,\s]+(?P<year>\d{2,4}))?\b",
    re.IGNORECASE,
)

DATE_PATTERN_NUMERIC = re.compile(
    r"\b(?P<day>\d{1,2})[\/-](?P<month>\d{1,2})(?:[\/-](?P<year>\d{2,4}))?\b",
    re.IGNORECASE,
)

DATE_PATTERN_YMD = re.compile(
    r"\b(?P<year>\d{4})[\/-](?P<month>\d{1,2})[\/-](?P<day>\d{1,2})\b",
    re.IGNORECASE,
)

TIME_PATTERN = re.compile(
    r"\b(?P<hour>\d{1,2})(?::(?P<minute>\d{2}))?\s*(?P<ampm>am|pm)\b",
    re.IGNORECASE,
)


def _safe_json_loads(value: str, default: Any) -> Any:
    try:
        return json.loads(value)
    except Exception:
        return default


def _extract_pdf_text(file_base64: str) -> str:
    try:
        raw_bytes = base64.b64decode(file_base64)
        with fitz.open(stream=raw_bytes, filetype="pdf") as doc:
            parts = [page.get_text().strip() for page in doc]
        return "\n".join([part for part in parts if part])
    except Exception:
        return ""


def _prepare_image_for_vision(mime_type: str, file_base64: str) -> tuple[str, str]:
    """
    Normalize large phone images so vision requests are less likely to fail.
    Returns (mime_type, base64_data) after optional conversion/compression.
    """
    try:
        raw_bytes = base64.b64decode(file_base64)
    except Exception:
        return mime_type, file_base64

    if len(raw_bytes) <= MAX_IMAGE_BYTES and mime_type in {"image/jpeg", "image/png", "image/webp"}:
        return mime_type, file_base64

    try:
        image = Image.open(io.BytesIO(raw_bytes))
        image = image.convert("RGB")

        width, height = image.size
        largest = max(width, height)
        if largest > MAX_IMAGE_DIMENSION:
            scale = MAX_IMAGE_DIMENSION / largest
            resized = (int(width * scale), int(height * scale))
            image = image.resize(resized)

        output = io.BytesIO()
        image.save(output, format="JPEG", quality=72, optimize=True)
        encoded = base64.b64encode(output.getvalue()).decode("utf-8")
        return "image/jpeg", encoded
    except Exception:
        # Keep original if processing fails.
        return mime_type, file_base64


def _extract_image_text(item_name: str, mime_type: str, file_base64: str) -> str:
    prepared_mime, prepared_b64 = _prepare_image_for_vision(mime_type, file_base64)

    primary_prompt = (
        "Transcribe all legible text from this support correspondence image exactly as written. "
        "Preserve dates, times, headings, numbers, and line breaks where possible. "
        "Do not summarize. Return plain text only."
    )

    secondary_prompt = (
        "If full transcription is difficult, extract any appointment, deadline, meeting, hearing, "
        "or due-date details from this image. Include exact date/time phrases. Return plain text only."
    )

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            temperature=0,
            messages=[
                {
                    "role": "system",
                    "content": "You are an OCR-style extraction assistant for support letters. Return plain text only.",
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": primary_prompt,
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{prepared_mime};base64,{prepared_b64}",
                                "detail": "high",
                            },
                        },
                    ],
                },
            ],
        )

        primary_text = (response.choices[0].message.content or "").strip()
        if primary_text:
            return primary_text

        retry = client.chat.completions.create(
            model=MODEL_NAME,
            temperature=0,
            messages=[
                {
                    "role": "system",
                    "content": "You extract appointment/deadline details from correspondence images. Return plain text only.",
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": secondary_prompt,
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{prepared_mime};base64,{prepared_b64}",
                                "detail": "auto",
                            },
                        },
                    ],
                },
            ],
        )

        return (retry.choices[0].message.content or "").strip()
    except Exception as exc:
        print(f"Image OCR failed for {item_name}: {exc}")
        return ""


def _extract_image_notifications_direct(
    item_id: str,
    item_name: str,
    mime_type: str,
    file_base64: str,
    today_iso: str,
) -> list[dict[str, Any]]:
    prepared_mime, prepared_b64 = _prepare_image_for_vision(mime_type, file_base64)
    prompt = (
        "Extract upcoming reminders from this support correspondence image. "
        "Return JSON only with key notifications as an array. "
        "Each notification must include: title, summary, dueDateISO (ISO or null), urgency (LOW|MEDIUM|HIGH), confidence (0..1), reason."
    )

    payload = {
        "todayISO": today_iso,
        "rules": {
            "windowDays": 365,
            "maxNotifications": 8,
        },
        "requiredOutput": {
            "notifications": [
                {
                    "title": "short reminder title",
                    "summary": "one sentence summary",
                    "dueDateISO": "ISO datetime or null",
                    "urgency": "LOW|MEDIUM|HIGH",
                    "confidence": 0.5,
                    "reason": "brief extraction rationale",
                }
            ]
        },
    }

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            temperature=0,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": prompt,
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": json.dumps(payload)},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{prepared_mime};base64,{prepared_b64}",
                                "detail": "high",
                            },
                        },
                    ],
                },
            ],
        )

        content = (response.choices[0].message.content or "").strip()
        parsed = _safe_json_loads(content, {})
        rows = parsed.get("notifications") if isinstance(parsed, dict) else []
        if not isinstance(rows, list):
            return []

        normalized_rows = []
        for row in rows:
            normalized_rows.append(
                {
                    "title": row.get("title"),
                    "summary": row.get("summary"),
                    "dueDateISO": row.get("dueDateISO"),
                    "urgency": row.get("urgency"),
                    "confidence": row.get("confidence"),
                    "sourceItemId": item_id,
                    "sourceItemName": item_name,
                    "reason": row.get("reason") or "Extracted directly from image content.",
                }
            )

        return _sanitize_notifications(normalized_rows)
    except Exception as exc:
        print(f"Direct image reminder extraction failed for {item_name}: {exc}")
        return []


def _normalize_sources(items: list[dict[str, Any]]) -> list[dict[str, str]]:
    sources: list[dict[str, str]] = []

    for item in items:
        item_id = str(item.get("itemId") or "")
        item_name = str(item.get("itemName") or "Support item")
        mime_type = str(item.get("mimeType") or "")

        text_content = str(item.get("textContent") or "").strip()
        if text_content:
            sources.append(
                {
                    "itemId": item_id,
                    "itemName": item_name,
                    "text": text_content[:MAX_SOURCE_CHARS],
                }
            )
            continue

        file_base64 = item.get("fileBase64")
        if not isinstance(file_base64, str) or not file_base64:
            continue

        extracted = ""
        if mime_type == "application/pdf":
            extracted = _extract_pdf_text(file_base64)
        elif mime_type.startswith("image/"):
            extracted = _extract_image_text(item_name, mime_type, file_base64)

        extracted = extracted.strip()
        if extracted:
            sources.append(
                {
                    "itemId": item_id,
                    "itemName": item_name,
                    "text": extracted[:MAX_SOURCE_CHARS],
                }
            )

    return sources


def _sanitize_notifications(raw: list[dict[str, Any]]) -> list[dict[str, Any]]:
    notifications: list[dict[str, Any]] = []

    for row in raw:
        due_date = row.get("dueDateISO")
        if not isinstance(due_date, str) or not due_date.strip():
            due_date = None

        title = str(row.get("title") or "Upcoming support item").strip()
        summary = str(row.get("summary") or "").strip()
        urgency = str(row.get("urgency") or "MEDIUM").upper()
        if urgency not in {"LOW", "MEDIUM", "HIGH"}:
            urgency = "MEDIUM"

        confidence = row.get("confidence")
        try:
            confidence = float(confidence)
        except Exception:
            confidence = 0.6

        notifications.append(
            {
                "title": title,
                "summary": summary,
                "dueDateISO": due_date,
                "urgency": urgency,
                "confidence": max(0.0, min(1.0, confidence)),
                "sourceItemId": str(row.get("sourceItemId") or ""),
                "sourceItemName": str(row.get("sourceItemName") or ""),
                "reason": str(row.get("reason") or "").strip(),
            }
        )

    notifications.sort(
        key=lambda item: (
            item["dueDateISO"] is None,
            item["dueDateISO"] or "9999-12-31T00:00:00Z",
            -item["confidence"],
        )
    )
    return notifications


def _urgency_from_due_date(due: datetime, today: datetime) -> str:
    delta_days = (due.date() - today.date()).days
    if delta_days <= 7:
        return "HIGH"
    if delta_days <= 30:
        return "MEDIUM"
    return "LOW"


def _parse_due_datetime_from_match(text: str, match: re.Match[str], today: datetime) -> datetime | None:
    day = int(match.group("day"))
    month_name = match.group("month").lower().rstrip(".")
    month = MONTH_ALIASES.get(month_name)
    if not month:
        return None

    year_text = match.group("year")
    year = int(year_text) if year_text else today.year

    # Look around the date phrase for a time like "9pm" or "9:30 pm".
    start = max(0, match.start() - 40)
    end = min(len(text), match.end() + 40)
    surrounding = text[start:end]
    time_match = TIME_PATTERN.search(surrounding)

    hour = 9
    minute = 0
    if time_match:
        hour = int(time_match.group("hour"))
        minute = int(time_match.group("minute") or 0)
        ampm = time_match.group("ampm").lower()
        if ampm == "pm" and hour != 12:
            hour += 12
        if ampm == "am" and hour == 12:
            hour = 0

    try:
        due = datetime(year, month, day, hour, minute, tzinfo=timezone.utc)
    except ValueError:
        return None

    # If no explicit year was supplied and this date already passed, assume next year.
    if not year_text and due < today:
        try:
            due = due.replace(year=due.year + 1)
        except ValueError:
            return None

    return due


def _parse_due_datetime_from_month_day_match(text: str, match: re.Match[str], today: datetime) -> datetime | None:
    month_name = match.group("month").lower().rstrip(".")
    month = MONTH_ALIASES.get(month_name)
    if not month:
        return None

    day = int(match.group("day"))
    year = _normalize_year(match.group("year"), today.year)

    start = max(0, match.start() - 40)
    end = min(len(text), match.end() + 40)
    surrounding = text[start:end]
    time_match = TIME_PATTERN.search(surrounding)

    hour = 9
    minute = 0
    if time_match:
        hour = int(time_match.group("hour"))
        minute = int(time_match.group("minute") or 0)
        ampm = time_match.group("ampm").lower()
        if ampm == "pm" and hour != 12:
            hour += 12
        if ampm == "am" and hour == 12:
            hour = 0

    try:
        due = datetime(year, month, day, hour, minute, tzinfo=timezone.utc)
    except ValueError:
        return None

    if not match.group("year") and due < today:
        try:
            due = due.replace(year=due.year + 1)
        except ValueError:
            return None

    return due


def _normalize_year(year_text: str | None, fallback_year: int) -> int:
    if not year_text:
        return fallback_year
    year = int(year_text)
    if year < 100:
        return 2000 + year
    return year


def _parse_due_datetime_from_numeric_match(text: str, match: re.Match[str], today: datetime) -> datetime | None:
    day = int(match.group("day"))
    month = int(match.group("month"))
    year = _normalize_year(match.group("year"), today.year)

    if day < 1 or day > 31 or month < 1 or month > 12:
        return None

    start = max(0, match.start() - 40)
    end = min(len(text), match.end() + 40)
    surrounding = text[start:end]
    time_match = TIME_PATTERN.search(surrounding)

    hour = 9
    minute = 0
    if time_match:
        hour = int(time_match.group("hour"))
        minute = int(time_match.group("minute") or 0)
        ampm = time_match.group("ampm").lower()
        if ampm == "pm" and hour != 12:
            hour += 12
        if ampm == "am" and hour == 12:
            hour = 0

    try:
        due = datetime(year, month, day, hour, minute, tzinfo=timezone.utc)
    except ValueError:
        return None

    if not match.group("year") and due < today:
        try:
            due = due.replace(year=due.year + 1)
        except ValueError:
            return None

    return due


def _parse_due_datetime_from_ymd_match(text: str, match: re.Match[str], _: datetime) -> datetime | None:
    year = int(match.group("year"))
    month = int(match.group("month"))
    day = int(match.group("day"))

    if day < 1 or day > 31 or month < 1 or month > 12:
        return None

    start = max(0, match.start() - 40)
    end = min(len(text), match.end() + 40)
    surrounding = text[start:end]
    time_match = TIME_PATTERN.search(surrounding)

    hour = 9
    minute = 0
    if time_match:
        hour = int(time_match.group("hour"))
        minute = int(time_match.group("minute") or 0)
        ampm = time_match.group("ampm").lower()
        if ampm == "pm" and hour != 12:
            hour += 12
        if ampm == "am" and hour == 12:
            hour = 0

    try:
        return datetime(year, month, day, hour, minute, tzinfo=timezone.utc)
    except ValueError:
        return None


def _build_title_from_text(text: str, match_start: int) -> str:
    prefix = text[:match_start].strip()
    if not prefix:
        return "Upcoming support item"

    # Prefer phrase after the last punctuation or line break.
    chunks = re.split(r"[\n\.!?]", prefix)
    candidate = (chunks[-1] if chunks else prefix).strip(" ,;:-")
    if not candidate:
        candidate = prefix.strip(" ,;:-")
    if not candidate:
        return "Upcoming support item"
    return candidate[:90]


def _extract_rule_based_notifications(
    sources: list[dict[str, str]],
    today: datetime,
) -> list[dict[str, Any]]:
    notifications: list[dict[str, Any]] = []

    for source in sources:
        source_text = source.get("text", "")
        if not source_text:
            continue

        for match in DATE_PATTERN.finditer(source_text):
            due_dt = _parse_due_datetime_from_match(source_text, match, today)
            if not due_dt:
                continue

            title = _build_title_from_text(source_text, match.start())
            due_iso = due_dt.isoformat().replace("+00:00", "Z")
            urgency = _urgency_from_due_date(due_dt, today)

            notifications.append(
                {
                    "title": title,
                    "summary": f"Upcoming item inferred from support correspondence: {title}",
                    "dueDateISO": due_iso,
                    "urgency": urgency,
                    "confidence": 0.72,
                    "sourceItemId": source.get("itemId", ""),
                    "sourceItemName": source.get("itemName", ""),
                    "reason": "Matched explicit month-name date in source text.",
                }
            )

        for match in DATE_PATTERN_MONTH_DAY.finditer(source_text):
            due_dt = _parse_due_datetime_from_month_day_match(source_text, match, today)
            if not due_dt:
                continue

            title = _build_title_from_text(source_text, match.start())
            due_iso = due_dt.isoformat().replace("+00:00", "Z")
            urgency = _urgency_from_due_date(due_dt, today)

            notifications.append(
                {
                    "title": title,
                    "summary": f"Upcoming item inferred from support correspondence: {title}",
                    "dueDateISO": due_iso,
                    "urgency": urgency,
                    "confidence": 0.7,
                    "sourceItemId": source.get("itemId", ""),
                    "sourceItemName": source.get("itemName", ""),
                    "reason": "Matched month-day date format in source text.",
                }
            )

        for match in DATE_PATTERN_NUMERIC.finditer(source_text):
            due_dt = _parse_due_datetime_from_numeric_match(source_text, match, today)
            if not due_dt:
                continue

            title = _build_title_from_text(source_text, match.start())
            due_iso = due_dt.isoformat().replace("+00:00", "Z")
            urgency = _urgency_from_due_date(due_dt, today)

            notifications.append(
                {
                    "title": title,
                    "summary": f"Upcoming item inferred from support correspondence: {title}",
                    "dueDateISO": due_iso,
                    "urgency": urgency,
                    "confidence": 0.68,
                    "sourceItemId": source.get("itemId", ""),
                    "sourceItemName": source.get("itemName", ""),
                    "reason": "Matched numeric date format in source text.",
                }
            )

        for match in DATE_PATTERN_YMD.finditer(source_text):
            due_dt = _parse_due_datetime_from_ymd_match(source_text, match, today)
            if not due_dt:
                continue

            title = _build_title_from_text(source_text, match.start())
            due_iso = due_dt.isoformat().replace("+00:00", "Z")
            urgency = _urgency_from_due_date(due_dt, today)

            notifications.append(
                {
                    "title": title,
                    "summary": f"Upcoming item inferred from support correspondence: {title}",
                    "dueDateISO": due_iso,
                    "urgency": urgency,
                    "confidence": 0.68,
                    "sourceItemId": source.get("itemId", ""),
                    "sourceItemName": source.get("itemName", ""),
                    "reason": "Matched ISO-style date format in source text.",
                }
            )

    return _sanitize_notifications(notifications)


def _merge_notifications(
    ai_notifications: list[dict[str, Any]],
    fallback_notifications: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    merged: list[dict[str, Any]] = []
    seen: set[tuple[str, str, str]] = set()

    for row in ai_notifications + fallback_notifications:
        key = (
            str(row.get("sourceItemId") or ""),
            str(row.get("title") or "").strip().lower(),
            str(row.get("dueDateISO") or ""),
        )
        if key in seen:
            continue
        seen.add(key)
        merged.append(row)

    return _sanitize_notifications(merged)


async def extract_upcoming_support_notifications(items: list[dict[str, Any]], today_iso: str | None = None) -> list[dict[str, Any]]:
    if not items:
        return []

    today_text = today_iso or datetime.now(timezone.utc).isoformat()

    image_direct_notifications: list[dict[str, Any]] = []
    for item in items:
        mime_type = str(item.get("mimeType") or "")
        file_base64 = item.get("fileBase64")
        if mime_type.startswith("image/") and isinstance(file_base64, str) and file_base64:
            image_direct_notifications.extend(
                _extract_image_notifications_direct(
                    item_id=str(item.get("itemId") or ""),
                    item_name=str(item.get("itemName") or "Support image"),
                    mime_type=mime_type,
                    file_base64=file_base64,
                    today_iso=today_text,
                )
            )

    sources = _normalize_sources(items)
    if not sources and not image_direct_notifications:
        return []

    try:
        normalized_today = today_text.replace("Z", "+00:00")
        today_dt = datetime.fromisoformat(normalized_today)
        if today_dt.tzinfo is None:
            today_dt = today_dt.replace(tzinfo=timezone.utc)
    except Exception:
        today_dt = datetime.now(timezone.utc)

    fallback_notifications = _extract_rule_based_notifications(sources, today_dt) if sources else []

    prompt = (
        "You are an assistant that reads support correspondence and builds planner reminders. "
        "Find concrete upcoming tasks, appointments, deadlines, hearings, submissions, and follow-ups. "
        "Use only information that appears in the provided source text. "
        "If date is unclear, set dueDateISO to null."
    )

    user_payload = {
        "todayISO": today_text,
        "rules": {
            "windowDays": 365,
            "maxNotifications": 20,
            "urgencyGuide": {
                "HIGH": "Due in <=7 days or clearly urgent wording",
                "MEDIUM": "Due in 8-30 days",
                "LOW": "Due in >30 days or informational reminder",
            },
        },
        "requiredOutput": {
            "notifications": [
                {
                    "title": "short reminder title",
                    "summary": "one sentence summary",
                    "dueDateISO": "ISO datetime or null",
                    "urgency": "LOW|MEDIUM|HIGH",
                    "confidence": "0.0 to 1.0",
                    "sourceItemId": "string",
                    "sourceItemName": "string",
                    "reason": "brief extraction rationale",
                }
            ]
        },
        "sources": sources,
    }

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            temperature=0.1,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": json.dumps(user_payload)},
            ],
        )

        content = (response.choices[0].message.content or "").strip()
        parsed = _safe_json_loads(content, {})
        notifications = parsed.get("notifications") if isinstance(parsed, dict) else []

        if not isinstance(notifications, list):
            return _merge_notifications(fallback_notifications, image_direct_notifications)

        ai_notifications = _sanitize_notifications(notifications)
        merged = _merge_notifications(ai_notifications, fallback_notifications)
        return _merge_notifications(merged, image_direct_notifications)
    except Exception:
        return _merge_notifications(fallback_notifications, image_direct_notifications)
