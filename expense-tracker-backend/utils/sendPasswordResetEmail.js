const sendPasswordResetEmail = async (email, resetUrl) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error("Password reset email is not configured");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Reset your Expense Tracker password",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#1d2945">
          <h2 style="margin-bottom:12px">Reset your password</h2>
          <p style="line-height:1.7;color:#66738d">We received a request to reset the password for your Expense Tracker account. Use the button below to choose a new password.</p>
          <p style="margin:28px 0"><a href="${resetUrl}" style="background:#416be3;color:#fff;padding:13px 22px;border-radius:8px;text-decoration:none;font-weight:bold">Reset password</a></p>
          <p style="line-height:1.7;color:#66738d">This link expires in 15 minutes and can only be used once. If you did not request this, you can ignore this email.</p>
          <p style="font-size:12px;color:#98a2b3">If the button does not work, copy this link into your browser:<br><a href="${resetUrl}">${resetUrl}</a></p>
        </div>
      `
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Email provider rejected the request: ${details}`);
  }
};

module.exports = sendPasswordResetEmail;
