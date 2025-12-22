import os
import sys

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
PROCESSED_FOLDER = os.path.join(BASE_DIR, 'static', 'processed')
UPLOADS_DIR='uploads'
PROCESSED_DIR='processed'

CHUNK_LENGTH_MS = 120000  # 2 minutes
SILENCE_THRESHOLD = -30    # in dBFS
MIN_SILENCE_LEN = 1000     # in milliseconds


ALLOWED_EXTENSIONS_AUDIO = {'wav', 'mp3', 'm4a', 'mp4', 'webm', 'ogg'}
ALLOWED_EXTENSIONS_TEXT = {'pdf'}