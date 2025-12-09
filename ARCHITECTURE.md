# Architecture & System Diagram

## 🏗️ High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                                   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      React Application                               │   │
│  │                    http://localhost:3000                             │   │
│  │                                                                      │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │ App.jsx (Main Component)                                    │   │   │
│  │  │ ├─ State: documents[], alert, deleteModal                 │   │   │
│  │  │ ├─ loadDocuments()  - fetch list                          │   │   │
│  │  │ ├─ handleUploadSuccess()                                  │   │   │
│  │  │ └─ handleDelete()                                          │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │           ↓                      ↓                    ↓              │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │   │
│  │  │ UploadForm       │  │DocumentsTable    │  │DeleteModal      │  │   │
│  │  ├─ File input     │  │├─ Document list  │  │├─ Confirmation  │  │   │
│  │  ├─ Validation     │  │├─ Download btn   │  │├─ Loading state │  │   │
│  │  ├─ Loading state  │  │└─ Delete btn     │  │└─ Actions       │  │   │
│  │  └──────────────────┘  └──────────────────┘  └─────────────────┘  │   │
│  │           ↓                      ↓                    ↓              │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │ Alert Component (Global Notifications)                     │  │   │
│  │  │ ├─ Success alerts                                          │  │   │
│  │  │ ├─ Error alerts                                            │  │   │
│  │  │ └─ Warning alerts (auto-dismiss in 5s)                    │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │           ↓ ↓ ↓                                                    │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │ Axios HTTP Client (api/index.js)                            │  │   │
│  │  │ ├─ uploadDocument(file)                                    │  │   │
│  │  │ ├─ getDocuments()                                          │  │   │
│  │  │ ├─ downloadDocument(id)                                    │  │   │
│  │  │ └─ deleteDocument(id)                                      │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────┬──────────────────────────────────┘
                                          │ HTTP Requests
                                          │ (JSON + FormData)
                                          ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Express.js Server                                         │
│                  http://localhost:5000                                       │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ server.js (Entry Point)                                              │   │
│  │ ├─ Express app initialization                                        │   │
│  │ ├─ CORS middleware                                                   │   │
│  │ ├─ Body parser middleware                                            │   │
│  │ ├─ Static file serving (/uploads)                                   │   │
│  │ └─ Route mounting (/api/documents)                                  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│           ↓                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ Express Router (routes/documents.routes.js)                          │   │
│  │ ├─ POST   /upload                                                    │   │
│  │ ├─ GET    / (list)                                                   │   │
│  │ ├─ GET    /:id (download)                                            │   │
│  │ └─ DELETE /:id (delete)                                              │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│           ↓                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ Middleware Layer                                                      │   │
│  │ ├─ upload.js (Multer Configuration)                                 │   │
│  │ │  ├─ File storage config                                           │   │
│  │ │  ├─ PDF MIME type validation                                      │   │
│  │ │  ├─ File extension validation (.pdf)                              │   │
│  │ │  ├─ Size limit (8 MB = 8388608 bytes)                             │   │
│  │ │  └─ Error handling                                                │   │
│  │ └─ Error handling middleware                                         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│           ↓                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ Controllers (controllers/documents.controller.js)                    │   │
│  │ ├─ uploadDocument(req, res)                                          │   │
│  │ │  ├─ Validate file                                                 │   │
│  │ │  ├─ Generate UUID                                                 │   │
│  │ │  └─ Insert to database                                            │   │
│  │ ├─ listDocuments(req, res)                                           │   │
│  │ │  └─ Query all documents (ordered by date)                         │   │
│  │ ├─ downloadDocument(req, res)                                        │   │
│  │ │  ├─ Get document metadata                                         │   │
│  │ │  └─ Stream file to client                                         │   │
│  │ └─ deleteDocument(req, res)                                          │   │
│  │    ├─ Delete file from disk                                         │   │
│  │    └─ Delete record from database                                   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│           ↓                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ Database Layer (db/db.js)                                            │   │
│  │ ├─ initDb()    - Initialize SQLite connection                        │   │
│  │ ├─ run(sql)    - INSERT, UPDATE, DELETE operations                  │   │
│  │ ├─ get(sql)    - SELECT single row                                   │   │
│  │ ├─ all(sql)    - SELECT all rows                                     │   │
│  │ └─ closeDb()   - Close connection                                    │   │
│  │                                                                       │   │
│  │ Promises: All DB operations return Promises                         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│           ↓                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ Storage Layer                                                         │   │
│  │ ├─ SQLite Database File: db.sqlite                                  │   │
│  │ │  └─ documents table (7 columns)                                   │   │
│  │ └─ File System: backend/uploads/                                    │   │
│  │    └─ UUID-named PDF files                                          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Diagrams

### Upload Document Flow

```
User Action: Select PDF file
    ↓
UploadForm.jsx
├─ Validate file type (PDF only)
├─ Validate file size (≤ 8 MB)
└─ Create FormData
    ↓
api/index.js (uploadDocument)
├─ POST /api/documents/upload
└─ Send FormData
    ↓
middleware/upload.js (Multer)
├─ Receive multipart/form-data
├─ Validate MIME type
├─ Validate extension (.pdf)
├─ Check file size
├─ Generate UUID filename
└─ Save to backend/uploads/
    ↓
controllers/documents.controller.js (uploadDocument)
├─ Create document metadata
├─ Generate database record with UUID
└─ INSERT into documents table
    ↓
SQLite Database
├─ Write row to documents table
└─ Return success
    ↓
JSON Response
├─ success: true
├─ data: {id, filename, original_name, filesize, created_at}
└─ message: "Document uploaded successfully"
    ↓
App.jsx
├─ Show success alert
├─ Call loadDocuments()
├─ Clear form
└─ Refresh table
    ↓
User sees new document in table ✓
```

### Download Document Flow

```
User Action: Click "Download" button on document
    ↓
DocumentsTable.jsx
├─ Extract document ID
└─ Call handleDownload(doc)
    ↓
api/index.js (downloadDocument)
├─ GET /api/documents/:id
└─ Set responseType: 'blob'
    ↓
controllers/documents.controller.js (downloadDocument)
├─ Query database by ID
├─ Verify document exists
├─ Get file path
├─ Verify file on disk
└─ Use res.download() to stream file
    ↓
Express sends file
├─ Content-Disposition: attachment
├─ Original filename
└─ Binary PDF content
    ↓
Browser receives blob
├─ Create object URL
├─ Create hidden <a> tag
├─ Trigger click (download)
└─ Revoke object URL
    ↓
User's downloads folder
└─ File saved with original name ✓
```

### Delete Document Flow

```
User Action: Click "Delete" button
    ↓
DocumentsTable.jsx
├─ Call handleDeleteClick(doc)
└─ Set deleteModal.isOpen = true
    ↓
DeleteModal.jsx
├─ Show confirmation dialog
├─ Display document name
└─ Wait for user action
    ↓
User confirms deletion
    ↓
api/index.js (deleteDocument)
├─ DELETE /api/documents/:id
└─ Send request
    ↓
controllers/documents.controller.js (deleteDocument)
├─ Query database by ID
├─ Verify document exists
├─ Delete file from backend/uploads/
│  (handle error if file missing)
├─ DELETE from documents table
└─ Return success response
    ↓
SQLite Database
├─ Remove document record
└─ Commit transaction
    ↓
App.jsx
├─ Close delete modal
├─ Show success alert
└─ Call loadDocuments()
    ↓
DocumentsTable.jsx
└─ Refresh table (document removed)
    ↓
User sees updated list ✓
```

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                    documents (Table)                        │
├─────────────────────────────────────────────────────────────┤
│ id TEXT PRIMARY KEY                                         │
│    Unique identifier (UUID v4)                              │
│    Example: "550e8400-e29b-41d4-a716-446655440000"         │
│                                                              │
│ filename TEXT NOT NULL UNIQUE                               │
│    Stored filename (UUID.pdf)                               │
│    Example: "550e8400-e29b-41d4-a716-446655440000.pdf"     │
│    UNIQUE constraint prevents duplicates                    │
│                                                              │
│ original_name TEXT NOT NULL                                 │
│    Original filename from user upload                       │
│    Example: "patient_report.pdf"                            │
│                                                              │
│ filepath TEXT NOT NULL                                      │
│    Relative path to file                                    │
│    Example: "uploads/550e8400-e29b-41d4-a716-446655440000" │
│                                                              │
│ filesize INTEGER NOT NULL                                   │
│    File size in bytes                                       │
│    Example: 2097152 (2 MB)                                  │
│                                                              │
│ created_at TEXT NOT NULL                                    │
│    ISO 8601 timestamp of upload                             │
│    Example: "2024-12-09T10:30:00.000Z"                      │
│                                                              │
│ updated_at TEXT NOT NULL                                    │
│    ISO 8601 timestamp of last update                        │
│    Example: "2024-12-09T10:30:00.000Z"                      │
└─────────────────────────────────────────────────────────────┘

Sample Data:
┌──────────────────────┬────────────────────────┬────────────────────────┐
│ id                   │ original_name          │ filesize               │
├──────────────────────┼────────────────────────┼────────────────────────┤
│ 550e8400-e29b-41d4   │ patient_report.pdf     │ 2097152                │
│ 660e8400-e29b-41d4   │ lab_results.pdf        │ 1048576                │
│ 770e8400-e29b-41d4   │ prescription.pdf       │ 524288                 │
└──────────────────────┴────────────────────────┴────────────────────────┘
```

## 🔄 Request-Response Cycle

```
HTTP Requests:

1. POST /api/documents/upload
   Content-Type: multipart/form-data
   Body: binary file data
   ↓
   Response (201):
   {
     "success": true,
     "message": "Document uploaded successfully",
     "data": {...document metadata...}
   }

2. GET /api/documents
   Query: none
   ↓
   Response (200):
   {
     "success": true,
     "message": "Documents retrieved successfully",
     "data": [{...}, {...}]
   }

3. GET /api/documents/:id
   Query: document ID
   ↓
   Response (200):
   Content-Disposition: attachment
   Body: PDF binary data

4. DELETE /api/documents/:id
   Query: document ID
   ↓
   Response (200):
   {
     "success": true,
     "message": "Document deleted successfully",
     "data": null
   }
```

## 🛡️ Security Layers

```
Input Validation
├─ Client-side (React)
│  └─ File type check, size check before upload
└─ Server-side (Express)
   ├─ MIME type validation (application/pdf)
   ├─ Extension validation (.pdf)
   ├─ File size limit (8 MB)
   └─ Request body size limit

File Handling
├─ UUID generation (no predictable names)
├─ UUID storage (prevents path traversal)
├─ Isolated uploads directory
└─ No executable files allowed

Database Security
├─ Parameterized queries (prevent SQL injection)
├─ Input sanitization
├─ Unique constraints
└─ ACID compliance

CORS Security
├─ Whitelist frontend origin
├─ Specify allowed methods
├─ Specify allowed headers
└─ Credentials handling

Error Handling
├─ No sensitive info in error messages
├─ Proper HTTP status codes
├─ Graceful degradation
└─ Logging for debugging
```

---

This architecture document provides a complete visual representation of the system design and data flows.
