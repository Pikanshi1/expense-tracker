# Password reset email setup

Password reset emails use SMTP. Gmail accounts can use a Google app password; do not use the normal Gmail account password.

| Variable | Purpose | Example |
|---|---|---|
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `465` |
| `SMTP_SECURE` | Use TLS for the connection | `true` |
| `EMAIL_USER` | Gmail address used to send mail | `your.address@gmail.com` |
| `EMAIL_PASS` | 16-character Google app password | `xxxx xxxx xxxx xxxx` |
| `EMAIL_FROM` | Sender shown in the email | `Expense Tracker <your.address@gmail.com>` |
| `FRONTEND_URL` | Base URL of the deployed frontend | `https://your-frontend-domain.com` |

Do not commit real app passwords, email credentials, or other secrets to GitHub.

For Gmail, enable 2-Step Verification, create an app password under Google Account security, and put that generated password in `EMAIL_PASS`. `SMTP_USER` and `SMTP_APP_PASSWORD` are also accepted aliases.

## Flow and safeguards

- The forgot-password endpoint returns the same success message whether or not the email belongs to an account.
- Reset tokens are generated with Node's crypto module. Only a SHA-256 hash is stored in MongoDB.
- Reset links expire after 15 minutes and can be used only once.
- The forgot/reset endpoints are rate-limited.
- Passwords are hashed with bcrypt before being saved.

After setting the environment variables, deploy the backend and test the full flow with an email address you control. Confirm that the reset link opens the deployed frontend's `/reset-password/:token` route.
