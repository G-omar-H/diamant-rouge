// pages/api/newsletter.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  
  try {
    // Store the subscriber if not already present
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });
    
    if (!existingSubscriber) {
      await prisma.newsletterSubscriber.create({
        data: { email },
      });
    }
    
    // Send a welcome email
    await sendEmail({
      to: email,
      subject: "Bienvenue dans le Cercle Diamant Rouge",
      html: `<div style="font-family: Arial, sans-serif; color: #333;">
              <h1 style="color: #D4AF37;">Bienvenue !</h1>
              <p>Merci de rejoindre le Cercle Diamant Rouge. Découvrez nos créations exclusives et bien plus encore.</p>
              <p>Nous sommes ravis de vous compter parmi nos clients privilégiés.</p>
              <p style="margin-top: 20px;">Cordialement,<br/>L'équipe Diamant Rouge</p>
            </div>`,
    });
    
    return res.status(200).json({ message: "Subscription successful – welcome email sent." });
  } catch (error) {
    console.error("Error in newsletter API:", error);
    return res.status(500).json({ error: "Error processing subscription." });
  }
}
