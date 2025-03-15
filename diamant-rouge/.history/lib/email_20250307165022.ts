// lib/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., "smtp.gmail.com"
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string; }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM, // sender address, e.g., '"Diamant Rouge" <noreply@diamantrouge.com>'
      to,
      subject,
      html,
    });
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// Add this function to your existing email.ts file

type ResetEmailParams = {
  to: string;
  name: string;
  resetUrl: string;
};

export async function sendPasswordResetEmail({ to, name, resetUrl }: ResetEmailParams) {
  const subject = "Réinitialisation de votre mot de passe - Diamant Rouge";
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="${process.env.NEXTAUTH_URL}/images/1/diamant-rouge-logo-full.svg" alt="Diamant Rouge" style="max-width: 200px;">
      </div>
      
      <h1 style="color: #9a2240; text-align: center; margin-bottom: 20px;">Réinitialisation de votre mot de passe</h1>
      
      <p>Bonjour ${name},</p>
      
      <p>Nous avons reçu une demande de réinitialisation de votre mot de passe pour votre compte Diamant Rouge.</p>
      
      <p>Pour définir un nouveau mot de passe, veuillez cliquer sur le bouton ci-dessous :</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #9a2240; color: #fff; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold; display: inline-block;">Réinitialiser mon mot de passe</a>
      </div>
      
      <p>Ce lien est valable pour les 6 prochaines heures.</p>
      
      <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.</p>
      
      <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #777; font-size: 14px;">
        Cordialement,<br>
        L'équipe Diamant Rouge
      </p>
    </div>
  `;
  
  return await sendEmail({ to, subject, html });
}

export async function  sendOrderUpdateEmail(