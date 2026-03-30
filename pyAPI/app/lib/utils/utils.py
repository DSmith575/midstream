import logging
import os
import re
import time

from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


def allowed_file(filename: str, allowed_extensions: set) -> bool:
    """Check if the file is allowed based on the extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions


def sanitize_filename(filename: str) -> str:
    """Sanitize the filename by removing or replacing invalid characters."""
    name = os.path.splitext(filename)[0]
    if not name:
        return "File"
    name = name[0].upper() + name[1:]
    return re.sub(r'[^a-zA-Z0-9_\-]', '-', name)

def split_filename_from_extension(filename: str) -> str:
    """Split the filename from the extension."""
    return filename.rsplit('.', 1)[0]

def handle_exception(_request, exc: Exception) -> JSONResponse:
    """Custom exception handler for FastAPI."""
    return JSONResponse(
        status_code=500,
        content={"error": str(exc)}
    )


def delete_files_older_than(folder_path: str, minutes: int) -> None:
    # Calculate the threshold time in seconds
    threshold_time = time.time() - minutes * 60

    try:
        # Loop through all the files in the specified folder
        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)

            # Check if it's a file (skip directories)
            if os.path.isfile(file_path):
                # Get the last modification time of the file
                file_mod_time = os.path.getmtime(file_path)

                # If the file is older than the threshold, delete it
                if file_mod_time < threshold_time:
                    os.remove(file_path)
                    logger.info("Deleted file: %s", file_path)

        logger.info("Deletion process completed")

    except Exception as e:
        logger.error("An error occurred while deleting old files: %s", e)
