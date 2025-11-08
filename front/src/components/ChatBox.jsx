import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const ChatBox = ({ reportText }) => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("detailed"); // 🩺 Default tone
  const [language, setLanguage] = useState("English"); // 🌍 Default language
  const chatEndRef = useRef(null);

  // ✅ Persistent User ID across sessions
  const [userId] = useState(() => {
    let storedId = localStorage.getItem("user_id");
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("user_id", storedId);
    }
    return storedId;
  });

  // 🎤 Speech Recognition setup
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

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

  // 🎤 Start voice input
  const handleVoiceInput = () => {
    if (!recognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    recognition.lang =
      language === "Hindi"
        ? "hi-IN"
        : language === "Tamil"
        ? "ta-IN"
        : language === "Bengali"
        ? "bn-IN"
        : language === "Telugu"
        ? "te-IN"
        : "en-IN";

    recognition.start();
    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setQuestion(voiceText);
    };
  };

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // 💬 Send message to backend
  const handleAsk = async () => {
    if (!question.trim()) return;

    const newUserMessage = { sender: "user", text: question };
    setChatHistory((prev) => [...prev, newUserMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          report_text: reportText,
          question,
          tone,
          language,
        }),
      });

      const data = await response.json();
      const aiReply = data.answer || "⚠️ No response received.";
      const newAIMessage = { sender: "ai", text: aiReply };
      setChatHistory((prev) => [...prev, newAIMessage]);
      speak(aiReply); // 🔊 Speak reply
    } catch (err) {
      console.error("Chat Error:", err);
      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Failed to connect to AI service." },
      ]);
    } finally {
      setLoading(false);
    }
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
                {msg.text}
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
          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-300 transition"
          title="Speak your question"
        >
          🎤
        </button>

        <input
          type="text"
          placeholder="Ask about your report..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          disabled={loading}
        />

        <button
          onClick={handleAsk}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>

      {loading && (
        <p className="text-gray-500 text-sm italic mt-2">
          AI is generating a response...
        </p>
      )}
    </div>
  );
};

export default ChatBox;
