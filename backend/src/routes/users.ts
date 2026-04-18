import { Router, Request, Response } from 'express';
import pool from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/users  — search users by email or username
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  const rawQuery = typeof req.query.q === 'string' ? req.query.q.trim() : '';

  if (!rawQuery) {
    res.json([]);
    return;
  }
  try {
    const result = await pool.query(
      `SELECT id, name, email, avatar_color, avatar_url, created_at
       FROM users
       WHERE LOWER(name) LIKE LOWER($1)
          OR LOWER(email) LIKE LOWER($1)
       ORDER BY name ASC
       LIMIT 25`,
      [`%${rawQuery}%`]
    );
    res.json(result.rows);
  } catch (e: any) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/users/:id
router.get('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, avatar_color, avatar_url, created_at FROM users WHERE id=$1',
      [req.params.id]
    );
    if (!result.rows.length) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/users/profile
router.put('/profile', authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const { name, avatar_url } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           avatar_url = COALESCE($2, avatar_url)
       WHERE id = $3
       RETURNING id, name, email, avatar_color, avatar_url, created_at`,
      [name, avatar_url, userId]
    );

    if (!result.rows.length) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (e: any) {
    console.error('Update profile error:', e.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
