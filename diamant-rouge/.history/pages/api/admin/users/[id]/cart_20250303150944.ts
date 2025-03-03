// pages/api/admin/users/[id]/cart.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { jwtVerify } from "jose";

interface DecodedPayload {
  id: string;
  role: string;
  email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const rawCookie = req.headers.cookie || "";
    let match =
      rawCookie.match(/next-auth\.session-token=([^;]+)/) ||
      rawCookie.match(/__Secure-next-auth\.session-token=([^;]+)/);
    if (!match) throw new Error("Unauthorized: No token found");

    const tokenStr = decodeURIComponent(match[1]);
    const secret = process.env.NEXTAUTH_SECRET || "";
    const { payload: decoded } = await jwtVerify(tokenStr, new TextEncoder().encode(secret));
    const user = decoded as unknown as DecodedPayload;
    if (user.role !== "admin") throw new Error("Unauthorized: Admin access required");

    const { id } = req.query;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: Number(id) },
      include: {
        product: {
          include: { translations: true },
        },
      },
    });

    return res.status(200).json(cartItems);
  } catch (error: any) {
    console.error("❌ Error fetching cart items:", error);
    return res.status(401).json({ error: error.message || "Unauthorized request" });
  }
}
