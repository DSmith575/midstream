from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.testdir.test import test_text
from app.lib.constants.routes import APIRoutes, CORS_CONFIG


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_CONFIG["origins"],
    allow_credentials=True,
    allow_methods=CORS_CONFIG["methods"],
    allow_headers=CORS_CONFIG["headers"],
)

@app.get(APIRoutes.HOME.value, status_code=status.HTTP_200_OK)
async def main():
    return {"Hello": "World"}

@app.get("/items", status_code=status.HTTP_200_OK)
def read_root():
    return JSONResponse(content={"message": "Hello World"})