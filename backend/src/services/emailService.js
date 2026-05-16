// ============================================
// Email Service (Optional)
// ============================================
// Nodemailer is an optional dependency.
// If not installed, email features are silently disabled.

const { env } = require('../config/env');

let nodemailer = null;
try {
  nodemailer = require('nodemailer');
} catch {
  // nodemailer not installed — email features disabled
}

let transporter = null;

/**
 * Initialize the email transporter if SMTP credentials are configured.
 */
function initEmailService() {
  if (!nodemailer) {
    console.log('📧 Email service disabled (nodemailer not installed)');
    return;
  }

  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
    console.log('📧 Email service initialized');
  } else {
    console.log('📧 Email service not configured (SMTP credentials missing)');
  }
}

/**
 * Send assessment result email to the patient.
 *
 * @param {string} toEmail - Recipient email
 * @param {string} userName - Patient name
 * @param {Object} result - Assessment result data
 */
async function sendAssessmentResultEmail(toEmail, userName, result) {
  if (!transporter) {
    return false;
  }

  const riskColors = {
    LOW: '#10b981',
    MODERATE: '#f59e0b',
    HIGH: '#ef4444',
  };

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1e40af; text-align: center;">GastroCare</h1>
      <h2 style="text-align: center; color: #374151;">Your GERD Risk Assessment Results</h2>

      <p>Hello ${userName || 'there'},</p>
      <p>Thank you for completing the GastroCare GERD risk assessment. Here are your results:</p>

      <div style="background: #f9fafb; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0;">
        <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Risk Level</div>
        <div style="font-size: 24px; font-weight: bold; color: ${riskColors[result.riskLevel]};">
          ${result.riskLevel} RISK
        </div>
        <div style="margin-top: 12px; font-size: 14px; color: #6b7280;">
          Score: ${result.totalScore} / ${result.maxScore} (${result.percentage}%)
        </div>
      </div>

      <p>${result.recommendation}</p>

      <div style="background: #f0fdf4; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <strong>${result.habits.title}</strong>
        <ul style="padding-left: 20px; margin-top: 8px;">
          ${result.habits.items.map((item) => `<li style="margin-bottom: 4px;">${item}</li>`).join('')}
        </ul>
      </div>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
      <p style="font-size: 12px; color: #9ca3af; text-align: center;">
        <strong>Medical Disclaimer:</strong> This assessment is for informational purposes only
        and does not constitute medical advice. Please consult with a qualified healthcare
        provider for proper diagnosis and treatment.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"GastroCare" <${env.SMTP_USER}>`,
      to: toEmail,
      subject: `Your GERD Risk Assessment Results — ${result.riskLevel} Risk`,
      html: htmlContent,
    });
    console.log(`📧 Assessment result email sent to ${toEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    return false;
  }
}

module.exports = { initEmailService, sendAssessmentResultEmail };
