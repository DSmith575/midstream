from enum import Enum

class APIRoutes(Enum):
    HOME = "/"
    UPLOAD_AUDIO = "/upload-audio"
    GENERATE_REFERRAL = "/generate-referral"


CORS_CONFIG = {
    "origins": ["*"],
    "methods": ["*"],
    "headers": ["*"],
}