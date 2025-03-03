// pages/api/user/update-address.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { jwtVerify } from "jose"; // Make sure you have "jose" installed
import { DecodedPayload } from "../../../types/DecodedPayload";
// or define your own type inline:
// type DecodedPayload = { id: string | number; email: string; iat?: number; exp?: number };

export default async function updateAddress(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("📥 Received request body:", req.body);

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // ----- 1) Parse raw cookies for session token -----
    const rawCookie = req.headers.cookie || "";
    let match = rawCookie.match(/next-auth\.session-token=([^;]+)/);
    if (!match) {
        match = rawCookie.match(/__Secure-next-auth\.session-token=([^;]+)/);
        if (!match) {
            console.log("❌ No session token found. Returning 401.");
            return res
                .status(401)
                .json({ error: "User not authenticated. No token found." });
        }
    }
    const tokenStr = decodeURIComponent(match[1]);

    // ----- 2) Verify token using "jose" -----
    let payload: DecodedPayload | null = null;
    try {
        const secret = process.env.NEXTAUTH_SECRET || "";
        const { payload: decoded } = await jwtVerify(
            tokenStr,
            new TextEncoder().encode(secret)
        );

        console.log("✅ Token decoded:", decoded);
        if (typeof decoded !== "object" || !decoded.id || !decoded.email) {
            throw new Error("Invalid token payload structure.");
        }
        payload = decoded as DecodedPayload;
    } catch (err) {
        console.error("❌ Token verification failed:", err);
        return res
            .status(401)
            .json({ error: "User not authenticated. Invalid token." });
    }

    if (!payload) {
        console.error("❌ Token payload is null. Returning 401.");
        return res
            .status(401)
            .json({ error: "User not authenticated. Invalid token payload." });
    }

    // ----- 3) We have a valid payload => get user ID -----
    console.log("✅ User ID =>", payload.id);
    const userId = Number(payload.id);

    // ----- 4) Access the request body (address, phone, etc.) -----
    const { address, city, postalCode, country, phoneNumber } = req.body;

    try {
        // ----- 5) Update user in the database -----
        await prisma.user.update({
            where: { id: userId },
            data: {
                address: address || null,
                city: city || null,
                postalCode: postalCode || null,
                country: country || null,
                phoneNumber: phoneNumber || null,
            },
        });

        console.log("✅ Address/Phone updated for user ID:", userId);
        return res.status(200).json({ message: "Address/Phone updated successfully" });
    } catch (error) {
        console.error("❌ Error updating user address/phone:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
