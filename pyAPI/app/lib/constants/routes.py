from enum import Enum

class APIRoutes(Enum):
    HOME = "/"
    UPLOAD_AUDIO = "/upload-audio"
    GENERATE_REFERRAL = "/generate-referral"
    UPCOMING_SUPPORT = "/upcoming-support"


CORS_CONFIG = {
    "origins": ["*"],
    "methods": ["*"],
    "headers": ["*"],
}