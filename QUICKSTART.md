# Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Install Node.js
1. Download Node.js LTS from https://nodejs.org/
2. Run the installer
3. Restart your terminal/PowerShell

### Step 2: Run Setup Script

**On Windows Command Prompt:**
```cmd
setup.bat
```

**On Windows PowerShell:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1
```

**On macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Step 3: Configure MongoDB

1. Create a free MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
2. Create a cluster (free tier available)
3. Get your connection string
4. Open `.env` and update `MONGODB_URI`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/student-management
   ```

### Step 4: Start the Server

**Development Mode** (auto-reload on file changes):
```bash
npm run dev
```

**Production Mode**:
```bash
npm run build
npm start
```

### Step 5: Test the API

**Health Check:**
```bash
curl http://localhost:3000/health
```

**Login as Admin:**
```bash
curl -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"adminpassword123"}'
```

You should get a response with a JWT token!

---

## 📋 Environment Variables

Update your `.env` file:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student-management

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_123456789

# Admin Credentials (for initial setup)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=adminpassword123
```

---

## 🔧 Troubleshooting

### Node.js not found
- **Solution**: Restart PowerShell/CMD after installing Node.js
- The system needs to refresh its PATH environment variable

### MongoDB connection error
- **Solution**: Check your `MONGODB_URI` in `.env`
- Make sure your IP is whitelisted in MongoDB Atlas (0.0.0.0/0 for development)
- Test connection with MongoDB Compass

### Port already in use
- **Solution**: Change PORT in `.env` or kill process using port 3000

### npm install fails
- **Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install` again

---

## 📚 Next Steps

1. Review [README_DETAILED.md](README_DETAILED.md) for full API documentation
2. Test endpoints with Postman or curl
3. Read [PRODUCTION_IMPROVEMENTS.md](PRODUCTION_IMPROVEMENTS.md) to understand code improvements

---

## 🎯 API Endpoints Quick Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/api/auth/admin/login` | No | Admin login |
| POST | `/api/auth/student/login` | No | Student login |
| POST | `/api/admin/add-student` | Admin | Add new student |
| POST | `/api/admin/assign-task` | Admin | Assign task to student |
| GET | `/api/student/tasks` | Student | Get student's tasks |
| PUT | `/api/student/tasks/:taskId` | Student | Update task status |

---

## 💡 Default Credentials

**Admin:**
- Email: `admin@example.com`
- Password: `adminpassword123`

⚠️ Change these in production!

---

## ✅ All Set!

Your Student Management API is ready to use. Start with `npm run dev` and test the endpoints! 🎉
