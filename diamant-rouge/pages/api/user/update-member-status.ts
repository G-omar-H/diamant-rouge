import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { jwtVerify } from "jose";
import { DecodedPayload } from "../../../types/DecodedPayload";

export default async function updateMemberStatus(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow admin access
    console.log("📥 Received member status update request:", req.body);

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

    // ----- 3) We have a valid payload => get admin user ID -----
    console.log("✅ Admin User ID =>", payload.id);
    const adminUserId = Number(payload.id);
    
    // Check if the user is an admin
    const adminUser = await prisma.user.findUnique({
        where: { id: adminUserId },
        select: { role: true }
    });
    
    if (!adminUser || adminUser.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized. Admin access required." });
    }

    // ----- 4) Access the request body (targetUserId and memberStatus) -----
    const { targetUserId, memberStatus } = req.body;
    
    if (!targetUserId || !memberStatus) {
        return res.status(400).json({ error: "Missing required fields: targetUserId and memberStatus" });
    }
    
    // Validate memberStatus
    const validStatuses = ["regular", "gold", "platinum", "vip"];
    if (!validStatuses.includes(memberStatus)) {
        return res.status(400).json({ 
            error: `Invalid member status. Must be one of: ${validStatuses.join(", ")}` 
        });
    }

    try {
        // ----- 5) Update user member status in the database -----
        await prisma.user.update({
            where: { id: Number(targetUserId) },
            data: { memberStatus }
        });

        console.log(`✅ Member status updated to ${memberStatus} for user ID:`, targetUserId);
        return res.status(200).json({ message: "Member status updated successfully" });
    } catch (error) {
        console.error("❌ Error updating member status:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
} 