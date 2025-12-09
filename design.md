# Architecture & Design Document

## Patient Document Management Portal

---

## 1. Tech Stack Choices

### **React for Frontend**

**Why React?**
- **Component-based architecture**: Enables reusable, maintainable UI components (UploadForm, DocumentsTable, DeleteModal)
- **Virtual DOM**: Provides excellent performance and smooth UX
- **Rich ecosystem**: Large community with tools like Axios for HTTP requests
- **Developer experience**: JSX makes UI code readable and intuitive
- **SPA capability**: Creates fast, responsive single-page application without page reloads

### **Express.js for Backend**

**Why Express?**
- **Lightweight & fast**: Minimal overhead, perfect for REST APIs
- **Middleware system**: Clean handling of CORS, file uploads (Multer), and error handling
- **Express Router**: Enables organized, modular route structure
- **Node.js ecosystem**: Access to npm packages for database, file handling, and utilities
- **Production-ready**: Widely used in enterprise applications
- **Easy to scale**: Simple to add features like authentication, logging, and caching

### **SQLite for Database**

**Why SQLite?**
- **No server required**: Runs as a file-based database (db.sqlite), perfect for local development
- **Zero configuration**: Works out-of-the-box without setup
- **ACID compliance**: Ensures data integrity
- **Small footprint**: Ideal for single-user applications
- **Easy deployment**: Single database file can be backed up and moved easily
- **Sufficient for healthcare docs**: Handles the document metadata efficiently

### **Multer for File Uploads**

**Why Multer?**
- **Designed for Express**: Seamless integration with Express middleware
- **Memory-efficient**: Streams files directly to disk without loading into memory
- **File validation**: Built-in size limits and MIME type filtering
- **Unique filename generation**: Prevents file overwrite conflicts
- **Industry standard**: Widely trusted and battle-tested

---

## 2. Architecture Overview

### **System Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  React SPA (Port 3000)                                    │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ App.jsx (State Management)                          │  │  │
│  │  │  - documents: Document[]                            │  │  │
│  │  │  - alert: {type, message}                           │  │  │
│  │  │  - deleteModal: {isOpen, document}                  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                          ↕                                 │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ Components Layer                                    │  │  │
│  │  │ • UploadForm.jsx → POST /documents/upload           │  │  │
│  │  │ • DocumentsTable.jsx → GET /documents               │  │  │
│  │  │ • DeleteModal.jsx → DELETE /documents/:id           │  │  │
│  │  │ • Alert.jsx (Global notifications)                  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                          ↕                                 │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ API Layer (Axios)                                   │  │  │
│  │  │ api/index.js - HTTP client configuration            │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────┬──────────────────────────────────────────┘
                      │ HTTP/REST
                      ↓ (JSON + FormData)
┌─────────────────────────────────────────────────────────────────┐
│              EXPRESS.JS SERVER (Port 5000)                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ server.js - Application Entry Point                      │  │
│  │  • CORS middleware                                        │  │
│  │  • Body parser middleware                                │  │
│  │  • Static file serving (uploads/)                        │  │
│  │  • Route mounting                                         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ API Routes Layer                                          │  │
│  │ routes/documents.routes.js                               │  │
│  │  • POST   /documents/upload                              │  │
│  │  • GET    /documents                                     │  │
│  │  • GET    /documents/:id                                │  │
│  │  • DELETE /documents/:id                                │  │
│  └───────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Middleware Layer                                          │  │
│  │  • middleware/upload.js (Multer config)                 │  │
│  │    - Storage: backend/uploads/                          │  │
│  │    - Validation: PDF only, max 8MB                      │  │
│  │    - Error handling                                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Controller Layer                                          │  │
│  │ controllers/documents.controller.js                      │  │
│  │  • uploadDocument()                                       │  │
│  │  • listDocuments()                                        │  │
│  │  • downloadDocument()                                     │  │
│  │  • deleteDocument()                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Database Layer                                            │  │
│  │ db/db.js (SQLite wrapper)                               │  │
│  │  • initDb()      - Initialize connection                │  │
│  │  • run(sql)      - INSERT/UPDATE/DELETE                 │  │
│  │  • get(sql)      - SELECT single row                    │  │
│  │  • all(sql)      - SELECT all rows                      │  │
│  │  • closeDb()     - Close connection                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Storage Layer                                             │  │
│  │  • Files: backend/uploads/*.pdf                          │  │
│  │  • Database: backend/db.sqlite                           │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### **Data Flow**

1. **Client → Server**: HTTP requests (JSON body or FormData)
2. **Server Processing**: Request → Middleware → Route → Controller → DB
3. **Server → Client**: JSON responses with metadata or file data
4. **File Storage**: Multer handles disk storage while DB stores metadata

---

## 3. API Specifications

### **3.1 POST /api/documents/upload**

**Purpose**: Upload a new PDF document

**Request**:
```http
POST /api/documents/upload HTTP/1.1
Host: localhost:5000
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="patient_report.pdf"
Content-Type: application/pdf

[Binary PDF content]
------WebKitFormBoundary--
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "550e8400-e29b-41d4-a716-446655440000.pdf",
    "original_name": "patient_report.pdf",
    "filepath": "uploads/550e8400-e29b-41d4-a716-446655440000.pdf",
    "filesize": 2097152,
    "created_at": "2024-12-09T10:30:00.000Z",
    "updated_at": "2024-12-09T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request)**:
```json
{
  "success": false,
  "message": "Only PDF files are allowed"
}
```

**Validation Rules**:
- Only PDF files (MIME: application/pdf, extension: .pdf)
- Max file size: 8 MB
- One file per request

---

### **3.2 GET /api/documents**

**Purpose**: Retrieve all uploaded documents

**Request**:
```http
GET /api/documents HTTP/1.1
Host: localhost:5000
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Documents retrieved successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "original_name": "patient_report.pdf",
      "filesize": 2097152,
      "created_at": "2024-12-09T10:30:00.000Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "original_name": "lab_results.pdf",
      "filesize": 1048576,
      "created_at": "2024-12-09T11:15:00.000Z"
    }
  ]
}
```

**Notes**:
- Returns documents ordered by creation date (newest first)
- Does not include filepath (security)
- Ideal for table display

---

### **3.3 GET /api/documents/:id**

**Purpose**: Download a specific document file

**Request**:
```http
GET /api/documents/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: localhost:5000
```

**Response (200 OK)**:
- Header: `Content-Disposition: attachment; filename="patient_report.pdf"`
- Body: Binary PDF file content

**Error Response (404 Not Found)**:
```json
{
  "success": false,
  "message": "Document not found"
}
```

---

### **3.4 DELETE /api/documents/:id**

**Purpose**: Delete a document (file + metadata)

**Request**:
```http
DELETE /api/documents/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: localhost:5000
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Document deleted successfully",
  "data": null
}
```

**Error Response (404 Not Found)**:
```json
{
  "success": false,
  "message": "Document not found"
}
```

**Notes**:
- Deletes both physical file and database record
- Handles orphaned files gracefully

---

## 4. Data Flow: Step-by-Step

### **Upload Flow**

```
User selects PDF
    ↓
Client validates (type, size)
    ↓
UploadForm sends FormData via Axios
    ↓
Backend receives multipart/form-data
    ↓
Multer middleware processes:
  • Validate file type (PDF only)
  • Check file size (≤ 8 MB)
  • Generate unique filename (UUID)
  • Save to backend/uploads/
    ↓
Controller (uploadDocument):
  • Create document record with UUID
  • Insert metadata into SQLite
  • Return JSON response with document info
    ↓
Frontend receives response:
  • Show success alert
  • Reload documents list
  • Clear form
    ↓
User sees new document in table
```

### **Download Flow**

```
User clicks "Download" button
    ↓
Frontend sends GET /documents/:id
    ↓
Backend controller (downloadDocument):
  • Query database by ID
  • Verify file exists on disk
  • Use res.download() to stream file
    ↓
Browser receives file with:
  • Original filename in Content-Disposition header
  • PDF binary content
    ↓
Browser triggers download dialog
    ↓
File saved to user's downloads folder
```

### **Delete Flow**

```
User clicks "Delete" button
    ↓
Modal confirmation opens
    ↓
User confirms deletion
    ↓
Frontend sends DELETE /documents/:id
    ↓
Backend controller (deleteDocument):
  • Query database by ID
  • Delete file from backend/uploads/
  • Delete record from SQLite
  • Return success response
    ↓
Frontend shows success alert
    ↓
Reload documents list
    ↓
Document removed from UI
```

---

## 5. Assumptions

### **Single User Model**
- No authentication or authorization
- All documents belong to one implicit user
- No user accounts or sessions

### **File Size Limits**
- Maximum: 8 MB per file
- Enforced at both client (validation) and server (Multer)
- Suitable for medical documents (text PDFs, scans)

### **No Authentication**
- Application assumes trusted environment (local network)
- No JWT, OAuth, or password protection
- Full access to all operations

### **Local Storage**
- All files stored locally in `backend/uploads/`
- SQLite database file at `backend/db.sqlite`
- No cloud storage or external services
- Single machine deployment

### **Simple Concurrency Model**
- SQLite handles basic concurrent reads
- No complex transaction management
- Designed for single user + occasional uploads
- Not suitable for high-concurrency scenarios

### **File System Permissions**
- Backend process must have write access to `uploads/` directory
- Directory auto-created on server startup if missing
- No special permission checks required

### **Data Integrity**
- Filename uniqueness enforced via UUID
- Metadata stored atomically with file upload
- Orphaned files cleaned up manually if needed

---

## 6. Database Schema

### **documents Table**

```sql
CREATE TABLE documents (
  id TEXT PRIMARY KEY,                    -- UUID
  filename TEXT NOT NULL UNIQUE,          -- Stored name (UUID.pdf)
  original_name TEXT NOT NULL,            -- User's original filename
  filepath TEXT NOT NULL,                 -- Relative path to file
  filesize INTEGER NOT NULL,              -- File size in bytes
  created_at TEXT NOT NULL,               -- ISO 8601 timestamp
  updated_at TEXT NOT NULL                -- ISO 8601 timestamp
)
```

**Indexes**: Primary key on `id`, Unique constraint on `filename`

---

## 7. Error Handling Strategy

| Error | HTTP Code | Message | Handling |
|-------|-----------|---------|----------|
| Invalid file type | 400 | Only PDF files are allowed | Client rejects, server validates |
| File too large | 400 | File size exceeds 8 MB limit | Multer size limit + client check |
| No file provided | 400 | No file uploaded | Middleware validation |
| Document not found | 404 | Document not found | Graceful 404 response |
| Database error | 500 | Failed to upload/retrieve document | Log + generic error message |
| File not on disk | 404 | File not found on disk | Handled in download controller |

---

## 8. Security Considerations

- **File validation**: PDF MIME type + extension check
- **Size limits**: 8 MB hard limit via Multer
- **Filename anonymization**: UUID-based storage names prevent path traversal
- **CORS enabled**: Configured for localhost development
- **No SQL injection**: Parameterized queries via sqlite3 driver
- **File cleanup**: Deleted files removed from disk immediately

---

## 9. Scalability Notes

**Current Design** is suitable for:
- Single user
- < 1,000 documents
- Local network deployment

**For future scaling** consider:
- Add authentication/authorization
- Switch to PostgreSQL for multi-user support
- Implement cloud storage (S3, Azure Blob)
- Add caching layer (Redis)
- Implement proper logging (Winston, Bunyan)
- Add database migrations framework (Knex, Sequelize)
- Containerize with Docker
