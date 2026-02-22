import { Router } from 'express';
import { adminLogin, studentLogin } from '../controllers/auth.controller';

const router = Router();

router.post('/admin/login', adminLogin);
router.post('/student/login', studentLogin);

export default router;
