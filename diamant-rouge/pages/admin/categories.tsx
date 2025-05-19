import { useState, useEffect } from "react";

interface Translation {
    language: string;
    name: string;
    description: string;
    [key: string]: string;
}

interface Category {
    id: string;
    slug: string;
    translations: Translation[];
}

export default function ManageCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategorySlug, setNewCategorySlug] = useState("");
    const [translations, setTranslations] = useState<Translation[]>([
        { language: "en", name: "", description: "" },
    ]);
    const [error, setError] = useState("");
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        setCategories(data);
    };

    const handleTranslationChange = (index: number, key: string, value: string) => {
        const updatedTranslations = [...translations];
        updatedTranslations[index][key] = value;
        setTranslations(updatedTranslations);
    };

    // ✅ Handle Category Creation
    const handleCreateCategory = async () => {
        if (!newCategorySlug.trim()) return setError("Category slug is required.");
        setError("");

        const res = await fetch("/api/admin/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: newCategorySlug, translations }),
        });

        if (!res.ok) {
            setError("Failed to create category.");
            return;
        }

        setNewCategorySlug("");
        setTranslations([{ language: "en", name: "", description: "" }]);
        fetchCategories();
    };

    // ✅ Handle Category Editing
    const handleEditCategory = async () => {
        if (!editingCategory) return;
        setError("");

        const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                slug: editingCategory.slug,
                translations: editingCategory.translations,
            }),
        });

        if (!res.ok) {
            setError("Failed to update category.");
            return;
        }

        setEditingCategory(null);
        fetchCategories();
    };

    // ✅ Handle Category Deletion
    const handleDeleteCategory = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });

        if (!res.ok) {
            setError("Failed to delete category.");
            return;
        }

        fetchCategories();
    };

    return (
        <section className="section-light min-h-screen p-8">
            <h1 className="text-3xl font-serif text-brandGold mb-4">
                Manage Categories
            </h1>

            {/* Category Creation */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Category Slug (e.g., rings, bracelets)"
                    value={newCategorySlug}
                    onChange={(e) => setNewCategorySlug(e.target.value)}
                    className="input-field mr-2 w-full max-w-sm"
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

                <button
                    onClick={handleCreateCategory}
                    className="button-primary mt-4"
                >
                    Create Category
                </button>
                {error && <p className="text-burgundy mt-2">{error}</p>}
            </div>

            {/* Category List */}
            <ul className="mt-4 list-disc list-inside space-y-4">
                {categories.map((category) => {
                    const translation = 
                        category.translations.find((t) => t.language === "en") || 
                        { name: "", description: "" } as Translation;

                    return (
                        <li
                            key={category.id}
                            className="flex flex-col md:flex-row md:items-center justify-between bg-burgundy/10 p-4 rounded-md"
                        >
                            <div className="text-richEbony">
                                <strong>{translation.name || category.slug}</strong> -{" "}
                                {translation.description || "No description available"}
                            </div>
                            <div className="flex gap-3 mt-2 md:mt-0">
                                <button
                                    onClick={() => setEditingCategory(category)}
                                    className="bg-brandGold text-richEbony px-3 py-1 rounded-full hover:bg-burgundy hover:text-brandIvory transition duration-300"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="bg-burgundy text-brandIvory px-3 py-1 rounded-full hover:bg-brandGold hover:text-richEbony transition duration-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* Edit Form */}
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
                            setEditingCategory({ ...editingCategory, slug: e.target.value })
                        }
                        className="input-field w-full max-w-sm mb-3"
                    />
                    {editingCategory.translations.map((t, index) => (
                        <div key={index} className="mt-4 space-y-2">
                            <input
                                type="text"
                                placeholder={`Category Name (${t.language})`}
                                value={t.name}
                                onChange={(e) => {
                                    const updatedTranslations = [...editingCategory.translations];
                                    updatedTranslations[index].name = e.target.value;
                                    setEditingCategory({
                                        ...editingCategory,
                                        translations: updatedTranslations,
                                    });
                                }}
                                className="input-field w-full max-w-sm"
                            />
                            <input
                                type="text"
                                placeholder={`Description (${t.language})`}
                                value={t.description}
                                onChange={(e) => {
                                    const updatedTranslations = [...editingCategory.translations];
                                    updatedTranslations[index].description = e.target.value;
                                    setEditingCategory({
                                        ...editingCategory,
                                        translations: updatedTranslations,
                                    });
                                }}
                                className="input-field w-full max-w-sm"
                            />
                        </div>
                    ))}
                    <button
                        onClick={handleEditCategory}
                        className="button-primary mt-4"
                    >
                        Update Category
                    </button>
                    {error && <p className="text-burgundy mt-2">{error}</p>}
                </div>
            )}
        </section>
    );
}
