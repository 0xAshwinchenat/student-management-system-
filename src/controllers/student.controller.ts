import { Request, Response } from 'express';
import Task from '../models/task.model';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Get tasks assigned to a student
export const getMyTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ message: 'Not authorized, student ID not found' });
      return;
    }

    const tasks = await Task.find({ student: studentId as any }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching tasks: ' + error.message });
  }
};

// Update task status to completed
export const updateTaskStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ message: 'Not authorized, student ID not found' });
      return;
    }

    if (!status) {
      res.status(400).json({ message: 'Status field is required' });
      return;
    }

    const validStatuses = ['pending', 'overdue', 'completed'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: `Invalid task status. Must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    const task = await Task.findOne({ _id: taskId, student: studentId as any });

    if (!task) {
      res.status(404).json({ message: 'Task not found or not assigned to this student' });
      return;
    }

    task.status = status;
    await task.save();
    res.json({ message: 'Task status updated successfully', task });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating task: ' + error.message });
  }
};
