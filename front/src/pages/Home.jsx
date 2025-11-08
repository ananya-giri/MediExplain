import { useState } from "react";
import Hero from "../components/Hero";
import FileUpload from "../components/FileUpload";
import ResultCard from "../components/ResultCard";
import ChatBox from "../components/ChatBox";

export default function Home() {
  const [originalText, setOriginalText] = useState("");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [finalDisplay, setFinalDisplay] = useState("");

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      // 🧩 Step 1: OCR Extraction
      const ocrResponse = await fetch("http://127.0.0.1:8000/api/upload/", {
        method: "POST",
        body: formData,
      });
      const ocrData = await ocrResponse.json();

      if (!ocrData.extracted_text) {
        setFinalDisplay("❌ Failed to extract text");
        return;
      }

      setOriginalText(ocrData.extracted_text);
      setFinalDisplay("📄 Extracted Text:\n" + ocrData.extracted_text);

      // 🧠 Step 2: AI Simplification
      const aiResponse = await fetch("http://127.0.0.1:8000/api/explain/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ocrData.extracted_text }),
      });

      const aiData = await aiResponse.json();
      if (aiData.explanation) {
        setSimplifiedText(aiData.explanation);
        setFinalDisplay(
          `📄 Original Report:\n${ocrData.extracted_text}\n\n🧠 Simplified Explanation:\n${aiData.explanation}`
        );
      }
    } catch (err) {
      setFinalDisplay("⚠️ Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <Hero />

      <div className="w-full max-w-3xl">
        <FileUpload onFileUpload={handleFileUpload} />

        {/* Result display */}
        <ResultCard text={finalDisplay} />

        {/* Chat Section appears only after explanation */}
        {simplifiedText && (
          <ChatBox reportText={originalText} />
        )}
      </div>
    </div>
  );
}
