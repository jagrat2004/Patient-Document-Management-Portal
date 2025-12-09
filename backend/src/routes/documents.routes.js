import express from "express";
import { uploadMiddleware, handleUploadError } from "../middleware/upload.js";
import {
  uploadDocument,
  listDocuments,
  downloadDocument,
  deleteDocument
} from "../controllers/documents.controller.js";

const router = express.Router();

// POST - Upload document
router.post("/upload", uploadMiddleware.single("file"), handleUploadError, uploadDocument);

// GET - List all documents
router.get("/", listDocuments);

// GET - Download document
router.get("/:id", downloadDocument);

// DELETE - Delete document
router.delete("/:id", deleteDocument);

export default router;
