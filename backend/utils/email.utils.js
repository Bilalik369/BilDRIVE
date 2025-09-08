import dotenv from "dotenv"
dotenv.config()
import nodemailer from "nodemailer";

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
    const frontendUrl = process.env.FRONTEND_URL || "https://frontend-bildrive-ckhhdbfjg7g0bzhw.francecentral-01.azurewebsites.net"
    const verificationUrl = `${frontendUrl}/auth/verify-email/${token}`

    const subject = "Vérifiez votre adresse email";

    const htmlMessage = `
      <div style="font-size: 16px; line-height: 1.6; color: #333;">
        <p style="color: #28a745; font-weight: bold; margin-bottom: 20px;">Bienvenue sur Bildrive !</p>

        <p>Merci de vous être inscrit. Pour finaliser votre inscription, veuillez confirmer votre adresse email.</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 8px 0; text-align: center;">
            <strong style="color: #FF6500;">Cliquez sur le bouton ci-dessous pour vérifier votre email</strong>
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Vérifier mon email
          </a>
        </div>

        <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p>
        <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">${verificationUrl}</p>

        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #856404;">
            <strong>Note :</strong> Ce lien expire dans 24 heures.
          </p>
        </div>

        <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email en toute sécurité.</p>
      </div>
    `;

    const mailOptions = {
      from: `"Bildrive" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #FF6500; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
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
    console.error("Error sending verification email:", error);
    return false;
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  try {
    const frontendBase = process.env.FRONTEND_URL || "https://frontend-bildrive-ckhhdbfjg7g0bzhw.francecentral-01.azurewebsites.net"
    const resetUrl = `${frontendBase}/auth/reset-password/${token}`

    const subject = "Réinitialisez votre mot de passe";

    const htmlMessage = `
      <div style="font-size: 16px; line-height: 1.6; color: #333;">
        <p style="color: #28a745; font-weight: bold; margin-bottom: 20px;">Réinitialisation de mot de passe</p>

        <p>Vous avez demandé une réinitialisation de votre mot de passe. Pour définir un nouveau mot de passe, veuillez cliquer sur le bouton ci-dessous.</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 8px 0; text-align: center;">
            <strong style="color: #FF6500;">Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe</strong>
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Réinitialiser mon mot de passe
          </a>
        </div>

        <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p>
        <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">${resetUrl}</p>

        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #856404;">
            <strong>Note :</strong> Ce lien expire dans 1 heure.
          </p>
        </div>

        <p>Si vous n'avez pas demandé une réinitialisation de mot de passe, vous pouvez ignorer cet email en toute sécurité.</p>
      </div>
    `;

    const mailOptions = {
      from: `"Bildrive" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #FF6500; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
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
          <div style="background-color: #FF6500; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
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
          <p style="margin: 8px 0;"><strong style="color: #FF6500;">De :</strong> ${adresseDepart}</p>
          <p style="margin: 8px 0;"><strong style="color: #FF6500;">Vers :</strong> ${adresseArrivee}</p>
          <p style="margin: 8px 0;"><strong style="color: #FF6500;">Prix estimé :</strong> ${prix} DH</p>
          <p style="margin: 8px 0;"><strong style="color: #FF6500;">Distance :</strong> ${distance} km</p>
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
          <div style="background-color: #FF6500; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
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
        <p style="margin: 8px 0;"><strong style="color: #FF6500;">Chauffeur :</strong> ${chauffeur}</p>
        <p style="margin: 8px 0;"><strong style="color: #FF6500;">Arrivée estimée :</strong> ${arriveeEstimee}</p>
        <p style="margin: 8px 0;"><strong style="color: #FF6500;">Distance :</strong> ${distance}</p>
        <p style="margin: 8px 0;"><strong style="color: #FF6500;">Prix total :</strong> ${prix} DH</p>
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
          <div style="background-color: #FF6500; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
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
