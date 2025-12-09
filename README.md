# Patient Document Management Portal

A modern, production-quality full-stack web application for managing medical PDF documents with a clean React frontend and Express.js backend.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Screenshots](#screenshots)

## ✨ Features

- ✅ **Upload PDF Documents** - Secure PDF upload with validation (8 MB max)
- ✅ **View Documents** - Beautiful table view of all uploaded documents
- ✅ **Download Documents** - One-click download with original filename
- ✅ **Delete Documents** - Confirmation modal for safe deletion
- ✅ **Responsive UI** - Mobile-friendly modern design with TailwindCSS
- ✅ **Real-time Notifications** - Success, error, and warning alerts
- ✅ **Local Storage** - Everything runs locally with SQLite
- ✅ **RESTful API** - Clean JSON API with proper status codes

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library with functional components
- **Vite** - Ultra-fast build tool and dev server
- **Axios** - HTTP client for API calls
- **TailwindCSS** - Utility-first CSS framework

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Multer** - File upload middleware
- **SQLite3** - Lightweight relational database
- **UUID** - Unique identifier generation

### Database
- **SQLite** - File-based database
- **documents table** - Stores metadata (ID, filename, size, date)

## 📁 Project Structure

```
project-root/
│
├── backend/
│   ├── src/
│   │   ├── server.js                 # Express app entry point
│   │   ├── routes/
│   │   │   └── documents.routes.js   # API route definitions
│   │   ├── controllers/
│   │   │   └── documents.controller.js # Request handlers
│   │   ├── middleware/
│   │   │   └── upload.js             # Multer configuration
│   │   ├── db/
│   │   │   ├── db.js                 # SQLite wrapper
│   │   │   └── migrate.js            # Database migration
│   │   └── utils/
│   │       └── response.js           # Response formatting
│   │
│   ├── uploads/                      # PDF storage (auto-created)
│   ├── db.sqlite                     # SQLite database file
│   ├── package.json
│   ├── .env                          # Environment variables
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx                  # React entry point
│   │   ├── App.jsx                   # Main app component
│   │   ├── api/
│   │   │   └── index.js              # Axios API client
│   │   ├── components/
│   │   │   ├── UploadForm.jsx        # File upload component
│   │   │   ├── DocumentsTable.jsx    # Documents list component
│   │   │   ├── DeleteModal.jsx       # Confirmation modal
│   │   │   └── Alert.jsx             # Notification component
│   │   ├── index.css                 # Global styles
│   │   └── index.html
│   │
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # TailwindCSS config
│   ├── postcss.config.js             # PostCSS config
│   ├── package.json
│   └── .gitignore
│
├── design.md                         # Architecture document
├── README.md                         # This file
└── .gitignore
```

## 🚀 Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Git**

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Run database migration
npm run migrate

# Start the server
npm start
```

The backend will start on **http://localhost:5000**

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on **http://localhost:3000** (opens automatically)

## 🗄 Database Setup

### Automatic Migration

The database is automatically set up when you run the migration script:

```bash
cd backend
npm run migrate
```

This creates the `db.sqlite` file with the `documents` table.

### Manual Setup

If needed, manually initialize the database:

```bash
cd backend
node src/db/migrate.js
```

### Database Schema

```sql
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  filepath TEXT NOT NULL,
  filesize INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)
```

## ▶️ Running the Application

### Start Backend

```bash
cd backend
npm start
```

Expected output:
```
✅ Database initialized: ./db.sqlite
🚀 Server running on http://localhost:5000
📝 API Base: http://localhost:5000/api
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v4.4.9 ready in 123 ms

➜ Local: http://localhost:3000/
```

### Both Servers Together

Open two terminals:

```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm run dev
```

Then visit **http://localhost:3000** in your browser.

## 📡 API Endpoints

### 1. Upload Document

```http
POST /api/documents/upload
Content-Type: multipart/form-data

file: (PDF file)
```

**Response (201)**:
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

### 2. List All Documents

```http
GET /api/documents
```

**Response (200)**:
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
    }
  ]
}
```

### 3. Download Document

```http
GET /api/documents/:id
```

**Response (200)**:
- Header: `Content-Disposition: attachment; filename="patient_report.pdf"`
- Body: Binary PDF file

### 4. Delete Document

```http
DELETE /api/documents/:id
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Document deleted successfully",
  "data": null
}
```

## 💻 Usage Examples

### Using cURL

**Upload a PDF**:
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -F "file=@/path/to/document.pdf"
```

**List all documents**:
```bash
curl http://localhost:5000/api/documents
```

**Download a document**:
```bash
curl http://localhost:5000/api/documents/550e8400-e29b-41d4-a716-446655440000 \
  -o downloaded_file.pdf
```

**Delete a document**:
```bash
curl -X DELETE http://localhost:5000/api/documents/550e8400-e29b-41d4-a716-446655440000
```

### Using Postman

1. **POST /api/documents/upload**
   - Method: POST
   - URL: `http://localhost:5000/api/documents/upload`
   - Body: form-data
   - Key: `file`
   - Value: Select PDF file

2. **GET /api/documents**
   - Method: GET
   - URL: `http://localhost:5000/api/documents`

3. **GET /api/documents/:id**
   - Method: GET
   - URL: `http://localhost:5000/api/documents/550e8400-e29b-41d4-a716-446655440000`

4. **DELETE /api/documents/:id**
   - Method: DELETE
   - URL: `http://localhost:5000/api/documents/550e8400-e29b-41d4-a716-446655440000`

## 📸 Screenshots

### Upload Section
- Modern upload form with drag-and-drop hints
- File size validation (8 MB max)
- Real-time file name display
- Beautiful loading state

### Documents Table
- Responsive table with all document details
- File size formatting (Bytes, KB, MB, GB)
- Formatted timestamps
- Quick action buttons (Download, Delete)

### Delete Modal
- Confirmation modal before deletion
- Document name display
- Cancel/Confirm buttons
- Loading state during deletion

### Notifications
- Success alerts (green)
- Error alerts (red)
- Warning alerts (yellow)
- Auto-dismiss after 5 seconds
- Manual close option

## 🔧 Environment Configuration

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
DB_PATH=./db.sqlite
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=8388608
```

### Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| NODE_ENV | development | Environment mode |
| PORT | 5000 | Server port |
| DB_PATH | ./db.sqlite | Database file location |
| UPLOAD_DIR | ./uploads | PDF storage directory |
| MAX_FILE_SIZE | 8388608 | Max file size in bytes (8 MB) |

## 📝 Development Notes

### Code Structure

- **Components are functional** with React Hooks (useState, useEffect)
- **Clean separation of concerns** - API calls in dedicated api/index.js
- **Responsive design** - Mobile-first with TailwindCSS
- **Error handling** - Comprehensive try-catch blocks
- **Validation** - Client-side + server-side checks
- **Logging** - Console logs for debugging

### Adding Features

**To add a new endpoint**:
1. Create controller in `backend/src/controllers/`
2. Add route in `backend/src/routes/documents.routes.js`
3. Add API call in `frontend/src/api/index.js`
4. Create component in `frontend/src/components/`

**To add styling**:
- Use TailwindCSS classes directly in JSX
- Global styles in `frontend/src/index.css`
- Component-specific styles can use tailwind utilities

## 🧹 Cleanup

### Remove all documents

```bash
# Delete uploads directory (files)
rm -rf backend/uploads/*

# Clear database
rm backend/db.sqlite
npm run migrate
```

### Reset to clean state

```bash
# Backend
cd backend
rm db.sqlite
rm -rf uploads
npm run migrate

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## ❓ Technical Decisions & FAQs

### Q1. What frontend framework did you use and why? (React, Vue, etc.)

**Answer: React 18 with Vite**

- **React** was chosen for its:
  - Large ecosystem and community support
  - Excellent component reusability and state management patterns
  - Strong typing support with optional TypeScript (can be added later)
  - Popularity in healthcare/medical applications
  - Easy integration with form libraries and validation tools

- **Vite** as the build tool instead of Create React App because:
  - Ultra-fast Hot Module Replacement (HMR) for superior dev experience
  - 5-10x faster build times compared to Webpack
  - Smaller bundle size out of the box
  - Modern ES modules-based development
  - Better TypeScript support

### Q2. What backend framework did you choose and why? (Express, Flask, Django, etc.)

**Answer: Express.js with Node.js**

- **Express.js** was chosen over Flask/Django because:
  - JavaScript/Node.js allows **code sharing** between frontend and backend (same language ecosystem)
  - Lightweight and minimal, perfect for file upload/download operations
  - Excellent middleware ecosystem (Multer for file handling, CORS for frontend integration)
  - High performance with event-driven, non-blocking I/O model
  - Fast development iteration with hot-reload capabilities
  - Perfect for REST APIs (which is what we're building)

- Why not Django/Flask?
  - Django is overkill for this use case (too much boilerplate)
  - Python adds a language context switch (frontend devs need to learn Python)
  - Extra overhead for a simple CRUD API

- Why not Go/Rust?
  - Overkill for MVP and increases development complexity
  - No clear advantage for this use case
  - Larger learning curve

### Q3. What database did you choose and why? (SQLite vs PostgreSQL vs others)

**Answer: SQLite**

**SQLite pros:**
- ✅ Zero configuration - no separate database server needed
- ✅ Single file storage (`db.sqlite`) - easy to backup and deploy
- ✅ Perfect for MVP/prototyping phase
- ✅ Sufficient for local development and small-scale deployments
- ✅ Built-in, no additional dependencies to manage
- ✅ Automatic and atomic transactions

**When to upgrade to PostgreSQL:**
- When scaling to 1,000+ concurrent users
- When you need advanced features (JSON types, full-text search, geo-indexing)
- When you need robust backup/replication strategies
- When you have multi-server deployments

**Alternative considerations:**
- **MongoDB** - Not suitable for this use case (relational data, strict schema needed)
- **MySQL/MariaDB** - Good alternative to PostgreSQL, same scaling benefits
- **DynamoDB/Firestore** - Overkill for document metadata storage

### Q4. If you were to support 1,000 users, what changes would you consider?

**Database Scaling:**
1. **Migrate from SQLite to PostgreSQL**
   - Support concurrent read/write operations
   - Better indexing strategies (B-tree indexes on frequently queried columns)
   - Connection pooling (PgBouncer)

**Backend Changes:**
1. **Load Balancing** - Deploy multiple Express.js instances behind nginx/HAProxy
2. **Caching Layer** - Add Redis for:
   - Session management (JWT token blacklist)
   - Document metadata caching
   - Rate limiting
3. **Message Queue** - Add Bull/RabbitMQ for:
   - Async document processing
   - Background jobs (virus scanning, compression)
4. **File Storage Migration**:
   - Move from local `uploads/` to S3/Azure Blob Storage
   - Implement CDN for faster downloads
5. **Authentication** - Implement JWT + Refresh tokens + Session management
6. **API Rate Limiting** - Prevent abuse (e.g., 100 requests/minute per user)
7. **Logging & Monitoring** - ELK Stack or DataDog for performance monitoring
8. **Compression** - Enable gzip compression for API responses

**Frontend Changes:**
1. **Code Splitting** - Lazy load components for faster initial load
2. **Service Workers** - Implement offline support and caching strategies
3. **Progressive Image Loading** - Show thumbnails before full documents

**Infrastructure:**
1. **Containerization** - Docker + Kubernetes for orchestration
2. **CI/CD Pipeline** - GitHub Actions or GitLab CI for automated deployments
3. **Database Backups** - Automated daily backups to S3
4. **Monitoring & Alerts** - Performance metrics, error tracking (Sentry)
5. **Horizontal Scaling** - Multiple servers with load balancing

**Estimated Costs for 1,000 Concurrent Users:**
- Server Infrastructure: $500-1000/month (3-5 instances)
- Database (PostgreSQL): $100-300/month
- File Storage (S3): $20-100/month (depending on file volume)
- CDN: $50-200/month
- Monitoring/Logging: $100-300/month
- **Total: ~$800-2000/month**

### Q5. Describe the step-by-step process of what happens when a file is uploaded and when it is downloaded.

#### **Upload Process (Step-by-Step):**

1. **Frontend - User Selection**
   - User selects PDF file via file input (`UploadForm.jsx`)
   - Client-side validation:
     - Check file extension is `.pdf`
     - Check file size ≤ 8 MB
     - Show error alert if validation fails

2. **Frontend - API Request**
   - Create `FormData` with selected file
   - Send POST request to `http://localhost:5000/api/documents/upload`
   - Show loading spinner to user

3. **Backend - Middleware Processing**
   - `Multer` middleware intercepts request
   - Validates file:
     - Checks MIME type is `application/pdf`
     - Checks file extension is `.pdf`
     - Checks file size ≤ 8 MB (8,388,608 bytes)
   - If validation fails, return 400 error
   - If valid, temporarily store in memory/disk

4. **Backend - Controller Logic**
   - Generate unique ID: `uuid.v4()` → e.g., "550e8400-e29b-41d4-a716-446655440000"
   - Create filename: `{uuid}.pdf`
   - Create file path: `uploads/550e8400-e29b-41d4-a716-446655440000.pdf`
   - Move temp file to `uploads/` directory
   - Get file stats (size, timestamps)

5. **Backend - Database Insertion**
   - Execute INSERT query:
     ```sql
     INSERT INTO documents (id, filename, original_name, filepath, filesize, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ```
   - Commit transaction (atomically)

6. **Backend - Response**
   - Return 201 Created status with document metadata:
     ```json
     {
       "success": true,
       "message": "Document uploaded successfully",
       "data": { id, filename, original_name, filepath, filesize, created_at, updated_at }
     }
     ```

7. **Frontend - Success Handling**
   - Hide loading spinner
   - Display success alert: "Document uploaded successfully"
   - Refresh document list via `getDocuments()` API call
   - Clear file input
   - Alert auto-dismisses after 5 seconds

**Total Time: ~500-1500ms** (depends on file size and network speed)

---

#### **Download Process (Step-by-Step):**

1. **Frontend - User Action**
   - User clicks "Download" button on a document row in `DocumentsTable.jsx`
   - Button passes document ID to click handler

2. **Frontend - API Request**
   - Call `downloadDocument(documentId)` from `api/index.js`
   - Send GET request to `http://localhost:5000/api/documents/{documentId}`
   - Set response type to `arraybuffer` (binary data)

3. **Backend - Route Handler**
   - Route `GET /api/documents/:id` triggers `downloadDocument` controller
   - Extract document ID from URL parameter

4. **Backend - Database Query**
   - Execute SELECT query:
     ```sql
     SELECT * FROM documents WHERE id = ?
     ```
   - If no document found, return 404 error
   - If found, retrieve filepath from record

5. **Backend - File Validation**
   - Check if file exists on disk at `filepath`
   - Verify file is readable
   - Get file stats (size, modification time)
   - If file missing, return 404 error

6. **Backend - Response Headers**
   - Set HTTP headers:
     ```
     Content-Type: application/pdf
     Content-Disposition: attachment; filename="patient_report.pdf"
     Content-Length: {filesize}
     ```
   - `Content-Disposition` tells browser to download (not display inline)
   - `filename` sets the downloaded file name (original name, not UUID)

7. **Backend - Stream File**
   - Stream binary PDF content in response body
   - Node.js uses `fs.createReadStream()` for efficient memory usage

8. **Frontend - Browser Handling**
   - Browser receives binary data
   - `Content-Disposition: attachment` triggers download dialog
   - User sees save dialog with filename
   - Browser downloads to user's default downloads folder

9. **Frontend - Completion**
   - Download completes
   - No error alert shown (success is silent)

**Total Time: ~200-2000ms** (depends on file size and network speed)

---

**Architecture Diagram:**

```
UPLOAD FLOW:
User → File Input → Client Validation → FormData → POST /api/documents/upload
    → Multer Middleware → Server Validation → Generate UUID → Save to Disk
    → DB INSERT → 201 Response → Frontend Success Alert → Refresh List

DOWNLOAD FLOW:
User → Click Download → GET /api/documents/{id} → DB Query → File Exists Check
    → Set Headers → Stream File → Browser Download Dialog → Save to Disk
```

### Q6. What assumptions did you make while building this? (e.g., file size limits, authentication, concurrency)

**Assumptions Made:**

1. **File Size Limit: 8 MB**
   - Assumption: Most medical PDFs are under 8 MB
   - Reasoning: Prevents server overload, reasonable for hospital documents
   - Trade-off: Cannot upload high-resolution scan batches
   - Scalability: Increase to 100+ MB with cloud storage (S3/Azure Blob)

2. **No Authentication**
   - Assumption: Local/trusted environment (hospital network)
   - Reasoning: Focus on CRUD functionality for MVP
   - Risk: Anyone with access to server can upload/delete documents
   - Production: Must implement JWT + role-based access control (RBAC)
     - Admin can delete any document
     - Doctor can upload and download their patient docs
     - Nurse can view only assigned patient documents

3. **Single-Server Deployment**
   - Assumption: All requests processed on one machine
   - Reasoning: MVP doesn't require distributed system complexity
   - Limitation: No redundancy, single point of failure
   - Scaling: Add load balancer + multiple backend instances

4. **Local File Storage**
   - Assumption: All PDFs stored in `uploads/` directory on server
   - Reasoning: Simple, zero-config, works for single server
   - Risk: Disk failure = data loss
   - Production: Use S3/Azure Blob with automatic replication

5. **Sequential File Processing**
   - Assumption: One file is processed at a time (Node.js event loop)
   - Reasoning: Sufficient for MVP (no concurrent upload burden)
   - Limitation: 10,000 simultaneous uploads would queue
   - Scaling: Add message queue (Bull/RabbitMQ) for async processing

6. **No Rate Limiting**
   - Assumption: Trusted users won't abuse the API
   - Reasoning: MVP focus on functionality over security
   - Risk: Malicious user could spam uploads
   - Production: Add rate limiting (100 req/min per IP)

7. **No Virus/Malware Scanning**
   - Assumption: PDFs are trusted/pre-scanned
   - Reasoning: Medical facilities have network antivirus
   - Risk: Compromised PDF could execute malware
   - Production: Integrate ClamAV or VirusTotal API

8. **No File Encryption**
   - Assumption: Encryption handled by network/TLS
   - Reasoning: Files in transit use HTTPS (when deployed)
   - Risk: Unencrypted at rest
   - Production: Encrypt files at rest (AES-256) in database

9. **No Audit Logging**
   - Assumption: No compliance requirements (not HIPAA-compliant)
   - Reasoning: MVP focuses on feature completeness
   - Risk: Cannot trace who deleted a critical document
   - Production: Log all operations (who, what, when, from where)

10. **Synchronous Database Writes**
    - Assumption: SQLite handles transactions correctly
    - Reasoning: Works for single-server, low-concurrency scenario
    - Risk: Two simultaneous uploads could corrupt database
    - Production: Add connection pooling + transaction locks

11. **No Backup Strategy**
    - Assumption: Manual backups of `db.sqlite` and `uploads/`
    - Reasoning: MVP phase, user responsible for backups
    - Risk: Data loss if server crashes
    - Production: Automated daily backups to S3

12. **PDF Only**
    - Assumption: Only PDF files are supported
    - Reasoning: Medical documents are typically PDFs
    - Limitation: Cannot upload Word docs, images, etc.
    - Scalability: Add MIME type config for multi-format support

13. **Unique Filenames (UUID-based)**
    - Assumption: Filename conflicts are unlikely
    - Reasoning: UUID collision probability is virtually zero
    - Benefit: Simple filename strategy, prevents duplicates
    - Trade-off: Original filename hidden from filesystem

14. **Development vs Production Parity**
    - Assumption: Same code runs in dev and production
    - Reasoning: Reduces environment-specific bugs
    - Note: Use environment variables for configuration differences

15. **No WebSockets**
    - Assumption: No real-time updates needed
    - Reasoning: HTTP request/response sufficient for MVP
    - Use case: If multiple doctors edit simultaneously, add WebSockets for live collaboration

---

**Summary Table:**

| Aspect | Current (MVP) | Production Needed |
|--------|---------------|------------------|
| **Users** | 1-10 | 1,000+ |
| **Authentication** | None | JWT + RBAC |
| **Database** | SQLite | PostgreSQL |
| **File Storage** | Local disk | S3/Azure Blob |
| **Scaling** | Single server | Load-balanced |
| **Backups** | Manual | Automated hourly |
| **Monitoring** | Console logs | ELK Stack + Alerts |
| **Encryption** | In-transit (HTTPS) | At-rest + In-transit |
| **File Size Limit** | 8 MB | 100+ MB |
| **Rate Limiting** | None | 100 req/min |
| **Audit Trail** | None | Complete logging |

## 📄 License

MIT

## 🤝 Support

For issues or questions, check the `design.md` file for architecture details and assumptions.

---

**Built with ❤️ for modern document management**
