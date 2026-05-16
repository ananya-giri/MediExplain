import React from "react";
import { ShieldAlert, BrainCircuit, Database, FileText, Mic, Globe2, Activity, Network } from "lucide-react";

export default function About() {
  const innovations = [
    {
      icon: <Network className="w-8 h-8 text-indigo-500" />,
      title: "Dual-RAG Architecture",
      description: "A hybrid Retrieval-Augmented Generation pipeline. It cross-references global medical literature (ChromaDB) with your personal longitudinal health history (MongoDB) simultaneously to generate highly personalized, context-aware insights.",
      color: "bg-indigo-50 border-indigo-200"
    },
    {
      icon: <BrainCircuit className="w-8 h-8 text-blue-500" />,
      title: "Explainable AI (XAI) & SHAP",
      description: "Going beyond black-box AI. Our platform calculates true SHAP feature attributions locally, providing sentence-by-sentence confidence scores and highlighting the exact medical keywords that influenced the AI's reasoning.",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <ShieldAlert className="w-8 h-8 text-red-500" />,
      title: "Clinical Safety Guardrails",
      description: "Powered by Meta's Llama-Guard 3. Every user query is strictly filtered through an enterprise-grade safety model to prevent medical hallucinations, dangerous advice, or policy violations.",
      color: "bg-red-50 border-red-200"
    },
    {
      icon: <Activity className="w-8 h-8 text-emerald-500" />,
      title: "Automated Risk Triage",
      description: "Advanced NLP automatically classifies report severity into RED, YELLOW, or GREEN tiers, instantly surfacing critical health anomalies that require urgent doctor consultation.",
      color: "bg-emerald-50 border-emerald-200"
    },
    {
      icon: <Database className="w-8 h-8 text-purple-500" />,
      title: "Medical Ontology (SciSpaCy)",
      description: "Raw medical text is processed through SciSpaCy to extract structured Unified Medical Language System (UMLS) entities, ensuring precise tracking of diseases, chemicals, and biometrics over time.",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: <Mic className="w-8 h-8 text-amber-500" />,
      title: "Hands-Free Whisper ASR",
      description: "Accessibility-first design. Integrated with the Whisper-Large-v3 model to allow patients to ask complex medical questions using their voice with near-human transcription accuracy.",
      color: "bg-amber-50 border-amber-200"
    },
    {
      icon: <FileText className="w-8 h-8 text-cyan-500" />,
      title: "Enhanced Medical OCR",
      description: "Custom computer vision pipeline utilizing OpenCV image upscaling and Tesseract PSM-6 segmentation to perfectly extract tabular data and tiny fonts from scanned PDF lab reports.",
      color: "bg-cyan-50 border-cyan-200"
    },
    {
      icon: <Globe2 className="w-8 h-8 text-rose-500" />,
      title: "Native Multilingual LLM",
      description: "Breaking language barriers in healthcare. The Llama-3.3 70B backend natively processes and generates highly accurate medical explanations in Hindi, Bengali, Tamil, Telugu, and English.",
      color: "bg-rose-50 border-rose-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slideDown">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold tracking-wide uppercase mb-6">
            <BrainCircuit className="w-4 h-4" /> Research-Grade Architecture
          </div> */}
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            The Future of Explainable <br /> Medical AI
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            MediExplain isn't just a chatbot. It is a highly engineered, <strong>Neuro-Symbolic AI platform</strong> designed to make complex healthcare data transparent, accessible, and clinically safe.
          </p>
        </div>

        {/* Innovations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {innovations.map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border ${item.color} bg-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="mb-4 relative z-10">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 relative z-10">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Tech Stack Footer */}
        <div className="bg-gray-900 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
          <h2 className="text-2xl font-bold text-white mb-8">Powered by Industry-Leading Technology</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Llama 3.3 70B", "Groq LPU Engine", "FastAPI", "React + Vite", "ChromaDB", "MongoDB Atlas", "Llama-Guard 3", "SciSpaCy", "Tesseract OCR"].map((tech, idx) => (
              <span key={idx} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm font-semibold border border-gray-700 hover:border-gray-500 transition-colors">
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
