// pages/admin/products/[id]/edit.tsx

import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../../lib/prisma";
import { useState } from "react";
import { useRouter } from "next/router";

export default function EditProductPage({
                                            product,
                                            categories,
                                        }: {
    product: any;
    categories: any[];
}) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        sku: product.sku,
        basePrice: product.basePrice.toString(),
        categoryId: product.categoryId || "",
        translations: product.translations || [],
        images: product.images || [],
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTranslationChange = (
        index: number,
        key: string,
        value: string
    ) => {
        const updatedTranslations = [...formData.translations];
        updatedTranslations[index][key] = value;
        setFormData((prev) => ({ ...prev, translations: updatedTranslations }));
    };

    const handleImageUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file) {
            setError("No file selected");
            return;
        }

        const imageForm = new FormData();
        imageForm.append("file", file);

        try {
            const response = await fetch("/api/upload-image", {
                method: "POST",
                body: imageForm,
            });

            const data = await response.json();

            if (response.ok) {
                setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, data.imageUrl],
                }));
            } else {
                setError(data.error || "Image upload failed");
            }
        } catch (err) {
            setError("An error occurred while uploading the image.");
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/admin/products/${product.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error("Failed to update product");
            }

            router.push("/admin/products");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="section-light min-h-screen p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-serif text-brandGold mb-6">
                Edit Product
            </h1>

            {/* SKU & Price */}
            <div className="mb-4">
                <label className="block font-medium text-richEbony">SKU</label>
                <input
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="input-field w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block font-medium text-richEbony">
                    Base Price (€)
                </label>
                <input
                    name="basePrice"
                    type="number"
                    value={formData.basePrice}
                    onChange={handleInputChange}
                    className="input-field w-full"
                />
            </div>

            {/* Category Selection */}
            <div className="mb-4">
                <label className="block font-medium text-richEbony">Category</label>
                <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="input-field w-full"
                >
                    <option value="">Select a category</option>
                    {categories.map((category: any) => (
                        <option key={category.id} value={category.id}>
                            {category.translations.find((t: any) => t.language === "en")
                                ?.name || category.slug}
                        </option>
                    ))}
                </select>
            </div>

            {/* Translations */}
            <h3 className="text-xl text-brandGold mt-6 mb-2">Translations</h3>
            {formData.translations.map((t: any, index: number) => (
                <div key={index} className="mb-4">
                    <label className="block font-medium text-richEbony">
                        Language ({t.language})
                    </label>
                    <input
                        value={t.name}
                        onChange={(e) =>
                            handleTranslationChange(index, "name", e.target.value)
                        }
                        className="input-field w-full"
                        placeholder="Product Name"
                    />
                    <textarea
                        value={t.description}
                        onChange={(e) =>
                            handleTranslationChange(index, "description", e.target.value)
                        }
                        className="input-field w-full mt-2"
                        placeholder="Description"
                    />
                </div>
            ))}

            {/* Image Upload */}
            <h3 className="text-xl text-brandGold mt-6 mb-2">Product Images</h3>
            <input
                type="file"
                onChange={handleImageUpload}
                className="input-field w-full"
            />

            {/* Image Preview with Remove Button */}
            <div className="flex gap-2 mt-3">
                {formData.images.map((url: string, index: number) => (
                    <div key={index} className="relative">
                        <img
                            src={url}
                            alt="Uploaded"
                            className="w-16 h-16 object-cover rounded-md"
                        />
                        <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-0 right-0 bg-burgundy text-brandIvory rounded-full w-6 h-6 flex items-center justify-center hover:bg-brandGold hover:text-richEbony transition"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {error && <p className="text-burgundy mt-4">{error}</p>}

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="button-primary mt-6"
            >
                {loading ? "Updating..." : "Update Product"}
            </button>
        </main>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session || session.user.role !== "admin") {
        return { redirect: { destination: "/", permanent: false } };
    }

    const { id } = context.params!;
    const rawProduct = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: { translations: true },
    });

    const rawCategories = await prisma.category.findMany({
        include: { translations: true },
    });

    if (!rawProduct) {
        return { notFound: true };
    }

    // Convert date fields
    const product = JSON.parse(JSON.stringify(rawProduct));
    const categories = rawCategories.map((cat) => ({
        ...cat,
        createdAt: cat.createdAt.toISOString(),
        updatedAt: cat.updatedAt.toISOString(),
    }));

    return { props: { product, categories } };
};
