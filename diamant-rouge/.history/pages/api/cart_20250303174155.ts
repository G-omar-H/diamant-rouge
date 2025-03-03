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
  console.log("--- CART API START ---");
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
    const decodedResult = await jwtVerify(tokenStr, new TextEncoder().encode(secret));
    // Ensure payload is valid
    if (!decodedResult || typeof decodedResult.payload !== "object" || decodedResult.payload === null) {
      console.error("Decoded token payload is null or invalid:", decodedResult);
      throw new Error("Token payload is null or invalid");
    }
    payload = decodedResult.payload as unknown as DecodedPayload;
  } catch (err: any) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
  const userId = Number(payload.id);
  console.log(`Authenticated user ID: ${userId}`);
  if (isNaN(userId)) {
    console.error("User ID is not a valid number:", payload.id);
    return res.status(401).json({ error: "Unauthorized: Invalid user ID in token" });
  }

  const { id, clear } = req.query;
  console.log("", req.method, req.query);

  if (req.method === "DELETE" && clear) {
    console.log("Clearing cart for user ID:", userId);
    try {
      await prisma.cartItem.deleteMany({ where: { userId } });
      return res.status(200).json({ message: "Cart cleared successfully" });
    } catch (err: any) {
      console.error("Error clearing cart:", err);
      return res.status(500).json({ error: "Failed to clear cart" });
    }
  }

  if (id) {
    const cartItemId = Number(id);
    const cartItem = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
    if (!cartItem || cartItem.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You don't own this cart item" });
    }

    if (req.method === "PUT") {
        console.log("Updating cart item:", cartItemId);
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
        console.error("Error updating cart item:", err);
        return res.status(500).json({ error: "Failed to update cart item" });
      }
    }

    if (req.method === "DELETE") {
        console.log("Deleting cart item:", cartItemId);
      try {
        await prisma.cartItem.delete({ where: { id: cartItemId } });
        return res.status(200).json({ message: "Cart item deleted successfully" });
      } catch (err: any) {
        console.error("Error deleting cart item:", err);
        return res.status(500).json({ error: "Failed to delete cart item" });
      }
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (req.method === "GET") {
    console.log("Fetching cart items for user ID:", userId);
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
      console.error("Error fetching cart items:", err);
      return res.status(500).json({ error: "Error fetching cart items" });
    }
  }

  if (req.method === "POST") {
    console.log("Adding cart item for user ID:", userId);
    const { productId, variationId, sku, name, price, quantity, image } = req.body;
    console.log("Adding cart item:", req.body);
    if (!productId || !sku || !name || !price || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        console.log("Adding cart item:", req.body);
      const prodId = Number(productId);
      const qty = Number(quantity);
      const existing = await prisma.cartItem.findFirst({
        where: {
          userId,
          productId: prodId,
          variationId: variationId ? Number(variationId) : null,
        },
      });
      let cartItem;
      if (existing) {
        console.log("Updating existing cart item:", existing.id);
        cartItem = await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + qty },
        });
      } else {
        console.log("Creating new cart item");
        cartItem = await prisma.cartItem.create({
          data: {
            userId,
            productId: prodId,
            quantity: qty,
          },
        });
      }
      console.log("Cart item added:", cartItem);
      return res.status(201).json(cartItem);
    } catch (err: any) {
      console.error("Error in POST /api/cart:", err);
      return res.status(500).json({ error: "Error adding cart item" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
