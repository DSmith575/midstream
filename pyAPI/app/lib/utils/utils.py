import os
import re
import time
from fastapi.responses import JSONResponse
from app.lib.constants.constants import ALLOWED_EXTENSIONS_TEXT


def allowed_file(filename: str) -> bool:
    """Check if the file is allowed based on the extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS_TEXT


def sanitize_filename(filename: str) -> str:
    """Sanitize the filename by removing or replacing invalid characters."""
    name = os.path.splitext(filename)[0]
    return re.sub(r'[^a-zA-Z0-9_\-]', '-', name)


def handle_exception(request, exc):
    """Custom exception handler for FastAPI."""
    return JSONResponse(
        status_code=500,
        content={"error": str(exc)}
    )


def delete_files_older_than(folder_path, minutes):
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
                    print(f"Deleted file: {file_path}")

        print("Deletion process completed.")

    except Exception as e:
        print(f"An error occurred: {e}")
