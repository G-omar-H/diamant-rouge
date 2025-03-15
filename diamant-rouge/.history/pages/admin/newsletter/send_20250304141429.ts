// pages/api/admin/newsletter/send.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { jwtVerify } from "jose";
import { prisma } from "../../../../lib/prisma";
import { sendEmail } from "../../../../lib/email";

interface DecodedPayload {
  id: string;
  role: string;
  email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify that the request is POST and that the user is admin
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  
  const rawCookie = req.headers.cookie || "";
  let match = rawCookie.match(/next-auth\.session-token=([^;]+)/) || 
              rawCookie.match(/__Secure-next-auth\.session-token=([^;]+)/);
  if (!match) {
    return res.status(401).json({ error: "Unauthorized: No token found" });
  }
  const tokenStr = decodeURIComponent(match[1]);
  const secret = process.env.NEXTAUTH_SECRET || "";
  let payload: DecodedPayload;
  try {
    const decoded = await jwtVerify(tokenStr, new TextEncoder().encode(secret));
    payload = decoded.payload as unknown as DecodedPayload;
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
  if (payload.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  const { subject, message, recipients } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ error: "Subject and message are required" });
  }

  try {
    // If recipients array is provided, use it; otherwise, fetch all subscribers
    let emails: string[] = [];
    if (recipients && Array.isArray(recipients) && recipients.length > 0) {
      emails = recipients;
    } else {
      const subscribers = await prisma.newsletterSubscriber.findMany({
        select: { email: true },
      });
      emails = subscribers.map((sub) => sub.email);
    }

    // Send email to each recipient (for large lists, consider a bulk email service)
    for (const email of emails) {
      await sendEmail({
        to: email,
        subject,
        html: `<div style="font-family: Arial, sans-serif; color: #333;">
                <h1 style="color: #D4AF37;">${subject}</h1>
                <p>${message}</p>
                <p style="margin-top: 20px;">Cordialement,<br/>L'équipe Diamant Rouge</p>
              </div>`,
      });
    }
    return res.status(200).json({ message: "Emails sent successfully" });
  } catch (error: any) {
    console.error("Error sending mass email:", error);
    return res.status(500).json({ error: "Error sending mass email" });
  }
}
