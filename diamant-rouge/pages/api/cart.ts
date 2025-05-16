// pages/api/cart.ts

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("--- CART API START ---");

  // Get user session first using NextAuth's session handling
  const session = await getServerSession(req, res, authOptions);
  
  // If there's a session, use the user ID from it
  if (session?.user?.id) {
    const userId = Number(session.user.id);
    
    // Use query parameters for specific operations
    const { id, clear } = req.query;
    console.log("Method:", req.method, "Query:", req.query);

    // Clear cart if DELETE with clear=true
    if (req.method === "DELETE" && clear) {
      try {
        await prisma.cartItem.deleteMany({ where: { userId } });
        return res.status(200).json({ message: "Cart cleared successfully" });
      } catch (err: any) {
        console.error("Error clearing cart:", err);
        return res.status(500).json({ error: "Failed to clear cart" });
      }
    }

    // If an "id" is provided, operate on that specific cart item
    if (id) {
      const cartItemId = Number(id);
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
            data: { quantity: Number(quantity) }, // Set the quantity directly
          });
          
          return res.status(200).json(updated);
        } catch (err: any) {
          console.error("Error updating cart item:", err);
          return res.status(500).json({ error: "Failed to update cart item" });
        }
      }
      if (req.method === "DELETE") {
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

    // For GET, return all cart items for the user
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
        console.error("Error fetching cart items:", err);
        return res.status(500).json({ error: "Error fetching cart items" });
      }
    }

    // For POST, create (or update) a cart item
    if (req.method === "POST") {
      console.log("Adding cart item for user ID:", userId);
      const { productId, variationId, quantity } = req.body;
      console.log("Adding cart item:", req.body);
      if (!productId || !quantity) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      try {
        const prodId = Number(productId);
        const qty = Number(quantity);
        console.log("Checking existing cart item");
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
              variationId: variationId ? Number(variationId) : null,
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
  } else {
    // If no session with user ID, try the token method as fallback
    const rawCookie = req.headers.cookie || "";
    let match =
      rawCookie.match(/next-auth\.session-token=([^;]+)/) ||
      rawCookie.match(/__Secure-next-auth\.session-token=([^;]+)/);
    
    if (!match) {
      return res.status(401).json({ error: "Unauthorized: No token found" });
    }
    
    const tokenStr = decodeURIComponent(match[1]);
    const secret = process.env.NEXTAUTH_SECRET || "";
    
    try {
      // Verify the token and extract payload - handle possible null payload
      const decodedResult = await jwtVerify(tokenStr, new TextEncoder().encode(secret));
      
      // First check if decodedResult exists and has payload property
      if (!decodedResult || typeof decodedResult.payload !== "object" || !decodedResult.payload) {
        console.error("Invalid token payload structure");
        return res.status(401).json({ error: "Unauthorized: Invalid token payload" });
      }
      
      // Now safely cast the payload
      const payload = decodedResult.payload as unknown as DecodedPayload;
      
      // Validate the user ID
      if (!payload.id) {
        console.error("No user ID in token payload", payload);
        return res.status(401).json({ error: "Unauthorized: No user ID in token" });
      }
      
      const userId = Number(payload.id);
      if (isNaN(userId)) {
        console.error("User ID is not a valid number:", payload.id);
        return res.status(401).json({ error: "Unauthorized: Invalid user ID in token" });
      }
      
      console.log("User authenticated via token, ID:", userId);
      
      // Now handle the request using the user ID from the token
      // This section should duplicate the logic from the session-based authentication above
      
      // Use query parameters for specific operations
      const { id, clear } = req.query;
      console.log("Method:", req.method, "Query:", req.query);

      // Clear cart if DELETE with clear=true
      if (req.method === "DELETE" && clear) {
        try {
          await prisma.cartItem.deleteMany({ where: { userId } });
          return res.status(200).json({ message: "Cart cleared successfully" });
        } catch (err: any) {
          console.error("Error clearing cart:", err);
          return res.status(500).json({ error: "Failed to clear cart" });
        }
      }

      // If an "id" is provided, operate on that specific cart item
      if (id) {
        const cartItemId = Number(id);
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
              data: { quantity: Number(quantity) },
            });
            
            return res.status(200).json(updated);
          } catch (err: any) {
            console.error("Error updating cart item:", err);
            return res.status(500).json({ error: "Failed to update cart item" });
          }
        }
        if (req.method === "DELETE") {
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

      // For GET, return all cart items for the user
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
          console.error("Error fetching cart items:", err);
          return res.status(500).json({ error: "Error fetching cart items" });
        }
      }

      // For POST, create (or update) a cart item
      if (req.method === "POST") {
        console.log("Adding cart item for user ID:", userId);
        const { productId, variationId, quantity } = req.body;
        console.log("Adding cart item:", req.body);
        if (!productId || !quantity) {
          return res.status(400).json({ error: "Missing required fields" });
        }
        try {
          const prodId = Number(productId);
          const qty = Number(quantity);
          console.log("Checking existing cart item");
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
                variationId: variationId ? Number(variationId) : null,
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
      
    } catch (err: any) {
      console.error("JWT verification error:", err);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
