import nodemailer from "nodemailer";

// Configure transporter based on environment variables
// Supports: Gmail SMTP, generic SMTP, or a test account
function getTransporter() {
  if (process.env.SMTP_HOST) {
    // Custom SMTP server
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback: try Gmail SMTP with app password
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  // Last resort: create test account on ethereal.email (for development only)
  // This will log the preview URL where you can see the email
  return null;
}

const fromAddress = process.env.SMTP_FROM || process.env.GMAIL_USER || "wcadamsarcade@gmail.com";
const churchName = process.env.CHURCH_NAME || "Winners Chapel International Adams";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  recipientName?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  previewUrl?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const transporter = getTransporter();

  if (!transporter) {
    // Return a success-like response in dev so the app still works
    console.log(`[EMAIL DEV] To: ${params.to} | Subject: ${params.subject}`);
    console.log(`[EMAIL DEV] Body preview: ${params.html.substring(0, 200)}...`);
    return {
      success: true,
      messageId: "dev-mode",
      previewUrl: undefined,
    };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${churchName}" <${fromAddress}>`,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    console.log(`Email sent successfully: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info) || undefined,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to send email: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// === TEMPLATE HELPERS ===

// Replace {{placeholders}} in template strings
export function renderTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return result;
}

// === BUILT-IN TEMPLATES ===
export const defaultTemplates = {
  event_reminder: {
    name: "event_reminder",
    subject: "Reminder: {{event_title}} - {{church_name}}",
    body: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden;">
    <div style="background: #1e3a5f; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">{{church_name}}</h1>
    </div>
    <div style="padding: 30px;">
      <h2 style="color: #1e3a5f;">Hello {{name}},</h2>
      <p>This is a reminder for the upcoming event:</p>
      <div style="background: #f8f9fa; border-left: 4px solid #1e3a5f; padding: 15px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px; color: #1e3a5f;">{{event_title}}</h3>
        <p style="margin: 5px 0;"><strong>Date:</strong> {{event_date}}</p>
        <p style="margin: 5px 0;"><strong>Time:</strong> {{event_time}}</p>
        <p style="margin: 5px 0;"><strong>Location:</strong> {{event_location}}</p>
      </div>
      <p>{{event_description}}</p>
      <p style="margin-top: 20px;">God bless you,<br><strong>{{church_name}}</strong></p>
    </div>
  </div>
</body>
</html>`,
  },
  birthday: {
    name: "birthday",
    subject: "Happy Birthday {{name}}! - {{church_name}}",
    body: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden;">
    <div style="background: #1e3a5f; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">{{church_name}}</h1>
    </div>
    <div style="padding: 30px;">
      <h2 style="color: #1e3a5f;">Happy Birthday {{name}}! 🎂</h2>
      <p>On behalf of the entire {{church_name}} family, we want to wish you a very happy and blessed birthday!</p>
      <p>May God's grace continue to shine upon you, and may this new year of your life bring you joy, peace, and fulfillment in Christ.</p>
      <p style="margin-top: 20px;">With love,<br><strong>{{church_name}}</strong></p>
    </div>
  </div>
</body>
</html>`,
  },
  announcement: {
    name: "announcement",
    subject: "{{subject_line}} - {{church_name}}",
    body: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden;">
    <div style="background: #1e3a5f; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">{{church_name}}</h1>
    </div>
    <div style="padding: 30px;">
      <h2 style="color: #1e3a5f;">Dear {{name}},</h2>
      {{message_body}}
      <p style="margin-top: 20px;">God bless you,<br><strong>{{church_name}}</strong></p>
    </div>
  </div>
</body>
</html>`,
  },
};