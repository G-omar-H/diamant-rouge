// pages/api/admin/users/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { jwtVerify } from "jose";

interface DecodedPayload {
  id: string;
  role: string;
  email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "User ID is required" });

  try {
    const rawCookie = req.headers.cookie || "";
    let match =
      rawCookie.match(/next-auth\.session-token=([^;]+)/) ||
      rawCookie.match(/__Secure-next-auth\.session-token=([^;]+)/);
    if (!match) throw new Error("Unauthorized: No token found");

    const tokenStr = decodeURIComponent(match[1]);
    const secret = process.env.NEXTAUTH_SECRET || "";
    const { payload: decoded } = await jwtVerify(
      tokenStr,
      new TextEncoder().encode(secret)
    );
    const user = decoded as unknown as DecodedPayload;
    if (user.role !== "admin") throw new Error("Unauthorized: Admin access required");

    if (req.method === "PUT") {
      const { name, role, phoneNumber, address, city, postalCode, country } = req.body;
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: { name, role, phoneNumber, address, city, postalCode, country },
      });
      return res.status(200).json(updatedUser);
    }

    if (req.method === "DELETE") {
      await prisma.user.delete({
        where: { id: Number(id) },
      });
      return res.status(200).json({ message: "User deleted successfully" });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
}
