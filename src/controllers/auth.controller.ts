import { Request, Response } from 'express';
import Admin from '../models/admin.model';
import Student from '../models/student.model';
import { generateToken } from '../utils/jwt';

// Admin Login
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Input validation
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(admin._id.toString(), 'admin');
    res.json({ token, role: 'admin', email: admin.email });
  } catch (error: any) {
    res.status(500).json({ message: 'Login error: ' + error.message });
  }
};

// Student Login
export const studentLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Input validation
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const student = await Student.findOne({ email }).select('+password'); // Select password explicitly
    if (!student || !(await student.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(student._id.toString(), 'student');
    res.json({ token, role: 'student', name: student.name });
  } catch (error: any) {
    res.status(500).json({ message: 'Login error: ' + error.message });
  }
};
