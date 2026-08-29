import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  getPresidents,
  createPresident,
  updatePresident,
  deletePresident,
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from '../controllers/about.controller';

const router = Router();

// Presidents — public read, protected write
router.get('/presidents', getPresidents);
router.post('/presidents', authMiddleware, createPresident);
router.put('/presidents/:id', authMiddleware, updatePresident);
router.delete('/presidents/:id', authMiddleware, deletePresident);

// Members — public read, protected write
router.get('/members', getMembers);
router.post('/members', authMiddleware, createMember);
router.put('/members/:id', authMiddleware, updateMember);
router.delete('/members/:id', authMiddleware, deleteMember);

export default router;
