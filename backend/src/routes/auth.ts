import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { z } from "zod";
import pool from "../db.js";
import { sendSignupOtpEmail } from "../mailer.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
const OTP_EXPIRY_MINUTES = Number(process.env.SIGNUP_OTP_EXPIRES_MINUTES || 10);
const OTP_LENGTH = 6;
const MAX_OTP_ATTEMPTS = 5;

const AVATAR_COLORS = [
  "#f18303",
  "#e74c3c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#1abc9c",
  "#e67e22",
  "#e91e63",
];

const RegisterSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().email(),
  password: z.string().min(6).max(100),
});

const LoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

const VerifyOtpSchema = z.object({
  email: z.string().trim().email(),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be a 6-digit code"),
});

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function generateOtp(): string {
  return crypto.randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, "0");
}

function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

function isOtpValid(submittedOtp: string, storedOtpHash: string): boolean {
  const submittedBuffer = Buffer.from(hashOtp(submittedOtp), "hex");
  const storedBuffer = Buffer.from(storedOtpHash, "hex");
  if (submittedBuffer.length !== storedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(submittedBuffer, storedBuffer);
}

function getRandomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

function signToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as jwt.SignOptions);
}

function isMissingEmailVerificationTableError(error: any): boolean {
  return (
    error?.code === "42P01" &&
    typeof error?.message === "string" &&
    error.message.includes("email_verifications")
  );
}

// POST /api/auth/register/request-otp
router.post(
  "/register/request-otp",
  async (req: Request, res: Response): Promise<void> => {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0].message });
      return;
    }

    const { name, password } = parsed.data;
    const email = normalizeEmail(parsed.data.email);

    try {
      await pool.query("DELETE FROM email_verifications WHERE expires_at < NOW()");

      const exists = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
      if (exists.rows.length) {
        res.status(409).json({ error: "Email already registered" });
        return;
      }

      const otp = generateOtp();
      const passwordHash = await bcrypt.hash(password, 12);
      const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

      await pool.query(
        `INSERT INTO email_verifications (email, name, password_hash, otp_hash, expires_at, attempt_count)
         VALUES ($1, $2, $3, $4, $5, 0)
         ON CONFLICT (email)
         DO UPDATE SET
           name = EXCLUDED.name,
           password_hash = EXCLUDED.password_hash,
           otp_hash = EXCLUDED.otp_hash,
           expires_at = EXCLUDED.expires_at,
           attempt_count = 0,
           updated_at = NOW()`,
        [email, name, passwordHash, hashOtp(otp), expiresAt],
      );

      try {
        await sendSignupOtpEmail({
          email,
          otp,
          expiresInMinutes: OTP_EXPIRY_MINUTES,
        });
      } catch (mailError: any) {
        await pool.query("DELETE FROM email_verifications WHERE email=$1", [email]);
        console.error("Send OTP email error:", mailError.message, {
          code: mailError.code,
          response: mailError.response,
          responseCode: mailError.responseCode,
          command: mailError.command,
        });
        res
          .status(500)
          .json({ error: "Unable to send verification email right now" });
        return;
      }

      res.json({
        message: "Verification code sent to your email",
        expiresInMinutes: OTP_EXPIRY_MINUTES,
      });
    } catch (e: any) {
      if (isMissingEmailVerificationTableError(e)) {
        console.error("Request OTP schema error:", e.message);
        res.status(500).json({
          error: "Database schema is outdated. Run the latest db:init and try again",
        });
        return;
      }
      console.error("Request OTP error:", e.message);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const parsed = VerifyOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  const email = normalizeEmail(parsed.data.email);
  const { otp } = parsed.data;

  const client = await pool.connect();
  let transactionOpen = false;

  try {
    await client.query("BEGIN");
    transactionOpen = true;
    await client.query("DELETE FROM email_verifications WHERE expires_at < NOW()");

    const exists = await client.query("SELECT id FROM users WHERE email=$1", [email]);
    if (exists.rows.length) {
      await client.query("ROLLBACK");
      transactionOpen = false;
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const verificationResult = await client.query(
      `SELECT name, password_hash, otp_hash, expires_at, attempt_count
       FROM email_verifications
       WHERE email=$1
       FOR UPDATE`,
      [email],
    );
    const verification = verificationResult.rows[0];

    if (!verification) {
      await client.query("ROLLBACK");
      transactionOpen = false;
      res.status(400).json({ error: "Request a verification code first" });
      return;
    }

    if (new Date(verification.expires_at).getTime() <= Date.now()) {
      await client.query("DELETE FROM email_verifications WHERE email=$1", [email]);
      await client.query("COMMIT");
      transactionOpen = false;
      res.status(400).json({ error: "OTP expired. Please request a new code" });
      return;
    }

    if (!isOtpValid(otp, verification.otp_hash)) {
      const nextAttempt = verification.attempt_count + 1;

      if (nextAttempt >= MAX_OTP_ATTEMPTS) {
        await client.query("DELETE FROM email_verifications WHERE email=$1", [email]);
        await client.query("COMMIT");
        transactionOpen = false;
        res.status(429).json({
          error: "Too many incorrect OTP attempts. Please request a new code",
        });
        return;
      }

      await client.query(
        `UPDATE email_verifications
         SET attempt_count=$2, updated_at=NOW()
         WHERE email=$1`,
        [email, nextAttempt],
      );
      await client.query("COMMIT");
      transactionOpen = false;
      res.status(400).json({
        error: `Invalid OTP. ${MAX_OTP_ATTEMPTS - nextAttempt} attempt(s) remaining`,
      });
      return;
    }

    const avatar_color = getRandomAvatarColor();

    const result = await client.query(
      `INSERT INTO users (name, email, password_hash, avatar_color)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, avatar_color, avatar_url, created_at`,
      [verification.name, email, verification.password_hash, avatar_color],
    );
    const user = result.rows[0];
    const token = signToken(user.id, user.email);

    await client.query("DELETE FROM email_verifications WHERE email=$1", [email]);
    await client.query("COMMIT");
    transactionOpen = false;

    res.status(201).json({ token, user });
  } catch (e: any) {
    if (transactionOpen) {
      await client.query("ROLLBACK");
    }
    if (isMissingEmailVerificationTableError(e)) {
      console.error("Register verify schema error:", e.message);
      res.status(500).json({
        error: "Database schema is outdated. Run the latest db:init and try again",
      });
      return;
    }
    if (e.code === "23505") {
      res.status(409).json({ error: "Email already registered" });
      return;
    }
    console.error("Register verify error:", e.message);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }
  const password = parsed.data.password;
  const email = normalizeEmail(parsed.data.email);

  try {
    const result = await pool.query(
      "SELECT id, name, email, password_hash, avatar_color, avatar_url, created_at FROM users WHERE email=$1",
      [email],
    );
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = signToken(user.id, user.email);

    const { password_hash, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (e: any) {
    console.error("Login error:", e.message, e.code, e.stack);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/auth/me
router.get(
  "/me",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await pool.query(
        "SELECT id, name, email, avatar_color, avatar_url, created_at FROM users WHERE id=$1",
        [req.user!.userId],
      );
      if (!result.rows.length) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(result.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: "Server error" });
    }
  },
);

export default router;
