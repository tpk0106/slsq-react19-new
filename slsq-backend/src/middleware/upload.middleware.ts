import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getNextImageFilename } from '../utils/fileUtils';

const UPLOADS_ROOT = path.join(__dirname, '..', '..', 'public', 'uploads');

/**
 * Multer storage for event gallery images.
 * Saves to: public/uploads/events/{YYYYMMDD}/img_XXX.ext
 * The folder name (YYYYMMDD) is passed via req.params or req.body.
 */
const eventImageStorage = multer.diskStorage({
  destination: (req, _file, cb) => {
    // The folder name is set by the controller before upload
    const folderName = (req as any).uploadFolder || 'temp';
    const destPath = path.join(UPLOADS_ROOT, 'events', folderName);
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    const folderName = (req as any).uploadFolder || 'temp';
    const destPath = path.join(UPLOADS_ROOT, 'events', folderName);
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = getNextImageFilename(destPath, ext);
    cb(null, filename);
  },
});

/**
 * Multer storage for publication PDFs.
 * Saves to: public/uploads/publications/{YYYYMM}/News Letter {MonthName} {YYYY}.pdf
 */
const publicationStorage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const folderName = (req as any).uploadFolder || 'temp';
    const destPath = path.join(UPLOADS_ROOT, 'publications', folderName);
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    cb(null, destPath);
  },
  filename: (req, _file, cb) => {
    const fileName = (req as any).uploadFilename || 'document.pdf';
    cb(null, fileName);
  },
});

// File filter: only images
const imageFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, .png, and .webp image files are allowed.'));
  }
};

// File filter: only PDFs
const pdfFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf files are allowed.'));
  }
};

/**
 * Multer storage for gallery images.
 * Saves to: public/uploads/gallery/{YYYYMMDD}/img_XXX.ext
 */
const galleryImageStorage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const folderName = (req as any).uploadFolder || 'temp';
    const destPath = path.join(UPLOADS_ROOT, 'gallery', folderName);
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    const folderName = (req as any).uploadFolder || 'temp';
    const destPath = path.join(UPLOADS_ROOT, 'gallery', folderName);
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = getNextImageFilename(destPath, ext);
    cb(null, filename);
  },
});

export const uploadEventImages = multer({
  storage: eventImageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per image
}).array('images', 50);

export const uploadGalleryImages = multer({
  storage: galleryImageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per image
}).array('images', 50);

export const uploadPublicationPdf = multer({
  storage: publicationStorage,
  fileFilter: pdfFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB per PDF
}).single('file');
