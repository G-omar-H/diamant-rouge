// pages/api/cart.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { jwtVerify } from "jose";

interface DecodedPayload {
  id: string;
  role: string;
  email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ----- 1. Verify User via Token -----
  const rawCookie = req.headers.cookie || "";
  let match =
    rawCookie.match(/next-auth\.session-token=([^;]+)/) ||
    rawCookie.match(/__Secure-next-auth\.session-token=([^;]+)/);
  if (!match) {
    return res.status(401).json({ error: "Unauthorized: No token found" });
  }
  const tokenStr = decodeURIComponent(match[1]);
  const secret = process.env.NEXTAUTH_SECRET || "";
  let payload: DecodedPayload;
  try {
    const { payload: decoded } = await jwtVerify(
      tokenStr,
      new TextEncoder().encode(secret)
    );
    payload = decoded as unknown as DecodedPayload;
  } catch (err: any) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
  const userId = Number(payload.id);

  // ----- 2. Handle Query Parameters -----
  // If an "id" query parameter is present, operate on that specific cart item.
  const { id, clear } = req.query;

  // ----- 3. Clear Cart: DELETE with query parameter clear -----
  if (req.method === "DELETE" && clear) {
    try {
      await prisma.cartItem.deleteMany({ where: { userId } });
      return res.status(200).json({ message: "Cart cleared successfully" });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to clear cart" });
    }
  }

  // ----- 4. Specific Cart Item Operations (if id is provided) -----
  if (id) {
    const cartItemId = Number(id);
    // Ensure the cart item belongs to the current user
    const cartItem = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
    if (!cartItem || cartItem.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You don't own this cart item" });
    }

    if (req.method === "PUT") {
      const { quantity } = req.body;
      if (quantity === undefined) {
        return res.status(400).json({ error: "Quantity is required" });
      }
      try {
        const updated = await prisma.cartItem.update({
          where: { id: cartItemId },
          data: { quantity: cartItem.quantity + Number(quantity) },
        });
        return res.status(200).json(updated);
      } catch (err: any) {
        return res.status(500).json({ error: "Failed to update cart item" });
      }
    }

    if (req.method === "DELETE") {
      try {
        await prisma.cartItem.delete({ where: { id: cartItemId } });
        return res.status(200).json({ message: "Cart item deleted successfully" });
      } catch (err: any) {
        return res.status(500).json({ error: "Failed to delete cart item" });
      }
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // ----- 5. Handle Collection of Cart Items for the User -----
  if (req.method === "GET") {
    try {
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: {
          product: {
            include: { translations: true },
          },
        },
      });
      return res.status(200).json(cartItems);
    } catch (err: any) {
      return res.status(500).json({ error: "Error fetching cart items" });
    }
  }

  if (req.method === "POST") {
    const { productId, variationId, sku, name, price, quantity, image } = req.body;
    if (!productId || !sku || !name || !price || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    try {
      // Ensure numeric values
      const prodId = Number(productId);
      const qty = Number(quantity);
      // Check if an identical item exists for this user
      const existing = await prisma.cartItem.findFirst({
        where: { userId, productId: prodId, variationId: variationId ? Number(variationId) : null },
      });
      let cartItem;
      if (existing) {
        cartItem = await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + qty },
        });
      } else {
        cartItem = await prisma.cartItem.create({
          data: {
            userId,
            productId: prodId,
            quantity: qty,
          },
        });
      }
      return res.status(201).json(cartItem);
    } catch (err: any) {
      console.error("Error in POST /api/cart:", err);
      return res.status(500).json({ error: "Error adding cart item" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
