import { useState } from "react";

export default function FileUpload({ onFileUpload }) {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-2xl w-full max-w-lg mx-auto">
      <label
        htmlFor="fileInput"
        className="cursor-pointer border-2 border-dashed border-blue-400 rounded-xl p-8 text-center text-gray-600 hover:bg-blue-50 transition"
      >
        <p className="mb-2 text-lg">📄 Click or drag a file to upload</p>
        <p className="text-sm text-gray-500">Supported: .pdf, .jpg, .png</p>
        <input
          id="fileInput"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {fileName && (
        <p className="mt-4 text-blue-600 font-medium">
          ✅ {fileName} uploaded successfully!
        </p>
      )}
    </div>
  );
}
