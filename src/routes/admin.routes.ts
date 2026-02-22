import { Router } from 'express';
import { addStudent, assignTask } from '../controllers/admin.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/add-student', protect(['admin']), addStudent);
router.post('/assign-task', protect(['admin']), assignTask);

export default router;
