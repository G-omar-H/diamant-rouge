import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { jwtVerify } from "jose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

interface DecodedPayload {
    id: string;
    role: string;
    email: string;
}

// Use the server session first if available, fall back to manual token extraction
async function getUserId(req: NextApiRequest, res: NextApiResponse): Promise<number | null> {
    // Try to get the user session from NextAuth first (preferred method)
    const session = await getServerSession(req, res, authOptions);
    if (session?.user?.id) {
        return Number(session.user.id);
    }
    
    // Fall back to manual token extraction if no session
    const rawCookie = req.headers.cookie || '';
    const match = rawCookie.match(/next-auth\.session-token=([^;]+)/) || rawCookie.match(/__Secure-next-auth\.session-token=([^;]+)/);
    if (!match) {
        return null;
    }
    
    const tokenStr = decodeURIComponent(match[1]);
    try {
        const secret = process.env.NEXTAUTH_SECRET || '';
        const { payload: decoded } = await jwtVerify(tokenStr, new TextEncoder().encode(secret));
        if (typeof decoded !== 'object' || !decoded.id || !decoded.email) {
            throw new Error('Invalid token payload structure.');
        }
        const payload = decoded as DecodedPayload;
        return Number(payload.id);
    } catch (err) {
        return null;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Set cache-control headers to prevent excessive requests
    res.setHeader('Cache-Control', 'private, max-age=10');
    
    // Authenticate user
    const userId = await getUserId(req, res);
    
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    // Use a leaner GET method with minimal logging and optimized queries
    if (req.method === "GET") {
        try {
            // Minimize data returned by selecting only what's needed
            const wishlist = await prisma.wishlist.findMany({
                where: { userId },
                select: {
                    id: true,
                    productId: true
                }
            });
            
            // Add cache headers to response
            res.setHeader('Cache-Control', 'private, max-age=10');
            return res.status(200).json(wishlist);
            
        } catch (error) {
            return res.status(500).json({ error: "Failed to fetch wishlist" });
        }
    }

    if (req.method === "POST") {
        try {
            const { productId } = req.body;
            if (!productId) return res.status(400).json({ error: "Product ID required" });

            // Optimize with upsert to prevent duplicate requests
            const result = await prisma.wishlist.upsert({
                where: {
                    userId_productId: {
                        userId,
                        productId: Number(productId),
                    }
                },
                update: {}, // No update needed if it exists
                create: { 
                    userId, 
                    productId: Number(productId) 
                },
            });

            return res.status(201).json(result);
        } catch (error: any) {
            return res.status(500).json({ error: error.message || "Failed to add product" });
        }
    }

    if (req.method === "DELETE") {
        try {
            const { productId } = req.body;
            if (!productId) return res.status(400).json({ error: "Product ID required" });

            await prisma.wishlist.deleteMany({
                where: { userId, productId: Number(productId) },
            });

            return res.status(200).json({ message: "Removed from wishlist" });
        } catch (error) {
            return res.status(500).json({ error: "Failed to remove product" });
        }
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
