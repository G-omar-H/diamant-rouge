// components/admin/ManageProducts.tsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 1) Types
type AdminProduct = {
    id: number;
    sku: string;
    basePrice: string;
    featured: boolean;
    images: string[];
    categoryId?: number | null;
    translations: {
        language: string;
        name: string;
        description?: string;
    }[];
};

type Category = {
    id: number;
    slug: string;
    translations: {
        language: string;
        name: string;
        description?: string;
    }[];
};

type Variation = {
    variationType: string;
    variationValue: string;
    additionalPrice: number;
};

// 2) Top-level ManageProducts Component
export function ManageProducts() {
    // -----------------------------
    // State: product list, categories, error, loading
    // -----------------------------
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // -----------------------------
    // State: Current mode => "list", "create", "edit", "delete"
    // plus any product in focus
    // -----------------------------
    const [mode, setMode] = useState<"list" | "create" | "edit" | "delete">("list");
    const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);

    // -----------------------------
    // State for the form data (create/edit)
    // Could be separate states if you prefer
    // -----------------------------
    const [formData, setFormData] = useState<{
        id?: number;
        sku: string;
        basePrice: string;
        featured: false,
        categoryId: string;
        translations: {
            language: string;
            name: string;
            description: string;
        }[];
        variations: Variation[];
        images: string[];
    }>({
        sku: "",
        basePrice: "",
        
        categoryId: "",
        translations: [{ language: "en", name: "", description: "" }],
        variations: [],
        images: [],
    });

    // -----------------------------
    // On mount => fetch products and categories
    // -----------------------------
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    async function fetchProducts() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/products?all=true");
            // or your custom endpoint
            const data = await res.json();
            if (res.ok) {
                setProducts(data);
            } else {
                setError(data.error || "Failed to fetch products.");
            }
        } catch (err) {
            console.error(err);
            setError("Error fetching products.");
        } finally {
            setLoading(false);
        }
    }

    async function fetchCategories() {
        try {
            const res = await fetch("/api/admin/categories");
            const data = await res.json();
            if (res.ok) {
                setCategories(data);
            }
        } catch (err) {
            console.error(err);
            // not crucial enough to show error here
        }
    }

    // -----------------------------
    // Handler: create new product
    // -----------------------------
    async function handleCreateProduct() {
        setLoading(true);
        setError("");
        // Basic validations
        if (!formData.sku || !formData.basePrice || !formData.categoryId) {
            setError("SKU, Base Price, and Category are required.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sku: formData.sku,
                    basePrice: formData.basePrice,
                    categoryId: formData.categoryId,
                    translations: formData.translations,
                    variations: formData.variations,
                    images: formData.images,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create product.");
            }
            // success => refresh list
            await fetchProducts();
            setMode("list");
            resetForm();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // -----------------------------
    // Handler: edit existing product
    // -----------------------------
    async function handleUpdateProduct() {
        if (!selectedProduct) return;
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/admin/products/${selectedProduct.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sku: formData.sku,
                    basePrice: formData.basePrice,
                    categoryId: formData.categoryId,
                    translations: formData.translations,
                    images: formData.images,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update product.");
            }
            // success
            await fetchProducts();
            setMode("list");
            resetForm();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // -----------------------------
    // Handler: delete product
    // -----------------------------
    async function handleDeleteProduct() {
        if (!selectedProduct) return;
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/admin/products/${selectedProduct.id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete product.");
            }
            // success
            await fetchProducts();
            setMode("list");
            resetForm();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // -----------------------------
    // Helper: initialize form from existing product or empty
    // -----------------------------
    function loadFormForEdit(product: AdminProduct) {
        setFormData({
            sku: product.sku,
            basePrice: product.basePrice.toString(),
            categoryId: product.categoryId ? product.categoryId.toString() : "",
            translations: product.translations.map((t) => ({
                language: t.language,
                name: t.name,
                description: t.description || "",
            })),
            variations: [], // if you'd like to handle variations here
            images: product.images || [],
        });
    }

    function resetForm() {
        setFormData({
            sku: "",
            basePrice: "",
            categoryId: "",
            translations: [{ language: "en", name: "", description: "" }],
            variations: [],
            images: [],
        });
        setSelectedProduct(null);
    }

    // -----------------------------
    // Render
    // -----------------------------
    return (
        <div className="p-6 min-h-screen section-light">
            <h1 className="text-3xl font-serif text-brandGold mb-6">
                Manage Products
            </h1>

            {error && (
                <p className="text-burgundy mb-4 font-semibold">
                    {error}
                </p>
            )}

            {/* Show Different Sections Conditionally */}
            {mode === "list" && (
                <div>
                    <button
                        onClick={() => {
                            resetForm();
                            setMode("create");
                        }}
                        className="button-primary mb-6"
                    >
                        + Add New Product
                    </button>

                    {loading && <p className="text-platinumGray">Loading...</p>}

                    {/* Products Table */}
                    <table className="w-full bg-burgundy/10 text-richEbony shadow-luxury rounded-lg overflow-hidden">
                        <thead className="bg-burgundy/20">
                        <tr>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">SKU</th>
                            <th className="p-3 text-left">Name (EN)</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((prod) => {
                            const enTranslation = prod.translations.find(
                                (t) => t.language === "en"
                            );
                            return (
                                <tr
                                    key={prod.id}
                                    className="border-b border-platinumGray/30 hover:bg-burgundy/10 transition"
                                >
                                    <td className="p-3">{prod.id}</td>
                                    <td className="p-3">{prod.sku}</td>
                                    <td className="p-3">{enTranslation?.name || "No EN name"}</td>
                                    <td className="p-3">€{prod.basePrice}</td>
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => {
                                                setSelectedProduct(prod);
                                                loadFormForEdit(prod);
                                                setMode("edit");
                                            }}
                                            className="text-burgundy hover:text-brandGold mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedProduct(prod);
                                                setMode("delete");
                                            }}
                                            className="text-burgundy hover:text-brandGold"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}

            {mode === "create" && (
                <CreateOrEditForm
                    formData={formData}
                    setFormData={setFormData}
                    categories={categories}
                    loading={loading}
                    onCancel={() => {
                        setMode("list");
                        resetForm();
                    }}
                    onSubmit={handleCreateProduct}
                />
            )}

            {mode === "edit" && (
                <CreateOrEditForm
                    formData={formData}
                    setFormData={setFormData}
                    categories={categories}
                    loading={loading}
                    onCancel={() => {
                        setMode("list");
                        resetForm();
                    }}
                    onSubmit={handleUpdateProduct}
                    isEditMode={true}
                />
            )}

            {mode === "delete" && selectedProduct && (
                <DeleteConfirm
                    product={selectedProduct}
                    loading={loading}
                    onCancel={() => {
                        setMode("list");
                        resetForm();
                    }}
                    onDelete={handleDeleteProduct}
                />
            )}
        </div>
    );
}

/*
  CreateOrEditForm
  A sub-component to handle the create/edit form logic
*/
function CreateOrEditForm({
                              formData,
                              setFormData,
                              categories,
                              loading,
                              onCancel,
                              onSubmit,
                              isEditMode = false,
                          }: {
    formData: {
        sku: string;
        basePrice: string;
        categoryId: string;
        translations: {
            language: string;
            name: string;
            description: string;
        }[];
        images: string[];
        variations: Variation[];
    };
    setFormData: React.Dispatch<
        React.SetStateAction<{
            sku: string;
            basePrice: string;
            categoryId: string;
            translations: { language: string; name: string; description: string }[];
            images: string[];
            variations: Variation[];
        }>
    >;
    categories: Category[];
    loading: boolean;
    onCancel: () => void;
    onSubmit: () => void;
    isEditMode?: boolean;
}) {
    // simpler handlers for each input
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleTranslationChange(
        index: number,
        field: "name" | "description",
        value: string
    ) {
        setFormData((prev) => {
            const newTrans = [...prev.translations];
            newTrans[index] = { ...newTrans[index], [field]: value };
            return { ...prev, translations: newTrans };
        });
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        if (!file) return;

        // For demonstration. You might handle an actual /api/upload-image call
        const imageForm = new FormData();
        imageForm.append("file", file);

        try {
            const res = await fetch("/api/upload-image", {
                method: "POST",
                body: imageForm,
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Image upload failed.");
            }
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, data.imageUrl],
            }));
        } catch (err) {
            console.error(err);
            // handle error
        }
    }

    function handleRemoveImage(idx: number) {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== idx),
        }));
    }

    return (
        <div className="bg-burgundy/10 p-6 rounded-lg shadow-luxury">
            <h2 className="text-2xl font-serif text-brandGold mb-4">
                {isEditMode ? "Edit Product" : "Create Product"}
            </h2>

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

            {/* Category */}
            <div className="mb-4">
                <label className="block font-medium text-richEbony">Category</label>
                <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="input-field w-full"
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => {
                        const enTrans = cat.translations.find((t) => t.language === "en");
                        return (
                            <option key={cat.id} value={cat.id}>
                                {enTrans?.name || cat.slug}
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* Translations */}
            <h3 className="text-xl text-brandGold mt-4 mb-2">Translations</h3>
            {formData.translations.map((t, i) => (
                <div key={i} className="mb-4">
                    <label className="block font-medium text-richEbony">
                        Language: {t.language}
                    </label>
                    <input
                        value={t.name}
                        onChange={(e) => handleTranslationChange(i, "name", e.target.value)}
                        className="input-field w-full mt-1"
                        placeholder="Product Name"
                    />
                    <textarea
                        value={t.description}
                        onChange={(e) => handleTranslationChange(i, "description", e.target.value)}
                        className="input-field w-full mt-2"
                        placeholder="Description"
                    />
                </div>
            ))}

            {/* Images */}
            <h3 className="text-xl text-brandGold mt-4 mb-2">Images</h3>
            <input type="file" onChange={handleImageUpload} className="input-field w-full" />
            <div className="flex gap-2 mt-2">
                {formData.images.map((url, idx) => (
                    <div key={idx} className="relative">
                        <img
                            src={url}
                            alt="img"
                            className="w-16 h-16 object-cover rounded-md"
                        />
                        <button
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-0 right-0 bg-burgundy text-brandIvory rounded-full w-6 h-6 flex items-center justify-center hover:bg-brandGold hover:text-richEbony transition"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-4">
                <button
                    onClick={onSubmit}
                    disabled={loading}
                    className="button-primary"
                >
                    {loading ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
                </button>
                <button onClick={onCancel} className="button-secondary">
                    Cancel
                </button>
            </div>
        </div>
    );
}

/*
  DeleteConfirm
  A simple confirmation UI for product deletion
*/
function DeleteConfirm({
                           product,
                           loading,
                           onCancel,
                           onDelete,
                       }: {
    product: AdminProduct;
    loading: boolean;
    onCancel: () => void;
    onDelete: () => void;
}) {
    const enTranslation = product.translations.find((t) => t.language === "en");

    return (
        <div className="bg-burgundy/10 p-6 rounded-lg shadow-luxury">
            <h2 className="text-2xl font-serif text-burgundy mb-4">
                Confirm Deletion
            </h2>
            <p className="text-platinumGray mb-4">
                Are you sure you want to delete{" "}
                <strong>{enTranslation?.name || product.sku}</strong>?
            </p>
            <div className="flex gap-6">
                <button
                    onClick={onDelete}
                    disabled={loading}
                    className="button-primary"
                >
                    {loading ? "Deleting..." : "Delete"}
                </button>
                <button onClick={onCancel} className="button-secondary">
                    Cancel
                </button>
            </div>
        </div>
    );
}
