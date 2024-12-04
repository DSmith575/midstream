from enum import Enum

class APIRoutes(Enum):
    HOME = "/"


CORS_CONFIG = {
    "origins": ["*"],
    "methods": ["*"],
    "headers": ["*"],
}