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

export const sendNotificationEmail = async (email, subject, htmlMessage) => {
  try {
    const mailOptions = {
      from: `"Bildrive" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #9929EA; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Bildrive</h1>
          </div>
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            ${htmlMessage}
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Cordialement,<br>
              L'équipe Bildrive
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending notification email:", error);
    return false;
  }
};

export const sendRideRequestEmailToDriver = async (email, adresseDepart, adresseArrivee, prix, distance) => {
  try {
    const subject = "Nouvelle demande de course";

    const htmlMessage = `
      <div style="font-size: 16px; line-height: 1.6; color: #333;">
        <p style="color: #007bff; font-weight: bold; margin-bottom: 20px;">Une nouvelle course a été demandée !</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 8px 0;"><strong style="color: #9929EA;">De :</strong> ${adresseDepart}</p>
          <p style="margin: 8px 0;"><strong style="color: #9929EA;">Vers :</strong> ${adresseArrivee}</p>
          <p style="margin: 8px 0;"><strong style="color: #9929EA;">Prix estimé :</strong> ${prix} DH</p>
          <p style="margin: 8px 0;"><strong style="color: #9929EA;">Distance :</strong> ${distance} km</p>
        </div>

        <p>Connectez-vous à votre application pour accepter cette course.</p>
      </div>
    `;

    const mailOptions = {
      from: `"Bildrive" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #9929EA; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Bildrive</h1>
          </div>
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            ${htmlMessage}
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Cordialement,<br>
              L'équipe Bildrive
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending ride request email to driver:", error);
    return false;
  }
};


export const sendRideAcceptedEmailToPassenger = async (email, chauffeur, arriveeEstimee, distance, prix) => {
  try {
    const subject = "Course acceptée !";

    const htmlMessage = `
    <div style="font-size: 16px; line-height: 1.6; color: #333;">
      <p style="color: #28a745; font-weight: bold; margin-bottom: 20px;"> Votre course est confirmée !</p>
  
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 8px 0;"><strong style="color: #9929EA;">Chauffeur :</strong> ${chauffeur}</p>
        <p style="margin: 8px 0;"><strong style="color: #9929EA;">Arrivée estimée :</strong> ${arriveeEstimee}</p>
        <p style="margin: 8px 0;"><strong style="color: #9929EA;">Distance :</strong> ${distance}</p>
        <p style="margin: 8px 0;"><strong style="color: #9929EA;">Prix total :</strong> ${prix} DH</p>
      </div>
  
      <p>Votre chauffeur arrive bientôt. Préparez-vous à partir en toute tranquillité !</p>
    </div>
  `;
  

    const mailOptions = {
      from: `"Bildrive" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #9929EA; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Bildrive</h1>
          </div>
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            ${htmlMessage}
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Cordialement,<br>
              L'équipe Bildrive
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending ride accepted email to passenger:", error);
    return false;
  }
};