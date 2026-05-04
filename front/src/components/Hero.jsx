import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="text-center py-10 px-4 w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-600 font-medium text-sm mb-6 border border-teal-100 shadow-sm"
      >
        <Sparkles className="w-4 h-4" /> AI-Powered Analysis
      </motion.div>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight"
      >
        Simplify Your Medical Reports <span className="text-teal-500">Instantly</span>
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
      >
        Upload your blood test, X-ray, or prescription — get clear, AI-powered explanations in plain language so you can understand your health better.
      </motion.p>
    </section>
  );
}
