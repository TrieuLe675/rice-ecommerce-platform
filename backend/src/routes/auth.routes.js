import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me  (Protected)
router.get('/me', verifyToken, getMe);

export default router;
