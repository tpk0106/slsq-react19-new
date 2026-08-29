import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { uploadPublicationPdf } from '../middleware/upload.middleware';
import {
  getPublications,
  setPublicationUploadInfo,
  createPublication,
  deletePublication,
} from '../controllers/publications.controller';

const router = Router();

// Public
router.get('/', getPublications);

// Protected — auth first, then set upload folder/filename, then multer, then controller
router.post('/', authMiddleware, setPublicationUploadInfo, uploadPublicationPdf, createPublication);
router.delete('/:id', authMiddleware, deletePublication);

export default router;
