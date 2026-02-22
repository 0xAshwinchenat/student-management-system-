import { Request, Response } from 'express';
import Student from '../models/student.model';
import Task from '../models/task.model';
import Admin from '../models/admin.model';
import dotenv from 'dotenv';

dotenv.config();

// Create initial admin if not exists
export const createInitialAdmin = async (): Promise<void> => {
    const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.error('ADMIN_EMAIL or ADMIN_PASSWORD not set in .env');
        return;
    }

    try {
        const adminExists = await Admin.findOne({ email: ADMIN_EMAIL });
        if (!adminExists) {
            // Just set the raw password - let the pre-save hook hash it
            const admin = new Admin({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
            });
            await admin.save();
            console.log('✓ Initial admin created successfully!');
        } else {
            console.log('✓ Admin already exists');
        }
    } catch (error) {
        console.error('✗ Error creating initial admin:', error);
    }
};

// Add a new student
export const addStudent = async (req: Request, res: Response): Promise<void> => {
  const { name, email, department, password } = req.body;

  try {
    // Input validation
    if (!name || !email || !department || !password) {
      res.status(400).json({ message: 'Please provide all required fields: name, email, department, password' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ message: 'Invalid email format' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long' });
      return;
    }

    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      res.status(400).json({ message: 'Student with this email already exists' });
      return;
    }

    const student = new Student({
      name,
      email,
      department,
      password,
    });

    await student.save();
    res.status(201).json({ message: 'Student added successfully', student: { id: student._id, name: student.name, email: student.email, department: student.department } });
  } catch (error: any) {
    res.status(500).json({ message: 'Error adding student: ' + error.message });
  }
};

// Assign a task to a student
export const assignTask = async (req: Request, res: Response): Promise<void> => {
  const { studentId, title, description, dueDate } = req.body;

  try {
    // Input validation
    if (!studentId || !title || !dueDate) {
      res.status(400).json({ message: 'Please provide required fields: studentId, title, dueDate' });
      return;
    }

    const dueDateTime = new Date(dueDate);
    if (isNaN(dueDateTime.getTime())) {
      res.status(400).json({ message: 'Invalid dueDate format' });
      return;
    }

    const student = await Student.findById(studentId);
    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    const task = new Task({
      student: studentId,
      title,
      description: description || '',
      dueDate: dueDateTime,
    });

    await task.save();
    res.status(201).json({ message: 'Task assigned successfully', task });
  } catch (error: any) {
    res.status(500).json({ message: 'Error assigning task: ' + error.message });
  }
};
