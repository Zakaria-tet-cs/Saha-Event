"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  User,
  Heart,
  Briefcase,
  Cake,
  Users,
  PartyPopper,
  Star,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const WILAYAS = [
  "01-Adrar", "02-Chlef", "03-Laghouat", "04-Oum El Bouaghi", "05-Batna", "06-Béjaïa", "07-Biskra", "08-Béchar", 
  "09-Blida", "10-Bouira", "11-Tamanrasset", "12-Tébessa", "13-Tlemcen", "14-Tiaret", "15-Tizi Ouzou", "16-Alger", 
  "17-Djelfa", "18-Jijel", "19-Sétif", "20-Saïda", "21-Skikda", "22-Sidi Bel Abbès", "23-Annaba", "24-Guelma", 
  "25-Constantine", "26-Médéa", "27-Mostaganem", "28-M'Sila", "29-Mascara", "30-Ouargla", "31-Oran", "32-El Bayadh", 
  "33-Illizi", "34-Bordj Bou Arréridj", "35-Boumerdès", "36-El Tarf", "37-Tindouf", "38-Tissemsilt", "39-El Oued", 
  "40-Khenchela", "41-Souk Ahras", "42-Tipaza", "43-Mila", "44-Aïn Defla", "45-Naâma", "46-Aïn Témouchent", 
  "47-Ghardaïa", "48-Relizane", "49-Timimoun", "50-Bordj Badji Mokhtar", "51-Ouled Djellal", "52-Béni Abbès", 
  "53-In Salah", "54-In Guezzam", "55-Touggourt", "56-Djanet", "57-El M'Ghair", "58-El Menia"
];

const EVENT_TYPES = [
  { id: "Mariage", icon: Heart, label: "💒 Mariage" },
  { id: "Fiançailles", icon: Star, label: "💍 Fiançailles" },
  { id: "BAC", icon: PartyPopper, label: "🎓 Fête du BAC" },
  { id: "Anniversaire", icon: Cake, label: "🎂 Anniversaire" },
  { id: "Famille", icon: Users, label: "👨‍👩‍👧 Familial" },
  { id: "Conférence", icon: Briefcase, label: "🎤 Conférence" },
  { id: "Autre", icon: Star, label: "🎉 Autre" },
];

export default function CompleteProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);

  // Form State
  const [formData, setFormData] = React.useState({
    prenom: "",
    nom: "",
    phone: "",
    wilaya: "",
    age: "",
    gender: "",
    eventTypes: [] as string[],
  });
  const [formError, setFormError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const checkUserAndProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/signup");
          return;
        }

        // Vérifier si le profil existe
        let { data: profile } = await supabase
          .from('profiles')
          .select('profile_completed')
          .eq('id', user.id)
          .maybeSingle();

        // Si le profil n'existe pas encore (le trigger a pu échouer), on le crée manuellement
        if (!profile) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({ 
              id: user.id, 
              email: user.email,
              prenom: user.user_metadata?.prenom || "",
              nom: user.user_metadata?.nom || "",
              full_name: user.user_metadata?.full_name || `${user.user_metadata?.prenom} ${user.user_metadata?.nom}`
            });
          
          if (insertError) {
            console.error("Erreur lors de la création manuelle du profil:", insertError);
          }
        }

        if (profile?.profile_completed) {
          window.location.href = '/';
          return;
        }

        setUser(user);
        setFormData(prev => ({
          ...prev,
          prenom: user.user_metadata?.prenom || "",
          nom: user.user_metadata?.nom || "",
        }));
      } catch (err) {
        console.error("Check profile error:", err);
      } finally {
        setIsChecking(false);
      }
    };
    checkUserAndProfile();
  }, [router]);

  const toggleEventType = (id: string) => {
    setFormData(prev => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(id) 
        ? prev.eventTypes.filter(t => t !== id) 
        : [...prev.eventTypes, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (formData.phone.length !== 9) {
      toast.error("Numéro de téléphone invalide (9 chiffres requis)");
      return;
    }
    if (formData.eventTypes.length === 0) {
      toast.error("Sélectionnez au moins un type d'événement");
      return;
    }

    setLoading(true);
    setFormError(null);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("Session expirée. Veuillez vous reconnecter.");

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          prenom: formData.prenom,
          nom: formData.nom,
          full_name: formData.prenom + ' ' + formData.nom,
          phone: formData.phone,
          wilaya: formData.wilaya,
          city: formData.wilaya,
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender,
          event_preferences: formData.eventTypes ?? [],
          profile_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);

      if (updateError) throw updateError;

      setShowSuccess(true);
      toast.success("Profil complété !");
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err: any) {
      console.error('Update error:', err.message);
      setFormError(err.message || "Une erreur est survenue lors de la sauvegarde.");
      toast.error(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 md:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Decorative particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(212,175,55,0.12)] border border-[#D4AF37]/10 overflow-hidden relative z-10"
      >
        {/* Header Section */}
        <div className="bg-[#0a1628] p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-transparent opacity-50" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex justify-center gap-3 mb-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${s === 3 ? "bg-[#D4AF37]" : "bg-gray-700"}`} />
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#D4AF37] font-serif italic tracking-wide">Complétez votre profil</h1>
            <p className="text-white/60 font-medium italic serif font-serif">Ces informations nous permettent de vous proposer les meilleures salles</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-14 space-y-12">
          {formError && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl"
            >
              <p className="text-red-600 text-sm font-bold">{formError}</p>
            </motion.div>
          )}

          {/* Section 1: Informations Personnelles */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#0a1628] flex items-center justify-center text-[#D4AF37] shadow-lg">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-[#0a1628] uppercase tracking-widest text-sm">Informations Personnelles</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingInput label="Prénom" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} required />
              <FloatingInput label="Nom" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} required />
              
              <div className="relative">
                <label 
                  className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1"
                >
                  Numéro de téléphone
                </label>
                <div className="flex items-center border-2 rounded-xl overflow-hidden transition-all focus-within:border-[#D4AF37] focus-within:ring-4 focus-within:ring-[#D4AF37]/5"
                  style={{ borderColor: '#E5E7EB', background: '#FFFFFF' }}
                >
                  <span 
                    className="px-4 py-3 font-bold text-sm border-r-2 select-none"
                    style={{ 
                      color: '#0a1628', 
                      background: '#F5F0E8',
                      borderColor: '#E5E7EB'
                    }}
                  >
                    +213
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={9}
                    placeholder="6XX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      setFormData({ ...formData, phone: val })
                    }}
                    className="flex-1 px-4 py-3 outline-none text-base font-bold placeholder:text-gray-300"
                    style={{ 
                      color: '#0a1628',
                      background: 'transparent'
                    }}
                  />
                </div>
                {formData.phone && formData.phone.length !== 9 && (
                  <p className="text-[10px] font-bold mt-1 text-red-500 pl-1">Entrez 9 chiffres après +213</p>
                )}
                {formData.phone && formData.phone.length === 9 && (
                  <p className="text-[10px] font-bold mt-1 text-green-500 pl-1">✓ Numéro valide</p>
                )}
              </div>

              <div className="relative group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest absolute -top-2 left-4 bg-white px-1 z-10">Wilaya / Ville</label>
                <div className="relative">
                  <select
                    value={formData.wilaya}
                    onChange={e => setFormData({...formData, wilaya: e.target.value})}
                    required
                    className="w-full h-14 pl-4 pr-10 rounded-2xl bg-white border-2 border-gray-100 focus:border-[#D4AF37] outline-none appearance-none font-bold text-[#0a1628] transition-all cursor-pointer group-hover:border-gray-200"
                  >
                    <option value="">Sélectionnez votre Wilaya</option>
                    {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-5 h-5 pointer-events-none" />
                </div>
              </div>

              <FloatingInput 
                label="Âge" 
                type="number" 
                min="18" 
                max="99" 
                value={formData.age} 
                onChange={e => setFormData({...formData, age: e.target.value})} 
                required 
              />

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Genre</label>
                <div className="flex gap-3">
                  {["Homme", "Femme", "Autre"].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({...formData, gender: g})}
                      className={`flex-1 h-12 rounded-xl font-bold text-sm transition-all border-2 ${
                        formData.gender === g 
                          ? "bg-[#D4AF37] border-[#D4AF37] text-[#0a1628] shadow-lg shadow-[#D4AF37]/20" 
                          : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                      }`}
                    >
                      {g === "Homme" ? "👨" : g === "Femme" ? "👩" : "⚧"} {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 2: Préférences Événements */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-10"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#0a1628] flex items-center justify-center text-[#D4AF37] shadow-lg">
                <Heart className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-[#0a1628] uppercase tracking-widest text-sm">Vos Préférences</h2>
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Types d'événements préférés (min. 1)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => toggleEventType(type.id)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                      formData.eventTypes.includes(type.id) 
                        ? "border-[#D4AF37] bg-[#D4AF37]/5 text-[#0a1628] shadow-sm" 
                        : "border-gray-100 text-gray-400 hover:border-gray-200"
                    }`}
                  >
                    <type.icon className={`w-6 h-6 ${formData.eventTypes.includes(type.id) ? "text-[#D4AF37]" : "text-gray-300"}`} />
                    <span className="font-bold text-[11px] uppercase tracking-wider">{type.label.split(' ')[1] || type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="pt-8"
          >
            <AnimatePresence mode="wait">
              {!showSuccess ? (
                <button
                  key="submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full h-20 gold-gradient rounded-3xl text-[#0a1628] font-black uppercase tracking-[0.2em] text-lg shadow-[0_20px_50px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-4 group"
                >
                  {loading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <>
                      <span>Accéder à mon espace</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              ) : (
                <motion.div
                  key="success-animation"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full h-20 bg-green-500 rounded-3xl flex items-center justify-center gap-4 text-white font-black uppercase tracking-widest"
                >
                  <CheckCircle2 className="w-8 h-8" />
                  <span>Profil Sauvegardé</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
