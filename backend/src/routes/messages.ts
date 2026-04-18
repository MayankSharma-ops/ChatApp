import { Router, Request, Response } from 'express';
import pool from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/messages/:friendId
router.get('/:friendId', authenticate, async (req: Request, res: Response): Promise<void> => {
  const me = req.user!.userId;
  const { friendId } = req.params;

  try {
    const r = await pool.query(
      `SELECT m.id, m.sender_id, m.receiver_id, m.content, m.sent_at, m.is_read,
              u.name AS sender_name, u.avatar_color AS sender_avatar_color, u.avatar_url AS sender_avatar_url
       FROM messages m
       JOIN users u ON u.id = m.sender_id
       WHERE (m.sender_id=$1 AND m.receiver_id=$2)
          OR (m.sender_id=$2 AND m.receiver_id=$1)
       ORDER BY m.sent_at ASC`,
      [me, friendId]
    );

    // Mark as read
    await pool.query(
      `UPDATE messages SET is_read=TRUE
       WHERE receiver_id=$1 AND sender_id=$2 AND is_read=FALSE`,
      [me, friendId]
    );

    res.json(r.rows);
  } catch (e: any) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/messages
router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  const me = req.user!.userId;
  const { receiverId, content } = req.body;

  if (!receiverId || !content?.trim()) {
    res.status(400).json({ error: 'receiverId and content required' });
    return;
  }
  if (me === receiverId) { res.status(400).json({ error: 'Cannot message yourself' }); return; }

  try {
    // Verify friendship
    const [u1, u2] = me < receiverId ? [me, receiverId] : [receiverId, me];
    const fs = await pool.query(
      'SELECT id FROM friendships WHERE user1_id=$1 AND user2_id=$2',
      [u1, u2]
    );
    if (!fs.rows.length) { res.status(403).json({ error: 'Not friends' }); return; }

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content)
       VALUES ($1,$2,$3)
       RETURNING id, sender_id, receiver_id, content, sent_at, is_read`,
      [me, receiverId, content.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (e: any) {
    console.error(e.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/messages/unread/count
router.get('/unread/count', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const r = await pool.query(
      `SELECT sender_id, COUNT(*) AS count
       FROM messages WHERE receiver_id=$1 AND is_read=FALSE
       GROUP BY sender_id`,
      [req.user!.userId]
    );
    res.json(r.rows);
  } catch (e: any) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
