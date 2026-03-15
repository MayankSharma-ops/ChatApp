import { Router, Request, Response } from 'express';
import pool from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const areFriends = async (a: string, b: string): Promise<boolean> => {
  const [u1, u2] = a < b ? [a, b] : [b, a];
  const r = await pool.query(
    'SELECT id FROM friendships WHERE user1_id=$1 AND user2_id=$2',
    [u1, u2]
  );
  return r.rows.length > 0;
};

// GET /api/friends  — my friend list
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  const me = req.user!.userId;
  try {
    const r = await pool.query(
      `SELECT
         f.id,
         CASE WHEN f.user1_id=$1 THEN f.user2_id ELSE f.user1_id END AS friend_id,
         u.name  AS friend_name,
         u.email AS friend_email,
         u.avatar_color AS friend_avatar_color,
         f.created_at
       FROM friendships f
       JOIN users u ON u.id = CASE WHEN f.user1_id=$1 THEN f.user2_id ELSE f.user1_id END
       WHERE f.user1_id=$1 OR f.user2_id=$1
       ORDER BY u.name ASC`,
      [me]
    );
    res.json(r.rows);
  } catch (e: any) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/friends/requests  — incoming pending requests
router.get('/requests', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const r = await pool.query(
      `SELECT fr.id, fr.requester_id, fr.created_at,
              u.name AS requester_name, u.email AS requester_email, u.avatar_color AS requester_avatar_color
       FROM friend_requests fr
       JOIN users u ON u.id = fr.requester_id
       WHERE fr.receiver_id=$1 AND fr.status='pending'
       ORDER BY fr.created_at DESC`,
      [req.user!.userId]
    );
    res.json(r.rows);
  } catch (e: any) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/friends/pending  — outgoing pending requests (receiver ids)
router.get('/pending', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const r = await pool.query(
      `SELECT fr.receiver_id, u.name AS receiver_name
       FROM friend_requests fr
       JOIN users u ON u.id = fr.receiver_id
       WHERE fr.requester_id=$1 AND fr.status='pending'`,
      [req.user!.userId]
    );
    res.json(r.rows);
  } catch (e: any) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/friends/request  — send (or re-send after rejection) a friend request
router.post('/request', authenticate, async (req: Request, res: Response): Promise<void> => {
  const me = req.user!.userId;
  const { receiverId } = req.body;

  if (!receiverId) { res.status(400).json({ error: 'receiverId required' }); return; }
  if (me === receiverId) { res.status(400).json({ error: 'Cannot add yourself' }); return; }

  try {
    const receiverExists = await pool.query('SELECT id FROM users WHERE id=$1', [receiverId]);
    if (!receiverExists.rows.length) { res.status(404).json({ error: 'User not found' }); return; }

    if (await areFriends(me, receiverId)) {
      res.status(409).json({ error: 'Already friends' }); return;
    }

    // Check if the other person already sent us a pending request
    const theirPending = await pool.query(
      `SELECT id FROM friend_requests
       WHERE requester_id=$1 AND receiver_id=$2 AND status='pending'`,
      [receiverId, me]
    );
    if (theirPending.rows.length) {
      res.status(409).json({ error: 'This user already sent you a request' }); return;
    }

    // Check if a row already exists from me to them (any status)
    const existing = await pool.query(
      `SELECT id, status FROM friend_requests
       WHERE requester_id=$1 AND receiver_id=$2`,
      [me, receiverId]
    );

    if (existing.rows.length) {
      const currentStatus = existing.rows[0].status;

      if (currentStatus === 'pending') {
        res.status(409).json({ error: 'Request already pending' }); return;
      }

      if (currentStatus === 'accepted') {
        res.status(409).json({ error: 'Already friends' }); return;
      }

      // currentStatus === 'rejected' — reset it to pending
      await pool.query(
        `UPDATE friend_requests
         SET status = 'pending', created_at = NOW()
         WHERE requester_id=$1 AND receiver_id=$2`,
        [me, receiverId]
      );
    } else {
      // No prior row — fresh insert
      await pool.query(
        'INSERT INTO friend_requests (requester_id, receiver_id) VALUES ($1,$2)',
        [me, receiverId]
      );
    }

    res.status(201).json({ success: true });
  } catch (e: any) {
    console.error(e.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/friends/respond
router.post('/respond', authenticate, async (req: Request, res: Response): Promise<void> => {
  const me = req.user!.userId;
  const { requesterId, accept } = req.body;

  if (!requesterId) { res.status(400).json({ error: 'requesterId required' }); return; }

  try {
    const fr = await pool.query(
      `SELECT id FROM friend_requests
       WHERE requester_id=$1 AND receiver_id=$2 AND status='pending'`,
      [requesterId, me]
    );
    if (!fr.rows.length) { res.status(404).json({ error: 'No pending request' }); return; }

    const status = accept ? 'accepted' : 'rejected';
    await pool.query(
      `UPDATE friend_requests SET status=$1
       WHERE requester_id=$2 AND receiver_id=$3 AND status='pending'`,
      [status, requesterId, me]
    );

    if (accept) {
      const [u1, u2] = me < requesterId ? [me, requesterId] : [requesterId, me];
      await pool.query(
        'INSERT INTO friendships (user1_id, user2_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
        [u1, u2]
      );
    }
    res.json({ success: true, status });
  } catch (e: any) {
    console.error(e.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;