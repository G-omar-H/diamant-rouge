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
    // Basic state
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Form state
    const [newProduct, setNewProduct] = useState<Partial<AdminProduct>>({
        sku: "",
        basePrice: "",
        featured: false,
        categoryId: null,
        translations: [{ language: "fr", name: "", description: "" }],
        images: [],
    });
    
    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
    
    // Fetch all products and categories on component mount
    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                
                // Fetch products
                const productsRes = await fetch("/api/admin/products");
                if (!productsRes.ok) throw new Error("Erreur lors du chargement des produits");
                const productsData = await productsRes.json();
                
                // Fetch categories
                const categoriesRes = await fetch("/api/admin/categories");
                if (!categoriesRes.ok) throw new Error("Erreur lors du chargement des catégories");
                const categoriesData = await categoriesRes.json();
                
                setProducts(productsData);
                setCategories(categoriesData);
                setError("");
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchData();
    }, []);
    
    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };
    
    // Handle edit form input changes
    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (!editingProduct) return;
        
        const { name, value } = e.target;
        setEditingProduct((prev) => {
            if (!prev) return prev;
            return { ...prev, [name]: value };
        });
    };
    
    // Handle checkbox changes
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: checked }));
    };
    
    // Handle edit checkbox changes
    const handleEditCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingProduct) return;
        
        const { name, checked } = e.target;
        setEditingProduct((prev) => {
            if (!prev) return prev;
            return { ...prev, [name]: checked };
        });
    };
    
    // Handle translation changes
    const handleTranslationChange = (index: number, field: string, value: string) => {
        setNewProduct((prev) => {
            const translations = [...(prev.translations || [])];
            translations[index] = { ...translations[index], [field]: value };
            return { ...prev, translations };
        });
    };
    
    // Handle edit translation changes
    const handleEditTranslationChange = (index: number, field: string, value: string) => {
        if (!editingProduct) return;
        
        setEditingProduct((prev) => {
            if (!prev) return prev;
            
            const translations = [...prev.translations];
            translations[index] = { ...translations[index], [field]: value };
            return { ...prev, translations };
        });
    };
    
    // Add product function
    const addProduct = async () => {
        try {
            setIsSubmitting(true);
            
            const res = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newProduct,
                    basePrice: parseFloat(newProduct.basePrice || "0"),
                    featured: newProduct.featured || false,
                }),
            });
            
            if (!res.ok) throw new Error("Erreur lors de la création du produit");
            
            const newlyAddedProduct = await res.json();
            setProducts([...products, newlyAddedProduct]);
            
            // Reset form and close modal
            setNewProduct({
                sku: "",
                basePrice: "",
                featured: false,
                categoryId: null,
                translations: [{ language: "fr", name: "", description: "" }],
                images: [],
            });
            setShowAddModal(false);
            
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Update product function
    const updateProduct = async () => {
        if (!editingProduct) return;
        
        try {
            setIsSubmitting(true);
            
            const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...editingProduct,
                    basePrice: parseFloat(editingProduct.basePrice || "0"),
                    featured: editingProduct.featured || false,
                }),
            });
            
            if (!res.ok) throw new Error("Erreur lors de la mise à jour du produit");
            
            const updatedProduct = await res.json();
            
            // Update products list
            setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
            
            // Close modal
            setEditingProduct(null);
            
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Delete product function
    const deleteProduct = async (productId: number) => {
        try {
            setIsSubmitting(true);
            
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: "DELETE",
            });
            
            if (!res.ok) throw new Error("Erreur lors de la suppression du produit");
            
            // Remove from products list
            setProducts(products.filter(p => p.id !== productId));
            setShowDeleteConfirm(null);
            
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Render products table
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-brandGold">Gérer les Produits</h1>
                <button
                    className="px-4 py-2 bg-brandGold text-richEbony hover:bg-burgundy hover:text-brandIvory transition duration-300"
                    onClick={() => setShowAddModal(true)}
                >
                    + Ajouter un Produit
                </button>
            </div>
            
            {error && <p className="text-burgundy mb-4">{error}</p>}
            
            {isLoading ? (
                <p>Chargement...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                        <thead className="bg-burgundy/10 text-richEbony">
                            <tr>
                                <th className="p-3 text-left">SKU</th>
                                <th className="p-3 text-left">Nom</th>
                                <th className="p-3 text-right">Prix</th>
                                <th className="p-3 text-center">En Vedette</th>
                                <th className="p-3 text-center">Catégorie</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => {
                                // Get the French translation or fall back to first translation
                                const frenchName = product.translations.find(t => t.language === "fr")?.name || 
                                                  product.translations[0]?.name || "Sans nom";
                                
                                // Find category name if available
                                const category = categories.find(c => c.id === product.categoryId);
                                const categoryName = category ? 
                                    (category.translations.find(t => t.language === "fr")?.name || 
                                     category.translations[0]?.name || category.slug) : 
                                    "Aucune";
                                
                                return (
                                    <tr key={product.id} className="border-b border-gray-200 hover:bg-burgundy/5">
                                        <td className="p-3">{product.sku}</td>
                                        <td className="p-3">{frenchName}</td>
                                        <td className="p-3 text-right">{parseFloat(product.basePrice).toLocaleString('fr-FR')} MAD</td>
                                        <td className="p-3 text-center">
                                            {product.featured ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brandGold text-richEbony">
                                                    Oui
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    Non
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3 text-center">{categoryName}</td>
                                        <td className="p-3 text-center">
                                            <button 
                                                onClick={() => setEditingProduct(product)}
                                                className="text-brandGold hover:text-burgundy mr-2"
                                            >
                                                Modifier
                                            </button>
                                            <button 
                                                onClick={() => setShowDeleteConfirm(product.id)}
                                                className="text-burgundy hover:text-brandGold"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            
            {/* Add Product Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-xl font-bold text-brandGold mb-4">Ajouter un Nouveau Produit</h2>
                            
                            <div className="space-y-4">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-richEbony mb-1">
                                            SKU
                                        </label>
                                        <input
                                            type="text"
                                            name="sku"
                                            value={newProduct.sku}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-platinumGray/30 focus:ring-1 focus:ring-brandGold"
                                            placeholder="Référence unique"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-richEbony mb-1">
                                            Prix (MAD)
                                        </label>
                                        <input
                                            type="number"
                                            name="basePrice"
                                            value={newProduct.basePrice}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-platinumGray/30 focus:ring-1 focus:ring-brandGold"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                
                                {/* Category & Featured Flag */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-richEbony mb-1">
                                            Catégorie
                                        </label>
                                        <select
                                            name="categoryId"
                                            value={newProduct.categoryId || ""}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-platinumGray/30 focus:ring-1 focus:ring-brandGold"
                                        >
                                            <option value="">Sélectionner une catégorie</option>
                                            {categories.map((cat) => {
                                                const catName = cat.translations.find(t => t.language === "fr")?.name || 
                                                               cat.translations[0]?.name || cat.slug;
                                                return (
                                                    <option key={cat.id} value={cat.id}>
                                                        {catName}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            name="featured"
                                            checked={!!newProduct.featured}
                                            onChange={handleCheckboxChange}
                                            className="h-4 w-4 text-brandGold border-platinumGray/30 focus:ring-brandGold"
                                        />
                                        <label htmlFor="featured" className="ml-2 block text-sm text-richEbony">
                                            Produit en Vedette (affiché sur la page d'accueil)
                                        </label>
                                    </div>
                                </div>
                                
                                {/* French Translation */}
                                <div className="border-t border-platinumGray/20 pt-4 mt-4">
                                    <h3 className="text-md font-semibold text-richEbony mb-2">Traduction Française</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-richEbony mb-1">
                                                Nom du Produit
                                            </label>
                                            <input
                                                type="text"
                                                value={newProduct.translations?.[0]?.name || ""}
                                                onChange={(e) => handleTranslationChange(0, "name", e.target.value)}
                                                className="w-full p-2 border border-platinumGray/30 focus:ring-1 focus:ring-brandGold"
                                                placeholder="Nom du produit"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-richEbony mb-1">
                                                Description
                                            </label>
                                            <textarea
                                                value={newProduct.translations?.[0]?.description || ""}
                                                onChange={(e) => handleTranslationChange(0, "description", e.target.value)}
                                                className="w-full p-2 border border-platinumGray/30 focus:ring-1 focus:ring-brandGold h-24"
                                                placeholder="Description du produit"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Images - Basic implementation */}
                                <div className="border-t border-platinumGray/20 pt-4 mt-4">
                                    <h3 className="text-md font-semibold text-richEbony mb-2">Images</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-richEbony mb-1">
                                                URL de l'image
                                            </label>
                                            <input
                                                type="text"
                                                value={newProduct.images?.[0] || ""}
                                                onChange={(e) => {
                                                    const newImages = [...(newProduct.images || [])];
                                                    newImages[0] = e.target.value;
                                                    setNewProduct({...newProduct, images: newImages});
                                                }}
                                                className="w-full p-2 border border-platinumGray/30 focus:ring-1 focus:ring-brandGold"
                                                placeholder="URL de l'image principale"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-platinumGray hover:text-richEbony"
                                    disabled={isSubmitting}
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={addProduct}
                                    className="px-4 py-2 bg-brandGold text-richEbony hover:bg-burgundy hover:text-brandIvory transition duration-300"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "En cours..." : "Ajouter le Produit"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Edit Product Modal */}
            <AnimatePresence>
                {editingProduct && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-xl font-bold text-brandGold mb-4">Modifier le Produit</h2>
                            
                            <div className="space-y-4">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-richEbony mb-1">
                                            SKU
                                        </label>
                                        <input
                                            type="text"
                                            name="sku"
                                            value={editingProduct.sku}
                                            onChange={handleEditInputChange}
                                            className="w-full p-2 border border-platinumGray/30 focus:ring-1 focus:ring-brandGold"
                                            placeholder="Référence unique"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-richEbony mb-1">
                                            Prix (MAD)
                                        </label>
                                        <input
                                            type="number"
                                            name="basePrice"
                                            value={editingProduct.basePrice}
                                            onChange={handleEditInputChange}
                                            className="w-full p-2 border border-platinumGray/30 focus:ring-1 focus:ring-brandGold"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                
                                {/* Category & Featured Flag */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-richEbony mb-1">
                                            Catégorie
                                        </label>
                                        <select
                                            name="categoryId"
                                            value={editingProduct.categoryId || ""}
                                            onChange={handleEditInputChange}
                                            className="w-full p-2 border border-platinumGray/30 focus:ring-1 focus:ring-brandGold"
                                        >
                                            <option value="">Sélectionner une catégorie</option>
                                            {categories.map((cat) => {
                                                const catName = cat.translations.find(t => t.language === "fr")?.name || 
                                                               cat.translations[0]?.name || cat.slug;
                                                return (
                                                    <option key={cat.id} value={cat.id}>
                                                        {catName}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="editFeatured"
                                            name="featured"
                                            checked={!!editingProduct.featured}
                                            onChange={handleEditCheckboxChange}
                                            className="h-4 w-4 text-brandGold border-platinumGray/30 focus:ring-brandGold"
                                        />
                                        <label htmlFor="editFeatured" className="ml-2 block text-sm text-richEbony">
                                            Produit en Vedette (affiché sur la page d'accueil)
                                        </label>
                                    </div>
                                </div>
                                
                                {/* French Translation */}
                                <div className="border-t border-platinumGray/20 pt-4 mt-4">
                                    <h3 className="text-md font-semibold text-richEbony mb-2">Traduction Française</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-richEbony mb-1">
                                                Nom du Produit
                                            </label>
                                            <input
                                                type="text"
                                                value={editingProduct.translations?.[0]?.name || ""}
                                                onChange={(e) => handleEditTranslationChange(0, "name", e.target.value)}
                                                className="w-full p-2 border border-platinumGray/30 focus:ring-1 focus:ring-brandGold"
                                                placeholder="Nom du produit"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-richEbony mb-1">
                                                Description
                                            </label>
                                            <textarea
                                                value={editingProduct.translations?.[0]?.description || ""}
                                                onChange={(e) => handleEditTranslationChange(0, "description", e.target.value)}
                                                className="w-full p-2 border border-platinumGray/30 focus:ring-1 focus:ring-brandGold h-24"
                                                placeholder="Description du produit"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Images - Basic implementation */}
                                <div className="border-t border-platinumGray/20 pt-4 mt-4">
                                    <h3 className="text-md font-semibold text-richEbony mb-2">Images</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-richEbony mb-1">
                                                URL de l'image
                                            </label>
                                            <input
                                                type="text"
                                                value={editingProduct.images?.[0] || ""}
                                                onChange={(e) => {
                                                    const newImages = [...(editingProduct.images || [])];
                                                    newImages[0] = e.target.value;
                                                    setEditingProduct({...editingProduct, images: newImages});
                                                }}
                                                className="w-full p-2 border border-platinumGray/30 focus:ring-1 focus:ring-brandGold"
                                                placeholder="URL de l'image principale"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => setEditingProduct(null)}
                                    className="px-4 py-2 text-platinumGray hover:text-richEbony"
                                    disabled={isSubmitting}
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={updateProduct}
                                    className="px-4 py-2 bg-brandGold text-richEbony hover:bg-burgundy hover:text-brandIvory transition duration-300"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "En cours..." : "Mettre à jour"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-lg p-6 w-full max-w-md"
                        >
                            <h2 className="text-xl font-bold text-burgundy mb-4">Confirmer la Suppression</h2>
                            <p className="mb-4">
                                Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
                            </p>
                            
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="px-4 py-2 text-platinumGray hover:text-richEbony"
                                    disabled={isSubmitting}
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => deleteProduct(showDeleteConfirm)}
                                    className="px-4 py-2 bg-burgundy text-brandIvory hover:bg-brandGold hover:text-richEbony transition duration-300"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Suppression..." : "Confirmer la Suppression"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}