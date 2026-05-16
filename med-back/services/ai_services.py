from google import genai
from dotenv import load_dotenv
import os
import re
import json
import datetime
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
import chromadb
from database import biometrics_history_collection, prescriptions_collection, reports_history_collection, reports_history_collection
import groq

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
groq_client = groq.Groq(api_key=os.getenv("GROQ_API_KEY"))

# 0. Llama-Guard 3 Safety Guardrails (Updated for Groq compatibility)
def check_safety_guardrails(text: str, role: str = "user") -> bool:
    try:
        # Truncate to first 4000 characters to avoid "Request too large" errors on Groq
        safe_check_text = text[:4000]
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a medical safety filter. Respond ONLY with 'safe' if the content is a harmless medical report or question, or 'unsafe' if it contains hate speech, violence, or dangerous non-medical advice."},
                {"role": "user", "content": safe_check_text}
            ]
        )
        verdict = response.choices[0].message.content.strip().lower()
        return "safe" in verdict
    except Exception as e:
        print("Llama Guard Error:", e)
        return True # Fail-open to avoid blocking the user if Groq is down

# 1. Privacy-Preserving Local Anonymization (HIPAA Compliance)
analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

def anonymize_text(text: str) -> str:
    results = analyzer.analyze(text=text, entities=["PERSON", "PHONE_NUMBER", "EMAIL_ADDRESS", "LOCATION", "DATE_TIME"], language='en')
    anonymized_text = anonymizer.anonymize(text=text, analyzer_results=results)
    return anonymized_text.text

# 2. Hybrid Neuro-Symbolic Verification
def apply_symbolic_rules(text: str) -> str:
    rules_output = []
    hb_match = re.search(r'Hemoglobin\s*[:\-]?\s*([\d\.]+)', text, re.IGNORECASE)
    if hb_match:
        val = float(hb_match.group(1))
        if val < 12.0:
            rules_output.append(f"[Symbolic Engine] Hemoglobin is {val} (Low - Indicates possible anemia).")
        elif val > 17.5:
            rules_output.append(f"[Symbolic Engine] Hemoglobin is {val} (High).")
        else:
            rules_output.append(f"[Symbolic Engine] Hemoglobin is {val} (Normal).")
            
    gl_match = re.search(r'Glucose\s*[:\-]?\s*([\d\.]+)', text, re.IGNORECASE)
    if gl_match:
        val = float(gl_match.group(1))
        if val > 100:
            rules_output.append(f"[Symbolic Engine] Glucose is {val} (High - Indicates possible hyperglycemia).")
        elif val < 70:
            rules_output.append(f"[Symbolic Engine] Glucose is {val} (Low - Indicates possible hypoglycemia).")
        else:
            rules_output.append(f"[Symbolic Engine] Glucose is {val} (Normal).")
            
    if not rules_output:
        return "[Symbolic Engine] No specific biometric rules matched."
    return "\n".join(rules_output)

# 3. Longitudinal Temporal Reasoning
async def extract_and_store_biometrics(user_email: str, text: str) -> str:
    new_biometrics = {}
    hb_match = re.search(r'Hemoglobin\s*[:\-]?\s*([\d\.]+)', text, re.IGNORECASE)
    if hb_match: new_biometrics["Hemoglobin"] = float(hb_match.group(1))
    
    gl_match = re.search(r'Glucose\s*[:\-]?\s*([\d\.]+)', text, re.IGNORECASE)
    if gl_match: new_biometrics["Glucose"] = float(gl_match.group(1))
    
    if not new_biometrics:
        return "No specific biometrics found to track over time."
        
    history = await biometrics_history_collection.find_one({"email": user_email})
    delta_report = []
    
    if history and "records" in history and len(history["records"]) > 0:
        last_record = history["records"][-1]
        last_date = last_record.get("date")
        for key, val in new_biometrics.items():
            if key in last_record["data"]:
                old_val = last_record["data"][key]
                diff = val - old_val
                delta_report.append(f"{key}: {val} (was {old_val} on {last_date}, change: {'+' if diff>0 else ''}{diff:.2f})")
            else:
                delta_report.append(f"{key}: {val} (New baseline)")
    else:
        for key, val in new_biometrics.items():
            delta_report.append(f"{key}: {val} (New baseline)")
            
    new_record = {"date": datetime.datetime.now().strftime("%Y-%m-%d"), "data": new_biometrics}
    await biometrics_history_collection.update_one(
        {"email": user_email},
        {"$push": {"records": new_record}},
        upsert=True
    )
    
    return "Temporal Trend Analysis:\n" + "\n".join(delta_report)

# 4. Multi-Modal Grounding with RAG (Literature & Personal Prescription History)
chroma_client = chromadb.Client()
literature_collection = chroma_client.create_collection(name="medical_knowledge")
prescription_collection = chroma_client.create_collection(name="patient_prescriptions")

# Mock Medical Literature (Global)
literature_base = [
    "Anemia is often indicated by a low hemoglobin level. It can cause fatigue and weakness.",
    "Normal hemoglobin ranges are generally 13.8 to 17.2 grams per deciliter (g/dL) for men and 12.1 to 15.1 g/dL for women.",
    "Hyperglycemia, or high blood glucose, occurs when there is too much sugar in the blood. This is a common indicator of diabetes.",
    "A normal fasting blood glucose level is lower than 100 mg/dL."
]
literature_collection.add(
    documents=literature_base,
    metadatas=[{"source": "PubMed 1"}, {"source": "PubMed 2"}, {"source": "PubMed 3"}, {"source": "PubMed 4"}],
    ids=["id1", "id2", "id3", "id4"]
)

# Mock Prescription History (Personalized for the patient)
# In production, this would be fetched from MongoDB on login and embedded per user session.
prescription_history = [
    "Patient takes Metformin 500mg twice daily for Type 2 Diabetes Management.",
    "Patient takes Lisinopril 10mg once daily for Hypertension.",
    "Patient was prescribed Iron Supplements (Ferrous Sulfate 325mg) in January due to low Hemoglobin.",
    "Patient is allergic to Penicillin."
]
prescription_collection.add(
    documents=prescription_history,
    metadatas=[{"type": "Medication"}, {"type": "Medication"}, {"type": "Supplement"}, {"type": "Allergy"}],
    ids=["rx1", "rx2", "rx3", "rx4"]
)

def retrieve_knowledge(query: str, collection_type: str = "literature") -> str:
    collection = literature_collection if collection_type == "literature" else prescription_collection
    results = collection.query(query_texts=[query], n_results=2)
    retrieved = []
    for doc in results['documents'][0]:
        retrieved.append(f"- {doc}")
    return "\n".join(retrieved)


from services.shap_analyzer import get_true_shap_keywords
from services.nlp_medical_extractor import extract_medical_entities

async def simplify_medical_text(raw_text: str, user_email: str) -> dict:
    if not check_safety_guardrails(raw_text):
        return {"error": "Llama-Guard-3 flagged this input as unsafe or violating medical guardrails."}

    safe_text = anonymize_text(raw_text)
    symbolic_analysis = apply_symbolic_rules(safe_text)
    temporal_analysis = await extract_and_store_biometrics(user_email, safe_text)
    
    # 🧠 Dual-RAG Query Pipeline
    query_text = safe_text[:300]
    retrieved_facts = retrieve_knowledge(query_text, "literature")
    retrieved_prescriptions = retrieve_knowledge(query_text, "prescription")

    # 3. Retrieve User's Past Reports
    past_reports_cursor = reports_history_collection.find({"email": user_email}).sort("date", -1).limit(3)
    past_reports = []
    async for doc in past_reports_cursor:
        past_reports.append(doc.get("report_text", "")[:500])
    past_reports_context = "\n".join(past_reports) if past_reports else "No previous reports found."

    # 🏥 NLP Ontology Extraction (SciSpaCy)
    structured_entities = extract_medical_entities(safe_text)

    prompt = f"""
    You are a highly advanced, culturally-aware medical assistant AI.
    
    INPUT REPORT (ANONYMIZED):
    {safe_text}
    
    NEURO-SYMBOLIC VERIFICATION RESULTS:
    {symbolic_analysis}
    
    LONGITUDINAL TEMPORAL REASONING:
    {temporal_analysis}
    
    MEDICAL LITERATURE RAG:
    {retrieved_facts}
    
    PATIENT PRESCRIPTION HISTORY RAG:
    {retrieved_prescriptions}
    
    PATIENT PAST REPORTS RAG:
    {past_reports_context}

    YOUR TASK:
    1. Simplify the medical report into clear, colloquial analogies suitable for low-resource environments. Keep sentences short.
    2. Incorporate the Neuro-Symbolic and Temporal reasoning to explain trends.
    3. CROSS-REFERENCE PRESCRIPTIONS: Point out drug interactions if applicable.
    4. CLINICAL TRIAGE NLP: Based on the findings, classify the urgency: "RED" (ER/Urgent), "YELLOW" (Consult Doctor soon), "GREEN" (Routine/Normal). Provide a brief 1-sentence reason.
    5. UNCERTAINTY QUANTIFICATION: Break your response down sentence by sentence. For each sentence, provide a confidence score (0.0 to 1.0).
    6. Provide a "cultural_readability_score" (0-100).
    
    OUTPUT FORMAT MUST BE STRICTLY VALID JSON:
    {{
        "triage_level": "YELLOW",
        "triage_reason": "Hemoglobin is slightly below normal range.",
        "sentences": [
            {{"text": "Your blood sugar went up slightly, which is important to note since you are taking Metformin.", "confidence": 0.95}}
        ],
        "cultural_readability_score": 92
    }}
    """
    
    response = None
    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        json_str = response.choices[0].message.content.strip()
        if json_str.startswith("```json"): json_str = json_str[7:]
        if json_str.endswith("```"): json_str = json_str[:-3]
        data = json.loads(json_str.strip())
        
        # 🧪 Apply TRUE SHAP Feature Attribution locally
        if "sentences" in data:
            for sent in data["sentences"]:
                sent["shap_keywords"] = get_true_shap_keywords(sent.get("text", ""))
                
        # Attach the SciSpaCy entities
        data["medical_entities"] = structured_entities
                
        return data
    except Exception as e:
        print(f"🔥 AI API Error: {str(e)}")
        return {"error": f"AI Generation Failed: {str(e)}", "raw": str(e)}

async def chat_about_report(report_text: str, user_question: str, user_email: str, tone: str = "detailed", language: str = "English") -> dict:
    if not check_safety_guardrails(user_question):
        return {"error": "Llama-Guard-3 flagged this question as unsafe or a policy violation."}

    try:
        safe_text = anonymize_text(report_text)
        symbolic_analysis = apply_symbolic_rules(safe_text)
        temporal_analysis = await extract_and_store_biometrics(user_email, safe_text)
        
        retrieved_facts = retrieve_knowledge(user_question, "literature")
        retrieved_prescriptions = retrieve_knowledge(user_question, "prescription")
        
        # Retrieve User's Past Reports
        past_reports_cursor = reports_history_collection.find({"email": user_email}).sort("date", -1).limit(3)
        past_reports = []
        async for doc in past_reports_cursor:
            past_reports.append(doc.get("report_text", "")[:500])
        past_reports_context = "\n".join(past_reports) if past_reports else "No previous reports found."

        prompt = f"""
        You are a medical explanation assistant.
        
        --- MEDICAL REPORT (ANONYMIZED) ---
        {safe_text}
        ----------------------
        
        NEURO-SYMBOLIC VERIFICATION RESULTS:
        {symbolic_analysis}
        
        LONGITUDINAL TEMPORAL REASONING:
        {temporal_analysis}
        
        MEDICAL LITERATURE RAG:
        {retrieved_facts}
        
        PATIENT PRESCRIPTION HISTORY RAG:
        {retrieved_prescriptions}
        
        PATIENT PAST REPORTS RAG:
        {past_reports_context}

        User's Question:
        {user_question}

        YOUR TASK:
        - Answer in clear, colloquial analogies.
        - Cross-reference their question with their active Prescription History.
        - Tone Preference: {tone} (e.g. if child-friendly, use gentle and extremely simple language)
        - Target Language: YOU MUST RESPOND ENTIRELY IN {language}. If {language} is Hindi, respond entirely in Hindi text. DO NOT reply in English if {language} is not English.
        - UNCERTAINTY QUANTIFICATION: Break your response down sentence by sentence. Provide confidence (0-1).
        - Output strictly valid JSON.
        
        FORMAT:
        {{
            "sentences": [
                {{"text": "...", "confidence": 0.95}}
            ],
            "cultural_readability_score": 90
        }}
        """

        response = None
        try:
            response = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            json_str = response.choices[0].message.content.strip()
            if json_str.startswith("```json"): json_str = json_str[7:]
            if json_str.endswith("```"): json_str = json_str[:-3]
            data = json.loads(json_str.strip())
            
            # 🧪 Apply TRUE SHAP Feature Attribution locally
            if "sentences" in data:
                for sent in data["sentences"]:
                    sent["shap_keywords"] = get_true_shap_keywords(sent.get("text", ""))
                    
            return data
        except Exception as e:
            raise e

    except Exception as e:
        print(f"🔥 Error in chat_about_report: {e}")
        return {"error": f"⚠️ Internal Error: {str(e)}"}
