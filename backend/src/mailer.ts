import nodemailer, { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

function readRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function getTransporter(): Transporter {
  if (transporter) {
    return transporter;
  }

  const host = readRequiredEnv("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT || 587);
  if (!Number.isFinite(port)) {
    throw new Error("SMTP_PORT must be a valid number");
  }

  const user = readRequiredEnv("SMTP_USER");
  const pass = readRequiredEnv("SMTP_PASS");

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user, pass },
  });

  return transporter;
}

interface SignupOtpEmailArgs {
  email: string;
  otp: string;
  expiresInMinutes: number;
}

export async function sendSignupOtpEmail({
  email,
  otp,
  expiresInMinutes,
}: SignupOtpEmailArgs): Promise<void> {
  const from = process.env.MAIL_FROM || readRequiredEnv("SMTP_USER");

  await getTransporter().sendMail({
    from,
    to: email,
    subject: "Your ChatApp signup verification code",
    text: [
      "Welcome to ChatApp.",
      "",
      `Your one-time verification code is ${otp}.`,
      `It expires in ${expiresInMinutes} minutes.`,
      "",
      "If you did not request this code, you can ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">Verify your ChatApp signup</h2>
        <p style="margin: 0 0 12px;">Use the code below to finish creating your account.</p>
        <div style="font-size: 28px; font-weight: 700; letter-spacing: 8px; margin: 16px 0; color: #f18303;">
          ${otp}
        </div>
        <p style="margin: 0 0 12px;">This code expires in ${expiresInMinutes} minutes.</p>
        <p style="margin: 0;">If you did not request this code, you can ignore this email.</p>
      </div>
    `,
  });
}
