// pages/api/admin/orders/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { jwtVerify } from "jose";

interface DecodedPayload {
    id: string;
    role: string;
    email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("--- ADMIN ORDER GET ROUTE START ---");

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        // ----- Extract and verify admin session token -----
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

        // ----- Fetch orders from the database
        const orders = await prisma.order.findMany({
            include: { user: true },
            orderBy: { createdAt: "desc" },
        });

        console.log("✅ Orders fetched successfully");
        return res.status(200).json(orders);
    } catch (error: any) {
        console.error("❌ API Error:", error);
        return res.status(401).json({ error: error.message || "Unauthorized request" });
    }
}
