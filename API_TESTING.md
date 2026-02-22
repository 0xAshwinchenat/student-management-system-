# API Testing Guide

Complete guide to test all endpoints of the Student Management API.

## Prerequisites

- Server running on `http://localhost:3000`
- cURL installed (comes with Windows 10+, macOS, Linux)
- OR use Postman (free download: https://www.postman.com)

## Testing Workflow

### 1. Health Check
Verify the server is running.

```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-02-22T10:00:00.000Z"
}
```

---

### 2. Admin Login
Get JWT token for admin operations.

```bash
curl -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpassword123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "admin",
  "email": "admin@example.com"
}
```

**Save the token:**
```bash
# In PowerShell
$ADMIN_TOKEN = "your_token_here"

# In bash/zsh
export ADMIN_TOKEN="your_token_here"
```

---

### 3. Add a Student
Create a new student account.

```bash
curl -X POST http://localhost:3000/api/admin/add-student \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Computer Science",
    "password": "john123456"
  }'
```

**Expected Response:**
```json
{
  "message": "Student added successfully",
  "student": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Computer Science"
  }
}
```

**Save the student ID:**
```bash
# In PowerShell
$STUDENT_ID = "64a1b2c3d4e5f6g7h8i9j0k1"

# In bash/zsh
export STUDENT_ID="64a1b2c3d4e5f6g7h8i9j0k1"
```

---

### 4. Assign a Task
Assign a task to the student.

```bash
curl -X POST http://localhost:3000/api/admin/assign-task \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "studentId": "'$STUDENT_ID'",
    "title": "Complete TypeScript Tutorial",
    "description": "Watch the TypeScript fundamentals tutorial and complete exercises",
    "dueDate": "2026-03-15T23:59:59Z"
  }'
```

**Expected Response:**
```json
{
  "message": "Task assigned successfully",
  "task": {
    "_id": "64b2c3d4e5f6g7h8i9j0k1l2",
    "title": "Complete TypeScript Tutorial",
    "description": "Watch the TypeScript fundamentals tutorial and complete exercises",
    "dueDate": "2026-03-15T23:59:59.000Z",
    "status": "pending",
    "student": "64a1b2c3d4e5f6g7h8i9j0k1"
  }
}
```

**Save the task ID:**
```bash
# In PowerShell
$TASK_ID = "64b2c3d4e5f6g7h8i9j0k1l2"

# In bash/zsh
export TASK_ID="64b2c3d4e5f6g7h8i9j0k1l2"
```

---

### 5. Student Login
Student gets their JWT token.

```bash
curl -X POST http://localhost:3000/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "john123456"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "student",
  "name": "John Doe"
}
```

**Save the student token:**
```bash
# In PowerShell
$STUDENT_TOKEN = "your_token_here"

# In bash/zsh
export STUDENT_TOKEN="your_token_here"
```

---

### 6. Get Student Tasks
Retrieve all tasks assigned to the student.

```bash
curl -X GET http://localhost:3000/api/student/tasks \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

**Expected Response:**
```json
[
  {
    "_id": "64b2c3d4e5f6g7h8i9j0k1l2",
    "title": "Complete TypeScript Tutorial",
    "description": "Watch the TypeScript fundamentals tutorial and complete exercises",
    "dueDate": "2026-03-15T23:59:59.000Z",
    "status": "pending",
    "student": "64a1b2c3d4e5f6g7h8i9j0k1",
    "createdAt": "2026-02-22T10:00:00.000Z",
    "updatedAt": "2026-02-22T10:00:00.000Z"
  }
]
```

---

### 7. Update Task Status
Student marks task as completed.

```bash
curl -X PUT http://localhost:3000/api/student/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '{
    "status": "completed"
  }'
```

**Expected Response:**
```json
{
  "message": "Task status updated successfully",
  "task": {
    "_id": "64b2c3d4e5f6g7h8i9j0k1l2",
    "title": "Complete TypeScript Tutorial",
    "status": "completed",
    ...
  }
}
```

---

## Error Testing

### Invalid Email
```bash
curl -X POST http://localhost:3000/api/admin/add-student \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "department": "CS",
    "password": "test123456"
  }'
```

**Expected Response (400):**
```json
{
  "message": "Invalid email format"
}
```

### Short Password
```bash
curl -X POST http://localhost:3000/api/admin/add-student \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "department": "CS",
    "password": "short"
  }'
```

**Expected Response (400):**
```json
{
  "message": "Password must be at least 6 characters long"
}
```

### Missing Token
```bash
curl -X GET http://localhost:3000/api/student/tasks
```

**Expected Response (401):**
```json
{
  "message": "Not authorized, no token"
}
```

### Invalid Token
```bash
curl -X GET http://localhost:3000/api/student/tasks \
  -H "Authorization: Bearer invalid_token123"
```

**Expected Response (401):**
```json
{
  "message": "Not authorized, token failed"
}
```

### Wrong Role (Student trying admin endpoint)
```bash
curl -X POST http://localhost:3000/api/admin/add-student \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '...'
```

**Expected Response (403):**
```json
{
  "message": "Access denied: Insufficient role"
}
```

---

## Using Postman (Easier Alternative)

1. **Import Collection**
   - Download Postman: https://www.postman.com/downloads/
   - Create a new collection "Student Management API"

2. **Create Requests**
   - Create each endpoint as a separate request
   - Use `{{ADMIN_TOKEN}}` and `{{STUDENT_TOKEN}}` as variables
   - Set environment variables after login

3. **Pre-request Script** (auto-save token)
   - Add in Login requests to save token to variable:
   ```javascript
   if (pm.response.code === 200) {
     pm.environment.set("ADMIN_TOKEN", pm.response.json().token);
   }
   ```

---

## Quick Copy-Paste Testing

Here's a complete test sequence you can copy and paste:

### PowerShell
```powershell
# 1. Health Check
curl http://localhost:3000/health

# 2. Login as Admin
$response = curl -X POST http://localhost:3000/api/auth/admin/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@example.com","password":"adminpassword123"}' | ConvertFrom-Json

$ADMIN_TOKEN = $response.token
echo "Admin Token: $ADMIN_TOKEN"

# 3. Add Student
$studentResponse = curl -X POST http://localhost:3000/api/admin/add-student `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $ADMIN_TOKEN" `
  -d '{"name":"Test User","email":"testuser@example.com","department":"CS","password":"test123456"}' | ConvertFrom-Json

$STUDENT_ID = $studentResponse.student.id
echo "Student ID: $STUDENT_ID"

# 4. Assign Task
$taskResponse = curl -X POST http://localhost:3000/api/admin/assign-task `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $ADMIN_TOKEN" `
  -d '{
    "studentId":"'$STUDENT_ID'",
    "title":"Test Task",
    "description":"Complete the test",
    "dueDate":"2026-03-15T23:59:59Z"
  }' | ConvertFrom-Json

$TASK_ID = $taskResponse.task._id
echo "Task ID: $TASK_ID"

# 5. Login as Student
$studentLoginResponse = curl -X POST http://localhost:3000/api/auth/student/login `
  -H "Content-Type: application/json" `
  -d '{"email":"testuser@example.com","password":"test123456"}' | ConvertFrom-Json

$STUDENT_TOKEN = $studentLoginResponse.token
echo "Student Token: $STUDENT_TOKEN"

# 6. Get Tasks
curl -X GET http://localhost:3000/api/student/tasks `
  -H "Authorization: Bearer $STUDENT_TOKEN"

# 7. Update Task Status
curl -X PUT http://localhost:3000/api/student/tasks/$TASK_ID `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $STUDENT_TOKEN" `
  -d '{"status":"completed"}'
```

### Bash/Zsh
```bash
# 1. Health Check
curl http://localhost:3000/health

# 2. Login as Admin
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"adminpassword123"}' | jq -r '.token')
echo "Admin Token: $ADMIN_TOKEN"

# 3. Add Student
STUDENT_ID=$(curl -s -X POST http://localhost:3000/api/admin/add-student \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"name":"Test User","email":"testuser@example.com","department":"CS","password":"test123456"}' | jq -r '.student.id')
echo "Student ID: $STUDENT_ID"

# 4. Get Tasks
curl -X GET http://localhost:3000/api/student/tasks \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

---

## Performance Testing

### Simple Load Test
```bash
# Install Apache Bench (if not installed)
# macOS: brew install ab
# Linux: sudo apt-get install apache2-utils

# Test health endpoint with 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:3000/health
```

### Check Response Times
```bash
# Measure time to health check
curl -w "Time: %{time_total}s\n" http://localhost:3000/health
```

---

## All Done! 🎉

Your API is tested and working! See [README_DETAILED.md](README_DETAILED.md) for more information.
