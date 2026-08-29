import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { poolPromise } from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';
import { formatEventDateFolder, deleteFileIfExists, deleteFolderRecursive } from '../utils/fileUtils';

const UPLOADS_ROOT = path.join(__dirname, '..', '..', 'public', 'uploads');

/**
 * GET /api/events
 * Query params: ?type=Event|NoticeBoard (optional — omit to get all)
 * Returns all events with their associated gallery images.
 */
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const eventType = req.query.type as string | undefined;

    const request = pool.request();
    let whereClause = '';
    if (eventType) {
      request.input('eventType', eventType);
      whereClause = 'WHERE e.EventType = @eventType';
    }

    const eventsResult = await request.query(`
      SELECT e.EventId, e.EventName, e.EventDate, e.Description, e.EventType, e.CreatedAt,
             ed.Id AS ImageId, ed.EventPosterImageUrl, ed.Caption, ed.DisplayOrder
      FROM Events e
      LEFT JOIN EventDetails ed ON e.EventId = ed.EventId
      ${whereClause}
      ORDER BY e.EventDate DESC, ed.DisplayOrder ASC
    `);

    // Group images under their parent event
    const eventsMap = new Map<number, any>();
    for (const row of eventsResult.recordset) {
      if (!eventsMap.has(row.EventId)) {
        eventsMap.set(row.EventId, {
          EventId: row.EventId,
          EventName: row.EventName,
          EventDate: row.EventDate,
          Description: row.Description,
          EventType: row.EventType || 'Event',
          CreatedAt: row.CreatedAt,
          images: [],
        });
      }
      if (row.ImageId) {
        eventsMap.get(row.EventId).images.push({
          Id: row.ImageId,
          EventId: row.EventId,
          EventPosterImageUrl: row.EventPosterImageUrl,
          Caption: row.Caption,
          DisplayOrder: row.DisplayOrder,
        });
      }
    }

    res.json(Array.from(eventsMap.values()));
  } catch (err) {
    console.error('Get events error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * POST /api/events
 * Body: { eventName, eventDate, description }
 */
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventName, eventDate, description, eventType } = req.body;

    if (!eventName || !eventDate) {
      res.status(400).json({ error: 'eventName and eventDate are required.' });
      return;
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('eventName', eventName)
      .input('eventDate', new Date(eventDate))
      .input('description', description || null)
      .input('eventType', eventType || 'Event')
      .query(`
        INSERT INTO Events (EventName, EventDate, Description, EventType)
        VALUES (@eventName, @eventDate, @description, @eventType);
        SELECT SCOPE_IDENTITY() AS EventId;
      `);

    const eventId = result.recordset[0].EventId;
    res.status(201).json({ message: 'Event created.', EventId: eventId });
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * PUT /api/events/:id
 * Body: { eventName, eventDate, description }
 * If eventDate changes, renames the upload folder.
 */
export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const { eventName, eventDate, description, eventType } = req.body;

    const pool = await poolPromise;

    // Get current event to check if date changed
    const current = await pool.request()
      .input('eventId', eventId)
      .query('SELECT EventDate FROM Events WHERE EventId = @eventId');

    if (current.recordset.length === 0) {
      res.status(404).json({ error: 'Event not found.' });
      return;
    }

    const oldDate = new Date(current.recordset[0].EventDate);
    const newDate = eventDate ? new Date(eventDate) : oldDate;

    // If date changed, rename the upload folder
    const oldFolder = formatEventDateFolder(oldDate);
    const newFolder = formatEventDateFolder(newDate);

    if (oldFolder !== newFolder) {
      const oldPath = path.join(UPLOADS_ROOT, 'events', oldFolder);
      const newPath = path.join(UPLOADS_ROOT, 'events', newFolder);
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);

        // Update all image URLs in EventDetails
        await pool.request()
          .input('eventId', eventId)
          .input('oldFolder', oldFolder)
          .input('newFolder', newFolder)
          .query(`
            UPDATE EventDetails
            SET EventPosterImageUrl = REPLACE(EventPosterImageUrl, @oldFolder, @newFolder)
            WHERE EventId = @eventId
          `);
      }
    }

    await pool.request()
      .input('eventId', eventId)
      .input('eventName', eventName)
      .input('eventDate', newDate)
      .input('description', description || null)
      .input('eventType', eventType || 'Event')
      .query(`
        UPDATE Events
        SET EventName = @eventName, EventDate = @eventDate, Description = @description, EventType = @eventType
        WHERE EventId = @eventId
      `);

    res.json({ message: 'Event updated.' });
  } catch (err) {
    console.error('Update event error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * DELETE /api/events/:id
 * Deletes event, all EventDetails records (cascade), and the upload folder.
 */
export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const pool = await poolPromise;

    // Get event date for folder deletion
    const result = await pool.request()
      .input('eventId', eventId)
      .query('SELECT EventDate FROM Events WHERE EventId = @eventId');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Event not found.' });
      return;
    }

    const eventDate = new Date(result.recordset[0].EventDate);
    const folderName = formatEventDateFolder(eventDate);
    const folderPath = path.join(UPLOADS_ROOT, 'events', folderName);

    // Delete from DB (EventDetails cascade-deleted via FK)
    await pool.request()
      .input('eventId', eventId)
      .query('DELETE FROM Events WHERE EventId = @eventId');

    // Delete physical folder
    deleteFolderRecursive(folderPath);

    res.json({ message: 'Event and all associated images deleted.' });
  } catch (err) {
    console.error('Delete event error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Middleware: runs BEFORE multer to set req.uploadFolder so multer saves
 * files to the correct date-based directory.
 */
export const setEventUploadFolder = async (req: AuthRequest, res: Response, next: Function): Promise<void> => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const pool = await poolPromise;

    const eventResult = await pool.request()
      .input('eventId', eventId)
      .query('SELECT EventDate FROM Events WHERE EventId = @eventId');

    if (eventResult.recordset.length === 0) {
      res.status(404).json({ error: 'Event not found.' });
      return;
    }

    const eventDate = new Date(eventResult.recordset[0].EventDate);
    (req as any).uploadFolder = formatEventDateFolder(eventDate);
    next();
  } catch (err) {
    console.error('Set upload folder error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * POST /api/events/:id/images
 * Uploads multiple images for an event. Multer handles file saving.
 */
export const uploadImages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const pool = await poolPromise;

    const eventDate = new Date(
      (await pool.request().input('eventId', eventId)
        .query('SELECT EventDate FROM Events WHERE EventId = @eventId'))
        .recordset[0].EventDate
    );
    const folderName = formatEventDateFolder(eventDate);

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No image files uploaded.' });
      return;
    }

    // Get current max display order
    const orderResult = await pool.request()
      .input('eventId', eventId)
      .query('SELECT ISNULL(MAX(DisplayOrder), 0) AS MaxOrder FROM EventDetails WHERE EventId = @eventId');
    let displayOrder = orderResult.recordset[0].MaxOrder;

    const insertedImages: any[] = [];

    for (const file of files) {
      displayOrder++;
      const relativeUrl = `/uploads/events/${folderName}/${file.filename}`;

      const insertResult = await pool.request()
        .input('eventId', eventId)
        .input('imageUrl', relativeUrl)
        .input('caption', null)
        .input('displayOrder', displayOrder)
        .query(`
          INSERT INTO EventDetails (EventId, EventPosterImageUrl, Caption, DisplayOrder)
          VALUES (@eventId, @imageUrl, @caption, @displayOrder);
          SELECT SCOPE_IDENTITY() AS ImageId;
        `);

      insertedImages.push({
        imageId: insertResult.recordset[0].ImageId,
        imageUrl: relativeUrl,
        displayOrder,
      });
    }

    res.status(201).json({ message: `${files.length} image(s) uploaded.`, images: insertedImages });
  } catch (err) {
    console.error('Upload images error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * DELETE /api/events/images/:imageId
 * Deletes a single image record and its physical file.
 */
export const deleteImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const imageId = parseInt(req.params.imageId, 10);
    const pool = await poolPromise;

    // Get image URL before deleting
    const result = await pool.request()
      .input('imageId', imageId)
      .query('SELECT EventPosterImageUrl FROM EventDetails WHERE Id = @imageId');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Image not found.' });
      return;
    }

    const imageUrl = result.recordset[0].EventPosterImageUrl;
    const filePath = path.join(__dirname, '..', '..', 'public', imageUrl);

    // Delete from DB
    await pool.request()
      .input('imageId', imageId)
      .query('DELETE FROM EventDetails WHERE Id = @imageId');

    // Delete physical file
    deleteFileIfExists(filePath);

    res.json({ message: 'Image deleted.' });
  } catch (err) {
    console.error('Delete image error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
