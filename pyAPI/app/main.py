from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.lib.constants.routes import APIRoutes, CORS_CONFIG
from app.routes import upcoming_support, upload_audio, upload_referral_form


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_CONFIG["origins"],
    allow_credentials=True,
    allow_methods=CORS_CONFIG["methods"],
    allow_headers=CORS_CONFIG["headers"],
)

@app.get(APIRoutes.HOME.value)
async def main():
    return {"Hello": "World"}

app.include_router(upload_audio.router)
app.include_router(upload_referral_form.router)
app.include_router(upcoming_support.router)