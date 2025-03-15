// pages/api/admin/newsletter/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { jwtVerify } from "jose";

interface DecodedPayload {
  id: string;
  role: string;
  email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify that the request is GET and that the user is admin
  if (req.method !== "GET") {
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

  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(subscribers);
  } catch (error: any) {
    console.error("Error fetching subscribers:", error);
    return res.status(500).json({ error: "Error fetching subscribers" });
  }
}
