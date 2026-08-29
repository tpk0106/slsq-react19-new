import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { poolPromise } from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';
import { formatEventDateFolder, deleteFileIfExists, deleteFolderRecursive } from '../utils/fileUtils';

const UPLOADS_ROOT = path.join(__dirname, '..', '..', 'public', 'uploads');

/**
 * GET /api/gallery
 * Returns all galleries with their associated images.
 */
export const getAllGalleries = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT g.Id, g.Title, g.GalleryDate, g.Description, g.CreatedAt,
             gi.Id AS ImageId, gi.ImageUrl, gi.Caption, gi.DisplayOrder
      FROM Galleries g
      LEFT JOIN GalleryImages gi ON g.Id = gi.GalleryId
      ORDER BY g.GalleryDate DESC, gi.DisplayOrder ASC
    `);

    // Group images under their parent gallery
    const galleriesMap = new Map<number, any>();
    for (const row of result.recordset) {
      if (!galleriesMap.has(row.Id)) {
        galleriesMap.set(row.Id, {
          Id: row.Id,
          Title: row.Title,
          GalleryDate: row.GalleryDate,
          Description: row.Description,
          CreatedAt: row.CreatedAt,
          images: [],
        });
      }
      if (row.ImageId) {
        galleriesMap.get(row.Id).images.push({
          Id: row.ImageId,
          GalleryId: row.Id,
          ImageUrl: row.ImageUrl,
          Caption: row.Caption,
          DisplayOrder: row.DisplayOrder,
        });
      }
    }

    res.json(Array.from(galleriesMap.values()));
  } catch (err) {
    console.error('Get galleries error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * POST /api/gallery
 * Body: { title, galleryDate, description }
 */
export const createGallery = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, galleryDate, description } = req.body;

    if (!title || !galleryDate) {
      res.status(400).json({ error: 'title and galleryDate are required.' });
      return;
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('title', title)
      .input('galleryDate', new Date(galleryDate))
      .input('description', description || null)
      .query(`
        INSERT INTO Galleries (Title, GalleryDate, Description)
        VALUES (@title, @galleryDate, @description);
        SELECT SCOPE_IDENTITY() AS GalleryId;
      `);

    const galleryId = result.recordset[0].GalleryId;
    res.status(201).json({ message: 'Gallery created.', GalleryId: galleryId });
  } catch (err) {
    console.error('Create gallery error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * PUT /api/gallery/:id
 * Body: { title, galleryDate, description }
 * If galleryDate changes, renames the upload folder.
 */
export const updateGallery = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const galleryId = parseInt(req.params.id, 10);
    const { title, galleryDate, description } = req.body;

    const pool = await poolPromise;

    // Get current gallery to check if date changed
    const current = await pool.request()
      .input('galleryId', galleryId)
      .query('SELECT GalleryDate FROM Galleries WHERE Id = @galleryId');

    if (current.recordset.length === 0) {
      res.status(404).json({ error: 'Gallery not found.' });
      return;
    }

    const oldDate = new Date(current.recordset[0].GalleryDate);
    const newDate = galleryDate ? new Date(galleryDate) : oldDate;

    // If date changed, rename the upload folder
    const oldFolder = formatEventDateFolder(oldDate);
    const newFolder = formatEventDateFolder(newDate);

    if (oldFolder !== newFolder) {
      const oldPath = path.join(UPLOADS_ROOT, 'gallery', oldFolder);
      const newPath = path.join(UPLOADS_ROOT, 'gallery', newFolder);
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);

        // Update all image URLs in GalleryImages
        await pool.request()
          .input('galleryId', galleryId)
          .input('oldFolder', oldFolder)
          .input('newFolder', newFolder)
          .query(`
            UPDATE GalleryImages
            SET ImageUrl = REPLACE(ImageUrl, @oldFolder, @newFolder)
            WHERE GalleryId = @galleryId
          `);
      }
    }

    await pool.request()
      .input('galleryId', galleryId)
      .input('title', title)
      .input('galleryDate', newDate)
      .input('description', description || null)
      .query(`
        UPDATE Galleries
        SET Title = @title, GalleryDate = @galleryDate, Description = @description
        WHERE Id = @galleryId
      `);

    res.json({ message: 'Gallery updated.' });
  } catch (err) {
    console.error('Update gallery error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * DELETE /api/gallery/:id
 * Deletes gallery, all GalleryImages records (cascade), and the upload folder.
 */
export const deleteGallery = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const galleryId = parseInt(req.params.id, 10);
    const pool = await poolPromise;

    // Get gallery date for folder deletion
    const result = await pool.request()
      .input('galleryId', galleryId)
      .query('SELECT GalleryDate FROM Galleries WHERE Id = @galleryId');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Gallery not found.' });
      return;
    }

    const galleryDate = new Date(result.recordset[0].GalleryDate);
    const folderName = formatEventDateFolder(galleryDate);
    const folderPath = path.join(UPLOADS_ROOT, 'gallery', folderName);

    // Delete from DB (GalleryImages cascade-deleted via FK)
    await pool.request()
      .input('galleryId', galleryId)
      .query('DELETE FROM Galleries WHERE Id = @galleryId');

    // Delete physical folder
    deleteFolderRecursive(folderPath);

    res.json({ message: 'Gallery and all associated images deleted.' });
  } catch (err) {
    console.error('Delete gallery error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Middleware: sets req.uploadFolder BEFORE multer runs.
 * Must be placed in the route chain before the multer middleware.
 */
export const setGalleryUploadFolder = async (req: AuthRequest, res: Response, next: Function): Promise<void> => {
  try {
    const galleryId = parseInt(req.params.id, 10);
    const pool = await poolPromise;

    const galleryResult = await pool.request()
      .input('galleryId', galleryId)
      .query('SELECT GalleryDate FROM Galleries WHERE Id = @galleryId');

    if (galleryResult.recordset.length === 0) {
      res.status(404).json({ error: 'Gallery not found.' });
      return;
    }

    const galleryDate = new Date(galleryResult.recordset[0].GalleryDate);
    const folderName = formatEventDateFolder(galleryDate);

    // Set folder on request so multer middleware uses the correct path
    (req as any).uploadFolder = folderName;
    next();
  } catch (err) {
    console.error('Set gallery upload folder error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * POST /api/gallery/:id/images
 * Uploads multiple images for a gallery. Multer handles file saving.
 * NOTE: setGalleryUploadFolder middleware must run BEFORE multer in the route chain.
 */
export const uploadGalleryImages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const galleryId = parseInt(req.params.id, 10);
    const pool = await poolPromise;

    // Get gallery date to determine folder (for DB record URL)
    const galleryResult = await pool.request()
      .input('galleryId', galleryId)
      .query('SELECT GalleryDate FROM Galleries WHERE Id = @galleryId');

    if (galleryResult.recordset.length === 0) {
      res.status(404).json({ error: 'Gallery not found.' });
      return;
    }

    const galleryDate = new Date(galleryResult.recordset[0].GalleryDate);
    const folderName = formatEventDateFolder(galleryDate);

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No image files uploaded.' });
      return;
    }

    // Get current max display order
    const orderResult = await pool.request()
      .input('galleryId', galleryId)
      .query('SELECT ISNULL(MAX(DisplayOrder), 0) AS MaxOrder FROM GalleryImages WHERE GalleryId = @galleryId');
    let displayOrder = orderResult.recordset[0].MaxOrder;

    const insertedImages: any[] = [];

    for (const file of files) {
      displayOrder++;
      const relativeUrl = `/uploads/gallery/${folderName}/${file.filename}`;

      const insertResult = await pool.request()
        .input('galleryId', galleryId)
        .input('imageUrl', relativeUrl)
        .input('caption', null)
        .input('displayOrder', displayOrder)
        .query(`
          INSERT INTO GalleryImages (GalleryId, ImageUrl, Caption, DisplayOrder)
          VALUES (@galleryId, @imageUrl, @caption, @displayOrder);
          SELECT SCOPE_IDENTITY() AS ImageId;
        `);

      insertedImages.push({
        Id: insertResult.recordset[0].ImageId,
        ImageUrl: relativeUrl,
        DisplayOrder: displayOrder,
      });
    }

    res.status(201).json({ message: `${files.length} image(s) uploaded.`, images: insertedImages });
  } catch (err) {
    console.error('Upload gallery images error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * DELETE /api/gallery/images/:imageId
 * Deletes a single image record and its physical file.
 */
export const deleteGalleryImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const imageId = parseInt(req.params.imageId, 10);
    const pool = await poolPromise;

    // Get image URL before deleting
    const result = await pool.request()
      .input('imageId', imageId)
      .query('SELECT ImageUrl FROM GalleryImages WHERE Id = @imageId');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Image not found.' });
      return;
    }

    const imageUrl = result.recordset[0].ImageUrl;
    const filePath = path.join(__dirname, '..', '..', 'public', imageUrl);

    // Delete from DB
    await pool.request()
      .input('imageId', imageId)
      .query('DELETE FROM GalleryImages WHERE Id = @imageId');

    // Delete physical file
    deleteFileIfExists(filePath);

    res.json({ message: 'Image deleted.' });
  } catch (err) {
    console.error('Delete gallery image error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
