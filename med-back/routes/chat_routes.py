from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Dict, List
import google.genai as genai
import os
from database import chat_history_collection
from utils.jwt_handler import get_current_user

router = APIRouter()

# Initialize Gemini client
genai_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class ChatRequest(BaseModel):
    user_id: str
    report_text: str
    question: str
    tone: str = "detailed"
    language: str = "English" 
    

@router.post("/chat/")
async def chat(req: ChatRequest, current_user: dict = Depends(get_current_user)):
    user_email = current_user["email"]
    
    # Retrieve history from DB
    user_record = await chat_history_collection.find_one({"email": user_email})
    if user_record:
        history = user_record.get("history", [])
    else:
        history = []

    # Add user's message
    history.append({"role": "user", "content": req.question})

    user_msg_lower = req.question.strip().lower()

    # 🧩 Lightweight pre-filter
    if any(word in user_msg_lower for word in ["bye", "goodbye", "see you"]):
        return {"answer": "👋 Goodbye! Take care and stay healthy."}
    
    if any(word in user_msg_lower for word in ["hi", "hello", "hey", "lol", "what's up"]):
        return {"answer": "👋 Hello! I can help explain your medical report or test results."}
    
    # Detect obviously irrelevant or inappropriate inputs
    if len(req.question.split()) < 3 and not any(x in user_msg_lower for x in ["what", "how", "why", "explain"]):
        return {"answer": "⚠️ I can only help with questions related to your medical report."}

    tone_instructions = {
    "detailed": "Give a comprehensive yet clear medical explanation. Use structured paragraphs and define terms simply.",
    "summary": "Give a short, concise summary — just the key points and what matters for the patient.",
    "child": "Explain in the simplest, friendliest way possible as if explaining to a 12-year-old. Avoid jargon and keep it gentle."
}

    tone_text = tone_instructions.get(req.tone.lower(), tone_instructions["detailed"])

    language_instructions = {
    "English": "Respond in clear, simple English.",
    "Hindi": "उत्तर हिंदी में दें, सरल और स्पष्ट भाषा में।",
    "Tamil": "தயவுசெய்து தமிழில் தெளிவாகவும் எளிமையாகவும் பதிலளிக்கவும்.",
    "Bengali": "সহজ এবং স্পষ্ট বাংলায় উত্তর দিন।",
    "Telugu": "దయచేసి సరళమైన తెలుగు భాషలో సమాధానం ఇవ్వండి.",
}

    language_text = language_instructions.get(req.language, "Respond in clear English.")

    context_prompt = (
    "You are MediExplain — a polite, professional AI medical assistant.\n"
    "Your role is to clearly explain medical reports in simple, safe, and factual language.\n"
    "Rules:\n"
    "- If the user's message is casual or off-topic, reply briefly and politely.\n"
    "- If the user says 'bye' or 'thank you', reply with a short goodbye message.\n"
    "- Never overexplain or give prescriptions.\n"
    "- Keep tone empathetic but professional.\n\n"
    f"Preferred response style: {tone_text}\n\n"
    f"Language: {language_text}\n\n"
    f"Here is the uploaded report:\n{req.report_text}\n\n"
    "Use chat history and tone preference to generate your response."
)



    messages = [{"role": "system", "content": context_prompt}] + history

    try:
        response = genai_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=messages,
            generation_config={
           "max_output_tokens": 250,
            "temperature": 0.7
          }
        )

        ai_reply = response.text.strip() if hasattr(response, "text") else "I couldn't generate a response."

        history.append({"role": "assistant", "content": ai_reply})
        
        # Save updated history to DB
        await chat_history_collection.update_one(
            {"email": user_email},
            {"$set": {"history": history}},
            upsert=True
        )

        return {"answer": ai_reply, "history": history}

    except Exception as e:
        print("Chat error:", e)
        return {"answer": f"⚠️ Error generating response: {str(e)}"}
