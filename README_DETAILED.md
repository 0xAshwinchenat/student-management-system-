# Student Management System API

A production-ready RESTful API for managing students, tasks, and admin functionality built with **Node.js**, **Express.js**, **TypeScript**, and **MongoDB Atlas**.

## ✨ Features

### Admin Panel
- 🔐 Admin authentication with JWT
- 👥 Add and manage students
- 📋 Assign tasks to students with due dates
- 🔒 Secure password hashing with bcryptjs

### Student Interface
- 🔐 Student authentication with JWT
- 📝 View all assigned tasks
- ✅ Update task status (pending, overdue, completed)
- 🔍 View task details and due dates

## 🛠️ Technologies

- **Runtime**: Node.js v14+
- **Framework**: Express.js 5.x
- **Language**: TypeScript 5.x
- **Database**: MongoDB Atlas
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing
- **Validation**: Built-in input validation

## 📋 Prerequisites

- Node.js v14 or higher
- npm v6 or higher
- MongoDB Atlas account (free tier available)

## 🚀 Quick Start

### 1. Installation

```bash
# Clone repository
git clone <repository-url>
cd student-management-api

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Copy from template
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/student-management?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=adminpassword123
```

### 3. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Authentication

#### Admin Login
```
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "adminpassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "admin",
  "email": "admin@example.com"
}
```

#### Student Login
```
POST /api/auth/student/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "student",
  "name": "John Doe"
}
```

### Admin Operations

#### Add Student
```
POST /api/admin/add-student
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "department": "Computer Science",
  "password": "securepassword123"
}

Response:
{
  "message": "Student added successfully",
  "student": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "department": "Computer Science"
  }
}
```

#### Assign Task
```
POST /api/admin/assign-task
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "studentId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "title": "Complete Assignment 1",
  "description": "Submit the TypeScript project",
  "dueDate": "2026-03-01T23:59:59Z"
}

Response:
{
  "message": "Task assigned successfully",
  "task": {
    "_id": "64b2c3d4e5f6g7h8i9j0k1l2",
    "title": "Complete Assignment 1",
    "description": "Submit the TypeScript project",
    "dueDate": "2026-03-01T23:59:59.000Z",
    "status": "pending",
    "student": "64a1b2c3d4e5f6g7h8i9j0k1",
    "createdAt": "2026-02-22T10:00:00.000Z",
    "updatedAt": "2026-02-22T10:00:00.000Z"
  }
}
```

### Student Operations

#### Get My Tasks
```
GET /api/student/tasks
Authorization: Bearer <student-token>

Response:
[
  {
    "_id": "64b2c3d4e5f6g7h8i9j0k1l2",
    "title": "Complete Assignment 1",
    "description": "Submit the TypeScript project",
    "dueDate": "2026-03-01T23:59:59.000Z",
    "status": "pending",
    "student": "64a1b2c3d4e5f6g7h8i9j0k1"
  }
]
```

#### Update Task Status
```
PUT /api/student/tasks/<taskId>
Authorization: Bearer <student-token>
Content-Type: application/json

{
  "status": "completed"
}

Response:
{
  "message": "Task status updated successfully",
  "task": {
    "_id": "64b2c3d4e5f6g7h8i9j0k1l2",
    "status": "completed",
    ...
  }
}
```

### Health Check
```
GET /health

Response:
{
  "status": "OK",
  "timestamp": "2026-02-22T10:00:00.000Z"
}
```

## 📝 Input Validation

The API includes comprehensive input validation:

- **Email**: Must be in valid email format
- **Password**: Minimum 6 characters
- **Task Status**: Must be one of: `pending`, `overdue`, `completed`
- **Required Fields**: All required fields must be provided

## 🔐 Security Features

✅ Password hashing using bcryptjs (10 salt rounds)  
✅ JWT token-based authentication  
✅ Role-based access control (Admin/Student)  
✅ Input validation on all endpoints  
✅ Secure password field (hidden by default)  
✅ CORS enabled for cross-origin requests  
✅ Environment variables for sensitive data  

## 📂 Project Structure

```
src/
├── config/
│   └── db.ts                 # MongoDB connection
├── controllers/
│   ├── admin.controller.ts   # Admin operations
│   ├── auth.controller.ts    # Authentication
│   └── student.controller.ts # Student operations
├── middlewares/
│   └── auth.middleware.ts    # JWT authentication & authorization
├── models/
│   ├── admin.model.ts        # Admin schema
│   ├── student.model.ts      # Student schema
│   └── task.model.ts         # Task schema
├── routes/
│   ├── admin.routes.ts       # Admin endpoints
│   ├── auth.routes.ts        # Auth endpoints
│   └── student.routes.ts     # Student endpoints
├── utils/
│   └── jwt.ts                # JWT token generation
└── index.ts                  # Application entry point
```

## 🧪 Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:3000/health

# Admin login
curl -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"adminpassword123"}'
```

### Using Postman

1. Import the endpoints from the API documentation above
2. Set `Authorization` header to `Bearer <token>` for protected routes
3. Test each endpoint with appropriate request bodies

## 🚨 Error Handling

The API returns appropriate HTTP status codes:

- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient role)
- `404` - Not Found
- `500` - Internal Server Error

## 📦 Scripts

```bash
npm run dev        # Run in development mode with auto-reload
npm run build      # Compile TypeScript to JavaScript
npm start          # Run compiled production build
npm test           # Run tests (placeholder)
```

## 🔧 TypeScript Configuration

Strict mode enabled with:
- Strict null checks
- Strict function types
- No implicit any
- No unused variables/parameters
- Implicit return checking

## 🌳 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development/production |
| MONGODB_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | JWT signing secret | your_secret_key |
| ADMIN_EMAIL | Initial admin email | admin@example.com |
| ADMIN_PASSWORD | Initial admin password | adminpassword123 |

## 📄 License

ISC

## 👨‍💻 Author

Your Name

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and structure.

## 📞 Support

For issues and questions, please open an issue in the repository.
