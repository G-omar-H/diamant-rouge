import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiTrash2, FiX, FiPlus, FiCheck, FiAlertCircle } from "react-icons/fi";

type CategoryTranslation = {
  language: string;
  name: string;
  description: string;
};

type Category = {
  id: number;
  slug: string;
  translations: CategoryTranslation[];
};

export function ManageCategories() {
  // State management
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Form state
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [newTranslations, setNewTranslations] = useState<CategoryTranslation[]>([
    { language: "fr", name: "", description: "" },
    { language: "en", name: "", description: "" }
  ]);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // Success message auto-dismiss
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch Categories on Mount
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) {
        throw new Error("Erreur lors du chargement des catégories");
      }
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Translations in Create Form
  function handleTranslationChange(
    index: number,
    key: "name" | "description",
    value: string
  ) {
    const updated = [...newTranslations];
    updated[index][key] = value;
    setNewTranslations(updated);
  }

  // Handle Translations in Edit Form
  function handleEditTranslationChange(
    index: number,
    key: "name" | "description", 
    value: string
  ) {
    if (!editingCategory) return;
    
    const updated = [...editingCategory.translations];
    updated[index][key] = value;
    setEditingCategory({
      ...editingCategory,
      translations: updated
    });
  }

  // Reset form fields
  function resetForm() {
    setNewCategorySlug("");
    setNewTranslations([
      { language: "fr", name: "", description: "" },
      { language: "en", name: "", description: "" }
    ]);
  }

  // Create Category
  async function handleCreateCategory() {
    // Validate form
    if (!newCategorySlug.trim()) {
      setError("L'identifiant de la catégorie est obligatoire");
      return;
    }
    
    if (!newTranslations[0].name.trim()) {
      setError("Le nom de la catégorie en français est obligatoire");
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
          translations: newTranslations,
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la création de la catégorie");
      }

      // Reset form and close modal
      resetForm();
      setShowAddModal(false);
      await fetchCategories();
      setSuccessMessage("Catégorie créée avec succès");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Edit Category
  async function handleEditCategory() {
    if (!editingCategory) return;
    
    // Validate form
    if (!editingCategory.slug.trim()) {
      setError("L'identifiant de la catégorie est obligatoire");
      return;
    }
    
    if (!editingCategory.translations[0].name.trim()) {
      setError("Le nom de la catégorie en français est obligatoire");
      return;
    }
    
    setIsSubmitting(true);
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
        throw new Error("Erreur lors de la mise à jour de la catégorie");
      }

      setEditingCategory(null);
      await fetchCategories();
      setSuccessMessage("Catégorie mise à jour avec succès");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Delete Category
  async function handleDeleteCategory(id: number) {
    setIsSubmitting(true);
    setError("");
    
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { 
        method: "DELETE" 
      });
      
      if (!res.ok) {
        throw new Error("Erreur lors de la suppression de la catégorie");
      }
      
      setShowDeleteConfirm(null);
      await fetchCategories();
      setSuccessMessage("Catégorie supprimée avec succès");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-brandGold">Gestion des Catégories</h1>
          <p className="text-platinumGray mt-1">Organisez votre collection par catégories</p>
        </div>
        <button
          className="px-4 py-2 bg-brandGold/90 text-richEbony hover:bg-brandGold transition-colors duration-300 flex items-center gap-2 rounded-md shadow-subtle"
          onClick={() => setShowAddModal(true)}
        >
          <FiPlus size={18} />
          <span>Ajouter une Catégorie</span>
        </button>
      </div>
      
      {/* Status Messages */}
      {error && (
        <div className="bg-burgundy/10 border border-burgundy/20 text-burgundy px-4 py-3 rounded-md flex items-center gap-2">
          <FiAlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-md flex items-center gap-2">
          <FiCheck size={18} />
          <span>{successMessage}</span>
        </div>
      )}
      
      {/* Categories List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-brandGold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-platinumGray">Chargement des catégories...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur-sm border border-brandGold/20 rounded-lg overflow-hidden shadow-luxury">
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-platinumGray text-lg">Aucune catégorie trouvée</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="mt-4 px-4 py-2 text-brandGold border border-brandGold/30 hover:bg-brandGold/10 rounded-md transition-colors duration-200"
              >
                Ajouter une catégorie
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-richEbony/5 text-richEbony">
                  <tr>
                    <th className="p-4 text-left font-serif">Identifiant</th>
                    <th className="p-4 text-left font-serif">Nom (FR)</th>
                    <th className="p-4 text-left font-serif">Nom (EN)</th>
                    <th className="p-4 text-center font-serif">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => {
                    const frTranslation = category.translations.find(t => t.language === "fr") || { name: "-", description: "-" };
                    const enTranslation = category.translations.find(t => t.language === "en") || { name: "-", description: "-" };
                    
                    return (
                      <tr 
                        key={category.id} 
                        className="border-b border-platinumGray/10 hover:bg-brandGold/5 transition-colors duration-150"
                      >
                        <td className="p-4 font-mono text-sm">{category.slug}</td>
                        <td className="p-4 font-medium">{frTranslation.name}</td>
                        <td className="p-4">{enTranslation.name}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button 
                              onClick={() => setEditingCategory(category)}
                              aria-label="Modifier la catégorie"
                              className="p-2 text-brandGold hover:bg-brandGold/10 rounded-full transition-colors duration-200"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button 
                              onClick={() => setShowDeleteConfirm(category.id)}
                              aria-label="Supprimer la catégorie"
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
      
      {/* Add Category Modal */}
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
              className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-luxury"
            >
              <div className="flex justify-between items-center border-b border-brandGold/10 pb-4 mb-6">
                <h2 className="text-xl font-serif text-brandGold">Ajouter une Catégorie</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-platinumGray hover:text-richEbony p-1"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-richEbony mb-2">
                    Identifiant (slug)
                  </label>
                  <input
                    type="text"
                    value={newCategorySlug}
                    onChange={(e) => setNewCategorySlug(e.target.value)}
                    className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                    placeholder="bagues-or"
                  />
                  <p className="text-xs text-platinumGray mt-1">
                    Format sans espaces ni caractères spéciaux (ex: bagues-or)
                  </p>
                </div>
                
                {/* French Translation */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-semibold text-richEbony border-b border-platinumGray/10 pb-1">Français</h3>
                  <div>
                    <label className="block text-sm font-medium text-richEbony mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={newTranslations[0].name}
                      onChange={(e) => handleTranslationChange(0, "name", e.target.value)}
                      className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                      placeholder="Bagues en Or"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-richEbony mb-2">
                      Description
                    </label>
                    <textarea
                      value={newTranslations[0].description}
                      onChange={(e) => handleTranslationChange(0, "description", e.target.value)}
                      className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md h-24 resize-none"
                      placeholder="Description de la catégorie..."
                    />
                  </div>
                </div>
                
                {/* English Translation */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-semibold text-richEbony border-b border-platinumGray/10 pb-1">English</h3>
                  <div>
                    <label className="block text-sm font-medium text-richEbony mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newTranslations[1].name}
                      onChange={(e) => handleTranslationChange(1, "name", e.target.value)}
                      className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                      placeholder="Gold Rings"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-richEbony mb-2">
                      Description
                    </label>
                    <textarea
                      value={newTranslations[1].description}
                      onChange={(e) => handleTranslationChange(1, "description", e.target.value)}
                      className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md h-24 resize-none"
                      placeholder="Category description..."
                    />
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
                  onClick={handleCreateCategory}
                  className="px-4 py-2 bg-brandGold/90 text-richEbony hover:bg-brandGold transition-colors duration-300 rounded-md shadow-subtle"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Création..." : "Créer la Catégorie"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Edit Category Modal */}
      <AnimatePresence>
        {editingCategory && (
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
              className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-luxury"
            >
              <div className="flex justify-between items-center border-b border-brandGold/10 pb-4 mb-6">
                <h2 className="text-xl font-serif text-brandGold">Modifier la Catégorie</h2>
                <button 
                  onClick={() => setEditingCategory(null)}
                  className="text-platinumGray hover:text-richEbony p-1"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-richEbony mb-2">
                    Identifiant (slug)
                  </label>
                  <input
                    type="text"
                    value={editingCategory.slug}
                    onChange={(e) => setEditingCategory({...editingCategory, slug: e.target.value})}
                    className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                  />
                  <p className="text-xs text-platinumGray mt-1">
                    Format sans espaces ni caractères spéciaux (ex: bagues-or)
                  </p>
                </div>
                
                {/* Translations - dynamically handle available languages */}
                {editingCategory.translations.map((translation, index) => {
                  const isFrencsh = translation.language === "fr";
                  const titleText = isFrencsh ? "Français" : "English";
                  const namePlaceholder = isFrencsh ? "Bagues en Or" : "Gold Rings";
                  const descPlaceholder = isFrencsh ? "Description de la catégorie..." : "Category description...";
                  
                  return (
                    <div key={index} className="space-y-3 pt-2">
                      <h3 className="text-sm font-semibold text-richEbony border-b border-platinumGray/10 pb-1">{titleText}</h3>
                      <div>
                        <label className="block text-sm font-medium text-richEbony mb-2">
                          {isFrencsh ? "Nom" : "Name"}
                        </label>
                        <input
                          type="text"
                          value={translation.name}
                          onChange={(e) => handleEditTranslationChange(index, "name", e.target.value)}
                          className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                          placeholder={namePlaceholder}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-richEbony mb-2">
                          {isFrencsh ? "Description" : "Description"}
                        </label>
                        <textarea
                          value={translation.description}
                          onChange={(e) => handleEditTranslationChange(index, "description", e.target.value)}
                          className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md h-24 resize-none"
                          placeholder={descPlaceholder}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 text-platinumGray hover:text-richEbony transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  onClick={handleEditCategory}
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
                Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible et pourrait affecter les produits qui utilisent cette catégorie.
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
                  onClick={() => showDeleteConfirm !== null && handleDeleteCategory(showDeleteConfirm)}
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