import { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { poolPromise } from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * POST /api/auth/register
 * Body: { firstname, lastname, username, password }
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstname, lastname, username, password } = req.body;

    if (!firstname || !lastname || !username || !password) {
      res.status(400).json({ error: 'All fields are required: firstname, lastname, username, password' });
      return;
    }

    const pool = await poolPromise;

    // Check if username already exists
    const existing = await pool.request()
      .input('username', username)
      .query('SELECT Id FROM Users WHERE Username = @username');

    if (existing.recordset.length > 0) {
      res.status(409).json({ error: 'Username already exists.' });
      return;
    }

    // Generate salt and hash password
    const salt = crypto.randomBytes(32).toString('hex');
    const passwordHash = await argon2.hash(password, { salt: Buffer.from(salt, 'hex') });

    // Insert user
    await pool.request()
      .input('firstname', firstname)
      .input('lastname', lastname)
      .input('username', username)
      .input('passwordHash', passwordHash)
      .input('passwordSalt', salt)
      .query(`
        INSERT INTO Users (Firstname, Lastname, Username, PasswordHash, PasswordSalt)
        VALUES (@firstname, @lastname, @username, @passwordHash, @passwordSalt)
      `);

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * POST /api/auth/login
 * Body: { username, password }
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required.' });
      return;
    }

    const pool = await poolPromise;

    // Find user
    const result = await pool.request()
      .input('username', username)
      .query('SELECT Id, Firstname, Lastname, Username, PasswordHash, Role FROM Users WHERE Username = @username');

    if (result.recordset.length === 0) {
      res.status(401).json({ error: 'Invalid username or password.' });
      return;
    }

    const user = result.recordset[0];

    // Verify password
    const isValid = await argon2.verify(user.PasswordHash, password);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid username or password.' });
      return;
    }

    // Generate JWT
    const expiresIn = (process.env.JWT_EXPIRES_IN || '24h') as string;
    const token = jwt.sign(
      { id: user.Id, username: user.Username, role: user.Role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: expiresIn as any }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.Id,
        firstname: user.Firstname,
        lastname: user.Lastname,
        username: user.Username,
        role: user.Role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * PUT /api/auth/change-password
 *
 * For any authenticated user changing their OWN password:
 *   Body: { currentPassword, newPassword }
 *
 * For Admin resetting ANOTHER user's password:
 *   Body: { username, newPassword }
 */
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword, username } = req.body;
    const requestingUser = req.user;

    if (!requestingUser) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ error: 'New password is required and must be at least 6 characters.' });
      return;
    }

    const pool = await poolPromise;

    // Determine the target user
    const isAdminResettingOther = requestingUser.role === 'Admin' && username && username !== requestingUser.username;

    if (isAdminResettingOther) {
      // Admin resetting another user's password — no current password required
      const targetUser = await pool.request()
        .input('username', username)
        .query('SELECT Id, Username FROM Users WHERE Username = @username');

      if (targetUser.recordset.length === 0) {
        res.status(404).json({ error: `User "${username}" not found.` });
        return;
      }

      // Generate new salt and hash
      const salt = crypto.randomBytes(32).toString('hex');
      const passwordHash = await argon2.hash(newPassword, { salt: Buffer.from(salt, 'hex') });

      await pool.request()
        .input('passwordHash', passwordHash)
        .input('passwordSalt', salt)
        .input('targetUsername', username)
        .query('UPDATE Users SET PasswordHash = @passwordHash, PasswordSalt = @passwordSalt WHERE Username = @targetUsername');

      res.json({ message: `Password for user "${username}" has been reset successfully.` });
    } else {
      // User changing their own password — current password required
      if (!currentPassword) {
        res.status(400).json({ error: 'Current password is required to change your own password.' });
        return;
      }

      // Fetch current user's hash
      const result = await pool.request()
        .input('userId', requestingUser.id)
        .query('SELECT PasswordHash FROM Users WHERE Id = @userId');

      if (result.recordset.length === 0) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }

      // Verify current password
      const isValid = await argon2.verify(result.recordset[0].PasswordHash, currentPassword);
      if (!isValid) {
        res.status(401).json({ error: 'Current password is incorrect.' });
        return;
      }

      // Generate new salt and hash
      const salt = crypto.randomBytes(32).toString('hex');
      const passwordHash = await argon2.hash(newPassword, { salt: Buffer.from(salt, 'hex') });

      await pool.request()
        .input('passwordHash', passwordHash)
        .input('passwordSalt', salt)
        .input('userId', requestingUser.id)
        .query('UPDATE Users SET PasswordHash = @passwordHash, PasswordSalt = @passwordSalt WHERE Id = @userId');

      res.json({ message: 'Password changed successfully.' });
    }
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
