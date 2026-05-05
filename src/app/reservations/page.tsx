'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CalendarCheck, 
  ArrowLeft,
  Calendar,
  Users,
  Loader2,
  Building2,
  Search
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function ReservationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [reservations, setReservations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchReservations();
    }
  }, [user, authLoading]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*, salles(*)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (err: any) {
      console.error("Error fetching reservations:", err);
      toast.error("Impossible de charger vos réservations");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (loading && !reservations.length)) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-6 pt-20">
        <div className="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
        <p className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-xs animate-pulse">Chargement de vos réservations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 px-4 md:px-8">
      <motion.div 
        className="max-w-4xl mx-auto space-y-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <button 
              onClick={() => router.push('/espace-client')}
              className="flex items-center gap-2 text-[#D4AF37] text-xs font-black uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
            >
              <ArrowLeft className="w-4 h-4" /> Retour à l'espace client
            </button>
            <h1 className="text-4xl md:text-5xl font-serif italic font-black text-[#0a1628]">
              Mes <span className="text-[#D4AF37]">Réservations</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-[#D4AF37]/10 shadow-sm">
            <CalendarCheck className="w-6 h-6 text-[#D4AF37]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">Total</span>
              <span className="text-xl font-serif italic font-black text-[#0a1628]">{reservations.length} Événements</span>
            </div>
          </div>
        </div>

        {/* Reservations List */}
        <div className="space-y-6">
          {reservations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {reservations.map((res, index) => (
                <ReservationCard key={res.id} res={res} index={index} router={router} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] p-16 border border-[#D4AF37]/15 text-center space-y-6 shadow-sm">
              <div className="w-20 h-20 bg-[#D4AF37]/5 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-10 h-10 text-[#D4AF37]/30" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif italic font-black text-[#0a1628]">Aucune réservation</h3>
                <p className="text-gray-400 max-w-sm mx-auto font-medium">Vous n'avez pas encore de réservations effectuées sur notre plateforme.</p>
              </div>
              <button 
                onClick={() => router.push('/salles')}
                className="px-10 h-14 bg-[#D4AF37] text-[#0a1628] rounded-2xl font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
              >
                Explorer les salles
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function ReservationCard({ res, index, router }: { res: any; index: number; router: any }) {
  const images = res.salles?.image_url?.split(',') || [];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-[#D4AF37]/15 shadow-premium hover:shadow-gold-subtle transition-all duration-500 group"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Photo Section */}
        <div className="relative w-full md:w-48 h-48 rounded-3xl overflow-hidden shrink-0 border border-gray-100">
          <img 
            src={images[0] || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80"} 
            alt={res.salles?.nom} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg border border-[#D4AF37]/20 shadow-sm">
             <span className={`text-[9px] font-black uppercase tracking-widest ${
              res.statut === 'confirmée' ? "text-green-600" : "text-orange-500"
            }`}>
              {res.statut || "En attente"}
            </span>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-2xl font-serif italic font-black text-[#0a1628] group-hover:text-[#D4AF37] transition-colors">{res.salles?.nom}</h4>
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                {res.salles?.wilaya}
              </div>
            </div>
            <div className="text-left md:text-right">
               <span className="text-2xl font-black text-[#D4AF37] block">{res.prix_total?.toLocaleString()} DZD</span>
               <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Prix Total Estimé</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-50">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Date de l'événement</span>
              <div className="flex items-center gap-2 text-[#0a1628] font-bold">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                {new Date(res.date_reservation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Nombre d'invités</span>
              <div className="flex items-center gap-2 text-[#0a1628] font-bold">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                {res.nombre_cartes} Personnes
              </div>
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Services Inclus</span>
              <div className="flex flex-wrap gap-1">
                {res.formule_choisie && (
                  <span className="px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] text-[8px] font-black uppercase rounded-md border border-[#D4AF37]/10">
                    Formule: {res.formule_choisie}
                  </span>
                )}
                {/* Simulation des services si non présents explicitement */}
                <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[8px] font-black uppercase rounded-md border border-gray-100">
                  Conciergerie Incluse
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4">
             <button 
              onClick={() => router.push(`/salles/${res.salle_id}`)}
              className="px-8 py-3 bg-[#0a1628] text-[#D4AF37] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-[#0a1628] transition-all duration-300 shadow-lg hover:shadow-[#D4AF37]/20"
            >
              Voir les détails de la salle
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
