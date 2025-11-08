import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def simplify_medical_text(raw_text: str) -> str:
    prompt = f"""
    You are a medical assistant AI. Simplify and explain the following medical report in plain language 
    that a non-medical person can easily understand.
    
    Input Report:
    {raw_text}

    Output Example:
    - Use simple everyday terms.
    - Explain what each medical term means.
    - If any values are abnormal, explain what that could indicate.
    - Be concise and neutral (no diagnosis).
    """

    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)

    return response.text.strip()
def chat_about_report(report_text: str, user_question: str) -> str:
    """
    AI Q&A: Answer user questions about a given medical report in plain language.
    """
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f"""
        You are a medical explanation assistant.
        Use the following medical report as background context.

        --- MEDICAL REPORT ---
        {report_text}
        ----------------------

        User's Question:
        {user_question}

        Your Task:
        - Answer in clear, everyday language.
        - Explain what medical terms mean.
        - If you are unsure, say "I’m not certain; please consult a doctor."
        - Never give medical advice, prescriptions, or diagnoses.
        """

        response = model.generate_content(prompt)

        if not hasattr(response, "text") or not response.text:
            return "⚠️ AI did not return any response. Please try again."

        return response.text.strip()

    except Exception as e:
        print(f"🔥 Error in chat_about_report: {e}")
        return f"⚠️ Internal Error: {str(e)}"
