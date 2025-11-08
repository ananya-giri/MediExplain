from fastapi import APIRouter, UploadFile, File
from services.ocr_services import extract_text_from_image

router = APIRouter()

@router.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        text = extract_text_from_image(contents)
        return {"extracted_text": text}
    except Exception as e:
        return {"error": str(e)}
