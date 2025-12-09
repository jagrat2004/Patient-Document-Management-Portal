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

## 📄 License

MIT

## 🤝 Support

For issues or questions, check the `design.md` file for architecture details and assumptions.

---

**Built with ❤️ for modern document management**
