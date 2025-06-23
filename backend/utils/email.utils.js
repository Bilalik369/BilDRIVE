import dotenv from "dotenv"
dotenv.config()
import nodemailer from "nodemailer";

// console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
// console.log("EMAIL_PORT:", process.env.EMAIL_PORT);
// console.log("EMAIL_SECURE:", process.env.EMAIL_SECURE);
// console.log("EMAIL_USER:", process.env.EMAIL_USER);



const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT), 
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, 
  },
});

export const sendVerificationEmail = async (email, token) => {
  try {
    const verificationUrl = `http://localhost:5000/api/auth/verify-email/${token}`



    const mailOptions = {
      from: `"Bildrive" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Bildrive!</h2>
          <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
          </div>
          <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>Best regards,<br>The Bildrive Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};


export const sendPasswordResetEmail = async (email, token) => {
  try {
    
    const resetUrl = `http://localhost:5000/api/auth/reset-password/${token}`

    const mailOptions = {
      from: `"Bildrive" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset. Please click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
          <p>${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>Best regards,<br>The Bildrive Team</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Error sending password reset email:", error)
    return false
  }
}
