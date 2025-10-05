import { Resend } from "resend";
import sgMail from "@sendgrid/mail";

const provider = (process.env.EMAIL_PROVIDER || "RESEND").toUpperCase();
const fromEmail = process.env.EMAIL_FROM || "no-reply@yourdomain.com";

// Resend client (default)
const resendKey = process.env.RESEND_API_KEY;
const resend = provider === "RESEND" && resendKey ? new Resend(resendKey) : null;
if (provider === "RESEND" && !resendKey) {
  console.warn("[email] RESEND selected but RESEND_API_KEY is not set. Emails will be skipped.");
}

// SendGrid client (optional)
if (provider === "SENDGRID") {
  const sgKey = process.env.SENDGRID_API_KEY;
  if (!sgKey) {
    console.warn("[email] SENDGRID selected but SENDGRID_API_KEY is not set. Emails will be skipped.");
  } else {
    sgMail.setApiKey(sgKey);
  }
}

// SMTP removed to avoid optional dependency issues in build. Supported: RESEND, SENDGRID.

export async function sendPaymentConfirmationEmail(params: {
  to: string;
  userName?: string | null;
  courseTitle: string;
  amountInCents?: number | null;
  currency?: string | null; // e.g., 'inr'
  receiptUrl?: string | null;
}) {
  const { to, userName, courseTitle, amountInCents, currency, receiptUrl } = params;

  const amountFormatted = typeof amountInCents === "number"
    ? `${(amountInCents / 100).toFixed(2)} ${String(currency || '').toUpperCase()}`
    : null;

  const subject = `Payment confirmed: ${courseTitle}`;

  const html = `
    <div style="font-family: Arial, sans-serif; color:#111;">
      <h2 style="margin:0 0 12px;">Thank you${userName ? ", " + escapeHtml(userName) : ""}!</h2>
      <p>Your payment for <strong>${escapeHtml(courseTitle)}</strong> has been received successfully.</p>
      ${amountFormatted ? `<p><strong>Amount:</strong> ${amountFormatted}</p>` : ""}
      ${receiptUrl ? `<p><a href="${escapeAttr(receiptUrl)}" target="_blank" rel="noreferrer">View receipt</a></p>` : ""}
      <p>You now have access to the course in your dashboard.</p>
      <p style="margin-top:24px; font-size:12px; color:#555;">If you did not make this purchase, please contact support immediately.</p>
    </div>
  `;

  // SMTP path removed

  if (provider === "SENDGRID") {
    if (!process.env.SENDGRID_API_KEY) return { skipped: true, reason: "sendgrid_not_configured" };
    try {
      const [resp] = await sgMail.send({
        to,
        from: fromEmail!,
        subject,
        html,
      });
      return { id: resp.headers["x-message-id"] || null, status: resp.statusCode } as any;
    } catch (e) {
      // surface minimal error
      throw e;
    }
  }

  if (!resend) return { skipped: true, reason: "resend_not_configured" };
  return await resend.emails.send({
    from: fromEmail!,
    to,
    subject,
    html,
  });
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(input: string) {
  return input.replace(/"/g, "&quot;");
}
