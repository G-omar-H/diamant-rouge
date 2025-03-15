import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckSquare, FiSquare, FiAlertCircle, FiCheck, FiSend, FiMail, FiUsers, FiImage, FiPlusCircle, FiEye, FiTrash2, FiSearch } from "react-icons/fi";
import dynamic from "next/dynamic";
import Image from "next/image";

// Import rich text editor with SSR disabled
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

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
      formData.append("file", file);
      formData.append("type", "newsletter");
      
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error("Échec du téléchargement de l'image");
      }
      
      const data = await res.json();
      setHeroImage({
        id: data.id || Date.now().toString(),
        url: data.url,
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

  // Handle content image upload
  async function handleContentImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "newsletter");
      
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error("Échec du téléchargement de l'image");
      }
      
      const data = await res.json();
      const newImage = {
        id: data.id || Date.now().toString(),
        url: data.url,
        alt: `Image ${contentImages.length + 1} pour la newsletter`
      };
      
      setContentImages(prev => [...prev, newImage]);
      
      // Insert image in the editor
      const imageHtml = `<img src="${newImage.url}" alt="${newImage.alt}" class="newsletter-content-image" style="max-width: 100%; margin: 1rem 0;" />`;
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
  function generateNewsletterHtml() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject || "Newsletter Diamant Rouge"}</title>
        <style>
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f8f8f8;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            text-align: center;
            padding: 20px;
            background-color: #1c1c1c;
          }
          .logo {
            max-width: 180px;
          }
          .hero-image {
            width: 100%;
            max-height: 300px;
            object-fit: cover;
          }
          .content {
            padding: 30px;
          }
          .footer {
            background-color: #1c1c1c;
            color: #d4af37;
            text-align: center;
            padding: 20px;
            font-size: 12px;
          }
          h1, h2, h3 {
            color: #1c1c1c;
            font-family: 'Georgia', serif;
          }
          .gold-text {
            color: #d4af37;
          }
          .button {
            display: inline-block;
            background-color: #d4af37;
            color: #1c1c1c;
            text-decoration: none;
            padding: 12px 25px;
            margin: 15px 0;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://diamant-rouge.com/logo.png" alt="Diamant Rouge" class="logo">
          </div>
          
          ${heroImage ? `<img src="${heroImage.url}" alt="${heroImage.alt}" class="hero-image">` : ''}
          
          <div class="content">
            ${htmlContent || '<p>Contenu de la newsletter...</p>'}
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Diamant Rouge. Tous droits réservés.</p>
            <p>Vous recevez cet email car vous êtes abonné à notre newsletter.</p>
            <p><a href="https://diamant-rouge.com/unsubscribe" style="color: #d4af37;">Se désabonner</a></p>
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

      