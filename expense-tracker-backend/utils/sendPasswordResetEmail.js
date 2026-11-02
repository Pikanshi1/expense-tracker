const nodemailer = require("nodemailer");

const sendPasswordResetEmail = async (email, resetUrl) => {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const password = process.env.SMTP_APP_PASSWORD || process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM || user;

  if (!user || !password || !from) {
    throw new Error("Password reset email is not configured");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true").toLowerCase() === "true",
    auth: { user, pass: password },
  });

  await transporter.sendMail({
    from,
    to: email,
    subject: "Reset your Expense Tracker password",
    text: `Reset your password using this link: ${resetUrl}\n\nThis link expires in 15 minutes and can only be used once.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#1d2945">
        <h2 style="margin-bottom:12px">Reset your password</h2>
        <p style="line-height:1.7;color:#66738d">We received a request to reset the password for your Expense Tracker account. Use the button below to choose a new password.</p>
        <p style="margin:28px 0"><a href="${resetUrl}" style="background:#416be3;color:#fff;padding:13px 22px;border-radius:8px;text-decoration:none;font-weight:bold">Reset password</a></p>
        <p style="line-height:1.7;color:#66738d">This link expires in 15 minutes and can only be used once. If you did not request this, you can ignore this email.</p>
        <p style="font-size:12px;color:#98a2b3">If the button does not work, copy this link into your browser:<br><a href="${resetUrl}">${resetUrl}</a></p>
      </div>
    `,
  });
};

module.exports = sendPasswordResetEmail;
