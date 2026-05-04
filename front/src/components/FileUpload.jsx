import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileType2, CheckCircle2 } from "lucide-react";

export default function FileUpload({ onFileUpload }) {
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center p-8 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 rounded-3xl w-full max-w-2xl mx-auto mb-8 relative overflow-hidden"
    >
      <label
        htmlFor="fileInput"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full cursor-pointer border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 ${
          isDragging ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-teal-400 hover:bg-gray-50"
        }`}
      >
        <motion.div 
          animate={{ y: isDragging ? -10 : 0 }}
          className={`p-4 rounded-full mb-4 ${isDragging ? "bg-teal-100 text-teal-600" : "bg-gray-50 text-gray-400"}`}
        >
          <UploadCloud className="w-10 h-10" />
        </motion.div>
        <p className="mb-2 text-xl font-semibold text-gray-700">
          Click to upload or drag and drop
        </p>
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <FileType2 className="w-4 h-4" /> PDF, JPG, JPEG, PNG
        </p>
        <input
          id="fileInput"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      <AnimatePresence>
        {fileName && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-4 w-full bg-teal-50 border border-teal-100 rounded-xl flex items-center gap-3 text-teal-700 font-medium"
          >
            <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
            <span className="truncate">{fileName}</span> uploaded successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
