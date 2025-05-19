// pages/api/admin/categories.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

interface CategoryTranslation {
    language: string;
    name: string;
    description?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        // ✅ Fetch categories with their translations
        const categories = await prisma.category.findMany({
            include: { translations: true },
        });

        return res.status(200).json(categories);
    }

    if (req.method === "POST") {
        const { slug, translations } = req.body;
        if (!slug) return res.status(400).json({ error: "Category slug is required" });

        // ✅ Create category and its translations
        const category = await prisma.category.create({
            data: {
                slug,
                translations: {
                    create: translations.map((t: CategoryTranslation) => ({
                        language: t.language,
                        name: t.name,
                        description: t.description || "",
                    })),
                },
            },
            include: { translations: true }, // ✅ Return translations in response
        });

        return res.status(201).json(category);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
