import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";

interface CategoryTranslation {
    language: string;
    name: string;
    description?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === "PUT") {
        const { slug, translations } = req.body;

        try {
            await prisma.categoryTranslation.deleteMany({
                where: { categoryId: Number(id) },
            });

            const updatedCategory = await prisma.category.update({
                where: { id: Number(id) },
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
                include: { translations: true },
            });

            return res.status(200).json(updatedCategory);
        } catch (error) {
            return res.status(500).json({ error: "Failed to update category." });
        }
    }

    if (req.method === "DELETE") {
        try {
            await prisma.categoryTranslation.deleteMany({
                where: { categoryId: Number(id) },
            });

            await prisma.category.delete({
                where: { id: Number(id) },
            });

            return res.status(200).json({ message: "Category deleted successfully." });
        } catch (error) {
            return res.status(500).json({ error: "Failed to delete category." });
        }
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
