"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Save,
  ArrowLeft,
  MapPin,
  Users,
  DollarSign,
  Image as ImageIcon,
  FileText,
  CheckSquare,
  List,
  Tag,
  Loader2,
  CheckCircle,
  AlertCircle,
  Trash2,
  Plus,
  X,
  Sparkles
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const ALL_SERVICES = [
  { key: "parking", label: "Parking Privé" },
  { key: "dj", label: "Système Son & DJ" },
  { key: "photographe", label: "Pack Média (Photo/Vidéo)" },
  { key: "traiteur", label: "Haute Cuisine / Traiteur" },
  { key: "serveurs", label: "Maîtres d'Hôtel / Serveurs" },
  { key: "decoration", label: "Scénographie & Décoration" },
  { key: "climatisation", label: "Climatisation" },
  { key: "securite", label: "Sécurité" },
  { key: "jardin", label: "Jardin Extérieur" },
  { key: "chambre_nuptiale", label: "Chambre Nuptiale" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Field({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
        <Icon className="w-3.5 h-3.5 text-[#D4AF37]" />
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white text-[#0a1628] font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/10 focus:border-[#D4AF37] transition-all placeholder:text-gray-300 shadow-sm";

function StringList({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3">
          <input
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
            className={inputCls}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-2xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors border border-red-100"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-[#0a1628] transition-colors pt-2 px-1"
      >
        <Plus className="w-4 h-4" /> Ajouter une ligne
      </button>
    </div>
  );
}

export default function AdminEditSallePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [formData, setFormData] = React.useState({
    nom: '',
    localisation: '',
    commune: '',
    prix: '',
    capacite: '',
    description: '',
    services: [] as string[],
    imageUrls: [] as string[],
    equipements: [] as string[],
    prestations: [] as string[]
  });

  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [authChecked, setAuthChecked] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [currentUrl, setCurrentUrl] = React.useState('');

  React.useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setAuthChecked(true); setLoading(false); return; }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (profile?.role !== "admin") { setAuthChecked(true); setLoading(false); return; }
      
      setIsAdmin(true);
      setAuthChecked(true);

      if (id) {
        const { data: salle, error: fetchError } = await supabase.from('salles').select('*').eq('id', id).single();
        if (fetchError) {
          setError('Erreur lors de la récupération de la salle');
        } else if (salle) {
          setFormData({
            nom: salle.nom ?? '',
            localisation: salle.localisation ?? '',
            commune: salle.commune ?? '',
            prix: salle.prix?.toString() ?? '',
            capacite: salle.capacite?.toString() ?? '',
            description: salle.description ?? '',
            services: salle.services ?? [],
            imageUrls: salle.image_url ? salle.image_url.split(',').filter(Boolean) : [],
            equipements: (salle.equipements && salle.equipements.length > 0) ? salle.equipements : [""],
            prestations: (salle.prestations && salle.prestations.length > 0) ? salle.prestations : [""]
          });
        }
      }
      setLoading(false);
    }
    init();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const loadingToast = toast.loading("Mise à jour de la salle...");

    try {
      if (!formData.nom.trim() || !formData.localisation.trim() || !formData.commune.trim() || !formData.prix || !formData.capacite) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      const updateData = {
        nom: formData.nom.trim(),
        localisation: formData.localisation.trim(),
        commune: formData.commune.trim(),
        prix: parseFloat(formData.prix),
        capacite: parseInt(formData.capacite),
        description: formData.description.trim(),
        services: formData.services,
        image_url: formData.imageUrls.join(','),
        equipements: formData.equipements.filter(e => e.trim() !== ""),
        prestations: formData.prestations.filter(p => p.trim() !== "")
      };

      const response = await fetch(`/api/salles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Mise à jour échouée');

      toast.success("Salle modifiée avec succès", { id: loadingToast });
      router.push('/salles');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message, { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  if (!authChecked || loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FDFBF7] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
        <p className="text-[#D4AF37] font-black uppercase tracking-widest text-[10px]">Chargement des données...</p>
      </div>
    );
  }

  if (!isAdmin) { router.push("/"); return null; }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto mb-12">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#0a1628] transition-all mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            <div className="h-px w-10 bg-[#D4AF37]" /> Administration
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#0a1628] tracking-tighter italic font-serif">
            Modifier la <span className="text-[#D4AF37]">Salle</span>
          </h1>
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-10">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5" /> {error}
          </motion.div>
        )}

        {/* Section 1: Informations principales */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-premium border border-[#D4AF37]/10 space-y-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37]">
                <FileText className="w-6 h-6" />
             </div>
             <h2 className="text-2xl font-black text-[#0a1628] italic font-serif">Détails de la Résidence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field label="Nom de la salle" icon={Tag}>
              <input value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className={inputCls} required />
            </Field>
            <Field label="Localisation" icon={MapPin}>
              <input value={formData.localisation} onChange={(e) => setFormData({...formData, localisation: e.target.value})} className={inputCls} required />
            </Field>
            <Field label="Commune" icon={MapPin}>
              <input value={formData.commune} onChange={(e) => setFormData({...formData, commune: e.target.value})} className={inputCls} required />
            </Field>
            <Field label="Prix (DZD)" icon={DollarSign}>
              <input type="number" value={formData.prix} onChange={(e) => setFormData({...formData, prix: e.target.value})} className={inputCls} required />
            </Field>
            <Field label="Capacité" icon={Users}>
              <input type="number" value={formData.capacite} onChange={(e) => setFormData({...formData, capacite: e.target.value})} className={inputCls} required />
            </Field>
          </div>

          <Field label="Description" icon={List}>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={6} className={`${inputCls} resize-none`} />
          </Field>
        </div>

        {/* Section 2: Images */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-premium border border-[#D4AF37]/10 space-y-8">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37]">
                <ImageIcon className="w-6 h-6" />
             </div>
             <h2 className="text-2xl font-black text-[#0a1628] italic font-serif">Galerie Photos</h2>
          </div>
          
          <Field label="Ajouter une photo par URL" icon={Plus}>
            <div className="flex gap-3">
              <input value={currentUrl} onChange={(e) => setCurrentUrl(e.target.value)} placeholder="https://..." className={inputCls} />
              <button type="button" onClick={() => { if(currentUrl) { setFormData({...formData, imageUrls: [...formData.imageUrls, currentUrl]}); setCurrentUrl(''); } }} className="px-8 bg-[#0a1628] text-[#D4AF37] font-black rounded-2xl hover:bg-[#1a2b44] transition-all uppercase text-[10px] tracking-widest shadow-xl">Ajouter</button>
            </div>
          </Field>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.imageUrls.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group shadow-md">
                <img src={url} alt="Salle" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <button type="button" onClick={() => setFormData({...formData, imageUrls: formData.imageUrls.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600"><X size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Services Prestige */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-premium border border-[#D4AF37]/10 space-y-8">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37]">
                <CheckSquare className="w-6 h-6" />
             </div>
             <h2 className="text-2xl font-black text-[#0a1628] italic font-serif">Services Prestige</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_SERVICES.map((svc) => {
              const active = formData.services.includes(svc.key);
              return (
                <button
                  key={svc.key}
                  type="button"
                  onClick={() => setFormData({...formData, services: active ? formData.services.filter(s => s !== svc.key) : [...formData.services, svc.key]})}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                    active ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0a1628] shadow-lg" : "border-gray-50 bg-white text-gray-400 hover:border-[#D4AF37]/30"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${active ? "bg-[#D4AF37]" : "bg-gray-100"}`}>
                    {active && <CheckCircle size={12} className="text-white" />}
                  </div>
                  {svc.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Équipements & Prestations */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-premium border border-[#D4AF37]/10 space-y-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37]">
                <Sparkles className="w-6 h-6" />
             </div>
             <h2 className="text-2xl font-black text-[#0a1628] italic font-serif">Équipements & Prestations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Field label="Équipements (format: Label: Valeur)" icon={CheckSquare}>
              <StringList 
                items={formData.equipements} 
                onChange={(v) => setFormData({...formData, equipements: v})} 
                placeholder="Ex: Salon homme: Disponible" 
              />
            </Field>
            <Field label="Prestations & Tarifs (format: Label: Prix)" icon={DollarSign}>
              <StringList 
                items={formData.prestations} 
                onChange={(v) => setFormData({...formData, prestations: v})} 
                placeholder="Ex: Dîner mariage: 120.000 DA" 
              />
            </Field>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-6 pb-20">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 h-16 bg-[#0a1628] text-[#D4AF37] rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl transition-all border border-[#D4AF37]/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Mettre à jour la Salle
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-12 h-16 border-2 border-gray-100 text-gray-400 font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-gray-50 transition-all"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
