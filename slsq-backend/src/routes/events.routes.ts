import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { uploadEventImages } from '../middleware/upload.middleware';
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  setEventUploadFolder,
  uploadImages,
  deleteImage,
} from '../controllers/events.controller';

const router = Router();

// Public
router.get('/', getAllEvents);

// Protected
router.post('/', authMiddleware, createEvent);
router.put('/:id', authMiddleware, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);

// Image upload — auth first, then set folder from event date, then multer saves files, then controller saves DB records.
router.post('/:id/images', authMiddleware, setEventUploadFolder, uploadEventImages, uploadImages);

// Delete single image
router.delete('/images/:imageId', authMiddleware, deleteImage);

export default router;
