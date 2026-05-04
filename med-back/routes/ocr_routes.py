from fastapi import APIRouter, UploadFile, File, Depends
from services.ocr_services import extract_text_from_file
from utils.jwt_handler import get_current_user

router = APIRouter()

@router.post("/upload/")
async def upload_file(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    try:
        contents = await file.read()
        text = extract_text_from_file(contents, file.content_type)
        return {"extracted_text": text}
    except Exception as e:
        return {"error": str(e)}
