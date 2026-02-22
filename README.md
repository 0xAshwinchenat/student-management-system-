# Student Management System API

A **production-ready** RESTful API for managing students, tasks, and admin functionality built with **Node.js**, **Express.js**, **TypeScript**, and **MongoDB Atlas**.

## 🎯 Features

### Admin Panel
- 🔐 Secure JWT authentication
- 👥 Add and manage students with validation
- 📋 Assign tasks to students with due dates
- 🔒 Password hashing with bcryptjs (10 salt rounds)

### Student Portal
- 🔐 Student authentication with JWT
- 📝 View all assigned tasks
- ✅ Update task status (pending, overdue, completed)
- 📅 View task details with due dates

### Security & Code Quality
- ✅ TypeScript strict mode enabled
- ✅ Input validation on all endpoints
- ✅ Role-based access control (Admin/Student)
- ✅ CORS enabled for cross-origin requests
- ✅ Environment variables for sensitive data
- ✅ Comprehensive error handling

---

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ ([Download](https://nodejs.org/))
- npm v6+
- MongoDB Atlas account (free tier available at [mongodb.com](https://www.mongodb.com/cloud/atlas))

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd student-management-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your MongoDB credentials:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student-management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin12345
```

4. **Start the server**
```bash
# Development (with auto-reload)
npm run dev

# Production
npm run build
npm start
```

Server runs on: **http://localhost:3000**

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 🔐 Authentication Endpoints

### Admin Login
```http
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin12345"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "admin",
  "email": "admin@example.com"
}
```

**Error (401):**
```json
{
  "message": "Invalid email or password"
}
```

---

### Student Login
```http
POST /api/auth/student/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123456"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "student",
  "name": "John Doe"
}
```

---

## 👨‍💼 Admin Endpoints (Requires Admin Role)

### Add Student
```http
POST /api/admin/add-student
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "department": "Computer Science",
  "password": "john123456"
}
```

**Response (201):**
```json
{
  "message": "Student added successfully",
  "student": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Computer Science"
  }
}
```

**Validation:**
- Email must be valid format
- Password must be at least 6 characters
- Email must be unique
- All fields required

---

### Assign Task to Student
```http
POST /api/admin/assign-task
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "studentId": "507f1f77bcf86cd799439011",
  "title": "Complete TypeScript Tutorial",
  "description": "Watch the full tutorial and complete exercises",
  "dueDate": "2026-03-15T23:59:59Z"
}
```

**Response (201):**
```json
{
  "message": "Task assigned successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Complete TypeScript Tutorial",
    "description": "Watch the full tutorial and complete exercises",
    "dueDate": "2026-03-15T23:59:59.000Z",
    "status": "pending",
    "student": "507f1f77bcf86cd799439011",
    "createdAt": "2026-02-22T10:15:00.000Z",
    "updatedAt": "2026-02-22T10:15:00.000Z"
  }
}
```

---

## 📝 Student Endpoints (Requires Student Role)

### Get My Tasks
```http
GET /api/student/tasks
Authorization: Bearer <student_token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Complete TypeScript Tutorial",
    "description": "Watch the full tutorial and complete exercises",
    "dueDate": "2026-03-15T23:59:59.000Z",
    "status": "pending",
    "student": "507f1f77bcf86cd799439011",
    "createdAt": "2026-02-22T10:15:00.000Z",
    "updatedAt": "2026-02-22T10:15:00.000Z"
  }
]
```

---

### Update Task Status
```http
PUT /api/student/tasks/:taskId
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "status": "completed"
}
```

**Response (200):**
```json
{
  "message": "Task status updated successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Complete TypeScript Tutorial",
    "status": "completed",
    ...
  }
}
```

**Valid Status Values:** `pending`, `overdue`, `completed`

---

## 🏥 Health Check

```http
GET /health
```

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2026-02-22T10:15:00.000Z"
}
```

---

## 🧪 Complete API Testing Example

### Step 1: Admin Login
```bash
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin12345"
  }')

ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | jq -r '.token')
echo "Admin Token: $ADMIN_TOKEN"
```

### Step 2: Add Student
```bash
STUDENT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/admin/add-student \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "department": "Information Technology",
    "password": "jane123456"
  }')

STUDENT_ID=$(echo $STUDENT_RESPONSE | jq -r '.student.id')
echo "Student ID: $STUDENT_ID"
```

### Step 3: Assign Task
```bash
TASK_RESPONSE=$(curl -s -X POST http://localhost:3000/api/admin/assign-task \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "studentId": "'$STUDENT_ID'",
    "title": "Project Submission",
    "description": "Submit your final project",
    "dueDate": "2026-03-20T23:59:59Z"
  }')

TASK_ID=$(echo $TASK_RESPONSE | jq -r '.task._id')
echo "Task ID: $TASK_ID"
```

### Step 4: Student Login
```bash
STUDENT_LOGIN=$(curl -s -X POST http://localhost:3000/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "jane123456"
  }')

STUDENT_TOKEN=$(echo $STUDENT_LOGIN | jq -r '.token')
echo "Student Token: $STUDENT_TOKEN"
```

### Step 5: View Tasks
```bash
curl -s -X GET http://localhost:3000/api/student/tasks \
  -H "Authorization: Bearer $STUDENT_TOKEN" | jq .
```

### Step 6: Update Task Status
```bash
curl -s -X PUT http://localhost:3000/api/student/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '{"status": "completed"}' | jq .
```

---

## 📋 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port | `3000` |
| `NODE_ENV` | No | Environment (development/production) | `development` |
| `MONGODB_URI` | **Yes** | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | **Yes** | Secret key for JWT signing | `your_secret_key_123` |
| `ADMIN_EMAIL` | **Yes** | Initial admin email | `admin@example.com` |
| `ADMIN_PASSWORD` | **Yes** | Initial admin password | `admin12345` |

### Getting MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Login
3. Create a Cluster (Free tier available)
4. Click "Connect"
5. Choose "Connect your application"
6. Copy the connection string
7. Replace `<username>`, `<password>`, and `<database>` with your values

Example MongoDB URI:
```
mongodb+srv://ashwin:user123@cluster0.zmedrjm.mongodb.net/student-management?retryWrites=true&w=majority
```

---

## 🐳 Docker Support

### With Docker Compose (Includes MongoDB)
```bash
docker-compose up
```

This runs both the API and MongoDB in containers.

### Build Custom Docker Image
```bash
docker build -t student-management-api .
docker run -p 3000:3000 -e MONGODB_URI=your_uri student-management-api
```

---

## 📦 Project Structure

```
src/
├── index.ts                      # Application entry point
├── config/
│   └── db.ts                     # MongoDB connection setup
├── controllers/
│   ├── admin.controller.ts       # Admin business logic
│   ├── auth.controller.ts        # Authentication logic
│   └── student.controller.ts     # Student business logic
├── middlewares/
│   └── auth.middleware.ts        # JWT validation & authorization
├── models/
│   ├── admin.model.ts            # Admin schema
│   ├── student.model.ts          # Student schema
│   └── task.model.ts             # Task schema
├── routes/
│   ├── admin.routes.ts           # Admin endpoints
│   ├── auth.routes.ts            # Auth endpoints
│   └── student.routes.ts         # Student endpoints
└── utils/
    └── jwt.ts                    # JWT token generation
```

---

## 🔧 Available Scripts

```bash
npm run dev          # Start development server with auto-reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production server
npm test             # Run tests (placeholder)
```

---

## 🚨 HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| `200` | OK | Successful request |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Validation error |
| `401` | Unauthorized | Missing/invalid token |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `500` | Server Error | Unexpected error |

---

## 🔐 Security Checklist

- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ JWT tokens expire in 1 hour
- ✅ Role-based access control implemented
- ✅ Input validation on all endpoints
- ✅ CORS configured
- ✅ Environment variables for secrets
- ✅ No hardcoded credentials

**Production Tips:**
- Change `ADMIN_PASSWORD` immediately
- Use strong `JWT_SECRET` (32+ characters)
- Set `NODE_ENV=production`
- Enable HTTPS/TLS
- Use rate limiting
- Setup monitoring

---

## 📖 Additional Resources

### Setup Scripts
- **Windows CMD:** `setup.bat`
- **Windows PowerShell:** `.\setup.ps1`
- **macOS/Linux:** `./setup.sh`

### Utilities
- **Reset Admin:** `npx ts-node clear-admin.ts`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

ISC License - See LICENSE file for details

---

## 🆘 Troubleshooting

### MongoDB Connection Error
- Verify connection string in `.env`
- Ensure IP is whitelisted in MongoDB Atlas (0.0.0.0/0 for development)
- Check credentials are correct

### Port Already in Use
- Change `PORT` in `.env` or
- Kill process: `lsof -ti :3000 | xargs kill -9` (macOS/Linux)

### Authentication Issues
- Ensure token is in `Authorization: Bearer <token>` format
- Check token hasn't expired (1 hour)
- Verify user has correct role

---

## 📧 Support

For issues or questions, please open an issue in the repository.

---

Made with ❤️ - Production Ready API


### Running the Application

To run the application in development mode with live-reloading:
```bash
npm run dev
```

To build and run the application in production:
```bash
npm run build
npm start
```

## API Endpoints

All API endpoints are prefixed with `/api`.

### Authentication

#### 1. Admin Login
- **URL:** `/api/auth/admin/login`
- **Method:** `POST`
- **Description:** Authenticates an admin user and returns a JWT token.
- **Request Body (JSON):**
  \`\`\`json
  {
    "email": "admin@example.com",
    "password": "adminpassword"
  }
  \`\`\`
- **Response (Success - 200 OK):**
  \`\`\`json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "admin"
  }
  \`\`\`
- **Response (Error - 401 Unauthorized):**
  \`\`\`json
  {
    "message": "Invalid credentials"
  }
  \`\`\`

#### 2. Student Login
- **URL:** `/api/auth/student/login`
- **Method:** `POST`
- **Description:** Authenticates a student user and returns a JWT token.
- **Request Body (JSON):**
  \`\`\`json
  {
    "email": "student1@example.com",
    "password": "studentpassword"
  }
  \`\`\`
- **Response (Success - 200 OK):**
  \`\`\`json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "student"
  }
  \`\`\`
- **Response (Error - 401 Unauthorized):**
  \`\`\`json
  {
    "message": "Invalid credentials"
  }
  \`\`\`

### Admin Panel

Requires `Authorization: Bearer <admin_token>` header.

#### 1. Add Student
- **URL:** `/api/admin/add-student`
- **Method:** `POST`
- **Description:** Allows an admin to add a new student.
- **Request Body (JSON):**
  \`\`\`json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "department": "Computer Science",
    "password": "securepassword123"
  }
  \`\`\`
- **Response (Success - 201 Created):**
  \`\`\`json
  {
    "message": "Student added successfully",
    "student": {
      "id": "60d0fe4f5e2a2b0015b0b2e3",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "department": "Computer Science"
    }
  }
  \`\`\`
- **Response (Error - 400 Bad Request):**
  \`\`\`json
  {
    "message": "Student with this email already exists"
  }
  \`\`\`
- **Response (Error - 401 Unauthorized):**
  \`\`\`json
  {
    "message": "Not authorized, token failed"
  }
  \`\`\`

#### 2. Assign Task
- **URL:** `/api/admin/assign-task`
- **Method:** `POST`
- **Description:** Allows an admin to assign a task to a student.
- **Request Body (JSON):**
  \`\`\`json
  {
    "studentId": "60d0fe4f5e2a2b0015b0b2e3",
    "title": "Complete Project Report",
    "description": "Write a detailed report on the Q3 project.",
    "dueDate": "2026-03-15T23:59:59Z"
  }
  \`\`\`
- **Response (Success - 201 Created):**
  \`\`\`json
  {
    "message": "Task assigned successfully",
    "task": {
      "_id": "60d0fe4f5e2a2b0015b0b2e4",
      "student": "60d0fe4f5e2a2b0015b0b2e3",
      "title": "Complete Project Report",
      "description": "Write a detailed report on the Q3 project.",
      "dueDate": "2026-03-15T23:59:59.000Z",
      "status": "pending",
      "createdAt": "2026-02-22T10:00:00.000Z",
      "updatedAt": "2026-02-22T10:00:00.000Z",
      "__v": 0
    }
  }
  \`\`\`
- **Response (Error - 404 Not Found):**
  \`\`\`json
  {
    "message": "Student not found"
  }
  \`\`\`

### Student Interface

Requires `Authorization: Bearer <student_token>` header.

#### 1. Get My Tasks
- **URL:** `/api/student/tasks`
- **Method:** `GET`
- **Description:** Retrieves all tasks assigned to the logged-in student.
- **Response (Success - 200 OK):**
  \`\`\`json
  [
    {
      "_id": "60d0fe4f5e2a2b0015b0b2e4",
      "student": "60d0fe4f5e2a2b0015b0b2e3",
      "title": "Complete Project Report",
      "description": "Write a detailed report on the Q3 project.",
      "dueDate": "2026-03-15T23:59:59.000Z",
      "status": "pending",
      "createdAt": "2026-02-22T10:00:00.000Z",
      "updatedAt": "2026-02-22T10:00:00.000Z",
      "__v": 0
    },
    {
      "_id": "60d0fe4f5e2a2b0015b0b2e5",
      "student": "60d0fe4f5e2a2b0015b0b2e3",
      "title": "Prepare Presentation",
      "description": "Create slides for the weekly meeting.",
      "dueDate": "2026-02-25T17:00:00Z",
      "status": "overdue",
      "createdAt": "2026-02-20T09:00:00.000Z",
      "updatedAt": "2026-02-20T09:00:00.000Z",
      "__v": 0
    }
  ]
  \`\`\`
- **Response (Error - 401 Unauthorized):**
  \`\`\`json
  {
    "message": "Not authorized, token failed"
  }
  \`\`\`

#### 2. Update Task Status
- **URL:** `/api/student/tasks/:taskId`
- **Method:** `PUT`
- **Description:** Allows a student to update the status of their assigned task. Only "completed" status change is explicitly mentioned, but the API allows changing to "pending", "overdue", or "completed".
- **Request Body (JSON):**
  \`\`\`json
  {
    "status": "completed"
  }
  \`\`\`
- **Response (Success - 200 OK):**
  \`\`\`json
  {
    "message": "Task status updated successfully",
    "task": {
      "_id": "60d0fe4f5e2a2b0015b0b2e4",
      "student": "60d0fe4f5e2a2b0015b0b2e3",
      "title": "Complete Project Report",
      "description": "Write a detailed report on the Q3 project.",
      "dueDate": "2026-03-15T23:59:59.000Z",
      "status": "completed",
      "createdAt": "2026-02-22T10:00:00.000Z",
      "updatedAt": "2026-02-22T10:00:00.000Z",
      "__v": 0
    }
  }
  \`\`\`
- **Response (Error - 400 Bad Request):**
  \`\`\`json
  {
    "message": "Invalid task status provided"
  }
  \`\`\`
- **Response (Error - 404 Not Found):**
  \`\`\`json
  {
    "message": "Task not found or not assigned to this student"
  }
  \`\`\`

## Contributing

(Contribution guidelines will be added here later)

## License

(License information will be added here later)
