"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Users,
  Star,
  Sparkles,
  ArrowLeft,
  Share2,
  Heart,
  Info,
  Calendar,
  Camera,
  Music2,
  UtensilsCrossed,
  Wine,
  Clock,
  CheckCircle2,
  Banknote,
  Image as ImageIcon,
  Pencil,
  Trash2,
  AlertTriangle,
  Loader2,
  Copy,
  Check,
  Heart as HeartOutline,
} from "lucide-react";
import {
  FaFacebookF as Facebook,
  FaInstagram as Instagram,
  FaWhatsapp as WhatsApp,
  FaTelegramPlane as Telegram,
  FaSnapchatGhost as Ghost,
  FaTwitter as XIcon
} from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useUserRole } from "@/hooks/useUserRole";

const serviceConfig = [
  { key: "parking", label: "Parking Privé", icon: Clock, desc: "Espace sécurisé pour les cortèges." },
  { key: "dj", label: "Système Son & DJ", icon: Music2, desc: "Équipement acoustique de pointe." },
  { key: "photographe", label: "Pack Media", icon: Camera, desc: "Couverture photo et vidéo ultra HD." },
  { key: "traiteur", label: "Haute Cuisine", icon: UtensilsCrossed, desc: "Buffets raffinés et service à l'assiette." },
  { key: "serveurs", label: "Maîtres d'Hôtel", icon: Wine, desc: "Personnel de salle formé." },
  { key: "decoration", label: "Scénographie", icon: Sparkles, desc: "Décoration florale et artistique." },
];

export default function SalleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { isAdmin } = useUserRole();
  const [salle, setSalle] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);
  const [reserving, setReserving] = React.useState(false);
  const [activeImage, setActiveImage] = React.useState(0);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  // New States for Dynamic Actions
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const [isFavoris, setIsFavoris] = React.useState(false);
  const [favorisCount, setFavorisCount] = React.useState(0);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [favorisLoading, setFavorisLoading] = React.useState(false);
  const [copySuccess, setCopySuccess] = React.useState(false);

  React.useEffect(() => {
    async function loadSalle() {
      // Check Auth
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (_) { }

      // Find in Supabase database exclusively
      if (id) {
        const { data, error } = await supabase.from('salles').select('*').eq('id', id).single();
        if (error) {
          console.error("Error fetching salle detail:", error);
        }
        setSalle(data ?? null);

        // PART 1 — DETECT ROLE & FAVORIS
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();
          setUserRole(profile?.role ?? 'user');

          const { data: favori } = await supabase
            .from('favoris')
            .select('id')
            .eq('user_id', user.id)
            .eq('salle_id', id)
            .maybeSingle();
          setIsFavoris(!!favori);
        }

        const { count } = await supabase
          .from('favoris')
          .select('*', { count: 'exact', head: true })
          .eq('salle_id', id);
        setFavorisCount(count ?? 0);
      }
      setLoading(false);
    }
    if (id) loadSalle();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    // Use the API route to perform admin deletion safely
    const response = await fetch(`/api/salles?id=${id}`, { method: 'DELETE' });

    if (!response.ok) {
      toast.error("Erreur lors de la suppression.");
    } else {
      toast.success("Salle supprimée avec succès.", {
        style: {
          background: '#0a1628',
          color: '#fff',
          borderRadius: '12px',
          borderLeft: '4px solid #D4AF37',
        }
      });
      router.push('/salles');
    }
    setDeleting(false);
    setDeleteConfirm(false);
  };

  const handleFavoris = async () => {
    if (!user) {
      toast("Connectez-vous pour ajouter aux favoris", {
        icon: '🔑',
        style: {
          background: '#0a1628',
          color: '#fff',
          borderRadius: '12px',
          borderLeft: '4px solid #D4AF37',
        }
      });
      router.push('/auth/login');
      return;
    }

    setFavorisLoading(true);

    if (isFavoris) {
      await supabase
        .from('favoris')
        .delete()
        .eq('user_id', user.id)
        .eq('salle_id', id);

      setIsFavoris(false);
      setFavorisCount(prev => Math.max(0, prev - 1));
    } else {
      await supabase
        .from('favoris')
        .insert({ user_id: user.id, salle_id: id });

      setIsFavoris(true);
      setFavorisCount(prev => prev + 1);

      toast.success("Ajouté aux favoris", {
        style: {
          background: '#0a1628',
          color: '#fff',
          borderRadius: '12px',
          borderLeft: '4px solid #D4AF37',
        }
      });
    }
    setFavorisLoading(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    toast.success("Lien copié dans le presse-papiers !", {
      style: {
        background: '#0a1628',
        color: '#fff',
        borderRadius: '12px',
        borderLeft: '4px solid #D4AF37',
      }
    });
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleReserve = () => {
    if (!user) {
      toast.error("Connectez-vous pour réserver cette salle", {
        icon: '🔐',
        style: {
          borderRadius: '10px',
          background: '#0a1628',
          color: '#fff',
        },
      });
      router.push('/auth/login');
      return;
    }
    router.push(`/reservation/${id}`);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-6 h-screen bg-beige">
      <div className="w-12 h-12 border-4 border-beige border-t-secondary rounded-full animate-spin" />
      <p className="text-secondary font-black text-[10px] uppercase tracking-[0.3em]">Ouverture des portes...</p>
    </div>
  );

  if (!salle) return (
    <div className="h-screen flex items-center justify-center bg-beige">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-premium mx-auto">
          <Info className="w-10 h-10 text-secondary" />
        </div>
        <h1 className="text-4xl font-black text-primary italic font-serif">Résidence Introuvable</h1>
        <Button onClick={() => router.push("/salles")} className="gold-gradient rounded-xl font-bold border-0 shadow-gold text-white px-8 h-12">
          Retour à la Collection
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-beige pb-40">
      {/* Hero Header */}
      <section className="relative h-[65vh] w-full overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          {salle.image_url ? (
            <motion.img
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              src={salle.image_url.split(',')[activeImage] || salle.image_url.split(',')[0]}
              alt={salle.nom}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#0a1628]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        </div>

        {/* Navbar overlay - Back button only */}
        <div className="absolute top-24 left-0 w-full px-6 md:px-16 z-20">
          <button
            onClick={() => router.back()}
            className="w-12 h-12 bg-black/30 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-black/50 transition-all shadow-2xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-12 left-0 w-full px-6 md:px-16 z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 text-secondary font-black uppercase tracking-[0.3em] text-[10px] mb-4 bg-primary/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-secondary/30">
              <Sparkles className="w-3.5 h-3.5" /> Collection Prestige
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 italic font-serif drop-shadow-xl">
              {salle.nom}
            </h1>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90">
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="font-bold text-sm">{salle.localisation}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                <Users className="w-4 h-4 text-secondary" />
                <span className="font-bold text-sm">{salle.capacite} Convives</span>
              </div>
              <div className="flex items-center gap-2 bg-secondary/20 backdrop-blur-md px-4 py-2 rounded-xl border border-secondary/30">
                <Star className="w-4 h-4 text-secondary fill-secondary" />
                <span className="font-black text-white text-sm">{salle.rating || "5.0"}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-16 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-12">

            {/* PART 6 — GLOBAL ACTION ZONE ANIMATION */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full"
            >
              {/* ADMIN ZONE */}
              {userRole === 'admin' && (
                <div className="bg-white rounded-[24px] p-8 shadow-[0_10px_40px_rgba(212,175,55,0.12)] border border-[#D4AF37]/20">
                  <div className="flex flex-col space-y-8">
                    <div className="flex items-center justify-between border-b border-[#D4AF37]/10 pb-4">
                      <h3 className="text-[#0a1628] font-serif text-xl font-black italic">Options de gestion</h3>
                      <div className="flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="text-[10px] font-black uppercase text-[#D4AF37] tracking-wider">Mode Administrateur</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      {/* Booking Action */}
                      <motion.button
                        whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(212,175,55,0.5)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleReserve}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#9A7A20] rounded-full text-[#0a1628] font-black text-sm uppercase tracking-widest shadow-xl transition-all"
                      >
                        <Calendar className="w-5 h-5" />
                        Réserver cette salle
                      </motion.button>

                      {/* Social Actions */}
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleFavoris}
                          className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all border-2 ${isFavoris 
                            ? "bg-red-50 border-red-100 text-red-500" 
                            : "bg-gray-50 border-gray-100 text-gray-400 hover:text-red-400"}`}
                        >
                          <Heart className={`w-5 h-5 ${isFavoris ? "fill-red-500" : ""}`} />
                          <span className="text-xs font-black uppercase tracking-widest">{isFavoris ? "Favori" : "Liker"}</span>
                          <span className="ml-1 px-1.5 py-0.5 bg-white rounded-md text-[10px] font-black">{favorisCount}</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowShareModal(true)}
                          className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-full text-[#0a1628] transition-all hover:bg-[#0a1628] hover:text-white"
                        >
                          <Share2 className="w-5 h-5" />
                          <span className="text-xs font-black uppercase tracking-widest">Partager</span>
                        </motion.button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-50">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => router.push(`/admin/salles/edit/${id}`)}
                        className="flex items-center gap-2 text-[#0a1628] hover:text-[#D4AF37] font-black text-xs uppercase tracking-widest transition-all"
                      >
                        <Pencil className="w-4 h-4" /> Modifier la Fiche
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeleteConfirm(true)}
                        className="flex items-center gap-2 text-red-600 font-black text-xs uppercase tracking-widest hover:opacity-70 transition-all"
                      >
                        <Trash2 className="w-4 h-4" /> Supprimer Définitivement
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {/* NORMAL USER ZONE */}
              {userRole !== 'admin' && (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleFavoris}
                    disabled={favorisLoading}
                    className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-full font-bold text-sm transition-all border-2 ${isFavoris
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]"
                        : "bg-transparent border-[#D4AF37]/40 text-[#D4AF37]"
                      }`}
                  >
                    <motion.div
                      animate={isFavoris ? { scale: [1, 1.4, 1] } : {}}
                      transition={{ duration: 0.4, type: "spring" }}
                      className="relative"
                    >
                      <Heart className={`w-5 h-5 ${isFavoris ? "fill-[#D4AF37]" : ""}`} />
                      {/* Particules dorées simulées au clic (visibles brièvement) */}
                      {isFavoris && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          className="absolute inset-0 pointer-events-none"
                        >
                          {[0, 72, 144, 216, 288].map((angle, i) => (
                            <motion.div
                              key={i}
                              initial={{ x: 0, y: 0, scale: 0 }}
                              animate={{
                                x: Math.cos(angle * Math.PI / 180) * 20,
                                y: Math.sin(angle * Math.PI / 180) * 20,
                                scale: 1
                              }}
                              className="absolute w-1.5 h-1.5 bg-[#D4AF37] rounded-full"
                            />
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                    <span>{isFavoris ? "Dans vos favoris" : "Ajouter aux favoris"}</span>
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[10px] font-black">{favorisCount}</span>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(10,22,40,0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowShareModal(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 bg-[#0a1628] rounded-full text-white font-bold text-sm shadow-xl"
                  >
                    <Share2 className="w-5 h-5" />
                    Partager cette salle
                  </motion.button>
                </div>
              )}
            </motion.div>

            {/* Description */}
            <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-secondary/10 rounded-2xl">
                  <Info className="w-6 h-6 text-secondary" />
                </div>
                <h2 className="text-3xl font-black text-primary italic font-serif">L'Âme du Lieu</h2>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium text-lg">
                {salle.description}
              </p>
            </section>

            {/* Équipements (Array of strings) */}
            {salle.equipements && salle.equipements.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                  <h3 className="text-2xl font-black text-primary italic font-serif">Équipements & Inclusions</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {salle.equipements.map((eqString: string, i: number) => {
                    const parts = eqString.split(':');
                    const label = parts[0].trim();
                    const value = parts.slice(1).join(':').trim();
                    const isPositive = value.toLowerCase().includes('inclus') || value.toLowerCase().includes('disponible') || (value === '' && label !== '');
                    return (
                      <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-secondary/30 transition-colors">
                        <span className="font-bold text-primary text-sm">{label}</span>
                        {value && (
                          <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Prestations & Tarifs (Array of strings) */}
            {salle.prestations && salle.prestations.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <Banknote className="w-6 h-6 text-secondary" />
                  <h3 className="text-2xl font-black text-primary italic font-serif">Prestations & Tarifs</h3>
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {salle.prestations.map((prestString: string, i: number) => {
                      const parts = prestString.split(':');
                      const label = parts[0].trim();
                      const price = parts.slice(1).join(':').trim();
                      return (
                        <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 hover:bg-gray-50 transition-colors gap-4">
                          <span className="font-bold text-primary text-sm">{label}</span>
                          {price && <span className="text-lg font-black text-secondary whitespace-nowrap">{price}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Services Icons */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="w-6 h-6 text-secondary" />
                <h3 className="text-2xl font-black text-primary italic font-serif">Services Complémentaires</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {(salle.services || []).map((key: string, i: number) => {
                  const config = serviceConfig.find(s => s.key === key);
                  if (!config) return null;
                  const Icon = config.icon;
                  return (
                    <div key={key} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
                      <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:scale-110 transition-all">
                        <Icon className="w-6 h-6 text-secondary group-hover:text-white" />
                      </div>
                      <h4 className="font-black text-primary text-sm mb-1">{config.label}</h4>
                      <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{config.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Galerie */}
            {salle.image_url && salle.image_url.split(',').length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <ImageIcon className="w-6 h-6 text-secondary" />
                  <h3 className="text-2xl font-black text-primary italic font-serif">Galerie de Prestige</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {salle.image_url.split(',').map((img: string, i: number) => (
                    <motion.div
                      key={i}
                      onClick={() => setActiveImage(i)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className={`aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer relative group ${activeImage === i ? 'ring-4 ring-secondary ring-offset-2' : ''}`}
                    >
                      <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={`View ${i + 1}`} />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary rounded-[2.5rem] p-8 shadow-2xl text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-10 rounded-full blur-2xl" />

                <div className="mb-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">À partir de</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-secondary">{salle.prix ? salle.prix.toLocaleString() : "0"}</span>
                    <span className="text-sm font-bold text-gray-400">DZD</span>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-bold">Disponibilités</span>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-1 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">Ouvert</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">
                      Réservez dès maintenant pour sécuriser votre date dans cette demeure d'exception.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleReserve}
                  disabled={reserving}
                  className="w-full h-14 rounded-xl font-black uppercase tracking-[0.1em] text-sm shadow-gold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 text-[#0a1628] border-0"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #9A7A20)' }}
                >
                  <Calendar className="w-4 h-4" />
                  {reserving ? "Traitement..." : "Réserver ce Palais"}
                </Button>

                <p className="mt-6 text-center text-[10px] font-bold text-gray-500">
                  Service Conciergerie 24/7 Inclus
                </p>
              </motion.div>
            </div>
          </div>

        </div>
      </div>

      {/* PART 4 — SHARE MODAL */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.175, 0.885, 0.32, 1.275] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[28px] p-8 max-w-[380px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.3)] border-t-[3px] border-[#D4AF37] relative"
            >
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>

              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto">
                  <Share2 className="w-10 h-10 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-xl font-serif italic font-black text-[#0a1628]">Partager cette salle</h3>
                  <p className="text-gray-400 text-[0.82rem] font-medium">Choisissez votre réseau préféré</p>
                </div>

                <div className="grid grid-cols-3 gap-y-6 pt-4">
                  {[
                    { name: 'Facebook', icon: <Facebook className="w-6 h-6" />, color: '#1877F2', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}` },
                    { name: 'WhatsApp', icon: <WhatsApp className="w-6 h-6" />, color: '#25D366', url: `https://wa.me/?text=${encodeURIComponent('Découvrez cette salle : ' + (typeof window !== 'undefined' ? window.location.href : ''))}` },
                    { name: 'Telegram', icon: <Telegram className="w-6 h-6" />, color: '#0088CC', url: `https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}` },
                    { name: 'Instagram', icon: <Instagram className="w-6 h-6" />, color: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', action: () => toast.success("Copiez le lien et partagez sur Instagram") },
                    { name: 'Snapchat', icon: <Ghost className="w-6 h-6" />, color: '#FFFC00', textColor: '#000', url: `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}` },
                    { name: 'X', icon: <XIcon className="w-5 h-5" />, color: '#000000', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent('Découvrez cette salle des fêtes sur Saha-Event !')}` },
                  ].map((network, index) => (
                    <motion.div
                      key={network.name}
                      initial={{ opacity: 0, scale: 0, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: index * 0.06, duration: 0.3, type: 'spring' }}
                      className="flex flex-col items-center gap-2"
                    >
                      <motion.button
                        whileHover={{ scale: 1.15, y: -4 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => network.action ? network.action() : window.open(network.url, '_blank')}
                        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg text-white"
                        style={{ background: network.color, color: network.textColor || 'white' }}
                      >
                        {network.icon}
                      </motion.button>
                      <span className="text-[0.7rem] text-gray-500 font-bold uppercase tracking-widest">{network.name}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-6">
                  <button
                    onClick={handleCopyLink}
                    className="w-full py-3.5 rounded-full bg-[#FDFBF7] border-1.5 border-[#D4AF37] text-[#0a1628] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#D4AF37]/5 transition-all"
                  >
                    {copySuccess ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copySuccess ? "✓ Lien copié !" : "🔗 Copier le lien"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl border border-gray-100 text-center"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <div className="space-y-4 mb-10">
                <h3 className="text-2xl font-serif italic font-black text-[#0a1628]">Supprimer cette salle ?</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  Cette action est irréversible. La salle <span className="font-bold text-[#0a1628]">{salle?.nom}</span> sera définitivement supprimée de la plateforme.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="flex-1 h-14 rounded-2xl bg-[#FDFBF7] text-[#0a1628] font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 h-14 rounded-2xl bg-red-600 text-white font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-red-200"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
