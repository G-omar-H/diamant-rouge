import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiCalendar, 
  FiClock, 
  FiMap, 
  FiUser, 
  FiAlertCircle, 
  FiCheck, 
  FiX, 
  FiEdit2, 
  FiTrash2, 
  FiPhone, 
  FiMail, 
  FiVideo, 
  FiCoffee, 
  FiDroplet 
} from "react-icons/fi";

type Appointment = {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  location: 'casablanca' | 'virtual';
  locationType?: string;
  appointmentType: 'discovery' | 'bespoke' | 'bridal' | 'investment';
  appointmentTypeLabel?: string;
  guestCount: number;
  preferences?: 'moroccan_tea' | 'arabic_coffee' | 'fruit_juice' | 'water' | 'none' | '';
  specialRequests?: string;
  createdAt: string;
};

export function ManageAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Appointment>>({});
  const [showConfirmDelete, setShowConfirmDelete] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  // Success message auto-dismiss
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch appointments from API
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Function to fetch appointments
  async function fetchAppointments() {
    setIsLoading(true);
    setError("");
    
    try {
      // Build query parameters for filtering
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (dateFilter) params.append("date", dateFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (locationFilter !== "all") params.append("location", locationFilter);
      
      // Fetch appointments from API
      const response = await fetch(`/api/admin/appointments?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec lors de la récupération des rendez-vous");
      }
      
      const data = await response.json();
      setAppointments(data);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des rendez-vous:", err);
      setError(err.message || "Une erreur est survenue lors de la récupération des rendez-vous");
    } finally {
      setIsLoading(false);
    }
  }

  // Helper functions
  function handleOpenEditModal(appointment: Appointment) {
    setSelectedAppointment(appointment);
    setEditFormData({
      clientName: appointment.clientName,
      clientEmail: appointment.clientEmail,
      clientPhone: appointment.clientPhone,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      duration: appointment.duration,
      status: appointment.status,
      notes: appointment.notes || "",
      location: appointment.location,
      locationType: appointment.locationType,
      appointmentType: appointment.appointmentType,
      appointmentTypeLabel: appointment.appointmentTypeLabel,
      guestCount: appointment.guestCount,
      preferences: appointment.preferences || "",
      specialRequests: appointment.specialRequests || "",
    });
  }

  function handleCloseEditModal() {
    setSelectedAppointment(null);
    setEditFormData({});
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  }

  // Update appointment
  async function handleUpdateAppointment() {
    if (!selectedAppointment) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/admin/appointments/${selectedAppointment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour du rendez-vous");
      }
      
      // Update the local state with the updated appointment
      setAppointments(prevAppointments => 
        prevAppointments.map(appt => 
          appt.id === selectedAppointment.id ? { ...appt, ...data } : appt
        )
      );
      
      setSuccessMessage("Rendez-vous mis à jour avec succès");
      handleCloseEditModal();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Delete appointment
  async function handleDeleteAppointment(id: number) {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/admin/appointments/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la suppression du rendez-vous");
      }
      
      // Remove the deleted appointment from the local state
      setAppointments(prevAppointments => 
        prevAppointments.filter(appt => appt.id !== id)
      );
      
      setSuccessMessage("Rendez-vous supprimé avec succès");
      setShowConfirmDelete(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Format date for display
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  // Get status badge with color
  function getStatusBadge(status: string) {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <FiClock className="mr-1" size={12} />
            En attente
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <FiCheck className="mr-1" size={12} />
            Confirmé
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <FiCheck className="mr-1" size={12} />
            Terminé
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <FiX className="mr-1" size={12} />
            Annulé
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            {status}
          </span>
        );
    }
  }

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    // Filter by status
    const statusMatch = statusFilter === "all" || appointment.status === statusFilter;
    
    // Filter by date
    const dateMatch = !dateFilter || appointment.appointmentDate === dateFilter;
    
    // Filter by appointment type
    const typeMatch = typeFilter === "all" || appointment.appointmentType === typeFilter;
    
    // Filter by location
    const locationMatch = locationFilter === "all" || appointment.location === locationFilter;
    
    return statusMatch && dateMatch && typeMatch && locationMatch;
  });

  // Fix table display for preferences icons
  const getPreferenceIcon = (preference: string) => {
    switch (preference) {
      case 'moroccan_tea':
      case 'arabic_coffee':
        return <FiCoffee size={12} className="mr-1 text-platinumGray" />;
      case 'fruit_juice':
      case 'water':
        return <FiDroplet size={12} className="mr-1 text-platinumGray" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-brandGold">Gestion des Rendez-vous</h1>
          <p className="text-platinumGray mt-1">Organisez et suivez vos rendez-vous clients</p>
        </div>
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
      
      {/* Filters */}
      <div className="bg-white/50 backdrop-blur-sm border border-brandGold/20 rounded-lg p-4 shadow-luxury">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Status filter */}
          <div>
            <label className="block text-xs text-platinumGray mb-1 font-medium">Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 w-full border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold bg-white/70"
            >
              <option value="all">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="CONFIRMED">Confirmés</option>
              <option value="COMPLETED">Terminés</option>
              <option value="CANCELLED">Annulés</option>
            </select>
          </div>
          
          {/* Appointment type filter */}
          <div>
            <label className="block text-xs text-platinumGray mb-1 font-medium">Type de consultation</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 w-full border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold bg-white/70"
            >
              <option value="all">Tous les types</option>
              <option value="discovery">Découverte des Collections</option>
              <option value="bespoke">Création Sur-Mesure</option>
              <option value="bridal">Collection Nuptiale</option>
              <option value="investment">Joaillerie d'Investissement</option>
            </select>
          </div>
          
          {/* Location filter */}
          <div>
            <label className="block text-xs text-platinumGray mb-1 font-medium">Lieu</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-2 w-full border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold bg-white/70"
            >
              <option value="all">Tous les lieux</option>
              <option value="casablanca">Showroom Casablanca</option>
              <option value="virtual">Consultation Virtuelle</option>
            </select>
          </div>
          
          {/* Date filter */}
          <div>
            <label className="block text-xs text-platinumGray mb-1 font-medium">Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 w-full border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold bg-white/70"
            />
          </div>
          
          {/* Reset filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter("all");
                setTypeFilter("all");
                setLocationFilter("all");
                setDateFilter("");
              }}
              className="px-4 py-2 w-full border border-platinumGray/30 text-platinumGray hover:text-richEbony hover:border-platinumGray transition-colors duration-200 rounded-md flex items-center justify-center gap-2"
            >
              <FiX size={18} />
              <span>Réinitialiser les filtres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {isLoading && !selectedAppointment ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-brandGold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-platinumGray">Chargement des rendez-vous...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur-sm border border-brandGold/20 rounded-lg overflow-hidden shadow-luxury">
          {filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-platinumGray text-lg">Aucun rendez-vous trouvé</p>
              <button 
                onClick={() => {
                  setStatusFilter("all");
                  setDateFilter("");
                }}
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
                    <th className="p-4 text-left font-serif">Client</th>
                    <th className="p-4 text-left font-serif">Contact</th>
                    <th className="p-4 text-left font-serif">Date & Heure</th>
                    <th className="p-4 text-left font-serif">Type</th>
                    <th className="p-4 text-center font-serif">Lieu</th>
                    <th className="p-4 text-center font-serif">Invités</th>
                    <th className="p-4 text-center font-serif">Statut</th>
                    <th className="p-4 text-center font-serif">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment) => (
                    <tr 
                      key={appointment.id} 
                      className="border-b border-platinumGray/10 hover:bg-brandGold/5 transition-colors duration-150"
                    >
                      <td className="p-4 font-medium">{appointment.clientName}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="flex items-center text-sm"><FiMail size={12} className="mr-1 text-platinumGray" /> {appointment.clientEmail}</span>
                          <span className="flex items-center text-sm mt-1"><FiPhone size={12} className="mr-1 text-platinumGray" /> {appointment.clientPhone}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="flex items-center"><FiCalendar size={14} className="mr-1 text-platinumGray" /> {formatDate(appointment.appointmentDate)}</span>
                          <span className="flex items-center mt-1"><FiClock size={14} className="mr-1 text-platinumGray" /> {appointment.appointmentTime} ({appointment.duration} min)</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-richEbony">{appointment.appointmentTypeLabel}</span>
                        {appointment.preferences && (
                          <div className="mt-1 flex items-center">
                            {getPreferenceIcon(appointment.preferences)}
                            <span className="text-xs text-platinumGray">
                              {(() => {
                                switch (appointment.preferences) {
                                  case 'moroccan_tea': return 'Thé marocain';
                                  case 'arabic_coffee': return 'Café arabe';
                                  case 'fruit_juice': return 'Jus de fruits';
                                  case 'water': return 'Eau';
                                  case 'none': return 'Aucune préférence';
                                  default: return '';
                                }
                              })()}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          {appointment.location === 'casablanca' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brandGold/10 text-brandGold">
                              <FiMap size={12} className="mr-1" />
                              Showroom
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <FiVideo size={12} className="mr-1" />
                              Virtuel
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 min-w-[28px]">
                          {appointment.guestCount}
                        </span>
                      </td>
                      <td className="p-4 text-center">{getStatusBadge(appointment.status)}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => handleOpenEditModal(appointment)}
                            className="p-1.5 text-brandGold hover:bg-brandGold/10 rounded-full transition-colors duration-200"
                            title="Modifier"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button 
                            onClick={() => setShowConfirmDelete(appointment.id)}
                            className="p-1.5 text-burgundy hover:bg-burgundy/10 rounded-full transition-colors duration-200"
                            title="Supprimer"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-richEbony/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-luxury border border-brandGold/20 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif text-brandGold">Modifier le Rendez-vous</h3>
                <button
                  onClick={handleCloseEditModal}
                  className="p-1 text-platinumGray hover:text-burgundy rounded-full transition-colors duration-200"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Name */}
                <div>
                  <label className="block text-sm font-medium text-richEbony mb-1">Nom du Client</label>
                  <input
                    type="text"
                    name="clientName"
                    value={editFormData.clientName || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold focus:border-brandGold"
                  />
                </div>

                {/* Client Email */}
                <div>
                  <label className="block text-sm font-medium text-richEbony mb-1">Email</label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={editFormData.clientEmail || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold focus:border-brandGold"
                  />
                </div>

                {/* Client Phone */}
                <div>
                  <label className="block text-sm font-medium text-richEbony mb-1">Téléphone</label>
                  <input
                    type="text"
                    name="clientPhone"
                    value={editFormData.clientPhone || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold focus:border-brandGold"
                  />
                </div>

                {/* Appointment Location */}
                <div>
                  <label className="block text-sm font-medium text-richEbony mb-1">Lieu</label>
                  <select
                    name="location"
                    value={editFormData.location || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold focus:border-brandGold"
                  >
                    <option value="casablanca">Showroom Casablanca</option>
                    <option value="virtual">Consultation Virtuelle</option>
                  </select>
                </div>

                {/* Appointment Type */}
                <div>
                  <label className="block text-sm font-medium text-richEbony mb-1">Type de consultation</label>
                  <select
                    name="appointmentType"
                    value={editFormData.appointmentType || ""}
                    onChange={(e) => {
                      handleInputChange(e);
                      // Update the label based on selection
                      const appointmentTypeLabel = (() => {
                        switch (e.target.value) {
                          case 'discovery': return 'Découverte des Collections';
                          case 'bespoke': return 'Création Sur-Mesure';
                          case 'bridal': return 'Collection Nuptiale';
                          case 'investment': return 'Joaillerie d\'Investissement';
                          default: return '';
                        }
                      })();
                      setEditFormData(prev => ({...prev, appointmentTypeLabel}));
                    }}
                    className="w-full px-4 py-2 border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold focus:border-brandGold"
                  >
                    <option value="discovery">Découverte des Collections</option>
                    <option value="bespoke">Création Sur-Mesure</option>
                    <option value="bridal">Collection Nuptiale</option>
                    <option value="investment">Joaillerie d'Investissement</option>
                  </select>
                </div>

                {/* Appointment Date */}
                <div>
                  <label className="block text-sm font-medium text-richEbony mb-1">Date</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={editFormData.appointmentDate || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold focus:border-brandGold"
                  />
                </div>

                {/* Appointment Time */}
                <div>
                  <label className="block text-sm font-medium text-richEbony mb-1">Heure</label>
                  <select
                    name="appointmentTime"
                    value={editFormData.appointmentTime || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold focus:border-brandGold"
                  >
                    <optgroup label="Matinée">
                      <option value="10:00">10:00 - Séance matinale</option>
                      <option value="11:30">11:30 - Consultation privée</option>
                    </optgroup>
                    <optgroup label="Après-midi">
                      <option value="14:00">14:00 - Présentation exclusive</option>
                      <option value="15:30">15:30 - Rendez-vous thé & découverte</option>
                      <option value="17:00">17:00 - Séance au crépuscule</option>
                    </optgroup>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-richEbony mb-1">Durée (minutes)</label>
                  <select
                    name="duration"
                    value={editFormData.duration || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold focus:border-brandGold"
                  >
                    <option value="60">60 - Standard</option>
                    <option value="90">90 - Découverte approfondie</option>
                    <option value="120">120 - Consultation premium</option>
                  </select>
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block text-sm font-medium text-richEbony mb-1">Nombre d'invités</label>
                  <select
                    name="guestCount"
                    value={editFormData.guestCount || 1}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold focus:border-brandGold"
                  >
                    <option value={1}>1 personne</option>
                    <option value={2}>2 personnes</option>
                    <option value={3}>3 personnes</option>
                    <option value={4}>4 personnes</option>
                  </select>
                </div>

                {/* Preferences */}
                <div>
                  <label className="block text-sm font-medium text-richEbony mb-1">Préférences</label>
                  <select
                    name="preferences"
                    value={editFormData.preferences || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold focus:border-brandGold"
                  >
                    <option value="">Aucune sélection</option>
                    <option value="moroccan_tea">Thé marocain</option>
                    <option value="arabic_coffee">Café arabe</option>
                    <option value="fruit_juice">Jus de fruits</option>
                    <option value="water">Eau</option>
                    <option value="none">Aucune préférence</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-richEbony mb-1">Statut</label>
                  <select
                    name="status"
                    value={editFormData.status || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold focus:border-brandGold"
                  >
                    <option value="PENDING">En attente</option>
                    <option value="CONFIRMED">Confirmé</option>
                    <option value="COMPLETED">Terminé</option>
                    <option value="CANCELLED">Annulé</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-richEbony mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={editFormData.notes || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold focus:border-brandGold"
                ></textarea>
              </div>

              {/* Special Requests */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-richEbony mb-1">Demandes spéciales</label>
                <textarea
                  name="specialRequests"
                  value={editFormData.specialRequests || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold focus:border-brandGold"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={handleCloseEditModal}
                  className="px-6 py-2 border border-platinumGray/30 text-platinumGray hover:text-richEbony hover:border-platinumGray rounded-md transition-colors duration-200"
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateAppointment}
                  className="px-6 py-2 bg-brandGold text-white hover:bg-brandGold/90 rounded-md transition-colors duration-200 flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <span>Enregistrer les Modifications</span>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirmDelete !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-richEbony/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-luxury border border-brandGold/20 p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-serif text-burgundy mb-4">Confirmation de Suppression</h3>
              <p className="text-richEbony">
                Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action est irréversible.
              </p>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowConfirmDelete(null)}
                  className="px-6 py-2 border border-platinumGray/30 text-platinumGray hover:text-richEbony hover:border-platinumGray rounded-md transition-colors duration-200"
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeleteAppointment(showConfirmDelete)}
                  className="px-6 py-2 bg-burgundy text-white hover:bg-burgundy/90 rounded-md transition-colors duration-200 flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                      <span>Confirmer la Suppression</span>
                    </>
                  ) : (
                    <span>Confirmer la Suppression</span>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 