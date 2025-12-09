import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Upload document
export const uploadDocument = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

// Get all documents
export const getDocuments = () => {
  return api.get("/documents");
};

// Download document
export const downloadDocument = (documentId, originalName) => {
  return api.get(`/documents/${documentId}`, {
    responseType: "blob"
  });
};

// Delete document
export const deleteDocument = (documentId) => {
  return api.delete(`/documents/${documentId}`);
};

export default api;
