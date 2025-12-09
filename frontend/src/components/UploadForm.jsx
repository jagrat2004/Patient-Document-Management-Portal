import React, { useRef } from "react";
import { uploadDocument } from "../api/index.js";

const UploadForm = ({ onUploadSuccess, onError }) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [fileName, setFileName] = React.useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const file = fileInputRef.current.files[0];
    if (!file) {
      onError("Please select a file");
      return;
    }

    // Client-side validation
    if (!file.type.includes("pdf")) {
      onError("Only PDF files are allowed");
      fileInputRef.current.value = "";
      setFileName("");
      return;
    }

    const maxSize = 8 * 1024 * 1024; // 8 MB
    if (file.size > maxSize) {
      onError("File size exceeds 8 MB limit");
      fileInputRef.current.value = "";
      setFileName("");
      return;
    }

    setIsUploading(true);
    try {
      await uploadDocument(file);
      onUploadSuccess();
      fileInputRef.current.value = "";
      setFileName("");
    } catch (error) {
      const message = error.response?.data?.message || "Upload failed";
      onError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 border-2 border-dashed border-blue-200">
      <div className="text-center mb-6">
        <svg className="w-12 h-12 mx-auto text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Upload PDF Document</h3>
        <p className="text-gray-600 text-sm">Max size: 8 MB</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="file-input" className="block mb-2">
            <div className="flex items-center justify-center w-full cursor-pointer">
              <div className="text-center">
                <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {fileName ? (
                  <p className="text-sm text-gray-600">
                    Selected: <span className="font-medium text-gray-900">{fileName}</span>
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">Click to select a PDF file or drag and drop</p>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              id="file-input"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isUploading || !fileName}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Uploading...
            </>
          ) : (
            "Upload Document"
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
