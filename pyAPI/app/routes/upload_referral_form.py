from fastapi import APIRouter, File, UploadFile, HTTPException
from app.lib.constants.routes import APIRoutes

router = APIRouter()

# upload referralForm data from prisma database and the audio file pdf
# then process the audio file and generate a pdf with the audio transcript