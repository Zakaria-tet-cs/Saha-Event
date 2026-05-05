"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Users, 
  ChevronLeft, 
  Plus, 
  Minus, 
  Paperclip, 
  Check, 
  Loader2, 
  X, 
  FileText, 
  Image as ImageIcon,
  Info,
  Clock,
  Music2,
  Camera,
  UtensilsCrossed,
  Wine,
  Sparkles,
  ShieldCheck,
  Truck,
  Volume2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";

// Config des services par défaut si la salle n'en a pas
const DEFAULT_SERVICES = [
  { id: "decoration", label: "Décoration florale", icon: Sparkles, price: 5000 },
  { id: "traiteur", label: "Traiteur / Resturation", icon: UtensilsCrossed, price: 15000 },
  { id: "musique", label: "DJ / Animation musicale", icon: Music2, price: 8000 },
  { id: "photographe", label: "Photographe professionnel", icon: Camera, price: 10000 },
  { id: "videaste", label: "Vidéaste", icon: Camera, price: 12000 },
  { id: "securite", label: "Sécurité", icon: ShieldCheck, price: 5000 },
  { id: "valet", label: "Valet parking", icon: Truck, price: 3000 },
  { id: "serveurs", label: "Service de serveurs", icon: Wine, price: 7000 },
  { id: "sono", label: "Sono et éclairage", icon: Volume2, price: 6000 },
];

export default function ReservationPage() {
  const params = useParams();
  const router = useRouter();
  const salleId = params?.salle_id as string;

  const [salle, setSalle] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [countdown, setCountdown] = React.useState(3);

  // Form State
  const [formData, setFormData] = React.useState({
    date: "",
    selectedServices: [] as string[],
    cards: 100,
    notes: "",
    file: null as File | null,
  });

  const [errors, setErrors] = React.useState<any>({});
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [displayPrice, setDisplayPrice] = React.useState(0);

  // Load User & Salle
  React.useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUser(user);

      if (salleId) {
        const { data, error } = await supabase
          .from("salles")
          .select("*")
          .eq("id", salleId)
          .single();
        
        if (error || !data) {
          toast.error("Salle introuvable.");
          router.push("/salles");
          return;
        }
        setSalle(data);
        setTotalPrice(data.prix || 0);
        setDisplayPrice(data.prix || 0);
      }
      setLoading(false);
    }
    init();
  }, [salleId, router]);

  // Dynamic Price Calculation
  React.useEffect(() => {
    if (!salle) return;
    
    let base = salle.prix || 0;
    const servicesPrice = formData.selectedServices.length * 5000; // Prix fixe fictif par service comme demandé
    const total = base + servicesPrice;
    
    setTotalPrice(total);
  }, [formData.selectedServices, salle]);

  // Count-up effect for price
  React.useEffect(() => {
    const duration = 800; // 0.8s
    const steps = 20;
    const increment = (totalPrice - displayPrice) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      if (currentStep < steps) {
        setDisplayPrice(prev => Math.round(prev + increment));
        currentStep++;
      } else {
        setDisplayPrice(totalPrice);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [totalPrice]);

  // Handlers
  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, file: "Fichier trop volumineux (max 5MB)" });
        return;
      }
      setFormData({ ...formData, file });
      setErrors({ ...errors, file: null });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Validations
    const newErrors: any = {};
    if (!formData.date) newErrors.date = "Veuillez choisir une date";
    else if (new Date(formData.date) <= new Date()) newErrors.date = "La date doit être dans le futur";
    
    if (formData.cards <= 0) newErrors.cards = "Nombre de cartes invalide";
    if (!formData.file) newErrors.file = "Le reçu CCP est obligatoire";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Veuillez corriger les erreurs.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Vérification de l'utilisateur et du profil
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error('Vous devez être connecté pour réserver');
        router.push('/auth/login');
        return;
      }

      console.log('User ID for reservation:', user.id);

      // Vérifier si le profil existe
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      // Si le profil n'existe pas, le créer pour éviter l'erreur de clé étrangère
      if (!profile) {
        console.log('Profil manquant, création en cours...');
        const { error: upsertError } = await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur',
          role: user.email?.includes('@estin.dz') ? 'admin' : 'user',
          updated_at: new Date().toISOString()
        });
        if (upsertError) console.error('Erreur lors de la création du profil:', upsertError);
      }

      // 2. Upload File
      const ext = formData.file!.name.split(".").pop();
      const fileName = `${user.id}-${salleId}-${Date.now()}.${ext}`;
      
      const { error: uploadError } = await supabase.storage
        .from("receipts")
        .upload(fileName, formData.file!);

      if (uploadError) throw uploadError;

      // 3. Get Signed URL
      const { data: signedData, error: urlError } = await supabase.storage
        .from("receipts")
        .createSignedUrl(fileName, 31536000); // 1 year

      if (urlError) throw urlError;

      // 4. Insert Reservation
      const { error: insertError } = await supabase
        .from("reservations")
        .insert({
          user_id: user.id,
          salle_id: salleId,
          date_reservation: formData.date,
          services: formData.selectedServices,
          nombre_cartes: formData.cards,
          prix_total: totalPrice,
          receipt_url: signedData.signedUrl,
          statut: 'en_attente',
          notes: formData.notes
        });

      if (insertError) {
        console.error('Erreur insertion réservation:', insertError);
        throw insertError;
      }

      setSuccess(true);
      toast.success('Réservation effectuée avec succès !');
      
      // Redirect countdown
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            router.push("/espace-client?tab=reservations");
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error: any) {
      console.error('Erreur complète:', error);
      toast.error(error.message || "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
      <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-[1100px] mx-auto">
        
        {/* Breadcrumb & Header */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4 font-medium">
            <span className="hover:text-[#D4AF37] cursor-pointer" onClick={() => router.push('/salles')}>Salles</span>
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span className="hover:text-[#D4AF37] cursor-pointer" onClick={() => router.push(`/salles/${salleId}`)}>{salle?.nom}</span>
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span className="text-[#0a1628] font-bold">Réservation</span>
          </nav>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-[#0a1628] font-serif italic mb-2">
              Réserver — {salle?.nom}
            </h1>
            <p className="text-gray-500 font-medium">
              Remplissez le formulaire pour confirmer votre réservation de prestige.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-10">
          
          {/* Form Column */}
          <div className="lg:col-span-6 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[24px] p-8 shadow-[0_4px_24px_rgba(10,22,40,0.08)] border border-[#D4AF37]/15"
            >
              <form onSubmit={handleSubmit} className="space-y-10">
                
                {/* Date */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[#0a1628] font-bold text-sm uppercase tracking-wider">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" /> Date de réservation
                  </label>
                  <input 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className={`w-full p-4 rounded-xl border-1.5 transition-all text-[#0a1628] font-bold outline-none ${
                      errors.date ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10'
                    }`}
                  />
                  {errors.date && <p className="text-red-500 text-xs font-bold">{errors.date}</p>}
                </div>

                {/* Services */}
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="flex items-center gap-2 text-[#0a1628] font-bold text-sm uppercase tracking-wider">
                      <Clock className="w-4 h-4 text-[#D4AF37]" /> Services additionnels
                    </label>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">(Sélectionnez les services souhaités)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DEFAULT_SERVICES.map((service) => {
                      const isSelected = formData.selectedServices.includes(service.id);
                      const Icon = service.icon;
                      return (
                        <motion.div
                          key={service.id}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleService(service.id)}
                          className={`flex items-center justify-between p-4 rounded-xl border-1.5 cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]' 
                              : 'bg-[#FDFBF7] border-gray-100 text-gray-500 hover:border-[#D4AF37]/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                            <span className="text-xs font-black uppercase tracking-wide">{service.label}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4" />}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Cards Count */}
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="flex items-center gap-2 text-[#0a1628] font-bold text-sm uppercase tracking-wider">
                      <FileText className="w-4 h-4 text-[#D4AF37]" /> Nombre de cartes
                    </label>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">(Estimation du nombre d'invités)</span>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFormData({...formData, cards: Math.max(10, formData.cards - 10)})}
                      className="w-12 h-12 rounded-full border-1.5 border-[#D4AF37] text-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-white transition-all"
                    >
                      <Minus className="w-5 h-5" />
                    </motion.button>
                    
                    <input 
                      type="number"
                      value={formData.cards}
                      onChange={(e) => setFormData({...formData, cards: parseInt(e.target.value) || 0})}
                      className="w-32 p-4 text-center rounded-xl border-1.5 border-[#D4AF37] text-2xl font-black text-[#0a1628] outline-none"
                    />

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFormData({...formData, cards: Math.min(2000, formData.cards + 10)})}
                      className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#0a1628] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[#0a1628] font-bold text-sm uppercase tracking-wider">
                    <Info className="w-4 h-4 text-[#D4AF37]" /> Notes et demandes spéciales
                  </label>
                  <textarea 
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Précisez vos besoins particuliers, thème souhaité..."
                    className="w-full p-4 rounded-xl border-1.5 border-gray-200 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all font-medium"
                  />
                </div>

                {/* Receipt Upload */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-[#0a1628] font-bold text-sm uppercase tracking-wider">
                      <Paperclip className="w-4 h-4 text-[#D4AF37]" /> Reçu de paiement CCP
                    </label>
                    <span className="text-[10px] text-red-500 font-black uppercase tracking-widest">Obligatoire</span>
                  </div>
                  
                  {!formData.file ? (
                    <motion.label 
                      whileHover={{ scale: 1.01 }}
                      className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${
                        errors.file ? 'border-red-300 bg-red-50' : 'border-[#D4AF37]/30 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/60'
                      }`}
                    >
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                      <Paperclip className="w-10 h-10 text-[#D4AF37] mb-4" />
                      <p className="text-[#0a1628] font-black text-sm uppercase tracking-wide">Glissez votre reçu ici</p>
                      <p className="text-gray-400 text-xs mt-1">Ou cliquez pour sélectionner un fichier</p>
                      <p className="text-[9px] text-gray-300 font-bold uppercase mt-4">PDF, JPG, PNG — MAX 5MB</p>
                    </motion.label>
                  ) : (
                    <div className="flex items-center justify-between p-6 bg-white border-1.5 border-[#D4AF37] rounded-3xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center">
                          {formData.file.type.includes('pdf') ? <FileText className="text-[#D4AF37]" /> : <ImageIcon className="text-[#D4AF37]" />}
                        </div>
                        <div>
                          <p className="text-[#0a1628] font-bold text-sm truncate max-w-[200px]">{formData.file.name}</p>
                          <p className="text-gray-400 text-[10px] font-black uppercase">{(formData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, file: null})}
                        className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {errors.file && <p className="text-red-500 text-xs font-bold">{errors.file}</p>}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-16 rounded-full font-black uppercase tracking-[0.2em] text-sm shadow-xl flex items-center justify-center gap-3 text-[#0a1628] border-0 mt-12"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #9A7A20)' }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Traitement en cours...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Confirmer la réservation</span>
                    </>
                  )}
                </Button>

              </form>
            </motion.div>
          </div>

          {/* Recap Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[24px] overflow-hidden shadow-[0_8px_32px_rgba(10,22,40,0.1)] border border-[#D4AF37]/20"
              >
                <div className="bg-[#0a1628] p-5">
                  <h3 className="text-[#D4AF37] font-serif text-xl font-black italic">Récapitulatif</h3>
                </div>

                <div className="h-40 w-full relative overflow-hidden bg-gray-100">
                  {salle?.image_url ? (
                    <img src={salle.image_url.split(',')[0]} className="w-full h-full object-cover" alt={salle.nom} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold uppercase tracking-widest text-xs">
                      Aucune Photo
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="text-[#0a1628] font-serif text-lg font-black italic">{salle?.nom}</h4>
                    <div className="flex items-center gap-1.5 text-gray-400 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{salle?.localisation}</span>
                    </div>
                  </div>

                  <div className="h-px bg-[#D4AF37]/20" />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Prix de base</span>
                      <span className="text-[#0a1628] font-black">{salle?.prix?.toLocaleString()} DZD</span>
                    </div>

                    <AnimatePresence>
                      {formData.selectedServices.map((id) => {
                        const service = DEFAULT_SERVICES.find(s => s.id === id);
                        return (
                          <motion.div
                            key={id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-[#D4AF37] font-bold text-[11px] uppercase tracking-wide">+ {service?.label}</span>
                            <span className="text-[#D4AF37] font-black italic">5,000 DZD</span>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  <div className="h-px bg-[#D4AF37]/20" />

                  <div className="flex flex-col items-center py-4 bg-[#FDFBF7] rounded-2xl border border-[#D4AF37]/10">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-2">Total Estimé</span>
                    <div className="text-3xl font-black text-[#D4AF37] font-serif italic">
                      {displayPrice.toLocaleString()} <span className="text-sm font-bold not-italic">DZD</span>
                    </div>
                    <p className="text-[10px] text-gray-400 italic mt-2 text-center px-4">Paiement CCP puis envoi du reçu requis</p>
                  </div>

                  <div className="flex justify-center">
                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full border border-orange-100">
                      <Clock className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase">En attente de validation</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[9999] bg-[#FDFBF7]/98 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-200 mb-8"
            >
              <Check className="w-12 h-12 text-white stroke-[4]" />
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-black text-[#0a1628] font-serif italic mb-4"
            >
              Réservation envoyée !
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 font-medium max-w-[320px] mb-8"
            >
              Votre réservation est en attente de validation par l'administrateur.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-50 text-orange-600 rounded-full border border-orange-100 mb-12"
            >
              <Clock className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">En attente de validation</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-gray-400 text-sm font-bold"
            >
              Redirection dans {countdown}...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Bar Mobile */}
      <div className="fixed lg:hidden bottom-0 left-0 w-full h-20 bg-white border-t border-[#D4AF37]/20 px-6 flex items-center justify-between z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-black uppercase">Total estimé</span>
          <span className="text-xl font-black text-[#D4AF37] italic font-serif">{displayPrice.toLocaleString()} DZD</span>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={submitting || success}
          className="h-12 px-8 rounded-full font-black uppercase tracking-widest text-[10px] text-[#0a1628] border-0"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #9A7A20)' }}
        >
          {submitting ? "..." : "Confirmer"}
        </Button>
      </div>

    </div>
  );
}
