'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  ArrowLeft,
  MapPin,
  Star,
  Building2,
  Search,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchFavorites();
    }
  }, [user, authLoading]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favoris')
        .select('*, salles(*)')
        .eq('user_id', user?.id);

      if (error) throw error;
      setFavorites(data || []);
    } catch (err: any) {
      console.error("Error fetching favorites:", err);
      toast.error("Impossible de charger vos favoris");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (loading && !favorites.length)) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-6 pt-20">
        <div className="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
        <p className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-xs animate-pulse">Chargement de vos favoris...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 px-4 md:px-8">
      <motion.div 
        className="max-w-6xl mx-auto space-y-12"
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
              Mes <span className="text-[#D4AF37]">Coups de Cœur</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-[2rem] border border-[#D4AF37]/15 shadow-premium">
            <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37]/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">Total</span>
              <span className="text-2xl font-serif italic font-black text-[#0a1628]">{favorites.length} Salles</span>
            </div>
          </div>
        </div>

        {/* Favorites Grid */}
        <div className="w-full">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((fav, index) => (
                <FavoriteCard key={fav.id} fav={fav} index={index} router={router} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] p-20 border border-[#D4AF37]/15 text-center space-y-8 shadow-premium">
              <div className="w-24 h-24 bg-[#D4AF37]/5 rounded-full flex items-center justify-center mx-auto border border-[#D4AF37]/10">
                <Heart className="w-12 h-12 text-[#D4AF37]/20" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-serif italic font-black text-[#0a1628]">Votre liste est vide</h3>
                <p className="text-gray-400 max-w-sm mx-auto font-medium text-lg leading-relaxed">Parcourez nos salles d'exception et enregistrez vos préférées pour les retrouver en un clic.</p>
              </div>
              <button 
                onClick={() => router.push('/salles')}
                className="px-12 h-16 gold-gradient rounded-2xl text-[#0a1628] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.03] transition-all flex items-center gap-3 mx-auto"
              >
                <Sparkles size={20} />
                Explorer les Salles
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function FavoriteCard({ fav, index, router }: { fav: any; index: number; router: any }) {
  const images = fav.salles?.image_url?.split(',') || [];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-[2.5rem] overflow-hidden border border-[#D4AF37]/15 shadow-premium hover:shadow-gold-subtle transition-all duration-500 group"
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={images[0] || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80"} 
          alt={fav.salles?.nom} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        <div className="absolute top-5 right-5">
           <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/50 text-[#D4AF37]">
              <Heart className="w-5 h-5 fill-[#D4AF37]" />
           </div>
        </div>

        <div className="absolute bottom-5 left-5 right-5">
           <div className="flex items-center gap-2 text-white/90 text-[10px] font-black uppercase tracking-[0.2em]">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              {fav.salles?.wilaya}
           </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">Prestige Collection</span>
            <div className="flex items-center gap-1 text-[#D4AF37]">
              <Star size={12} className="fill-[#D4AF37]" />
              <span className="text-[11px] font-black">4.9</span>
            </div>
          </div>
          <h4 className="text-2xl font-serif italic font-black text-[#0a1628] group-hover:text-[#D4AF37] transition-colors truncate">
            {fav.salles?.nom}
          </h4>
        </div>

        <div className="flex items-center justify-between py-4 border-y border-gray-50">
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">À partir de</span>
              <span className="text-xl font-black text-[#0a1628]">{fav.salles?.prix_base?.toLocaleString()} <span className="text-sm">DZD</span></span>
           </div>
           <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Capacité</span>
                 <span className="text-sm font-bold text-[#0a1628]">{fav.salles?.capacite || "500+"} pers.</span>
              </div>
           </div>
        </div>

        <button 
          onClick={() => router.push(`/salles/${fav.salle_id}`)}
          className="w-full h-14 bg-[#0a1628] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] group-hover:bg-[#D4AF37] group-hover:text-[#0a1628] transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
        >
          Voir la salle
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
