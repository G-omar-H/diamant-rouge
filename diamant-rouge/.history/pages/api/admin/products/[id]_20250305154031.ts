// /pages/api/admin/products/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const productId = Number(id);

    if (!productId) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    try {
        if (req.method === 'PUT') {
            const { sku, basePrice, categoryId, translations, images, featured } = req.body;

            // ✅ Validate required fields
            if (!sku || !basePrice) {
                return res.status(400).json({ error: "SKU and Base Price are required." });
            }

            // ✅ Ensure categoryId is either a valid integer or null
            const parsedCategoryId = categoryId ? parseInt(categoryId) : null;

            // ✅ Clean translations (remove unnecessary IDs)
            const cleanedTranslations = translations.map(({ id, ...rest }) => rest);

            // ✅ Update product in a transaction to maintain integrity
            const updatedProduct = await prisma.$transaction(async (tx) => {
                // ✅ Step 1: Delete existing translations
                await tx.productTranslation.deleteMany({ where: { productId } });

                // ✅ Step 2: Update product
                const product = await tx.product.update({
                    where: { id: productId },
                    data: {
                        sku,
                        basePrice: parseFloat(basePrice),
                        featured: featured || false,
                        categoryId: parsedCategoryId,
                        images: Array.isArray(images) ? images : [],
                    },
                    include: { category: true, variations: true },
                });

                // ✅ Step 3: Recreate translations
                await tx.productTranslation.createMany({
                    data: cleanedTranslations.map((t) => ({
                        ...t,
                        productId,
                    })),
                });

                return product;
            });

            return res.status(200).json(updatedProduct);
        }

        if (req.method === 'DELETE') {
            // ✅ Ensure product exists before attempting deletion
            const existingProduct = await prisma.product.findUnique({ where: { id: productId } });

            if (!existingProduct) {
                return res.status(404).json({ error: "Product not found." });
            }

            // ✅ Delete related records in a transaction
            await prisma.$transaction(async (tx) => {
                await tx.productTranslation.deleteMany({ where: { productId } });
                await tx.productVariation.deleteMany({ where: { productId } });
                await tx.product.delete({ where: { id: productId } });
            });

            return res.status(200).json({ message: "Product deleted successfully." });
        }

        return res.status(405).json({ error: "Method Not Allowed" });
    } catch (error) {
        console.error("❌ API Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
