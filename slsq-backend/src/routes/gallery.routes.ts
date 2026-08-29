import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { uploadGalleryImages as uploadGalleryMiddleware } from '../middleware/upload.middleware';
import {
  getAllGalleries,
  createGallery,
  updateGallery,
  deleteGallery,
  setGalleryUploadFolder,
  uploadGalleryImages,
  deleteGalleryImage,
} from '../controllers/gallery.controller';

const router = Router();

// Public
router.get('/', getAllGalleries);

// Protected
router.post('/', authMiddleware, createGallery);
router.put('/:id', authMiddleware, updateGallery);
router.delete('/:id', authMiddleware, deleteGallery);

// Image upload — auth first, then set upload folder, then multer processes the files,
// then the controller saves DB records.
router.post('/:id/images', authMiddleware, setGalleryUploadFolder, uploadGalleryMiddleware, uploadGalleryImages);

// Delete single image
router.delete('/images/:imageId', authMiddleware, deleteGalleryImage);

export default router;
