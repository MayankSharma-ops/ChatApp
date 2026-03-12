import { Router, Request, Response } from 'express';
import pool from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/users  — all users except self
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, avatar_color, created_at
       FROM users WHERE id != $1 ORDER BY name ASC`,
      [req.user!.userId]
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
      'SELECT id, name, email, avatar_color, created_at FROM users WHERE id=$1',
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

export default router;
