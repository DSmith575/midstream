from enum import Enum

class APIRoutes(Enum):
    HOME = "/"
    UPLOAD_AUDIO = "/upload-audio"
    UPLOAD_REFERRAL_FORM = "/generate"


CORS_CONFIG = {
    "origins": ["*"],
    "methods": ["*"],
    "headers": ["*"],
}