from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel
from services.ai_services import simplify_medical_text, chat_about_report
from utils.jwt_handler import get_current_user
import os
import groq

router = APIRouter()
groq_client = groq.Groq(api_key=os.getenv("GROQ_API_KEY"))

class TextInput(BaseModel):
    text: str

@router.post("/explain/")
async def explain_text(input_data: TextInput, current_user: dict = Depends(get_current_user)):
    user_email = current_user.get("email")
    explanation_data = await simplify_medical_text(input_data.text, user_email)

    if isinstance(explanation_data, dict) and explanation_data.get("error"):
        raise HTTPException(status_code=500, detail=explanation_data["error"])
    
    return {"explanation_data": explanation_data}


# 🧠 NEW MODEL for chat
class ChatInput(BaseModel):
    report_text: str
    question: str

@router.post("/chat/")
async def chat_with_ai(input_data: ChatInput, current_user: dict = Depends(get_current_user)):
    user_email = current_user.get("email")
    response_data = await chat_about_report(input_data.report_text, input_data.question, user_email)

    if isinstance(response_data, dict) and response_data.get("error"):
        raise HTTPException(status_code=500, detail=response_data["error"])
    
    return {"answer_data": response_data}

# 🎙️ Whisper ASR Endpoint
@router.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    try:
        # Read file to memory
        audio_bytes = await file.read()
        
        # Call Groq Whisper
        translation = groq_client.audio.transcriptions.create(
          file=(file.filename, audio_bytes),
          model="whisper-large-v3",
          response_format="json"
        )
        return {"text": translation.text}
    except Exception as e:
        print("Transcribe error:", e)
        raise HTTPException(status_code=500, detail=str(e))
