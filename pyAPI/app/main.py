from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.lib.constants.routes import APIRoutes, CORS_CONFIG
from app.routes import upload_audio
from app.routes import upload_referral_form


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

# @app.get("/items")
# def read_root():
#     return JSONResponse(content={"status_code": status.HTTP_200_OK,"message": "Hello World"}, status_code=status.HTTP_200_OK)

app.include_router(upload_audio.router)
app.include_router(upload_referral_form.router)