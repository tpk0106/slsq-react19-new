import { Request, Response } from 'express';
import path from 'path';
import { poolPromise } from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  formatPublicationFolder,
  formatPublicationFilename,
  deleteFileIfExists,
  deleteFolderRecursive,
} from '../utils/fileUtils';

const UPLOADS_ROOT = path.join(__dirname, '..', '..', 'public', 'uploads');

/**
 * GET /api/publications
 * Returns all publications ordered by Year DESC, Month DESC.
 */
export const getPublications = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(
      'SELECT Id, Title, Year, Month, Description, PdfUrl, CreatedAt FROM Publications ORDER BY Year DESC, Month DESC'
    );
    res.json(result.recordset);
  } catch (err) {
    console.error('Get publications error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Middleware: sets req.uploadFolder and req.uploadFilename BEFORE multer runs.
 * Must be placed in the route chain before the multer middleware.
 * Reads year/month from multipart body fields — but since multer hasn't run yet,
 * we parse them from the query string or use a custom header approach.
 * Actually, for multipart forms, we need multer to parse body fields too.
 * So we use a two-step approach: parse fields with multer, then this sets the path.
 *
 * NOTE: Since multer needs to run to parse body fields, but also needs the folder
 * to save the file, we pre-parse year/month from query params instead.
 * Frontend must send year and month as query params: POST /api/publications?year=2021&month=5
 */
export const setPublicationUploadInfo = async (req: AuthRequest, res: Response, next: Function): Promise<void> => {
  try {
    const year = req.query.year as string || req.body?.year;
    const month = req.query.month as string || req.body?.month;

    if (!year || !month) {
      res.status(400).json({ error: 'year and month are required as query params.' });
      return;
    }

    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);

    if (monthNum < 1 || monthNum > 12) {
      res.status(400).json({ error: 'month must be between 1 and 12.' });
      return;
    }

    const folderName = formatPublicationFolder(yearNum, monthNum);
    const fileName = formatPublicationFilename(yearNum, monthNum);
    (req as any).uploadFolder = folderName;
    (req as any).uploadFilename = fileName;
    next();
  } catch (err) {
    console.error('Set publication upload info error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * POST /api/publications?year=YYYY&month=M
 * Multi-part form: { file (PDF), title, description }
 * Year and month passed as query params so the pre-upload middleware can set the folder.
 * Auto-creates directory YYYYMM and names file "News Letter {MonthName} {YYYY}.pdf".
 */
export const createPublication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    const year = req.query.year as string || req.body.year;
    const month = req.query.month as string || req.body.month;

    if (!title || !year || !month) {
      res.status(400).json({ error: 'title, year, and month are required.' });
      return;
    }

    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);

    if (monthNum < 1 || monthNum > 12) {
      res.status(400).json({ error: 'month must be between 1 and 12.' });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'PDF file is required.' });
      return;
    }

    const folderName = formatPublicationFolder(yearNum, monthNum);
    const fileName = formatPublicationFilename(yearNum, monthNum);
    const relativeUrl = `/uploads/publications/${folderName}/${fileName}`;

    const pool = await poolPromise;
    const result = await pool.request()
      .input('title', title)
      .input('year', yearNum)
      .input('month', monthNum)
      .input('description', description || null)
      .input('pdfUrl', relativeUrl)
      .query(`
        INSERT INTO Publications (Title, Year, Month, Description, PdfUrl)
        VALUES (@title, @year, @month, @description, @pdfUrl);
        SELECT SCOPE_IDENTITY() AS Id;
      `);

    res.status(201).json({
      message: 'Publication created.',
      id: result.recordset[0].Id,
      pdfUrl: relativeUrl,
    });
  } catch (err) {
    console.error('Create publication error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * DELETE /api/publications/:id
 * Removes publication record and deletes physical PDF file.
 */
export const deletePublication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const pool = await poolPromise;

    // Get PDF URL before deleting
    const result = await pool.request()
      .input('id', id)
      .query('SELECT PdfUrl FROM Publications WHERE Id = @id');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Publication not found.' });
      return;
    }

    const pdfUrl = result.recordset[0].PdfUrl;
    const filePath = path.join(__dirname, '..', '..', 'public', pdfUrl);

    // Delete from DB
    await pool.request()
      .input('id', id)
      .query('DELETE FROM Publications WHERE Id = @id');

    // Delete physical file
    deleteFileIfExists(filePath);

    res.json({ message: 'Publication deleted.' });
  } catch (err) {
    console.error('Delete publication error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
