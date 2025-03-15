import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiSearch, FiFilter, FiX, FiTrash2, FiEdit2, FiPlus, FiImage } from "react-icons/fi";

// Types
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

export function ManageProducts() {
    // Basic state
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Form state
    const [newProduct, setNewProduct] = useState<Partial<AdminProduct>>({
        sku: "",
        basePrice: "",
        featured: false,
        categoryId: null,
        translations: [{ language: "fr", name: "", description: "" }],
        images: [],
    });
    
    // Search and filter state
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState<number | "all">("all");
    const [filterFeatured, setFilterFeatured] = useState<boolean | "all">("all");
    
    // Image upload state
    const [isUploading, setIsUploading] = useState(false);
    
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
    const handleTranslationChange = (field: string, value: string) => {
        setNewProduct((prev) => {
            const translations = [...(prev.translations || [])];
            // Just update the first translation since French is the only language
            translations[0] = { ...translations[0], [field]: value };
            return { ...prev, translations };
        });
    };
    
    // Handle edit translation changes
    const handleEditTranslationChange = (field: string, value: string) => {
        if (!editingProduct) return;
        
        setEditingProduct((prev) => {
            if (!prev) return prev;
            
            const translations = [...prev.translations];
            // Just update the first translation since French is the only language
            translations[0] = { ...translations[0], [field]: value };
            return { ...prev, translations };
        });
    };
    
    // Handle image upload
    const handleImageUpload = async (files: FileList, isEdit = false) => {
        if (files.length === 0) return;
        
        setIsUploading(true);
        setError(""); // Clear any previous errors
        
        try {
            const formData = new FormData();
            Array.from(files).forEach((file) => {
                formData.append('images', file);
            });
            
            const response = await fetch('/api/admin/upload-image', {
                method: 'POST',
                body: formData,
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Échec de l'upload d'image");
            }
            
            const result = await response.json();
            
            if (!result.urls || !Array.isArray(result.urls)) {
                throw new Error("Format de réponse invalide");
            }
            
            // Update state with uploaded image URLs
            if (isEdit && editingProduct) {
                setEditingProduct({
                    ...editingProduct,
                    images: [...editingProduct.images, ...result.urls]
                });
            } else {
                setNewProduct({
                    ...newProduct,
                    images: [...(newProduct.images || []), ...result.urls]
                });
            }
        } catch (err: any) {
            console.error("Erreur d'upload:", err);
            setError(err.message || "Échec de l'upload d'image");
        } finally {
            setIsUploading(false);
        }
    };
    
    // Remove image
    const removeImage = (index: number, isEdit = false) => {
        if (isEdit && editingProduct) {
            const newImages = [...editingProduct.images];
            newImages.splice(index, 1);
            setEditingProduct({...editingProduct, images: newImages});
        } else {
            const newImages = [...(newProduct.images || [])];
            newImages.splice(index, 1);
            setNewProduct({...newProduct, images: newImages});
        }
    };
    
    // Add product function
    const addProduct = async () => {
        try {
            setIsSubmitting(true);
            
            // Validate required fields
            if (!newProduct.sku || !newProduct.translations?.[0]?.name) {
                setError("Le SKU et le nom du produit sont obligatoires");
                setIsSubmitting(false);
                return;
            }
            
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
            
            // Validate required fields
            if (!editingProduct.sku || !editingProduct.translations?.[0]?.name) {
                setError("Le SKU et le nom du produit sont obligatoires");
                setIsSubmitting(false);
                return;
            }
            
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
            
            // Use the original editingProduct data to update the list
            // This ensures we have all the necessary fields without relying on the API response
            setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
            
            // Close modal
            setEditingProduct(null);
            
        } catch (err: any) {
            console.error("Update product error:", err);
            setError(err.message || "Une erreur s'est produite lors de la mise à jour");
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

    // Filter products based on search term and filters
    const filteredProducts = products.filter(product => {
        const matchesSearch = searchTerm === "" || 
            product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.translations?.[0]?.name.toLowerCase().includes(searchTerm.toLowerCase());
            
        const matchesCategory = filterCategory === "all" || product.categoryId === filterCategory;
        
        const matchesFeatured = filterFeatured === "all" || product.featured === filterFeatured;
        
        return matchesSearch && matchesCategory && matchesFeatured;
    });
    
    // Reset all filters
    const resetFilters = () => {
        setSearchTerm("");
        setFilterCategory("all");
        setFilterFeatured("all");
    };
    
    // Render products table with enhanced UI
    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-serif text-brandGold">Collection de Produits</h1>
                    <p className="text-platinumGray mt-1">Gérez votre catalogue de bijoux d'exception</p>
                </div>
                <button
                    className="px-4 py-2 bg-brandGold/90 text-richEbony hover:bg-brandGold transition-colors duration-300 flex items-center gap-2 rounded-md shadow-subtle"
                    onClick={() => setShowAddModal(true)}
                >
                    <FiPlus size={18} />
                    <span>Ajouter un Produit</span>
                </button>
            </div>
            
            {error && (
                <div className="bg-burgundy/10 border border-burgundy/20 text-burgundy px-4 py-3 rounded-md">
                    {error}
                </div>
            )}
            
            {/* Search and Filters */}
            <div className="bg-white/50 backdrop-blur-sm border border-brandGold/20 rounded-lg p-4 shadow-luxury">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search input */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-platinumGray" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold focus:border-brandGold bg-white/70"
                        />
                    </div>
                    
                    {/* Category filter */}
                    <div>
                        <select
                            value={filterCategory === "all" ? "all" : filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value === "all" ? "all" : Number(e.target.value))}
                            className="px-4 py-2 w-full border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold bg-white/70"
                        >
                            <option value="all">Toutes les catégories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.translations[0]?.name || cat.slug}</option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Featured filter */}
                    <div>
                        <select
                            value={filterFeatured === "all" ? "all" : filterFeatured ? "true" : "false"}
                            onChange={(e) => {
                                if (e.target.value === "all") setFilterFeatured("all");
                                else setFilterFeatured(e.target.value === "true");
                            }}
                            className="px-4 py-2 w-full border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold bg-white/70"
                        >
                            <option value="all">Tous les produits</option>
                            <option value="true">En vedette</option>
                            <option value="false">Standards</option>
                        </select>
                    </div>
                    
                    {/* Reset filters */}
                    <div className="flex justify-end">
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 border border-platinumGray/30 text-platinumGray hover:text-richEbony hover:border-platinumGray transition-colors duration-200 rounded-md flex items-center gap-2"
                        >
                            <FiX size={18} />
                            <span>Réinitialiser</span>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Products List */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-t-brandGold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-platinumGray">Chargement de votre collection...</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white/50 backdrop-blur-sm border border-brandGold/20 rounded-lg overflow-hidden shadow-luxury">
                    {filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <p className="text-platinumGray text-lg">Aucun produit trouvé</p>
                            <button 
                                onClick={resetFilters}
                                className="mt-4 px-4 py-2 text-brandGold border border-brandGold/30 hover:bg-brandGold/10 rounded-md transition-colors duration-200"
                            >
                                Réinitialiser les filtres
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-richEbony/5 text-richEbony">
                                    <tr>
                                        <th className="p-4 text-left font-serif">Image</th>
                                        <th className="p-4 text-left font-serif">SKU</th>
                                        <th className="p-4 text-left font-serif">Nom</th>
                                        <th className="p-4 text-right font-serif">Prix</th>
                                        <th className="p-4 text-center font-serif">En Vedette</th>
                                        <th className="p-4 text-center font-serif">Catégorie</th>
                                        <th className="p-4 text-center font-serif">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => {
                                        // Get the product name (only French is used for now)
                                        const productName = product.translations?.[0]?.name || "Sans nom";
                                        
                                        // Find category name if available
                                        const category = categories.find(c => c.id === product.categoryId);
                                        const categoryName = category ? 
                                            (category.translations[0]?.name || category.slug) : 
                                            "Aucune";
                                        
                                        return (
                                            <tr 
                                                key={product.id} 
                                                className="border-b border-platinumGray/10 hover:bg-brandGold/5 transition-colors duration-150"
                                            >
                                                <td className="p-4">
                                                    {product.images && product.images.length > 0 ? (
                                                        <div className="w-20 h-20 relative rounded-md overflow-hidden shadow-subtle">
                                                            <Image 
                                                                src={product.images[0]} 
                                                                alt={productName}
                                                                fill
                                                                className="object-cover"
                                                                sizes="80px"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-20 h-20 bg-platinumGray/10 flex items-center justify-center rounded-md">
                                                            <FiImage className="text-platinumGray/40" size={24} />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 font-mono text-sm">{product.sku}</td>
                                                <td className="p-4 font-medium">{productName}</td>
                                                <td className="p-4 text-right">{parseFloat(product.basePrice).toLocaleString('fr-FR')} MAD</td>
                                                <td className="p-4 text-center">
                                                    {product.featured ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brandGold/20 text-brandGold border border-brandGold/30">
                                                            En vedette
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-platinumGray/10 text-platinumGray">
                                                            Standard
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-center text-sm">{categoryName}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <button 
                                                            onClick={() => setEditingProduct(product)}
                                                            aria-label="Modifier le produit"
                                                            className="p-2 text-brandGold hover:bg-brandGold/10 rounded-full transition-colors duration-200"
                                                        >
                                                            <FiEdit2 size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => setShowDeleteConfirm(product.id)}
                                                            aria-label="Supprimer le produit"
                                                            className="p-2 text-burgundy hover:bg-burgundy/10 rounded-full transition-colors duration-200"
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
            
            {/* Hidden file input for image uploads */}
            <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e.target.files!, !!editingProduct)}
            />
            
            {/* Add Product Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-richEbony/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-luxury"
                        >
                            <div className="flex justify-between items-center border-b border-brandGold/10 pb-4 mb-6">
                                <h2 className="text-xl font-serif text-brandGold">Ajouter un Bijou à la Collection</h2>
                                <button 
                                    onClick={() => setShowAddModal(false)}
                                    className="text-platinumGray hover:text-richEbony p-1"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-richEbony mb-2">
                                            Référence (SKU)
                                        </label>
                                        <input
                                            type="text"
                                            name="sku"
                                            value={newProduct.sku}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                                            placeholder="MDR-001"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-richEbony mb-2">
                                            Prix (MAD)
                                        </label>
                                        <input
                                            type="number"
                                            name="basePrice"
                                            value={newProduct.basePrice}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                
                                {/* Category & Featured Flag */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-richEbony mb-2">
                                            Catégorie
                                        </label>
                                        <select
                                            name="categoryId"
                                            value={newProduct.categoryId || ""}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md bg-white"
                                        >
                                            <option value="">Sélectionner une catégorie</option>
                                            {categories.map((cat) => {
                                                const catName = cat.translations[0]?.name || cat.slug;
                                                return (
                                                    <option key={cat.id} value={cat.id}>
                                                        {catName}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="relative inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                id="featured"
                                                name="featured"
                                                checked={!!newProduct.featured}
                                                onChange={handleCheckboxChange}
                                                className="h-5 w-5 text-brandGold border-platinumGray/30 focus:ring-brandGold rounded"
                                            />
                                            <label htmlFor="featured" className="ml-3 block text-sm text-richEbony">
                                                Mettre ce produit en vedette
                                                <span className="block text-xs text-platinumGray">
                                                    Affiche ce bijou sur la page d'accueil
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Product Info */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-richEbony mb-2">
                                            Nom du Bijou
                                        </label>
                                        <input
                                            type="text"
                                            value={newProduct.translations?.[0]?.name || ""}
                                            onChange={(e) => handleTranslationChange("name", e.target.value)}
                                            className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                                            placeholder="Bague Soleil d'Or"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-richEbony mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={newProduct.translations?.[0]?.description || ""}
                                            onChange={(e) => handleTranslationChange("description", e.target.value)}
                                            className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md h-32 resize-none"
                                            placeholder="Description détaillée du bijou..."
                                        />
                                    </div>
                                </div>
                                
                                {/* Images */}
                                <div className="border-t border-platinumGray/20 pt-6 mt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-base text-md font-serif text-richEbony ">Photos du Bijou</h3>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="px-4 py-2 bg-burgundy/10 text-burgundy text-sm rounded-md hover:bg-burgundy/20 transition-colors flex items-center gap-2"
                                        >
                                            <FiImage size={16} />
                                            {isUploading ? "Chargement..." : "Ajouter des Images"}
                                        </button>
                                    </div>
                                    
                                    {/* Image Preview Area */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                                        {newProduct.images && newProduct.images.map((img, idx) => (
                                                                                        <motion.div
                                                                                        key={idx}
                                                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                                                        className="relative group"
                                                                                    >
                                                                                        <div className="aspect-square w-full relative overflow-hidden rounded-md border border-platinumGray/20 shadow-subtle">
                                                                                            <Image
                                                                                                src={img}
                                                                                                alt={`Image ${idx + 1}`}
                                                                                                fill
                                                                                                className="object-cover"
                                                                                                sizes="(max-width: 768px) 33vw, 25vw"
                                                                                            />
                                                                                        </div>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => removeImage(idx)}
                                                                                            className="absolute -top-2 -right-2 bg-burgundy text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                                                        >
                                                                                            ×
                                                                                        </button>
                                                                                    </motion.div>
                                                                                ))}
                                                                                
                                                                                {/* Empty state */}
                                                                                {(!newProduct.images || newProduct.images.length === 0) && (
                                                                                    <div className="aspect-square w-full flex items-center justify-center border border-dashed border-platinumGray/30 rounded-md text-platinumGray text-sm">
                                                                                        Aucune image
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="mt-6 flex justify-end space-x-3">
                                                                        <button
                                                                            onClick={() => setShowAddModal(false)}
                                                                            className="px-4 py-2 text-platinumGray hover:text-richEbony transition-colors duration-200"
                                                                            disabled={isSubmitting}
                                                                        >
                                                                            Annuler
                                                                        </button>
                                                                        <button
                                                                            onClick={addProduct}
                                                                            className="px-4 py-2 bg-brandGold/90 text-richEbony hover:bg-brandGold transition-colors duration-300 rounded-md shadow-subtle"
                                                                            disabled={isSubmitting}
                                                                        >
                                                                            {isSubmitting ? "Création..." : "Ajouter le Produit"}
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
                                                                className="fixed inset-0 bg-richEbony/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                                                            >
                                                                <motion.div
                                                                    initial={{ scale: 0.95, y: 20 }}
                                                                    animate={{ scale: 1, y: 0 }}
                                                                    exit={{ scale: 0.95, y: 20 }}
                                                                    className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-luxury"
                                                                >
                                                                    <div className="flex justify-between items-center border-b border-brandGold/10 pb-4 mb-6">
                                                                        <h2 className="text-xl font-serif text-brandGold">Modifier le Bijou</h2>
                                                                        <button 
                                                                            onClick={() => setEditingProduct(null)}
                                                                            className="text-platinumGray hover:text-richEbony p-1"
                                                                        >
                                                                            <FiX size={24} />
                                                                        </button>
                                                                    </div>
                                                                    
                                                                    <div className="space-y-6">
                                                                        {/* Basic Info */}
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                            <div>
                                                                                <label className="block text-sm font-medium text-richEbony mb-2">
                                                                                    Référence (SKU)
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    name="sku"
                                                                                    value={editingProduct.sku}
                                                                                    onChange={handleEditInputChange}
                                                                                    className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                                                                                    placeholder="MDR-001"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-sm font-medium text-richEbony mb-2">
                                                                                    Prix (MAD)
                                                                                </label>
                                                                                <input
                                                                                    type="number"
                                                                                    name="basePrice"
                                                                                    value={editingProduct.basePrice}
                                                                                    onChange={handleEditInputChange}
                                                                                    className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                                                                                    placeholder="0"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        {/* Category & Featured Flag */}
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                            <div>
                                                                                <label className="block text-sm font-medium text-richEbony mb-2">
                                                                                    Catégorie
                                                                                </label>
                                                                                <select
                                                                                    name="categoryId"
                                                                                    value={editingProduct.categoryId || ""}
                                                                                    onChange={handleEditInputChange}
                                                                                    className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md bg-white"
                                                                                >
                                                                                    <option value="">Sélectionner une catégorie</option>
                                                                                    {categories.map((cat) => {
                                                                                        const catName = cat.translations[0]?.name || cat.slug;
                                                                                        return (
                                                                                            <option key={cat.id} value={cat.id}>
                                                                                                {catName}
                                                                                            </option>
                                                                                        );
                                                                                    })}
                                                                                </select>
                                                                            </div>
                                                                            <div className="flex items-center">
                                                                                <div className="relative inline-flex items-center">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        id="editFeatured"
                                                                                        name="featured"
                                                                                        checked={!!editingProduct.featured}
                                                                                        onChange={handleEditCheckboxChange}
                                                                                        className="h-5 w-5 text-brandGold border-platinumGray/30 focus:ring-brandGold rounded"
                                                                                    />
                                                                                    <label htmlFor="editFeatured" className="ml-3 block text-sm text-richEbony">
                                                                                        Mettre ce produit en vedette
                                                                                        <span className="block text-xs text-platinumGray">
                                                                                            Affiche ce bijou sur la page d'accueil
                                                                                        </span>
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        {/* Product Info */}
                                                                        <div className="space-y-4">
                                                                            <div>
                                                                                <label className="block text-sm font-medium text-richEbony mb-2">
                                                                                    Nom du Bijou
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    value={editingProduct.translations?.[0]?.name || ""}
                                                                                    onChange={(e) => handleEditTranslationChange("name", e.target.value)}
                                                                                    className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                                                                                    placeholder="Bague Soleil d'Or"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-sm font-medium text-richEbony mb-2">
                                                                                    Description
                                                                                </label>
                                                                                <textarea
                                                                                    value={editingProduct.translations?.[0]?.description || ""}
                                                                                    onChange={(e) => handleEditTranslationChange("description", e.target.value)}
                                                                                    className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md h-32 resize-none"
                                                                                    placeholder="Description détaillée du bijou..."
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        {/* Images */}
                                                                        <div className="border-t border-platinumGray/20 pt-6 mt-6">
                                                                            <div className="flex justify-between items-center mb-4">
                                                                                <h3 className="text-md font-serif text-richEbony">Photos du Bijou</h3>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => fileInputRef.current?.click()}
                                                                                    disabled={isUploading}
                                                                                    className="px-4 py-2 bg-burgundy/10 text-burgundy text-sm rounded-md hover:bg-burgundy/20 transition-colors flex items-center gap-2"
                                                                                >
                                                                                    <FiImage size={16} />
                                                                                    {isUploading ? "Chargement..." : "Ajouter des Images"}
                                                                                </button>
                                                                            </div>
                                                                            
                                                                            {/* Image Preview Area */}
                                                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                                                                                {editingProduct.images && editingProduct.images.map((img, idx) => (
                                                                                    <motion.div
                                                                                        key={idx}
                                                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                                                        className="relative group"
                                                                                    >
                                                                                        <div className="aspect-square w-full relative overflow-hidden rounded-md border border-platinumGray/20 shadow-subtle">
                                                                                            <Image
                                                                                                src={img}
                                                                                                alt={`Image ${idx + 1}`}
                                                                                                fill
                                                                                                className="object-cover"
                                                                                                sizes="(max-width: 768px) 33vw, 25vw"
                                                                                            />
                                                                                        </div>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => removeImage(idx, true)}
                                                                                            className="absolute -top-2 -right-2 bg-burgundy text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                                                        >
                                                                                            ×
                                                                                        </button>
                                                                                    </motion.div>
                                                                                ))}
                                                                                
                                                                                {/* Empty state */}
                                                                                {(!editingProduct.images || editingProduct.images.length === 0) && (
                                                                                    <div className="aspect-square w-full flex items-center justify-center border border-dashed border-platinumGray/30 rounded-md text-platinumGray text-sm">
                                                                                        Aucune image
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="mt-6 flex justify-end space-x-3">
                                                                        <button
                                                                            onClick={() => setEditingProduct(null)}
                                                                            className="px-4 py-2 text-platinumGray hover:text-richEbony transition-colors duration-200"
                                                                            disabled={isSubmitting}
                                                                        >
                                                                            Annuler
                                                                        </button>
                                                                        <button
                                                                            onClick={updateProduct}
                                                                            className="px-4 py-2 bg-brandGold/90 text-richEbony hover:bg-brandGold transition-colors duration-300 rounded-md shadow-subtle"
                                                                            disabled={isSubmitting}
                                                                        >
                                                                            {isSubmitting ? "Mise à jour..." : "Enregistrer les Modifications"}
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
                                                                className="fixed inset-0 bg-richEbony/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                                                            >
                                                                <motion.div
                                                                    initial={{ scale: 0.95, y: 20 }}
                                                                    animate={{ scale: 1, y: 0 }}
                                                                    exit={{ scale: 0.95, y: 20 }}
                                                                    className="bg-white rounded-xl p-6 w-full max-w-md shadow-luxury"
                                                                >
                                                                    <div className="flex items-center mb-4 text-burgundy">
                                                                        <FiTrash2 size={24} className="mr-3" />
                                                                        <h2 className="text-xl font-serif">Confirmer la Suppression</h2>
                                                                    </div>
                                                                    
                                                                    <p className="text-richEbony mb-6">
                                                                        Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
                                                                    </p>
                                                                    
                                                                    <div className="flex justify-end space-x-3">
                                                                        <button
                                                                            onClick={() => setShowDeleteConfirm(null)}
                                                                            className="px-4 py-2 text-platinumGray hover:text-richEbony transition-colors duration-200"
                                                                            disabled={isSubmitting}
                                                                        >
                                                                            Annuler
                                                                        </button>
                                                                        <button
                                                                            onClick={() => showDeleteConfirm !== null && deleteProduct(showDeleteConfirm)}
                                                                            className="px-4 py-2 bg-burgundy text-white hover:bg-burgundy/80 transition-colors duration-300 rounded-md shadow-subtle"
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