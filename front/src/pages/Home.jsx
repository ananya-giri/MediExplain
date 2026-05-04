import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Hero from "../components/Hero";
import FileUpload from "../components/FileUpload";
import ResultCard from "../components/ResultCard";
import ChatBox from "../components/ChatBox";
import { uploadFile, explainText } from "../services/api";

export default function Home() {
  const [originalText, setOriginalText] = useState("");
  const [explanationData, setExplanationData] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const explainMutation = useMutation({
    mutationFn: explainText,
    onSuccess: (data) => {
      if (data.explanation_data) {
        setExplanationData(data.explanation_data);
        setStatusMessage("✅ Analysis Complete.");
      }
    },
    onError: (err) => {
      setStatusMessage("⚠️ Error explaining text: " + err.message);
    }
  });

  const uploadMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      if (!data.extracted_text) {
        setStatusMessage("❌ Failed to extract text");
        return;
      }

      setOriginalText(data.extracted_text);
      setStatusMessage("📄 Extracted Text. 🧠 Generating neuro-symbolic explanation...");

      // Trigger explain mutation
      explainMutation.mutate(data.extracted_text);
    },
    onError: (err) => {
      setStatusMessage("⚠️ Error uploading file: " + err.message);
    }
  });

  const handleFileUpload = (file) => {
    setStatusMessage("Uploading and extracting text...");
    setExplanationData(null);
    uploadMutation.mutate(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-24 p-6">
      <Hero />

      <div className="w-full max-w-3xl">
        <FileUpload onFileUpload={handleFileUpload} />

        {/* Status display */}
        {statusMessage && (
          <div className="mt-4 p-4 text-center text-gray-700 font-semibold bg-white rounded-xl shadow-sm">
            {statusMessage}
          </div>
        )}

        {/* Extracted Original Report */}
        <ResultCard text={originalText} />

        {/* XAI Explanation Section */}
        {explanationData && explanationData.sentences && (
          <div className="mt-6 space-y-6">
            {/* Triage & Entities Dashboard */}
            {(explanationData.triage_level || explanationData.medical_entities) && (
              <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl mx-auto flex flex-col md:flex-row gap-6">
                {explanationData.triage_level && (
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Automated Clinical Triage</h3>
                    <div className={`p-4 rounded-xl border ${
                      explanationData.triage_level.toUpperCase() === 'RED' ? 'bg-red-50 border-red-200 text-red-800' :
                      explanationData.triage_level.toUpperCase() === 'YELLOW' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                      'bg-green-50 border-green-200 text-green-800'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl font-bold">{explanationData.triage_level.toUpperCase()}</span>
                      </div>
                      <p className="text-sm">{explanationData.triage_reason}</p>
                    </div>
                  </div>
                )}
                {explanationData.medical_entities && explanationData.medical_entities.length > 0 && (
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Medical Entities (UMLS)</h3>
                    <div className="flex flex-wrap gap-2">
                      {explanationData.medical_entities.map((ent, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-200" title={`Mapped to: ${ent.mock_code}`}>
                          {ent.entity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-blue-700">
                  🧠 Explainable AI Analysis
                </h3>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  Readability: {explanationData.cultural_readability_score || "N/A"}/100
                </span>
              </div>
              
              <div className="space-y-2 text-gray-700 leading-relaxed">
                {explanationData.sentences.map((sent, idx) => (
                  <span 
                    key={idx} 
                    className={`inline-block mr-1 p-1 rounded transition-colors duration-200 cursor-help ${
                      sent.confidence < 0.85 ? "bg-yellow-200 hover:bg-yellow-300" : "hover:bg-gray-100"
                    }`}
                    title={`Confidence: ${(sent.confidence * 100).toFixed(1)}%\nSHAP Keywords: ${sent.shap_keywords?.join(", ")}`}
                  >
                    {sent.text}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4 border-t pt-2">
                ⚠️ Highlighted text indicates low AI confidence (&lt; 85%). Hover over sentences to see key factors (SHAP values).
              </p>
            </div>
          </div>
        )}

        {/* Chat Section appears only after explanation */}
        {explanationData && (
          <ChatBox reportText={originalText} />
        )}
      </div>
    </div>
  );
}
