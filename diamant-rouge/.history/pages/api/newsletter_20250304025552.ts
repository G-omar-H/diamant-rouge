// pages/api/newsletter.ts
import type { NextApiRequest, NextApiResponse } from "next";
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
    // Here you might also store the email in a newsletter subscribers table.
    await sendEmail({
      to: email,
      subject: "Bienvenue dans le Cercle Diamant Rouge",
      html: `<h1>Bienvenue !</h1>
             <p>Merci de rejoindre le Cercle Diamant Rouge. Découvrez nos créations exclusives et bien plus encore.</p>
             <p>Nous sommes ravis de vous compter parmi nos clients privilégiés.</p>
             <p>Cordialement,<br/>L'équipe Diamant Rouge</p>`
    });
    
    return res.status(200).json({ message: "Welcome email sent." });
  } catch (error) {
    return res.status(500).json({ error: "Error sending welcome email." });
  }
}
