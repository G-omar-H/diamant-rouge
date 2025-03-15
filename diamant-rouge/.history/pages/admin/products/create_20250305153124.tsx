// pages/admin/products/create.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function CreateProduct() {
    const router = useRouter();

    // ✅ State Management
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        sku: "",
        basePrice: "",
        categoryId: "",
        featured: false, 
        translations: [{ language: "en", name: "", description: "" }],
        variations: [],
        images: [],
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Fetch Categories on Load
    useEffect(() => {
        fetch("/api/admin/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch(() => setError("Failed to load categories"));
    }, []);

    // ✅ Handle Input Changes
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTranslationChange = (index: number, key: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            translations: prev.translations.map((t, i) =>
                i === index ? { ...t, [key]: value } : t
            ),
        }));
    };

        // Handle checkbox change
        const handleCheckboxChange = (e: any) => {
            const { name, checked } = e.target;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        };

    const addVariation = () => {
        setFormData((prev) => ({
            ...prev,
            variations: [
                ...prev.variations,
                { variationType: "", variationValue: "", additionalPrice: 0 },
            ],
        }));
    };

    const handleVariationChange = (
        index: number,
        key: string,
        value: string | number
    ) => {
        setFormData((prev) => ({
            ...prev,
            variations: prev.variations.map((v, i) =>
                i === index ? { ...v, [key]: value } : v
            ),
        }));
    };

    // ✅ Handle Image Upload
    const handleImageUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return setError("No file selected.");

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
                setError(data.error || "Image upload failed.");
            }
        } catch {
            setError("An error occurred while uploading the image.");
        }
    };

    // ✅ Remove Image from List
    const handleRemoveImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    // ✅ Handle Form Submission
    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        if (!formData.sku || !formData.basePrice || !formData.categoryId) {
            setLoading(false);
            return setError("SKU, Base Price, and Category are required.");
        }

        try {
            const resSession = await fetch("/api/auth/session");
            const sessionData = await resSession.json();
            if (!sessionData || !sessionData.user) {
                throw new Error("Unauthorized: Admin session not found");
            }

            const res = await fetch("/api/admin/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionData.user.token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to create product");

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
                Create Product
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
                <label className="block font-medium text-richEbony">Base Price (€)</label>
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
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.translations.find((t: any) => t.language === "en")?.name ||
                                cat.slug}
                        </option>
                    ))}
                </select>
            </div>

            {/* Translations */}
            <h3 className="text-xl text-brandGold mt-6 mb-2">Translations</h3>
            {formData.translations.map((t, index) => (
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

            {/* Variations */}
            <h3 className="text-xl text-brandGold mt-6 mb-2">Variations</h3>
            {formData.variations.map((v, index) => (
                <div key={index} className="mb-4 flex flex-col md:flex-row gap-2">
                    <input
                        value={v.variationType}
                        onChange={(e) =>
                            handleVariationChange(index, "variationType", e.target.value)
                        }
                        className="input-field md:w-1/3"
                        placeholder="Type (e.g., Size)"
                    />
                    <input
                        value={v.variationValue}
                        onChange={(e) =>
                            handleVariationChange(index, "variationValue", e.target.value)
                        }
                        className="input-field md:w-1/3"
                        placeholder="Value (e.g., 5)"
                    />
                    <input
                        type="number"
                        value={v.additionalPrice}
                        onChange={(e) =>
                            handleVariationChange(index, "additionalPrice", e.target.value)
                        }
                        className="input-field md:w-1/3"
                        placeholder="Extra Cost"
                    />
                </div>
            ))}
            <button onClick={addVariation} className="button-secondary">
                + Add Variation
            </button>

            {/* Image Upload */}
            <h3 className="text-xl text-brandGold mt-6 mb-2">Images</h3>
            <input type="file" onChange={handleImageUpload} className="input-field w-full" />

            {/* Image Preview with Remove Button */}
            <div className="flex gap-2 mt-3">
                {formData.images.map((url, index) => (
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
                {loading ? "Creating..." : "Create Product"}
            </button>
        </main>
    );
}
