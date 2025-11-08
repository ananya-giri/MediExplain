import React from "react";
import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-green-200 via-white to-pink-200 flex justify-center py-12 px-6 animate-fadeIn">

        <div className="max-w-5xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-green-200 transition-all duration-500 hover:shadow-green-300/40">

          <h1 className="text-4xl font-extrabold text-green-700 text-center mb-3 animate-slideDown">
            🩺 About MediExplain
          </h1>

          <p className="text-gray-700 text-center mb-14 text-lg animate-fadeInSlow">
            MediExplain is your AI-powered medical companion that converts confusing medical reports into clear, understandable insights — enabling confident healthcare decisions.
          </p>

          {/* ✨ Animated Features Grid */}
          <div className="grid md:grid-cols-2 gap-8">

            {[
              ["📄 Report Upload & OCR", "Upload medical reports and let our OCR extract text with high accuracy — even from unclear scans."],
              ["🧠 AI Simplified Explanations", "We convert medical jargon into plain, understandable language — without losing medical accuracy."],
              ["💬 Context-Aware Chat", "Ask questions based on *your* report — the AI understands your context, not generic web info."],
              ["🌍 Multilingual Support", "Choose your preferred language — Hindi, English, Bengali, Tamil, and more coming soon."],
              ["🔐 Secure & Private", "Your medical history is encrypted and safe. Your data stays yours — always."],
              ["🗂️ Personal Health History", "Access past reports and explanations anytime — your medical journey, neatly organized."]
            ].map(([title, desc], index) => (
              <div
                key={index}
                className="p-6 border border-green-400 rounded-2xl bg-green-50/60 backdrop-blur-sm
                           hover:-translate-y-2 hover:shadow-xl hover:bg-green-100/80
                           transition-all duration-300 animate-fadeUp"
              >
                <h2 className="text-xl font-semibold text-green-700">{title}</h2>
                <p className="text-gray-600 mt-2 leading-relaxed">{desc}</p>
              </div>
            ))}

          </div>

          

          {/* Footer */}
          <div className="text-center mt-12 animate-fadeInSlow">
            <p className="text-gray-500 text-sm tracking-wide">
              Built with ❤️ to make healthcare easy, transparent, and accessible.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
