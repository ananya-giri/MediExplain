import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Stethoscope, Activity, FileText, ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white overflow-hidden relative flex flex-col items-center justify-center pt-20">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center text-center px-6 max-w-4xl"
      >
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-8 backdrop-blur-md inline-block shadow-xl">
          <Stethoscope className="w-10 h-10 text-teal-400" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-200 to-white">
          Decode Your Health
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
          Upload your complex medical reports, and let our advanced AI translate them into simple, clear, and actionable insights. Understand your body better.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
          <Link to="/signup">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-gray-900 font-bold rounded-full flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)]"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <Link to="/login">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full border border-white/10 backdrop-blur-md transition-all"
            >
              Login
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Features snippet */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="z-10 mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 px-6 max-w-5xl w-full pb-20"
      >
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-4 hover:bg-white/10 transition-colors">
          <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 shadow-inner">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Instant OCR</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Effortlessly extract text from your scanned documents and lab results with high precision.</p>
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-4 hover:bg-white/10 transition-colors">
          <div className="p-3 bg-teal-500/20 rounded-xl text-teal-400 shadow-inner">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">AI Explanations</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Get medical jargon broken down into plain English with state-of-the-art AI models.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
