import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { run, all, get } from "../db/db.js";
import { sendSuccess, sendError } from "../utils/response.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, "../../uploads");

// POST /documents/upload - Upload a new PDF document
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, "No file uploaded", 400);
    }

    const documentId = uuidv4();
    const now = new Date().toISOString();

    const documentData = {
      id: documentId,
      filename: req.file.filename,
      original_name: req.file.originalname,
      filepath: `uploads/${req.file.filename}`,
      filesize: req.file.size,
      created_at: now,
      updated_at: now
    };

    // Insert into database
    await run(
      `INSERT INTO documents (id, filename, original_name, filepath, filesize, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        documentData.id,
        documentData.filename,
        documentData.original_name,
        documentData.filepath,
        documentData.filesize,
        documentData.created_at,
        documentData.updated_at
      ]
    );

    sendSuccess(res, documentData, "Document uploaded successfully", 201);
  } catch (error) {
    console.error("Upload error:", error);

    // Clean up uploaded file if database insert fails
    if (req.file) {
      try {
        await fs.unlink(path.join(UPLOAD_DIR, req.file.filename));
      } catch (err) {
        console.error("Cleanup error:", err);
      }
    }

    // Check for duplicate filename error
    if (error.message && error.message.includes("UNIQUE")) {
      return sendError(res, "Document with this filename already exists", 409, error);
    }

    sendError(res, "Failed to upload document", 500, error);
  }
};

// GET /documents - List all documents
export const listDocuments = async (req, res) => {
  try {
    const documents = await all(
      `SELECT id, original_name, filesize, created_at FROM documents ORDER BY created_at DESC`
    );

    sendSuccess(res, documents, "Documents retrieved successfully", 200);
  } catch (error) {
    console.error("List error:", error);
    sendError(res, "Failed to retrieve documents", 500, error);
  }
};

// GET /documents/:id - Download a document
export const downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // Get document from database
    const document = await get(
      `SELECT * FROM documents WHERE id = ?`,
      [id]
    );

    if (!document) {
      return sendError(res, "Document not found", 404);
    }

    const filePath = path.join(UPLOAD_DIR, document.filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (err) {
      return sendError(res, "File not found on disk", 404);
    }

    // Send file
    res.download(filePath, document.original_name);
  } catch (error) {
    console.error("Download error:", error);
    sendError(res, "Failed to download document", 500, error);
  }
};

// DELETE /documents/:id - Delete a document
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // Get document from database
    const document = await get(
      `SELECT * FROM documents WHERE id = ?`,
      [id]
    );

    if (!document) {
      return sendError(res, "Document not found", 404);
    }

    // Delete file from disk
    const filePath = path.join(UPLOAD_DIR, document.filename);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      // File might already be deleted, continue with database deletion
      console.warn("File deletion warning:", err.message);
    }

    // Delete from database
    await run(
      `DELETE FROM documents WHERE id = ?`,
      [id]
    );

    sendSuccess(res, null, "Document deleted successfully", 200);
  } catch (error) {
    console.error("Delete error:", error);
    sendError(res, "Failed to delete document", 500, error);
  }
};
