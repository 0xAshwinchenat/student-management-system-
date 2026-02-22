import { Router } from 'express';
import { getMyTasks, updateTaskStatus } from '../controllers/student.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.get('/tasks', protect(['student']), getMyTasks);
router.put('/tasks/:taskId', protect(['student']), updateTaskStatus);

export default router;
