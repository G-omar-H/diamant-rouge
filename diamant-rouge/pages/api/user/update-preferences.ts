import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { jwtVerify } from "jose";
import { DecodedPayload } from "../../../types/DecodedPayload";

export default async function updatePreferences(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("📥 Received preferences update request:", req.body);

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

    // ----- 4) Access the request body (preferences data) -----
    const { 
        preferredMetals, 
        preferredGemstones, 
        ringSize, 
        braceletSize, 
        necklaceLength 
    } = req.body;

    try {
        // ----- 5) Update user preferences in the database -----
        const updateData: any = {
            ringSize: ringSize || null,
            braceletSize: braceletSize || null,
            necklaceLength: necklaceLength || null,
        };
        
        // Only include array fields if they are provided
        if (Array.isArray(preferredMetals)) {
            updateData.preferredMetals = preferredMetals;
        }
        
        if (Array.isArray(preferredGemstones)) {
            updateData.preferredGemstones = preferredGemstones;
        }
        
        await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        console.log("✅ Preferences updated for user ID:", userId);
        return res.status(200).json({ message: "Preferences updated successfully" });
    } catch (error) {
        console.error("❌ Error updating user preferences:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
} 