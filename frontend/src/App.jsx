import React, { useEffect, useState } from "react";
import UploadForm from "./components/UploadForm.jsx";
import DocumentsTable from "./components/DocumentsTable.jsx";
import DeleteModal from "./components/DeleteModal.jsx";
import Alert from "./components/Alert.jsx";
import { getDocuments, deleteDocument } from "./api/index.js";
import "./index.css";

function App() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, document: null, isDeleting: false });

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await getDocuments();
      setDocuments(response.data.data || []);
    } catch (error) {
      showAlert("error", "Failed to load documents");
      console.error("Load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    showAlert("success", "Document uploaded successfully!");
    loadDocuments();
  };

  const handleDeleteClick = (document) => {
    setDeleteModal({
      isOpen: true,
      document,
      isDeleting: false
    });
  };

  const handleDeleteConfirm = async () => {
    const { document } = deleteModal;
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      await deleteDocument(document.id);
      showAlert("success", "Document deleted successfully");
      loadDocuments();
      setDeleteModal({ isOpen: false, document: null, isDeleting: false });
    } catch (error) {
      showAlert("error", "Failed to delete document");
      console.error("Delete error:", error);
    } finally {
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, document: null, isDeleting: false });
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const closeAlert = () => {
    setAlert({ type: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
            </svg>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Document Portal</h1>
              <p className="text-gray-600 mt-1">Manage and organize your medical documents securely</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="md:col-span-1">
            <UploadForm
              onUploadSuccess={handleUploadSuccess}
              onError={(msg) => showAlert("error", msg)}
            />
          </div>

          {/* Documents Section */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Documents</h2>
            <DocumentsTable
              documents={documents}
              onDelete={handleDeleteClick}
              onError={(msg) => showAlert("error", msg)}
              loading={loading}
            />
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        documentName={deleteModal.document?.original_name || ""}
        isDeleting={deleteModal.isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Alert */}
      <Alert
        type={alert.type}
        message={alert.message}
        onClose={closeAlert}
      />
    </div>
  );
}

export default App;
