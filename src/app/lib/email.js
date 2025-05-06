import nodemailer from 'nodemailer';

// Configure mail transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASSWORD || 'password'
  }
});

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content (optional)
 * @returns {Promise} - The sending result
 */
export async function sendEmail({ to, subject, text, html }) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Camsole <noreply@camsole.com>',
      to,
      subject,
      text,
      html: html || text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send verification email
 * @param {Object} user - User object
 * @param {string} token - Verification token
 */
export async function sendVerificationEmail(user, token) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  await sendEmail({
    to: user.email,
    subject: 'Verify your email address',
    text: `Hello ${user.name},\n\nPlease verify your email by clicking the link: ${verificationUrl}\n\nThank you!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Hello ${user.name},</p>
        <p>Please verify your email by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>Thank you!</p>
      </div>
    `
  });
}

/**
 * Send reset password email
 * @param {Object} user - User object
 * @param {string} token - Reset token
 */
export async function sendPasswordResetEmail(user, token) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  
  await sendEmail({
    to: user.email,
    subject: 'Reset your password',
    text: `Hello ${user.name},\n\nYou requested a password reset. Click this link to set a new password: ${resetUrl}\n\nIf you didn't request this, please ignore this email.\n\nThank you!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4285F4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Thank you!</p>
      </div>
    `
  });
}

/**
 * Send exam result notification email
 * @param {Object} user - User object
 * @param {Object} exam - Exam details
 * @param {Object} result - Result details
 */
export async function sendExamResultEmail(user, exam, result) {
  const resultUrl = `${process.env.NEXT_PUBLIC_APP_URL}/exams/${exam._id}/results`;
  
  await sendEmail({
    to: user.email,
    subject: `Your ${exam.title} Exam Results`,
    text: `Hello ${user.name},\n\nYour results for ${exam.title} are ready. You scored ${result.percentage}%.\n\nView your detailed results here: ${resultUrl}\n\nThank you!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Exam Results</h2>
        <p>Hello ${user.name},</p>
        <p>Your results for <strong>${exam.title}</strong> are ready.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="font-size: 18px; margin: 5px 0;">Score: <strong>${result.score}/${exam.totalMarks}</strong></p>
          <p style="font-size: 22px; margin: 5px 0;">Percentage: <strong>${result.percentage}%</strong></p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resultUrl}" style="background-color: #4285F4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Detailed Results
          </a>
        </div>
        <p>Thank you!</p>
      </div>
    `
  });
}