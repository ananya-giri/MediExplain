from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_services import simplify_medical_text, chat_about_report

router = APIRouter()

class TextInput(BaseModel):
    text: str

@router.post("/explain/")
async def explain_text(input_data: TextInput):
    explanation = simplify_medical_text(input_data.text)

    if explanation.startswith("⚠️ Internal Error:"):
        raise HTTPException(status_code=500, detail=explanation)
    
    return {"explanation": explanation}


# 🧠 NEW MODEL for chat
class ChatInput(BaseModel):
    report_text: str
    question: str

@router.post("/chat/")
async def chat_with_ai(input_data: ChatInput):
    response = chat_about_report(input_data.report_text, input_data.question)

    if response.startswith("⚠️ Internal Error:"):
        raise HTTPException(status_code=500, detail=response)
    
    return {"answer": response}
