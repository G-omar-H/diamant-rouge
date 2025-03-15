// pages/api/admin/products.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { jwtVerify } from "jose";

interface DecodedPayload {
    id: string;
    role: string;
    email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("--- ADMIN PRODUCT MANAGEMENT ROUTE START ---");

    try {
        // -----------------------------
        // 1) Extract & verify admin session token
        // -----------------------------
        const rawCookie = req.headers.cookie || "";
        let match =
            rawCookie.match(/next-auth\.session-token=([^;]+)/) ||
            rawCookie.match(/__Secure-next-auth\.session-token=([^;]+)/);
        if (!match) throw new Error("Unauthorized: No token found");

        const tokenStr = decodeURIComponent(match[1]);
        const secret = process.env.NEXTAUTH_SECRET || "";

        const { payload: decoded } = await jwtVerify(
            tokenStr,
            new TextEncoder().encode(secret)
        );
        const user = decoded as unknown as DecodedPayload;

        if (user.role !== "admin") {
            throw new Error("Unauthorized: Admin access required");
        }

        // -----------------------------
        // 2) Handle GET => return product list
        // -----------------------------
        if (req.method === "GET") {
            console.log("✅ GET /api/admin/products => Listing products...");
            const products = await prisma.product.findMany({
                include: {
                    translations: true,
                    category: true,
                    variations: true,
                },
                orderBy: { id: "asc" },
            });

            return res.status(200).json(products);
        }

        // -----------------------------
        // 3) Handle POST => create new product
        // -----------------------------
        if (req.method === "POST") {
            console.log("✅ Creating new product...");

            const { sku, basePrice, categoryId, categorySlug, translations, variations, images, featured } =
                req.body;

            if (!sku || !basePrice || (!categoryId && !categorySlug)) {
                console.log("❌ Missing required fields:", {
                    sku,
                    basePrice,
    
                    categoryId,
                    categorySlug,
                });
                return res
                    .status(400)
                    .json({ error: "Missing required fields: SKU, Base Price, or Category." });
            }

            let assignedCategoryId = null;

            if (categoryId) {
                // Convert categoryId to integer
                assignedCategoryId = parseInt(categoryId);
            } else if (categorySlug) {
                // Find Category by Slug if only slug is provided
                const category = await prisma.category.findUnique({
                    where: { slug: categorySlug },
                });
                if (!category) {
                    console.log("❌ Invalid categorySlug provided:", categorySlug);
                    return res.status(400).json({ error: "Invalid category slug provided." });
                }
                assignedCategoryId = category.id;
            }

            // Create New Product
            const newProduct = await prisma.product.create({
                data: {
                    sku,
                    basePrice: parseFloat(basePrice),
                    categoryId: assignedCategoryId, // assign category
                    translations: {
                        create: (translations || []).map((t: any) => ({
                            language: t.language,
                            name: t.name,
                            description: t.description || "",
                        })),
                    },
                    variations: {
                        create: (variations || []).map((v: any) => ({
                            variationType: v.variationType,
                            variationValue: v.variationValue,
                            additionalPrice: parseFloat(v.additionalPrice) || 0,
                        })),
                    },
                    images: images || [],
                },
            });

            console.log("✅ Product created successfully:", newProduct);
            return res.status(201).json(newProduct);
        }

        // If neither GET nor POST
        return res.status(405).json({ error: "Method Not Allowed" });
    } catch (error: any) {
        console.error("❌ API Error:", error);
        return res.status(401).json({ error: error.message || "Unauthorized request" });
    }
}
