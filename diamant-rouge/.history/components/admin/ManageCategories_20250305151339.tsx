// components/admin/ManageCategories.tsx

import { useState, useEffect } from "react";

/**
 * ManageCategories Component
 * - Lists categories
 * - Creates new categories
 * - Edits existing categories (slug & translations)
 * - Deletes categories
 */
export function ManageCategories() {
    // ---------- State ----------
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategorySlug, setNewCategorySlug] = useState("");
    const [translations, setTranslations] = useState([
        { language: "fr", name: "", description: "" }, // Changed default to French
        { language: "en", name: "", description: "" }  // Added English as secondary
    ]);
    const [error, setError] = useState("");
    const [editingCategory, setEditingCategory] = useState<any | null>(null);

    // ---------- Fetch Categories on Mount ----------
    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        setError("");
        try {
            const res = await fetch("/api/admin/categories");
            if (!res.ok) {
                throw new Error("Failed to fetch categories");
            }
            const data = await res.json();
            setCategories(data);
        } catch (err: any) {
            setError(err.message);
        }
    }

    // ---------- Handle Translations in Create Form ----------
    function handleTranslationChange(
        index: number,
        key: "name" | "description",
        value: string
    ) {
        const updated = [...translations];
        updated[index][key] = value;
        setTranslations(updated);
    }

    // ---------- Create Category ----------
    async function handleCreateCategory() {
        if (!newCategorySlug.trim()) {
            setError("Category slug is required.");
            return;
        }
        setError("");

        try {
            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug: newCategorySlug,
                    translations,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create category.");
            }

            // Reset form
            setNewCategorySlug("");
            setTranslations([{ language: "en", name: "", description: "" }]);
            fetchCategories();
        } catch (err: any) {
            setError(err.message);
        }
    }

    // ---------- Edit Category ----------
    async function handleEditCategory() {
        if (!editingCategory) return;
        setError("");

        try {
            const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug: editingCategory.slug,
                    translations: editingCategory.translations,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update category.");
            }

            setEditingCategory(null);
            fetchCategories();
        } catch (err: any) {
            setError(err.message);
        }
    }

    // ---------- Delete Category ----------
    async function handleDeleteCategory(id: number) {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
            if (!res.ok) {
                throw new Error("Failed to delete category.");
            }
            fetchCategories();
        } catch (err: any) {
            setError(err.message);
        }
    }

    // ---------- Render ----------
    return (
        <div className="p-6 section-light">
            <h1 className="text-3xl font-serif text-brandGold mb-4">Gérer les Catégories</h1>

            {error && <p className="text-burgundy mb-4">{error}</p>}

            {/* 1) Create Category Form */}
            <div className="mb-6 bg-burgundy/10 p-4 rounded-md">
                <h2 className="text-xl font-semibold text-richEbony mb-2">Créer une Nouvelle Catégorie</h2>
                <input
                    type="text"
                    placeholder="Identifiant de catégorie (ex: bagues, bracelets)"
                    value={newCategorySlug}
                    onChange={(e) => setNewCategorySlug(e.target.value)}
                    className="input-field w-full max-w-sm"
                />
                {translations.map((t, index) => (
                    <div key={index} className="mt-3 space-y-2">
                        <input
                            type="text"
                            placeholder={`Category Name (${t.language})`}
                            value={t.name}
                            onChange={(e) =>
                                handleTranslationChange(index, "name", e.target.value)
                            }
                            className="input-field w-full max-w-sm"
                        />
                        <input
                            type="text"
                            placeholder={`Description (${t.language})`}
                            value={t.description}
                            onChange={(e) =>
                                handleTranslationChange(index, "description", e.target.value)
                            }
                            className="input-field w-full max-w-sm"
                        />
                    </div>
                ))}

                <button onClick={handleCreateCategory} className="button-primary mt-3">
                    Create Category
                </button>
            </div>

            {/* 2) List of Existing Categories */}
            <ul className="space-y-4 mt-8">
                {categories.map((cat) => {
                    const enTrans = cat.translations.find((t: any) => t.language === "en") || {};
                    return (
                        <li
                            key={cat.id}
                            className="bg-burgundy/10 p-4 rounded-md flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
                        >
                            <div>
                                <strong className="text-richEbony">
                                    {enTrans.name || cat.slug}
                                </strong>{" "}
                                - {enTrans.description || "No description"}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setEditingCategory(cat)}
                                    className="bg-brandGold text-richEbony px-3 py-1 rounded-full hover:bg-burgundy hover:text-brandIvory transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(cat.id)}
                                    className="bg-burgundy text-brandIvory px-3 py-1 rounded-full hover:bg-brandGold hover:text-richEbony transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* 3) Edit Form (if editingCategory is set) */}
            {editingCategory && (
                <div className="mt-6 p-4 bg-burgundy/10 rounded-md">
                    <h2 className="text-xl font-serif text-brandGold mb-3">
                        Edit Category
                    </h2>
                    <input
                        type="text"
                        placeholder="Category Slug"
                        value={editingCategory.slug}
                        onChange={(e) =>
                            setEditingCategory({
                                ...editingCategory,
                                slug: e.target.value,
                            })
                        }
                        className="input-field w-full max-w-sm mb-3"
                    />

                    {editingCategory.translations.map((t: any, index: number) => (
                        <div key={index} className="mt-4 space-y-2">
                            <input
                                type="text"
                                placeholder={`Category Name (${t.language})`}
                                value={t.name}
                                onChange={(e) => {
                                    const updated = [...editingCategory.translations];
                                    updated[index].name = e.target.value;
                                    setEditingCategory({
                                        ...editingCategory,
                                        translations: updated,
                                    });
                                }}
                                className="input-field w-full max-w-sm"
                            />
                            <input
                                type="text"
                                placeholder={`Description (${t.language})`}
                                value={t.description}
                                onChange={(e) => {
                                    const updated = [...editingCategory.translations];
                                    updated[index].description = e.target.value;
                                    setEditingCategory({
                                        ...editingCategory,
                                        translations: updated,
                                    });
                                }}
                                className="input-field w-full max-w-sm"
                            />
                        </div>
                    ))}

                    <button onClick={handleEditCategory} className="button-primary mt-4">
                        Update Category
                    </button>
                </div>
            )}
        </div>
    );
}
