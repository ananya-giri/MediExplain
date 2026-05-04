import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useMutation } from "@tanstack/react-query";
import { chatAboutReport, transcribeAudio } from "../services/api";

const ChatBox = ({ reportText }) => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [tone, setTone] = useState("detailed"); // 🩺 Default tone
  const [language, setLanguage] = useState("English"); // 🌍 Default language
  const chatEndRef = useRef(null);

  // ASR State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // ✅ Persistent User ID across sessions
  const [userId] = useState(() => {
    let storedId = localStorage.getItem("user_id");
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("user_id", storedId);
    }
    return storedId;
  });

  const chatMutation = useMutation({
    mutationFn: chatAboutReport,
    onSuccess: (data) => {
      const aiReply = data.answer_data;
      if (aiReply && aiReply.sentences) {
        const fullText = aiReply.sentences.map((s) => s.text).join(" ");
        const newAIMessage = { sender: "ai", sentences: aiReply.sentences, text: fullText };
        setChatHistory((prev) => [...prev, newAIMessage]);
        speak(fullText);
      } else {
        const fallbackText = "⚠️ Failed to parse AI response.";
        setChatHistory((prev) => [...prev, { sender: "ai", text: fallbackText }]);
        speak(fallbackText);
      }
    },
    onError: (err) => {
      console.error("Chat Error:", err);
      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Failed to connect to AI service." },
      ]);
    }
  });

  const transcribeMutation = useMutation({
    mutationFn: transcribeAudio,
    onSuccess: (data) => {
      if (data.text) setQuestion(data.text);
    },
    onError: (err) => {
      console.error("Transcription error:", err);
      alert("Failed to transcribe audio.");
    }
  });

  // 🔊 Read aloud function
  const speak = (text) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    utter.lang =
      language === "Hindi"
        ? "hi-IN"
        : language === "Tamil"
        ? "ta-IN"
        : language === "Bengali"
        ? "bn-IN"
        : language === "Telugu"
        ? "te-IN"
        : "en-IN";
    synth.speak(utter);
  };

  // 🎤 Start/Stop voice input using MediaRecorder and Whisper ASR
  const handleVoiceInput = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          transcribeMutation.mutate(audioBlob);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        alert("Microphone access denied or not available.");
        console.error(err);
      }
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // 💬 Send message to backend
  const handleAsk = () => {
    if (!question.trim()) return;

    const newUserMessage = { sender: "user", text: question };
    setChatHistory((prev) => [...prev, newUserMessage]);
    
    chatMutation.mutate({
      user_id: userId,
      report_text: reportText,
      question,
      tone,
      language,
    });
    
    setQuestion("");
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-5 mt-6 border border-gray-200 flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        💬 Ask Questions About This Report
      </h2>

      {/* 🧩 Tone & Language Selectors */}
      <div className="flex flex-wrap gap-3 mb-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Response Style:
          </label>
          <select
            className="border rounded-lg px-2 py-1 text-sm focus:outline-none"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="detailed">🩺 Detailed</option>
            <option value="summary">🧾 Summary</option>
            <option value="child">👶 Child-Friendly</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Language:
          </label>
          <select
            className="border rounded-lg px-2 py-1 text-sm focus:outline-none"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">🇬🇧 English</option>
            <option value="Hindi">🇮🇳 Hindi</option>
            <option value="Tamil">🇮🇳 Tamil</option>
            <option value="Bengali">🇮🇳 Bengali</option>
            <option value="Telugu">🇮🇳 Telugu</option>
          </select>
        </div>
      </div>

      {/* 💬 Chat History */}
      <div className="h-72 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50 mb-3">
        {chatHistory.length === 0 ? (
          <p className="text-gray-500 italic">No questions yet. Ask something!</p>
        ) : (
          chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-3 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.sender === "ai" && msg.sentences ? (
                  msg.sentences.map((sent, idx) => (
                    <span
                      key={idx}
                      className={`inline-block mr-1 p-0.5 rounded cursor-help ${
                        sent.confidence < 0.85 ? "bg-yellow-300 text-black" : ""
                      }`}
                      title={`Confidence: ${(sent.confidence * 100).toFixed(1)}%\nSHAP Keywords: ${sent.shap_keywords?.join(", ")}`}
                    >
                      {sent.text}
                    </span>
                  ))
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* 🎤 Input and Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleVoiceInput}
          className={`px-3 py-2 rounded-xl transition ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          title="Speak your question"
        >
          {isRecording ? "🛑" : "🎤"}
        </button>

        <input
          type="text"
          placeholder={transcribeMutation.isPending ? "Transcribing audio..." : "Ask about your report..."}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          disabled={chatMutation.isPending || transcribeMutation.isPending}
        />

        <button
          onClick={handleAsk}
          disabled={chatMutation.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          {chatMutation.isPending ? "Thinking..." : "Send"}
        </button>
      </div>

      {chatMutation.isPending && (
        <p className="text-gray-500 text-sm italic mt-2">
          AI is generating a response...
        </p>
      )}
    </div>
  );
};

export default ChatBox;
