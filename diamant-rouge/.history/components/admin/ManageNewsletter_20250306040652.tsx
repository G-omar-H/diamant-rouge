import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckSquare, FiSquare, FiAlertCircle, FiCheck, FiSend, FiMail, FiUsers, FiImage, FiPlusCircle, FiEye, FiTrash2, FiSearch } from "react-icons/fi";
import dynamic from "next/dynamic";
import Image from "next/image";
import { RichTextEditor } from "../ui/RichTextEditor";



type Subscriber = {
  id: number;
  email: string;
  createdAt: string;
};

type NewsletterImage = {
  id: string;
  url: string;
  alt: string;
};

export function ManageNewsletter() {
  // Basic state
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  
  // Newsletter content state
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [sendStatus, setSendStatus] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Search filter
  const [searchTerm, setSearchTerm] = useState("");
  
  // Image state
  const [heroImage, setHeroImage] = useState<NewsletterImage | null>(null);
  const [contentImages, setContentImages] = useState<NewsletterImage[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Refs for file inputs
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);

  // Rich text editor configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet',
    'link'
  ];

  // Fetch subscribers from API
  useEffect(() => {
    async function fetchSubscribers() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/newsletter");
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Erreur lors du chargement des abonnés");
        }
        const data = await res.json();
        setSubscribers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSubscribers();
  }, []);

  // Auto-dismiss success message
  useEffect(() => {
    if (sendStatus && !sendStatus.includes("Erreur")) {
      const timer = setTimeout(() => {
        setSendStatus("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [sendStatus]);

  // Filter subscribers based on search term
  const filteredSubscribers = searchTerm ? 
    subscribers.filter(sub => 
      sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) : 
    subscribers;

  // Email selection functions
  function toggleSelect(email: string) {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  }

  function selectAll() {
    setSelectedEmails(filteredSubscribers.map((s) => s.email));
  }

  function deselectAll() {
    setSelectedEmails([]);
  }

 // Handle hero image upload
 async function handleHeroImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
  if (!e.target.files || e.target.files.length === 0) return;
  
  const file = e.target.files[0];
  setUploadingImage(true);
  
  try {
    const formData = new FormData();
    formData.append("images", file);
    formData.append("type", "newsletter");
    
    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) {
      throw new Error("Échec du téléchargement de l'image");
    }
    
    const data = await res.json();
    const imageUrl = data.urls && data.urls[0];
    
    console.log("Uploaded hero image URL:", imageUrl);
    
    if (!imageUrl) throw new Error("URL d'image invalide");
    
    // Make sure we store the FULL URL including domain
    const siteUrl = window.location.origin;
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`;
    
    setHeroImage({
      id: Date.now().toString(),
      url: fullImageUrl, // Store the complete URL
      alt: "Image d'en-tête pour la newsletter"
    });
  } catch (err: any) {
    setError(err.message || "Échec du téléchargement de l'image");
  } finally {
    setUploadingImage(false);
    if (heroImageInputRef.current) {
      heroImageInputRef.current.value = "";
    }
  }
}

// Update content image upload similarly
async function handleContentImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
  if (!e.target.files || e.target.files.length === 0) return;
  
  const file = e.target.files[0];
  setUploadingImage(true);
  
  try {
    const formData = new FormData();
    formData.append("images", file);
    formData.append("type", "newsletter");
    
    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) {
      throw new Error("Échec du téléchargement de l'image");
    }
    
    const data = await res.json();
    const imageUrl = data.urls && data.urls[0];
    
    console.log("Uploaded content image URL:", imageUrl);
    
    if (!imageUrl) throw new Error("URL d'image invalide");
    
    // Ensure absolute URL
    const siteUrl = window.location.origin;
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`;
    
    const newImage = {
      id: Date.now().toString(),
      url: fullImageUrl, // Store the complete URL
      alt: `Image ${contentImages.length + 1} pour la newsletter`
    };
    
    setContentImages(prev => [...prev, newImage]);
    
    // Insert image with absolute URL
    const imageHtml = `<img src="${fullImageUrl}" alt="${newImage.alt}" class="newsletter-content-image" style="max-width: 100%; margin: 1.5rem 0;" />`;
    setHtmlContent(prev => prev + imageHtml);
    
  } catch (err: any) {
    setError(err.message || "Échec du téléchargement de l'image");
  } finally {
    setUploadingImage(false);
    if (contentImageInputRef.current) {
      contentImageInputRef.current.value = "";
    }
  }
}

  // Remove hero image
  function removeHeroImage() {
    setHeroImage(null);
  }

  // Generate HTML template for the newsletter
  // Improved newsletter HTML template
function generateNewsletterHtml() {
  
  // No need to modify URLs again since we're already storing the full URLs
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject || "Newsletter Diamant Rouge"}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Raleway:wght@400;500&display=swap');
        
        body {
          font-family: 'Raleway', 'Helvetica', 'Arial', sans-serif;
          line-height: 1.8;
          color: #333333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 650px;
          margin: 0 auto;
          background-color: #ffffff;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding: 30px 20px;
          background-color: #1c1c1c;
        }
        .logo {
          max-width: 200px;
        }
        .hero-image-container {
          width: 100%;
          max-height: 350px;
          overflow: hidden;
        }
        .hero-image {
          width: 100%;
          display: block;
        }
        .content {
          padding: 40px 30px;
          color: #212121;
        }
        .gold-divider {
          height: 2px;
          background-color: #d4af37;
          width: 60px;
          margin: 25px auto;
        }
        .footer {
          background-color: #1c1c1c;
          color: #d4af37;
          text-align: center;
          padding: 30px 20px;
          font-size: 14px;
          line-height: 1.6;
        }
        h1, h2, h3 {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          color: #1c1c1c;
          line-height: 1.3;
        }
        h1 {
          font-size: 28px;
          margin-top: 0;
          letter-spacing: 0.5px;
        }
        h2 {
          font-size: 24px;
          margin-top: 30px;
        }
        .gold-text {
          color: #d4af37;
        }
        p {
          margin-bottom: 20px;
        }
        a {
          color: #d4af37;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        .button {
          display: inline-block;
          background-color: #d4af37;
          color: #1c1c1c;
          text-decoration: none;
          padding: 12px 30px;
          margin: 20px 0;
          font-weight: 500;
          letter-spacing: 0.5px;
          border-radius: 2px;
        }
        .social-links {
          margin-top: 15px;
        }
        .social-icon {
          display: inline-block;
          margin: 0 10px;
          width: 30px;
          height: 30px;
        }
        .newsletter-content-image {
          max-width: 100%;
          height: auto;
          margin: 25px 0;
          border-radius: 3px;
        }
        
        @media only screen and (max-width: 600px) {
          .content {
            padding: 30px 20px;
          }
          h1 {
            font-size: 24px;
          }
          h2 {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${siteUrl}/images/logo.png" alt="Diamant Rouge" class="logo">
        </div>
        
        ${heroImage ? `
        <div class="hero-image-container">
          <img src="${heroImage.url}" alt="${heroImage.alt}" class="hero-image">
        </div>` : ''}
        
        <div class="content">
          <h1 class="gold-text">${subject || "Diamant Rouge Newsletter"}</h1>
          <div class="gold-divider"></div>
          ${htmlContent || '<p>Contenu de la newsletter...</p>'}
          
          <div style="text-align: center; margin-top: 40px;">
            <a href="https://diamantrouge.com/collections" class="button">Découvrir nos collections</a>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin-bottom: 5px;">© ${new Date().getFullYear()} Diamant Rouge. Tous droits réservés.</p>
          <p style="margin-bottom: 15px;">Vous recevez cet email car vous êtes abonné à notre newsletter.</p>
          
          <div class="social-links">
            <a href="https://instagram.com/diamantrouge" aria-label="Instagram">
              <img src="${heroImage?.url ? heroImage.url.substring(0, heroImage.url.lastIndexOf('/')) : ''}/socials/instagram.png" alt="Instagram" class="social-icon">
            </a>
            <a href="https://facebook.com/diamantrouge" aria-label="Facebook">
              <img src="${heroImage?.url ? heroImage.url.substring(0, heroImage.url.lastIndexOf('/')) : ''}/socials/facebook.png" alt="Facebook" class="social-icon">
            </a>
          </div>
          
          <p style="margin-top: 20px;">
            <a href="${heroImage?.url ? heroImage.url.substring(0, heroImage.url.lastIndexOf('/')) : ''}/unsubscribe" style="color: #d4af37;">Se désabonner</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

  // Send newsletter
  async function handleSendMassEmail(e: React.FormEvent) {
    e.preventDefault();
    setSendStatus("");
    setIsSending(true);
    
    const emailHtml = generateNewsletterHtml();
    
    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          message: emailHtml,
          isHtml: true,
          recipients: selectedEmails,
          heroImage: heroImage ? heroImage.url : null
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setSendStatus(`Erreur: ${data.error || "Échec de l'envoi des emails"}`);
      } else {
        setSendStatus(`Email${selectedEmails.length !== 1 ? 's' : ''} envoyé${selectedEmails.length !== 1 ? 's' : ''} avec succès !`);
        
        // Reset form
        setSelectedEmails([]);
        setSubject("");
        setHtmlContent("");
        setHeroImage(null);
        setContentImages([]);
      }
    } catch (error: any) {
      setSendStatus("Erreur lors de l'envoi des emails");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-brandGold">Gestion de la Newsletter</h1>
          <p className="text-platinumGray mt-1">Créez et envoyez des communications luxueuses à vos abonnés</p>
        </div>
        <div className="flex items-center gap-2 bg-brandGold/10 px-4 py-2 rounded-md">
          <FiUsers className="text-brandGold" size={18} />
          <span className="font-medium">{subscribers.length} abonnés</span>
        </div>
      </div>
      
      {/* Status Messages */}
      {error && (
        <div className="bg-burgundy/10 border border-burgundy/20 text-burgundy px-4 py-3 rounded-md flex items-center gap-2">
          <FiAlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      
      {sendStatus && (
        <div className={`px-4 py-3 rounded-md flex items-center gap-2 ${
          sendStatus.includes("succès") 
            ? "bg-emerald-50 border border-emerald-200 text-emerald-800" 
            : "bg-burgundy/10 border border-burgundy/20 text-burgundy"
        }`}>
          {sendStatus.includes("succès") ? <FiCheck size={18} /> : <FiAlertCircle size={18} />}
          <span>{sendStatus}</span>
        </div>
      )}

      {/* Main Content - Two Column Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subscribers List - Takes 1/3 of space */}
        <div className="bg-white/50 backdrop-blur-sm border border-brandGold/20 rounded-lg overflow-hidden shadow-luxury">
          <div className="p-6 border-b border-brandGold/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-serif text-brandGold flex items-center gap-2">
                <FiMail size={20} />
                <span>Abonnés</span>
              </h2>
              <div className="flex gap-3">
                <button 
                  onClick={selectAll} 
                  className="px-3 py-1.5 border border-brandGold/50 text-brandGold hover:bg-brandGold/10 rounded-md flex items-center gap-1.5 transition-colors text-sm"
                  aria-label="Sélectionner tous les abonnés"
                >
                  <FiCheckSquare size={14} />
                  <span>Tout</span>
                </button>
                <button 
                  onClick={deselectAll} 
                  className="px-3 py-1.5 border border-platinumGray/30 text-platinumGray hover:text-richEbony hover:border-platinumGray transition-colors rounded-md flex items-center gap-1.5 text-sm"
                  aria-label="Désélectionner tous les abonnés"
                >
                  <FiSquare size={14} />
                  <span>Aucun</span>
                </button>
              </div>
            </div>
            
            {/* Search input */}
            <div className="mt-4 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-platinumGray" size={18} />
              <input
                type="text"
                placeholder="Rechercher un abonné..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold focus:border-brandGold bg-white/70"
                aria-label="Rechercher un abonné"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-t-brandGold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-platinumGray">Chargement des abonnés...</p>
              </div>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-center py-16">
              <FiMail size={48} className="text-platinumGray/30 mx-auto mb-4" />
              <p className="text-platinumGray">
                {searchTerm ? "Aucun résultat pour cette recherche" : "Aucun abonné à la newsletter pour le moment."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-brandGold hover:underline"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-richEbony/5 text-richEbony sticky top-0 z-10">
                  <tr>
                    <th className="p-3 text-left w-16"></th>
                    <th className="p-3 text-left font-serif">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.map((subscriber) => (
                    <tr 
                      key={subscriber.id}
                      className={`border-b border-platinumGray/10 hover:bg-brandGold/5 transition-colors duration-150 ${
                        selectedEmails.includes(subscriber.email) ? "bg-brandGold/5" : ""
                      }`}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedEmails.includes(subscriber.email)}
                          onChange={() => toggleSelect(subscriber.email)}
                          className="h-5 w-5 text-brandGold border-platinumGray/30 focus:ring-brandGold rounded"
                          aria-label={`Sélectionner ${subscriber.email}`}
                        />
                      </td>
                      <td className="p-3 font-medium">{subscriber.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Selected subscribers count */}
          {selectedEmails.length > 0 && (
            <div className="p-4 bg-brandGold/5 border-t border-brandGold/20">
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  <span className="font-medium">{selectedEmails.length}</span> abonné{selectedEmails.length > 1 ? 's' : ''} sélectionné{selectedEmails.length > 1 ? 's' : ''}
                </p>
                <button 
                  onClick={deselectAll}
                  className="text-xs text-burgundy hover:text-burgundy/70"
                >
                  Désélectionner
                </button>
              </div>
            </div>
          )}
        </div>

              {/* Email Composition Section - Takes 2/3 of space */}
              <div className="bg-white/50 backdrop-blur-sm border border-brandGold/20 rounded-lg p-6 shadow-luxury lg:col-span-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-xl font-serif text-brandGold flex items-center gap-2">
              <FiSend size={20} />
              <span>Créer une Newsletter Diamant Rouge</span>
            </h2>
            
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1.5 border border-brandGold/50 text-brandGold hover:bg-brandGold/10 rounded-md flex items-center gap-1.5 transition-colors text-sm"
              aria-expanded={showPreview}
              aria-controls="newsletter-preview"
            >
              <FiEye size={14} />
              <span>{showPreview ? "Masquer l'aperçu" : "Afficher l'aperçu"}</span>
            </button>
          </div>
          
          <form onSubmit={handleSendMassEmail} className="space-y-6">
            {/* Subject Line */}
            <div>
              <label htmlFor="newsletter-subject" className="block text-sm font-medium text-richEbony mb-2">
                Sujet
              </label>
              <input
                id="newsletter-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Nouvelles créations exclusives Diamant Rouge"
                className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                required
              />
            </div>
            
            {/* Hero Image Upload - enhanced interface */}
<div>
  <label className="block text-sm font-medium text-richEbony mb-2 flex items-center gap-2">
    <FiImage size={15} />
    <span>Image d'en-tête</span>
  </label>
  
  {heroImage ? (
    <div className="relative rounded-md overflow-hidden border border-brandGold/20 shadow-md">
      <div className="aspect-[16/9] relative">
        <Image 
          src={heroImage.url}
          alt={heroImage.alt}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover"
        />
      </div>
      <div className="absolute top-0 left-0 bg-gradient-to-b from-richEbony/50 to-transparent w-full h-16 pointer-events-none"></div>
      <button
        type="button"
        onClick={removeHeroImage}
        className="absolute top-2 right-2 bg-burgundy text-white p-1.5 rounded-full shadow-md hover:bg-burgundy/80 transition-colors"
        aria-label="Supprimer l'image d'en-tête"
      >
        <FiTrash2 size={16} />
      </button>
    </div>
  ) : (
    <div className="border-2 border-dashed border-platinumGray/30 rounded-md p-8 text-center">
      <FiImage size={36} className="mx-auto mb-2 text-platinumGray/50" />
      <p className="text-platinumGray mb-4">
        Téléchargez une image d'en-tête pour votre newsletter
      </p>
      <input
        type="file"
        ref={heroImageInputRef}
        onChange={handleHeroImageUpload}
        accept="image/*"
        className="hidden"
        aria-label="Choisir une image d'en-tête"
      />
      <button
        type="button"
        onClick={() => heroImageInputRef.current?.click()}
        disabled={uploadingImage}
        className="px-4 py-2 bg-brandGold/90 text-richEbony hover:bg-brandGold transition-colors duration-300 rounded-md shadow-subtle flex items-center gap-2 mx-auto"
        aria-busy={uploadingImage}
      >
        {uploadingImage ? (
          <>
            <div className="w-4 h-4 border-2 border-t-transparent border-richEbony/50 rounded-full animate-spin"></div>
            <span>Téléchargement...</span>
          </>
        ) : (
          <>
            <FiPlusCircle size={16} />
            <span>Ajouter une image</span>
          </>
        )}
      </button>
      <p className="text-xs text-platinumGray mt-4">
        Format recommandé: 1200 × 600px (ratio 2:1) • JPG ou PNG • Maximum 5 MB
      </p>
    </div>
  )}
</div>
            
            {/* Rich Text Editor */}
            <div>
              <label htmlFor="newsletter-content" className="block text-sm font-medium text-richEbony mb-2 flex justify-between items-center">
                <span>Contenu de votre newsletter</span>
                <button
                  type="button"
                  onClick={() => contentImageInputRef.current?.click()}
                  className="text-brandGold hover:text-brandGold/80 text-sm flex items-center gap-1"
                  disabled={uploadingImage}
                >
                  <FiImage size={14} />
                  <span>Insérer une image</span>
                </button>
              </label>
              
              <input
                type="file"
                ref={contentImageInputRef}
                onChange={handleContentImageUpload}
                accept="image/*"
                className="hidden"
                aria-label="Choisir une image à insérer"
              />
              
              <div className="border rounded-md">
  <RichTextEditor
    value={htmlContent}
    onChange={setHtmlContent}
    modules={modules}
    formats={formats}
    placeholder="Composez le contenu élégant de votre newsletter..."
    className="h-64 mb-12"
    id="newsletter-content"
  />
</div>
            </div>
            
            {/* Newsletter Preview */}
            <AnimatePresence>
  {showPreview && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
      id="newsletter-preview"
    >
      <div className="border border-brandGold/20 rounded-md overflow-hidden">
        <div className="bg-richEbony/5 p-3 border-b border-brandGold/10 flex items-center justify-between">
          <h3 className="font-medium text-brandGold flex items-center gap-1.5">
            <FiEye size={16} />
            <span>Aperçu de la newsletter</span>
          </h3>
        </div>
        <div className="p-3 max-h-[600px] overflow-auto bg-white">
          <div className="shadow-md">
            <div className="bg-richEbony p-4 text-center">
              <div className="text-brandGold font-serif font-bold text-lg">DIAMANT ROUGE</div>
            </div>
            
            {heroImage && (
              <div className="w-full max-h-[350px] overflow-hidden">
                <div className="aspect-[16/9] relative">
                  <Image 
                    src={heroImage.url}
                    alt={heroImage.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            
            <div className="p-6">
              <h2 className="text-xl font-serif text-brandGold mb-4">{subject || "Sujet de la newsletter"}</h2>
              <div className="h-1 w-16 bg-brandGold/80 mx-auto mb-6"></div>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent || "<p>Contenu de la newsletter...</p>" }} />
              
              <div className="mt-8 text-center">
                <a 
                  href="#" 
                  className="px-6 py-3 bg-brandGold/90 text-richEbony hover:bg-brandGold transition-colors duration-300 rounded-sm inline-block"
                >
                  Découvrir nos collections
                </a>
              </div>
            </div>
            
            <div className="bg-richEbony p-4 text-center">
              <div className="text-brandGold text-xs space-y-2">
                <p>© {new Date().getFullYear()} Diamant Rouge. Tous droits réservés.</p>
                <p>Vous recevez cet email car vous êtes abonné à notre newsletter.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
            
            {/* Recipients */}
            <div>
              <label htmlFor="newsletter-recipients" className="block text-sm font-medium text-richEbony mb-2 flex items-center gap-1">
                <FiUsers size={15} />
                <span>Destinataires ({selectedEmails.length || "tous"})</span>
              </label>
              <div id="newsletter-recipients" className="p-3 bg-platinumGray/5 border border-platinumGray/20 rounded-md">
                {selectedEmails.length === 0 ? (
                  <span className="text-platinumGray italic">Tous les abonnés recevront cet email</span>
                ) : (
                  <div>
                    <div className="text-sm font-medium text-richEbony mb-2">
                      {selectedEmails.length} abonné{selectedEmails.length > 1 ? 's' : ''} sélectionné{selectedEmails.length > 1 ? 's' : ''}
                    </div>
                    <div className="max-h-20 overflow-y-auto">
                      <div className="flex flex-wrap gap-2">
                        {selectedEmails.map(email => (
                          <div key={email} className="bg-brandGold/10 text-richEbony px-2 py-1 rounded-full text-xs flex items-center">
                            <span className="max-w-[150px] truncate">{email}</span>
                            <button 
                              type="button" 
                              onClick={() => toggleSelect(email)}
                              className="ml-1 text-burgundy hover:text-burgundy/70"
                              aria-label={`Retirer ${email} de la sélection`}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Send Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-brandGold/90 text-richEbony hover:bg-brandGold transition-colors duration-300 rounded-md shadow-subtle flex items-center gap-2"
                disabled={isSending || (selectedEmails.length === 0 && subscribers.length === 0) || !subject || uploadingImage}
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-transparent border-richEbony/50 rounded-full animate-spin"></div>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <FiSend size={18} />
                    <span>Envoyer la Newsletter</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}