"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Users,
  Star,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  Pencil,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/useUserRole";

const communes = [
  "Alger Centre",
  "Hydra",
  "El Biar",
  "Kouba",
  "Bab Ezzouar",
  "Zéralda",
  "Staoueli",
  "Dely Ibrahim",
  "Cheraga",
];

/* ─────────────────────────────────────────
   SALLE CARD — Airbnb/Booking premium style
 ───────────────────────────────────────── */
function SalleCard({ salle, index, isAdmin, onDelete, currentUser }: {
  salle: any;
  index: number;
  isAdmin?: boolean;
  onDelete?: (id: string, nom: string) => void;
  currentUser?: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, ease: "easeOut", delay: Math.min(index * 0.04, 0.4) }}
      style={{
        background: '#FDFBF7',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(212,175,55,0.15)',
        boxShadow: '0 4px 20px rgba(10,22,40,0.08)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
      whileHover={{
        y: -6,
        boxShadow: '0 12px 40px rgba(212,175,55,0.15)',
        borderColor: 'rgba(212,175,55,0.35)'
      }}
    >
      {/* Admin delete button */}
      {isAdmin && (
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          <Link
            href={`/admin/salles/edit/${salle.id}`}
            onClick={(e) => e.stopPropagation()}
            className="w-9 h-9 bg-[#D4AF37] rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            title="Modifier"
          >
            <Pencil className="w-4 h-4 text-[#0a1628]" />
          </Link>
          <button
            onClick={(e) => { e.preventDefault(); onDelete?.(salle.id, salle.nom); }}
            className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Image de la salle */}
      <div style={{ position: 'relative', overflow: 'hidden', height: '200px', flexShrink: 0 }}>
        <motion.img
          src={salle.image_url ? salle.image_url.split(',')[0] : '/placeholder-salle.jpg'}
          alt={`Découvrir la salle ${salle.nom}`}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        {/* Badge prix */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(10,22,40,0.85)',
          backdropFilter: 'blur(8px)',
          borderRadius: '9999px',
          padding: '4px 12px',
          border: '1px solid rgba(212,175,55,0.4)',
          zIndex: 10
        }}>
          <span style={{
            color: '#D4AF37',
            fontSize: '12px',
            fontWeight: 700
          }}>
            {salle.prix ? salle.prix.toLocaleString() : "0"} DA
          </span>
        </div>
        {/* Badge capacité */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: isAdmin ? '90px' : '12px',
          background: 'rgba(10,22,40,0.85)',
          backdropFilter: 'blur(8px)',
          borderRadius: '9999px',
          padding: '4px 12px',
          border: '1px solid rgba(212,175,55,0.2)',
          zIndex: 10
        }}>
          <span style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '11px',
            fontWeight: 600
          }}>
            👥 {salle.capacite} pers.
          </span>
        </div>
      </div>

      {/* Contenu card */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Nom salle */}
        <h3 style={{
          color: '#0a1628',
          fontSize: '16px',
          fontWeight: 700,
          marginBottom: '4px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontFamily: 'serif',
          fontStyle: 'italic'
        }}>
          {salle.nom}
        </h3>

        {/* Localisation */}
        <p style={{
          color: '#6B7280',
          fontSize: '12px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          📍 {salle.localisation || salle.wilaya || 'Alger'}
        </p>

        {/* Étoiles rating */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          marginBottom: '12px'
        }}>
          {[1, 2, 3, 4, 5].map(star => (
            <span key={star} style={{
              color: star <= (salle.rating || 5) ? '#D4AF37' : '#E5E7EB',
              fontSize: '14px'
            }}>★</span>
          ))}
          <span style={{
            color: '#9CA3AF',
            fontSize: '11px',
            marginLeft: '4px'
          }}>
            ({salle.reviews || 0} avis)
          </span>
        </div>

        <div style={{ flex: 1 }}></div>

        {/* Bouton Voir la salle */}
        <Link href={`/salles/${salle.id}`} style={{ marginTop: 'auto' }}>
          <motion.div
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            variants={{
              rest: { scale: 1, boxShadow: 'none' },
              hover: { scale: 1.02, boxShadow: '0 0 20px rgba(212,175,55,0.35)' },
              tap: { scale: 0.97 }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '11px 16px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #C49B2E 100%)',
              borderRadius: '12px',
              cursor: 'pointer',
              border: 'none',
              marginTop: '12px'
            }}
          >
            <span style={{
              color: '#0a1628',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.8px',
              textTransform: 'uppercase'
            }}>
              Voir la salle
            </span>
            <motion.div
              variants={{
                rest: { x: 0 },
                hover: { x: 4 }
              }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight size={15} color="#0a1628" strokeWidth={2.5} />
            </motion.div>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
 ───────────────────────────────────────── */
export default function SallesPage() {
  const router = useRouter();
  const { isAdmin } = useUserRole();
  const [salles, setSalles] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [activeCommune, setActiveCommune] = React.useState("Toutes");
  const [priceRange, setPriceRange] = React.useState<number>(10000000);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; nom: string } | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user || null);
    });
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    const fetchSalles = async () => {
      try {
        setLoading(true);
        setError("");

        const { data, error: supabaseError } = await supabase
          .from("salles")
          .select("*")
          .order("created_at", { ascending: false });

        if (cancelled) return;

        if (supabaseError) {
          console.error("Supabase error:", supabaseError.message);
          setError(supabaseError.message);
          return;
        }

        console.log('Salles trouvées:', data?.length);
        setSalles(data || []);
      } catch (err: any) {
        if (cancelled) return;
        console.error("Fetch error:", err?.message || err);
        setError(err?.message || "Erreur réseau");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSalles();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const handleDeleteRequest = (id: string, nom: string) => {
    setDeleteTarget({ id, nom });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const response = await fetch(`/api/salles?id=${deleteTarget.id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Delete error:', result.error);
        alert(`Erreur lors de la suppression: ${result.error}`);
      } else {
        setSalles(prev => prev.filter(s => s.id !== deleteTarget.id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filtered = React.useMemo(() => {
    const result = salles.filter((s) => {
      const fallbackCommune = s.localisation ? (s.localisation.split(',').pop()?.trim() || "Alger") : "Alger";
      const matchSearch =
        s.nom?.toLowerCase().includes(search.toLowerCase()) ||
        fallbackCommune.toLowerCase().includes(search.toLowerCase()) ||
        (s.localisation || "").toLowerCase().includes(search.toLowerCase());
      const matchCommune =
        activeCommune === "Toutes" || fallbackCommune === activeCommune;
      const matchPrice = (s.prix || 0) <= priceRange;
      return matchSearch && matchCommune && matchPrice;
    });

    console.log('Salles avant filtre:', salles.length);
    console.log('Salles après filtre:', result.length);
    return result;
  }, [salles, search, activeCommune, priceRange]);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">

      {/* ── Hero header ── */}
      <section className="relative h-[55vh] w-full flex items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000"
            alt="Header"
            className="w-full h-full object-cover opacity-25 grayscale scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary" />
        </div>

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 text-secondary font-black uppercase tracking-[0.3em] text-[10px] mb-5">
              <Sparkles className="w-4 h-4" />
              Le Catalogue d'Exception
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-3 italic font-serif">
              LES <span className="text-secondary">PALAIS</span>
            </h1>
            <p className="text-gray-400 font-medium max-w-lg mx-auto italic text-sm">
              "Explorez notre sélection rigoureuse de lieux iconiques, où chaque mètre carré
              raconte une histoire de prestige."
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Search / Filter bar ── */}
      <div className="max-w-5xl mx-auto px-4 lg:px-6 -translate-y-1/2 relative z-20">
        <div className="bg-[#FDFBF7]/90 backdrop-blur-2xl p-3 rounded-2xl shadow-[0_8px_32px_rgba(10,22,40,0.12)] border border-white/60 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
            <input
              type="text"
              placeholder="Chercher une commune ou un établissement…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 outline-none text-[#111827] font-semibold placeholder-[#9CA3AF] bg-transparent text-sm"
            />
          </div>
          <div className="h-8 w-px bg-gray-100 hidden md:block" />
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 font-bold transition-all rounded-2xl text-sm",
              isFilterOpen
                ? "bg-primary text-white"
                : "text-[#0a1628] hover:bg-gray-50"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
          </button>
          <Button className="gold-gradient h-11 px-8 rounded-2xl text-sm font-black border-0 shadow-[0_4px_20px_rgba(212,175,55,0.4)] text-[#0a1628] flex-shrink-0">
            Rechercher
          </Button>
        </div>
      </div>

      {/* ── Expanded filters ── */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#FDFBF7] border-b border-gray-100"
          >
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-secondary" /> Communes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["Toutes", ...communes].map((c) => (
                    <button
                      key={c}
                      onClick={() => setActiveCommune(c)}
                      className={cn(
                        "px-3 py-1.5 rounded-2xl text-xs font-bold transition-all uppercase tracking-wider",
                        activeCommune === c
                          ? "bg-secondary text-white shadow-[0_2px_8px_rgba(10,22,40,0.1)]"
                          : "bg-[#FDFBF7] text-[#6B7280] hover:bg-gray-100 border border-gray-100"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Budget Maximum
                  </h4>
                  <span className="text-primary font-black text-sm">
                    {priceRange.toLocaleString()} DZD
                  </span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="1000000"
                  step="50000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full accent-secondary"
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full border-gray-200 text-[#6B7280] font-bold h-11 rounded-2xl text-sm hover:bg-gray-50"
                  onClick={() => {
                    setSearch("");
                    setActiveCommune("Toutes");
                    setPriceRange(1000000);
                  }}
                >
                  <X className="w-4 h-4 mr-2" /> Réinitialiser
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-6 flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            Erreur: {error}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="bg-orange-50 border border-orange-200 text-orange-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            Aucune salle trouvée - Vérifiez la console (F12) ou les filtres.
          </div>
        )}

        <div className="flex items-center justify-between">
          {!loading && (
            <p className="text-sm text-gray-500 font-medium">
              <span className="font-black text-primary">{filtered.length}</span> résidence{filtered.length !== 1 ? "s" : ""} trouvée{filtered.length !== 1 ? "s" : ""}
            </p>
          )}
          {activeCommune !== "Toutes" && (
            <button
              onClick={() => setActiveCommune("Toutes")}
              className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-primary transition-colors"
            >
              <X className="w-3 h-3" /> Effacer filtre zone
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-32">
        {loading ? (
          <div className="text-center py-32">
            <div className="w-10 h-10 mx-auto border-4 border-gray-100 border-t-secondary rounded-full animate-spin mb-4" />
            <p className="text-secondary font-black text-[10px] uppercase tracking-[0.3em]">
              Chargement de la collection…
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <Search className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h3 className="text-xl font-black text-primary mb-2 italic font-serif">
              Aucune salle trouvée
            </h3>
            <p className="text-gray-400 font-medium italic text-sm">
              Vérifiez la console ou les politiques RLS dans Supabase.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
            padding: '0 16px'
          }}>
            {filtered.map((salle, i) => (
              <SalleCard
                key={salle.id}
                salle={salle}
                index={i}
                isAdmin={isAdmin}
                onDelete={handleDeleteRequest}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Floating Admin Button ── */}
      {isAdmin && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/admin/salles/new')}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 bg-[#D4AF37] text-[#0a1628] font-black uppercase tracking-widest text-sm rounded-2xl shadow-[0_8px_32px_rgba(212,175,55,0.5)] hover:shadow-[0_12px_40px_rgba(212,175,55,0.6)] transition-shadow"
        >
          <Plus className="w-5 h-5" />
          Ajouter une salle
        </motion.button>
      )}

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>
                <div>
                  <h3 className="font-black text-[#0a1628] text-xl">Supprimer la salle ?</h3>
                  <p className="text-sm text-gray-500 font-medium">{deleteTarget.nom}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-8 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer cette salle ?<br />
                <span className="text-red-600 font-black">Cette action est irréversible.</span>
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 h-12 rounded-xl border-2 border-gray-200 text-gray-600 font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 h-12 rounded-xl bg-red-600 text-white font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
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
