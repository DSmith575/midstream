from enum import Enum

class APIRoutes(Enum):
    HOME = "/"
    UPLOAD_AUDIO = "/upload-audio"


CORS_CONFIG = {
    "origins": ["*"],
    "methods": ["*"],
    "headers": ["*"],
}