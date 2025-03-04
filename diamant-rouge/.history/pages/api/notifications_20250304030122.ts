// pages/api/notifications.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { getSession } from "next-auth/react"; // if you use NextAuth

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Assuming you have session-based auth
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  const userId = Number(session.user.id);
  
  if (req.method === "GET") {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(notifications);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching notifications" });
    }
  }
  
  if (req.method === "PUT") {
    // Mark notifications as read
    try {
      const updated = await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ error: "Error updating notifications" });
    }
  }
  
  if (req.method === "DELETE") {
    // Delete all notifications
    try {
      await prisma.notification.deleteMany({ where: { userId } });
      return res.status(200).json({ message: "Notifications deleted" });
    } catch (error) {
      return res.status(500).json({ error: "Error deleting notifications" });
    }
  }
  
  return res.status(405).json({ error: "Method Not Allowed" });
}
