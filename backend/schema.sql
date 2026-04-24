-- ChatDApp PostgreSQL Schema
-- Run: psql $DATABASE_URL -f schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(60)  NOT NULL,
  email         VARCHAR(120) UNIQUE NOT NULL,
  password_hash TEXT         NOT NULL,
  avatar_color  VARCHAR(7)   NOT NULL DEFAULT '#f18303',
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ  DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_verifications (
  email         VARCHAR(120) PRIMARY KEY,
  name          VARCHAR(60)  NOT NULL,
  password_hash TEXT         NOT NULL,
  otp_hash      TEXT         NOT NULL,
  attempt_count INT          NOT NULL DEFAULT 0,
  expires_at    TIMESTAMPTZ  NOT NULL,
  created_at    TIMESTAMPTZ  DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS friend_requests (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status            VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','accepted','rejected')),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, receiver_id)
);

CREATE TABLE IF NOT EXISTS friendships (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id        UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content          TEXT        NOT NULL,
  sent_at          TIMESTAMPTZ DEFAULT NOW(),
  is_read          BOOLEAN     DEFAULT FALSE,
  read_at          TIMESTAMPTZ DEFAULT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fr_receiver    ON friend_requests (receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_fr_requester   ON friend_requests (requester_id, status);
CREATE INDEX IF NOT EXISTS idx_fs_u1          ON friendships (user1_id);
CREATE INDEX IF NOT EXISTS idx_fs_u2          ON friendships (user2_id);
CREATE INDEX IF NOT EXISTS idx_msg_pair       ON messages (sender_id, receiver_id, sent_at);
CREATE INDEX IF NOT EXISTS idx_msg_receiver   ON messages (receiver_id, is_read);
CREATE INDEX IF NOT EXISTS idx_email_verifications_expires_at
  ON email_verifications (expires_at);
