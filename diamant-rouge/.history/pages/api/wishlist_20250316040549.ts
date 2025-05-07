import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { jwtVerify } from "jose";

interface DecodedPayload {
    id: string;
    role: string;
    email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('--- WISHLIST API START ---');

    // ✅ Manually extract session token
    const rawCookie = req.headers.cookie || '';
    let match = rawCookie.match(/next-auth\.session-token=([^;]+)/) || rawCookie.match(/__Secure-next-auth\.session-token=([^;]+)/);
    if (!match) {
        console.log('❌ No session token found. Returning 401.');
        return res.status(401).json({ error: 'User not authenticated. No token found.' });
    }
    const tokenStr = decodeURIComponent(match[1]);

    let payload: DecodedPayload;
    try {
        const secret = process.env.NEXTAUTH_SECRET || '';
        const { payload: decoded } = await jwtVerify(tokenStr, new TextEncoder().encode(secret));
        if (typeof decoded !== 'object' || !decoded.id || !decoded.email) {
            throw new Error('Invalid token payload structure.');
        }
        payload = decoded as DecodedPayload;
    } catch (err) {
        console.error('❌ Token verification failed:', err);
        return res.status(401).json({ error: 'Invalid authentication token.' });
    }

    const userId = Number(payload.id);
    console.log(`✅ Authenticated user ID: ${userId}`);

    if (req.method === "GET") {
        // ✅ Retrieve Wishlist
        try {
            const wishlist = await prisma.wishlist.findMany({
                where: { userId },
                include: { product: { include: { translations: true } } },
            });
            return res.status(200).json(wishlist);
        } catch (error) {
            console.error("❌ Failed to fetch wishlist:", error);
            return res.status(500).json({ error: "Failed to fetch wishlist" });
        }
    }

    if (req.method === "POST") {
        // ✅ Add Product to Wishlist (Fix `upsert`)
        try {
            const { productId } = req.body;
            if (!productId) return res.status(400).json({ error: "Product ID required" });

            const existingWishlistItem = await prisma.wishlist.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId: Number(productId),
                    }
                }
            });

            if (!existingWishlistItem) {
                const newWishlistItem = await prisma.wishlist.create({
                    data: { userId, productId: Number(productId) },
                });
                console.log(`✅ Product ${productId} added to wishlist by User ${userId}`);
                return res.status(201).json(newWishlistItem);
            } else {
                return res.status(409).json({ error: "Product already in wishlist" });
            }
        } catch (error: any) {
            console.error("❌ Failed to add product to wishlist:", error.message);
            return res.status(500).json({ error: error.message || "Failed to add product" });
        }
    }

    if (req.method === "DELETE") {
        // ✅ Remove Product from Wishlist
        try {
            const { productId } = req.body;
            if (!productId) return res.status(400).json({ error: "Product ID required" });

            await prisma.wishlist.deleteMany({
                where: { userId, productId: Number(productId) },
            });

            console.log(`✅ Product ${productId} removed from wishlist by User ${userId}`);
            return res.status(200).json({ message: "Removed from wishlist" });
        } catch (error) {
            console.error("❌ Failed to remove product from wishlist:", error);
            return res.status(500).json({ error: "Failed to remove product" });
        }
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
