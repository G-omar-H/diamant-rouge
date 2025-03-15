// components/admin/ManageCategories.tsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiTrash2, FiX, FiPlus, FiCheck, FiAlertCircle } from "react-icons/fi";

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
        { language: "fr", name: "", description: "" },
        { language: "en", name: "", description: "" }
    ]);
    const [error, setError] = useState("");
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState("");

    // ---------- Fetch Categories on Mount ----------
    useEffect(() => {
        fetchCategories();
    }, []);

    // Success message auto-dismiss
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    async function fetchCategories() {
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/categories");
            if (!res.ok) {
                throw new Error("Échec du chargement des catégories");
            }
            const data = await res.json();
            setCategories(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    // Other functions with loading and success feedback...
    async function handleCreateCategory() {
        if (!newCategorySlug.trim()) {
            setError("L'identifiant de catégorie est requis.");
            return;
        }
        
        setIsSubmitting(true);
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
                throw new Error("Échec de la création de la catégorie");
            }

            // Reset form
            setNewCategorySlug("");
            setTranslations([
                { language: "fr", name: "", description: "" },
                { language: "en", name: "", description: "" }
            ]);
            
            await fetchCategories();
            setSuccessMessage("Catégorie créée avec succès");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    // Updated UI with consistent styling and animations
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-serif text-brandGold">Gestion des Catégories</h1>
                    <p className="text-platinumGray mt-1">Organisez votre collection par catégories</p>
                </div>
            </div>
            
            {/* Feedback Messages */}
            <AnimatePresence>
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-burgundy/10 border border-burgundy/20 text-burgundy px-4 py-3 rounded-md flex items-center"
                    >
                        <FiAlertCircle className="mr-2" size={18} />
                        {error}
                    </motion.div>
                )}
                
                {successMessage && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-center"
                    >
                        <FiCheck className="mr-2" size={18} />
                        {successMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Category Form with improved styling */}
            <div className="bg-white/50 backdrop-blur-sm border border-brandGold/20 rounded-lg p-6 shadow-luxury">
                <h2 className="text-xl font-serif text-brandGold mb-4">Créer une Nouvelle Catégorie</h2>
                
                {/* Form content... */}
            </div>

            {/* Category List with loading state */}
            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-t-brandGold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-platinumGray">Chargement des catégories...</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white/50 backdrop-blur-sm border border-brandGold/20 rounded-lg overflow-hidden shadow-luxury">
                    {/* Category list content... */}
                </div>
            )}

            {/* Delete Confirmation Modal with animation */}
            <AnimatePresence>
                {showDeleteConfirm !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-richEbony/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        {/* Modal content... */}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}