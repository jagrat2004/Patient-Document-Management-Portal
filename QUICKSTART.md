# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Backend Dependencies

```powershell
cd c:\Users\Welcome\Desktop\INI8\backend
npm install
```

Expected output:
```
added XX packages
```

### Step 2: Initialize Database

```powershell
npm run migrate
```

Expected output:
```
✅ Migration completed: documents table created/verified
```

### Step 3: Start Backend Server

```powershell
npm start
```

Expected output:
```
✅ Database initialized: ./db.sqlite
🚀 Server running on http://localhost:5000
📝 API Base: http://localhost:5000/api
```

Keep this terminal open. Backend is now running! ✅

### Step 4: Install Frontend Dependencies (New Terminal)

```powershell
cd c:\Users\Welcome\Desktop\INI8\frontend
npm install
```

Expected output:
```
added XX packages
```

### Step 5: Start Frontend Server

```powershell
npm run dev
```

Expected output:
```
VITE v4.4.9 ready in XXX ms

➜ Local: http://localhost:3000/
```

Browser should open automatically to **http://localhost:3000** 🎉

---

## 📝 What You Can Do Now

✅ **Upload PDF Documents**
- Click the upload form
- Select a PDF file (max 8 MB)
- See success message
- Document appears in table instantly

✅ **View All Documents**
- Table shows all uploaded PDFs
- See filename, size, upload date
- Documents listed newest first

✅ **Download Documents**
- Click "Download" button
- File downloads with original name

✅ **Delete Documents**
- Click "Delete" button
- Confirmation modal appears
- Click "Delete" to confirm
- Document removed from list

---

## 🛠 Common Commands

### Backend
```powershell
# Start server
npm start

# Run database migration
npm run migrate

# Install dependencies
npm install
```

### Frontend
```powershell
# Start dev server (hot reload)
npm run dev

# Build for production
npm build

# Preview production build
npm preview
```

---

## 🧪 Test the API with cURL

### Upload a PDF
```powershell
# First, create a test PDF (or use an existing one)
curl -X POST http://localhost:5000/api/documents/upload `
  -F "file=@C:\path\to\your\file.pdf"
```

### Get All Documents
```powershell
curl http://localhost:5000/api/documents
```

### Download a Document
```powershell
# Replace ID with actual document ID
curl http://localhost:5000/api/documents/550e8400-e29b-41d4-a716-446655440000 `
  -o downloaded_file.pdf
```

### Delete a Document
```powershell
curl -X DELETE http://localhost:5000/api/documents/550e8400-e29b-41d4-a716-446655440000
```

---

## 📁 File Locations

| Item | Location |
|------|----------|
| Backend | `c:\Users\Welcome\Desktop\INI8\backend` |
| Frontend | `c:\Users\Welcome\Desktop\INI8\frontend` |
| Database | `c:\Users\Welcome\Desktop\INI8\backend\db.sqlite` |
| Uploads | `c:\Users\Welcome\Desktop\INI8\backend\uploads\` |
| Design Doc | `c:\Users\Welcome\Desktop\INI8\design.md` |
| README | `c:\Users\Welcome\Desktop\INI8\README.md` |

---

## ⚠️ Troubleshooting

### Backend won't start
```powershell
# Check if port 5000 is already in use
netstat -ano | findstr :5000

# If in use, kill the process or use different port in .env
```

### Frontend won't start
```powershell
# Check if port 3000 is already in use
netstat -ano | findstr :3000

# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Cannot upload files
- Ensure backend is running
- Check .env MAX_FILE_SIZE (default 8 MB)
- Verify file is PDF format
- Check browser console for errors

### Database errors
```powershell
# Reset database
rm backend/db.sqlite
npm run migrate
```

---

## 📚 Documentation

- **Architecture** → See `design.md`
- **Setup & Usage** → See `README.md`
- **This Quick Start** → You're reading it!

---

## 🎯 Next Steps

1. ✅ Start both servers (backend + frontend)
2. ✅ Upload your first PDF document
3. ✅ Download it back
4. ✅ Delete it
5. ✅ Explore the code
6. ✅ Customize as needed

---


