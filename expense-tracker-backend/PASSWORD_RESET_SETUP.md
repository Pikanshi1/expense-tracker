# Password reset email setup

Password reset emails are sent through Resend. Configure these environment variables in the backend deployment and in your local backend environment:

| Variable | Purpose | Example format |
|---|---|---|
| `RESEND_API_KEY` | Secret API key from your Resend account | `re_...` |
| `EMAIL_FROM` | Sender address verified with Resend | `Expense Tracker <security@your-verified-domain.com>` |
| `FRONTEND_URL` | Base URL of the deployed frontend | `https://your-frontend-domain.com` |

Do not commit real API keys or email credentials to GitHub.

## Flow and safeguards

- The forgot-password endpoint returns the same success message whether or not the email belongs to an account.
- Reset tokens are generated with Node's crypto module. Only a SHA-256 hash is stored in MongoDB.
- Reset links expire after 15 minutes and can be used only once.
- The forgot/reset endpoints are rate-limited.
- Passwords are hashed with bcrypt before being saved.

After setting the environment variables, deploy the backend and test the full flow with an email address you control. Confirm that the sender domain is verified in Resend and that the reset link opens the deployed frontend's `/reset-password/:token` route.
