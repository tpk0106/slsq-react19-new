import { Request, Response } from 'express';
import { poolPromise } from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';

// =============================================
// PRESIDENTS
// =============================================

/**
 * GET /api/about/presidents
 */
export const getPresidents = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(
      'SELECT Id, PresidentName, PeriodFrom, PeriodTo FROM Presidents ORDER BY PeriodFrom ASC'
    );
    res.json(result.recordset);
  } catch (err) {
    console.error('Get presidents error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * POST /api/about/presidents
 * Body: { presidentName, periodFrom, periodTo }
 */
export const createPresident = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { presidentName, periodFrom, periodTo } = req.body;

    if (!presidentName || !periodFrom || !periodTo) {
      res.status(400).json({ error: 'presidentName, periodFrom, and periodTo are required.' });
      return;
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('presidentName', presidentName)
      .input('periodFrom', periodFrom)
      .input('periodTo', periodTo)
      .query(`
        INSERT INTO Presidents (PresidentName, PeriodFrom, PeriodTo)
        VALUES (@presidentName, @periodFrom, @periodTo);
        SELECT SCOPE_IDENTITY() AS Id;
      `);

    res.status(201).json({ message: 'President added.', id: result.recordset[0].Id });
  } catch (err) {
    console.error('Create president error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * PUT /api/about/presidents/:id
 * Body: { presidentName, periodFrom, periodTo }
 */
export const updatePresident = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { presidentName, periodFrom, periodTo } = req.body;

    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', id)
      .input('presidentName', presidentName)
      .input('periodFrom', periodFrom)
      .input('periodTo', periodTo)
      .query(`
        UPDATE Presidents
        SET PresidentName = @presidentName, PeriodFrom = @periodFrom, PeriodTo = @periodTo
        WHERE Id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ error: 'President not found.' });
      return;
    }

    res.json({ message: 'President updated.' });
  } catch (err) {
    console.error('Update president error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * DELETE /api/about/presidents/:id
 */
export const deletePresident = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', id)
      .query('DELETE FROM Presidents WHERE Id = @id');

    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ error: 'President not found.' });
      return;
    }

    res.json({ message: 'President deleted.' });
  } catch (err) {
    console.error('Delete president error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// =============================================
// MEMBERS (Committee Post Holders)
// =============================================

/**
 * GET /api/about/members
 */
export const getMembers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(
      'SELECT Id, Post, Name, DisplayOrder FROM Members ORDER BY DisplayOrder ASC'
    );
    res.json(result.recordset);
  } catch (err) {
    console.error('Get members error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * POST /api/about/members
 * Body: { post, name, displayOrder }
 */
export const createMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { post, name, displayOrder } = req.body;

    if (!post || !name) {
      res.status(400).json({ error: 'post and name are required.' });
      return;
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('post', post)
      .input('name', name)
      .input('displayOrder', displayOrder || 0)
      .query(`
        INSERT INTO Members (Post, Name, DisplayOrder)
        VALUES (@post, @name, @displayOrder);
        SELECT SCOPE_IDENTITY() AS Id;
      `);

    res.status(201).json({ message: 'Member added.', id: result.recordset[0].Id });
  } catch (err) {
    console.error('Create member error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * PUT /api/about/members/:id
 * Body: { post, name, displayOrder }
 */
export const updateMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { post, name, displayOrder } = req.body;

    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', id)
      .input('post', post)
      .input('name', name)
      .input('displayOrder', displayOrder || 0)
      .query(`
        UPDATE Members
        SET Post = @post, Name = @name, DisplayOrder = @displayOrder
        WHERE Id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ error: 'Member not found.' });
      return;
    }

    res.json({ message: 'Member updated.' });
  } catch (err) {
    console.error('Update member error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * DELETE /api/about/members/:id
 */
export const deleteMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', id)
      .query('DELETE FROM Members WHERE Id = @id');

    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ error: 'Member not found.' });
      return;
    }

    res.json({ message: 'Member deleted.' });
  } catch (err) {
    console.error('Delete member error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
