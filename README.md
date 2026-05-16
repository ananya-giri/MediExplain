# MediExplain AI: Research-Grade Medical Diagnostic Support System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)

**MediExplain** is an advanced, production-ready medical platform designed to bridge the gap between complex diagnostic reports and patient understanding. Built for academic rigour and clinical reliability, it employs a sophisticated multi-agent architecture combining Neuro-Symbolic AI, Temporal Reasoning, and Explainable AI (XAI).

---

## 🚀 Key Research Innovations

### 🧠 1. Hybrid Neuro-Symbolic Architecture
Unlike standard LLMs that are prone to hallucinations, MediExplain utilizes a **Symbolic Reasoning Engine** that enforces deterministic clinical rules over raw biometric data. Every AI claim is cross-verified against established medical thresholds before reaching the patient.

### 📈 2. Longitudinal Temporal Reasoning
MediExplain doesn't just analyze a single report; it builds a **Temporal Knowledge Graph** of the patient's health. By tracking biometrics over time, it provides trend-aware insights (e.g., *"Your hemoglobin has dropped by 1.2g/dL since last month"*), enabling preventive care.

### 🔬 3. Personalized RAG (P-RAG) & Historical Memory
Our proprietary **Dual-Retrieval Augmented Generation** pipeline fetches context from:
- **Global Medical Literature (ChromaDB):** Grounding answers in verified PubMed-style knowledge.
- **Patient Prescription History:** Automatically cross-referencing diagnostic findings with active medications to warn about potential adverse drug-condition interactions.
- **Longitudinal Patient History (MongoDB):** The RAG pipeline automatically retrieves the patient's past uploaded reports, allowing the AI to construct highly personalized, trend-aware responses.

### 🛡️ 4. Enterprise-Grade Security & Safety
- **Llama-Guard-3 Integration:** Every input and output is screened by Meta's Llama-Guard-3 to ensure medical safety and policy compliance.
- **HIPAA-Compliant Anonymization:** Local PII redaction using Microsoft Presidio to ensure patient privacy.

### 🧪 5. High-Fidelity Explainable AI (XAI)
- **Local SHAP Attribution:** Uses mathematically derived SHAP (SHapley Additive exPlanations) values via a local Transformer model to provide true feature attribution for every sentence.
- **Uncertainty Quantification:** Highlighting assertions where AI confidence is <85% to ensure clinical transparency.

### 🎙️ 6. Multimodal Accessibility & Advanced OCR
- **Whisper ASR:** Multi-lingual voice input support for rural and low-resource accessibility.
- **Enhanced Tesseract Pipeline:** Custom OpenCV upscaling with PSM-6 alignment to flawlessly read tabular medical data and tiny fonts.
- **SciSpaCy Ontology Mapping:** Automated linking of raw text to standard clinical ontologies (UMLS/ICD-10).

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, TanStack Query, Tailwind CSS, Framer Motion, Lucide React.
- **Backend:** FastAPI, Motor (Async MongoDB), Uvicorn.
- **AI/ML:** Llama 3.3 70B (via Groq), Meta Llama-Guard-3 (via Groq), OpenAI Whisper-Large-v3.
- **NLP Libraries:** SciSpaCy, Microsoft Presidio, Spacy, Transformers, SHAP, ChromaDB, OpenCV, Tesseract OCR.

---

## 📦 Installation & Setup

### Prerequisites
- Python 3.12+
- Node.js 18+
- MongoDB Instance

### Backend Setup
1. Navigate to `med-back`:
   ```bash
   cd med-back
   python -m venv venv
   source venv/bin/activate  # venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```
2. Create a `.env` file:
   ```env
   GEMINI_API_KEY=your_key
   GROQ_API_KEY=your_key
   MONGO_URI=your_uri
   JWT_SECRET=your_secret
   ```
3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to `front`:
   ```bash
   cd front
   npm install
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```

---

## 📜 Academic Contribution
This project is structured as a technical prototype for a research paper on *"Context-Aware Neuro-Symbolic Frameworks for Personalized Medical Report Simplification"*. It demonstrates a novel method of coupling generative LLMs with local symbolic checkers and SHAP-based attribution for clinical safety.

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.
