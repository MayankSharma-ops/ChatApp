import { Resend } from "resend";

let resend: Resend | null = null;

function readRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function getResendClient(): Resend {
  if (resend) {
    return resend;
  }
  const apiKey = readRequiredEnv("RESEND_API_KEY");
  resend = new Resend(apiKey);
  return resend;
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

  const { data, error } = await getResendClient().emails.send({
    from,
    to: email,
    subject: "Your GathorChat signup verification code",
    text: [
      "Welcome to GathorChat.",
      "",
      `Your one-time verification code is ${otp}.`,
      `It expires in ${expiresInMinutes} minutes.`,
      "",
      "If you did not request this code, you can ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">Verify your GathorChat signup</h2>
        <p style="margin: 0 0 12px;">Use the code below to finish creating your account.</p>
        <div style="font-size: 28px; font-weight: 700; letter-spacing: 8px; margin: 16px 0; color: #f18303;">
          ${otp}
        </div>
        <p style="margin: 0 0 12px;">This code expires in ${expiresInMinutes} minutes.</p>
        <p style="margin: 0;">If you did not request this code, you can ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
