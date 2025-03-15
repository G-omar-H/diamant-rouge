import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckSquare, FiSquare, FiAlertCircle, FiCheck, FiSend, FiMail, FiUsers, FiCalendar } from "react-icons/fi";

type Subscriber = {
  id: number;
  email: string;
  createdAt: string;
};

export function ManageNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendStatus, setSendStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

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

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (sendStatus && !sendStatus.includes("Erreur")) {
      const timer = setTimeout(() => {
        setSendStatus("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [sendStatus]);

  function toggleSelect(email: string) {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  }

  function selectAll() {
    setSelectedEmails(subscribers.map((s) => s.email));
  }

  function deselectAll() {
    setSelectedEmails([]);
  }

  async function handleSendMassEmail(e: React.FormEvent) {
    e.preventDefault();
    setSendStatus("");
    setIsSending(true);
    
    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          message,
          recipients: selectedEmails, // if empty, endpoint will send to all
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSendStatus(`Erreur: ${data.error || "Échec de l'envoi des emails"}`);
      } else {
        setSendStatus(`Email${selectedEmails.length !== 1 ? 's' : ''} envoyé${selectedEmails.length !== 1 ? 's' : ''} avec succès !`);
        // Clear form fields
        setSelectedEmails([]);
        setSubject("");
        setMessage("");
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
          <p className="text-platinumGray mt-1">Gérez vos abonnés et envoyez des communications exclusives</p>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subscribers List */}
        <div className="bg-white/50 backdrop-blur-sm border border-brandGold/20 rounded-lg overflow-hidden shadow-luxury">
          <div className="p-6 border-b border-brandGold/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-serif text-brandGold flex items-center gap-2">
                <FiMail size={20} />
                <span>Abonnés à la Newsletter</span>
              </h2>
              <div className="flex gap-3">
                <button 
                  onClick={selectAll} 
                  className="px-3 py-1.5 border border-brandGold/50 text-brandGold hover:bg-brandGold/10 rounded-md flex items-center gap-1.5 transition-colors text-sm"
                >
                  <FiCheckSquare size={14} />
                  <span>Tout Sélectionner</span>
                </button>
                <button 
                  onClick={deselectAll} 
                  className="px-3 py-1.5 border border-platinumGray/30 text-platinumGray hover:text-richEbony hover:border-platinumGray transition-colors rounded-md flex items-center gap-1.5 text-sm"
                >
                  <FiSquare size={14} />
                  <span>Désélectionner</span>
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-t-brandGold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-platinumGray">Chargement des abonnés...</p>
              </div>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-16">
              <FiMail size={48} className="text-platinumGray/30 mx-auto mb-4" />
              <p className="text-platinumGray">Aucun abonné à la newsletter pour le moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-richEbony/5 text-richEbony sticky top-0 z-10">
                  <tr>
                    <th className="p-3 text-left w-16"></th>
                    <th className="p-3 text-left font-serif">Email</th>
                    <th className="p-3 text-right font-serif">Date d'Inscription</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => {
                    const date = new Date(subscriber.createdAt);
                    const formattedDate = date.toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });
                    
                    return (
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
                          />
                        </td>
                        <td className="p-3 font-medium">{subscriber.email}</td>
                        <td className="p-3 text-right text-sm text-platinumGray flex items-center justify-end gap-1">
                          <FiCalendar size={12} className="opacity-70" />
                          {formattedDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Email Composition Section */}
        <div className="bg-white/50 backdrop-blur-sm border border-brandGold/20 rounded-lg p-6 shadow-luxury">
          <h2 className="text-xl font-serif text-brandGold mb-6 flex items-center gap-2">
            <FiSend size={20} />
            <span>Composer une Newsletter</span>
          </h2>
          
          <form onSubmit={handleSendMassEmail} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-richEbony mb-2">
                Sujet
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Nouvelles collections exclusives..."
                className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-richEbony mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Découvrez nos nouvelles créations..."
                className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md h-40 resize-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-richEbony mb-2 flex items-center gap-1">
                <FiUsers size={15} />
                <span>Destinataires ({selectedEmails.length || "tous"})</span>
              </label>
              <div className="p-3 bg-platinumGray/5 border border-platinumGray/20 rounded-md">
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
            
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-brandGold/90 text-richEbony hover:bg-brandGold transition-colors duration-300 rounded-md shadow-subtle flex items-center gap-2"
                disabled={isSending || loading}
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