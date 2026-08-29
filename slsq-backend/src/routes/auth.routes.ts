import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { register, login, changePassword } from '../controllers/auth.controller';

const router = Router();

// POST /api/auth/register — protected (admin-only)
router.post('/register', authMiddleware, register);

// POST /api/auth/login
router.post('/login', login);

// PUT /api/auth/change-password — protected (any authenticated user)
router.put('/change-password', authMiddleware, changePassword);

export default router;
