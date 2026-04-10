const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'BoardingBook <noreply@project.fxjpro.com>';

// Sends to actual recipient; override with DEV_TEST_EMAIL in .env for local testing
const resolveRecipient = (email) =>
  process.env.DEV_TEST_EMAIL || email;

/**
 * Send email verification link after sign-up
 */
async function sendVerificationEmail(email, verificationToken) {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

  const { error } = await resend.emails.send({
    from: FROM,
    to: resolveRecipient(email),
    subject: 'Verify your BoardingBook account',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Verify your BoardingBook account</title>
</head>
<body style="margin:0;padding:0;background:#060b18;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060b18;padding:52px 16px 48px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;">

        <!-- Wordmark -->
        <tr><td align="center" style="padding-bottom:40px;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="background:linear-gradient(135deg,#818cf8,#22d3ee);border-radius:12px;padding:10px 20px;">
              <span style="color:#fff;font-size:16px;font-weight:800;letter-spacing:-0.4px;">BoardingBook</span>
            </td>
          </tr></table>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#0e1525;border-radius:28px;border:1px solid rgba(129,140,248,0.16);box-shadow:0 48px 140px rgba(0,0,0,0.8),0 0 0 1px rgba(255,255,255,0.03);overflow:hidden;">

          <!-- Hero section -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background:linear-gradient(175deg,#131c38 0%,#0e1525 60%,#0e1525 100%);padding:56px 40px 48px;text-align:center;border-bottom:1px solid rgba(129,140,248,0.09);">

              <!-- Illustration -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 40px;">
                <tr><td align="center">
                  <!-- Outer glow ring -->
                  <div style="width:130px;height:130px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%);border:1px solid rgba(129,140,248,0.18);margin:0 auto;">
                    <table cellpadding="0" cellspacing="0" width="130" height="130"><tr><td align="center" valign="middle">
                      <!-- Inner solid circle -->
                      <div style="width:90px;height:90px;border-radius:50%;background:linear-gradient(145deg,#4338ca,#7c3aed);box-shadow:0 0 50px rgba(99,102,241,0.7),0 0 100px rgba(99,102,241,0.3),inset 0 1px 0 rgba(255,255,255,0.15);margin:0 auto;">
                        <table cellpadding="0" cellspacing="0" width="90" height="90"><tr><td align="center" valign="middle">
                          <img src="https://em-content.zobj.net/source/apple/391/envelope-with-arrow_1f4e9.png" width="44" height="44" alt="📩" style="display:block;margin:0 auto;" />
                        </td></tr></table>
                      </div>
                    </td></tr></table>
                  </div>
                </td></tr>
              </table>

              <h1 style="margin:0 0 14px;color:#ffffff;font-size:32px;font-weight:800;letter-spacing:-0.8px;line-height:1.1;">Verify your email</h1>
              <p style="margin:0 auto;color:#8892a8;font-size:15px;line-height:1.7;max-width:310px;">
                Click the button below to activate your <strong style="color:#c7d2fe;">BoardingBook</strong> account and get started.
              </p>
            </td></tr>
          </table>

          <!-- Body -->
          <table width="100%" cellpadding="0" cellspacing="0" style="padding:44px 40px 38px;">

            <!-- CTA Button -->
            <tr><td align="center" style="padding-bottom:24px;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="border-radius:14px;background:linear-gradient(135deg,#818cf8 0%,#6366f1 50%,#22d3ee 100%);box-shadow:0 0 44px rgba(129,140,248,0.55),0 12px 40px rgba(0,0,0,0.5);">
                  <a href="${verificationUrl}" style="display:inline-block;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:18px 56px;letter-spacing:0.3px;border-radius:14px;">
                    Verify Email Address &nbsp;→
                  </a>
                </td>
              </tr></table>
            </td></tr>

            <!-- Expiry pill -->
            <tr><td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.18);border-radius:100px;padding:8px 22px;">
                  <span style="color:#818cf8;font-size:12px;font-weight:600;letter-spacing:0.2px;">⏱&nbsp;&nbsp;Link expires in 24 hours</span>
                </td>
              </tr></table>
            </td></tr>

            <!-- Divider -->
            <tr><td style="padding-bottom:26px;">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(129,140,248,0.12),transparent);"></td>
              </tr></table>
            </td></tr>

            <!-- Ignore note -->
            <tr><td align="center">
              <p style="margin:0;color:#3d4f68;font-size:12px;line-height:1.7;text-align:center;">
                If you didn't create an account, you can safely ignore this email.<br/>
                No action is required on your part.
              </p>
            </td></tr>

          </table>
        </td></tr>

        <!-- Fallback URL -->
        <tr><td style="padding:24px 8px 0;" align="center">
          <p style="margin:0;color:#1f2e44;font-size:11px;text-align:center;line-height:1.85;">
            Can't click the button? Copy and paste this link into your browser:<br/>
            <a href="${verificationUrl}" style="color:#3a4f6e;word-break:break-all;text-decoration:none;">${verificationUrl}</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td align="center" style="padding-top:28px;padding-bottom:4px;">
          <p style="margin:0;color:#182030;font-size:11px;letter-spacing:0.1px;">© ${new Date().getFullYear()} BoardingBook &nbsp;·&nbsp; SLIIT Student Platform</p>
        </td></tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`,
  });

  if (error) throw new Error(error.message);
}

/**
 * Send welcome email after successful verification
 */
async function sendWelcomeEmail(email, name) {
  const { error } = await resend.emails.send({
    from: FROM,
    to: resolveRecipient(email),
    subject: 'Welcome to BoardingBook!',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family:Arial,sans-serif;background:#0f1425;margin:0;padding:30px;">
        <div style="max-width:560px;margin:0 auto;background:#1e2436;border-radius:12px;padding:36px;border:1px solid rgba(129,140,248,0.2);">
          <div style="text-align:center;margin-bottom:28px;">
            <div style="display:inline-block;background:linear-gradient(135deg,#818cf8,#22d3ee);border-radius:10px;padding:12px 20px;">
              <span style="color:white;font-size:18px;font-weight:bold;">BoardingBook</span>
            </div>
          </div>
          <h2 style="color:#ffffff;text-align:center;margin:0 0 8px;">You're all set, ${name || 'there'}!</h2>
          <p style="color:#94a3b8;text-align:center;margin:0 0 28px;font-size:14px;">Your email has been verified and your account is now active.</p>
          <div style="text-align:center;">
            <a href="${process.env.FRONTEND_URL}/signin" style="display:inline-block;background:linear-gradient(135deg,#818cf8,#22d3ee);color:white;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:600;font-size:15px;">
              Sign In Now
            </a>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) console.error('Welcome email failed:', error.message);
}

/**
 * Send password reset email
 */
async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const { error } = await resend.emails.send({
    from: FROM,
    to: resolveRecipient(email),
    subject: 'Reset your BoardingBook password',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family:Arial,sans-serif;background:#0f1425;margin:0;padding:30px;">
        <div style="max-width:560px;margin:0 auto;background:#1e2436;border-radius:12px;padding:36px;border:1px solid rgba(129,140,248,0.2);">
          <div style="text-align:center;margin-bottom:28px;">
            <div style="display:inline-block;background:linear-gradient(135deg,#818cf8,#22d3ee);border-radius:10px;padding:12px 20px;">
              <span style="color:white;font-size:18px;font-weight:bold;">BoardingBook</span>
            </div>
          </div>
          <h2 style="color:#ffffff;text-align:center;margin:0 0 8px;">Reset your password</h2>
          <p style="color:#94a3b8;text-align:center;margin:0 0 28px;font-size:14px;">Click the button below to set a new password. This link expires in 1 hour.</p>
          <div style="text-align:center;margin-bottom:28px;">
            <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#818cf8,#22d3ee);color:white;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:600;font-size:15px;">
              Reset Password
            </a>
          </div>
          <p style="color:#64748b;font-size:12px;text-align:center;margin:0 0 8px;">If you didn't request this, you can safely ignore this email.</p>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
          <p style="color:#475569;font-size:11px;text-align:center;margin:0;">Can't click the button? Copy this link:<br/>
            <span style="color:#818cf8;word-break:break-all;">${resetUrl}</span>
          </p>
        </div>
      </body>
      </html>
    `,
  });

  if (error) throw new Error(error.message);
}

module.exports = { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail };
