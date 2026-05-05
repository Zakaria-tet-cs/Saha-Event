"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  MapPin,
  Lock,
  ArrowLeft,
  Loader2,
  Save,
  ShieldCheck,
  ChevronDown,
  Mail,
  Calendar,
  Sparkles,
  Shield
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { FloatingInput } from "@/components/ui/FloatingInput";

const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annabba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
  "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
];

export default function SettingsPage() {
  const { profile, user, loading: authLoading, refreshProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'profil' | 'securite'>('profil');

  // Profile State
  const [formData, setFormData] = React.useState({
    prenom: "",
    nom: "",
    phone: "",
    wilaya: "",
    gender: "",
    age: ""
  });

  // Password State
  const [passwordData, setPasswordData] = React.useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        prenom: profile.prenom || "",
        nom: profile.nom || "",
        phone: profile.phone || "",
        wilaya: profile.wilaya || "",
        gender: profile.gender || "",
        age: profile.age?.toString() || ""
      });
    }
  }, [profile]);

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[@$!%*?&]/.test(pass);
    return minLength && hasUpper && hasNumber && hasSpecial;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.prenom || !formData.nom) {
      toast.error("Le prénom et le nom sont requis");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          prenom: formData.prenom,
          nom: formData.nom,
          full_name: `${formData.prenom} ${formData.nom}`,
          phone: formData.phone,
          wilaya: formData.wilaya,
          gender: formData.gender,
          age: formData.age ? parseInt(formData.age) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      if (refreshProfile) await refreshProfile();
      toast.success("Informations mises à jour avec succès !");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    if (!validatePassword(passwordData.newPassword)) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial");
      return;
    }

    setLoading(true);
    try {
      // 1. Verify old password by re-authenticating
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user?.email!,
        password: passwordData.oldPassword
      });

      if (loginError) {
        throw new Error("Mot de passe actuel incorrect");
      }

      // 2. Update with new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (updateError) throw updateError;

      toast.success("Mot de passe changé avec succès !");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err.message || "Erreur lors du changement de mot de passe");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
        <p className="text-[#D4AF37] font-black uppercase tracking-widest text-xs">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Navigation */}
        <Link href="/espace-client" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-all mb-10 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Retour au tableau de bord</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-serif italic font-black text-[#0a1628]">
                Paramètres
              </h1>
              <p className="text-gray-400 font-medium italic">Gérez vos informations et la sécurité de votre compte.</p>
            </div>

            <div className="bg-white rounded-[2rem] p-3 shadow-premium border border-[#D4AF37]/10">
              <button
                onClick={() => setActiveTab('profil')}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'profil'
                    ? "bg-[#0a1628] text-[#D4AF37] shadow-xl"
                    : "text-gray-400 hover:bg-gray-50"
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeTab === 'profil' ? "bg-[#D4AF37]/20" : "bg-gray-100"
                  }`}>
                  <User className="w-4 h-4" />
                </div>
                Profil & Informations
              </button>

              <button
                onClick={() => setActiveTab('securite')}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all mt-2 ${activeTab === 'securite'
                    ? "bg-[#0a1628] text-[#D4AF37] shadow-xl"
                    : "text-gray-400 hover:bg-gray-50"
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeTab === 'securite' ? "bg-[#D4AF37]/20" : "bg-gray-100"
                  }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                Sécurité & Compte
              </button>
            </div>

            {/* Account Summary Card */}
            <div className="bg-[#0a1628] rounded-[2rem] p-8 text-white relative overflow-hidden hidden lg:block">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Shield size={100} />
              </div>
              <h4 className="text-xl font-serif italic font-black text-[#D4AF37] mb-2">Protection Saha</h4>
              <p className="text-white/60 text-xs font-medium leading-relaxed">Vos données sont chiffrées et sécurisées selon les standards les plus élevés.</p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === 'profil' ? (
                <motion.div
                  key="profil"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-premium border border-[#D4AF37]/15">
                    <div className="flex items-center gap-5 mb-12">
                      <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                        <Sparkles className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-serif italic font-black text-[#0a1628]">Éditer mon profil</h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Identité & Contact</p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FloatingInput label="Prénom" value={formData.prenom} onChange={e => setFormData({ ...formData, prenom: e.target.value })} required />
                        <FloatingInput label="Nom" value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} required />
                        <FloatingInput label="Email (non modifiable)" value={user?.email || ""} disabled />
                        <FloatingInput label="Téléphone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        <FloatingInput label="Âge" type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />

                        <div className="relative group">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] absolute -top-2 left-4 bg-white px-1 z-10">Wilaya</label>
                          <div className="relative">
                            <select
                              value={formData.wilaya}
                              onChange={e => setFormData({ ...formData, wilaya: e.target.value })}
                              className="w-full h-16 pl-5 pr-12 rounded-2xl bg-white border border-gray-100 focus:border-[#D4AF37] outline-none appearance-none font-bold text-[#0a1628] transition-all cursor-pointer shadow-sm"
                            >
                              <option value="">Sélectionnez votre wilaya</option>
                              {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[#D4AF37] w-5 h-5 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Genre</label>
                        <div className="flex gap-4">
                          {["Homme", "Femme"].map(g => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setFormData({ ...formData, gender: g })}
                              className={`flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${formData.gender === g
                                  ? "bg-[#D4AF37] border-[#D4AF37] text-[#0a1628] shadow-lg"
                                  : "bg-white border-gray-50 text-gray-400 hover:border-[#D4AF37]/30"
                                }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(212,175,55,0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full h-16 bg-[#0a1628] text-[#D4AF37] rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 mt-10 transition-all border border-[#D4AF37]/20"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Enregistrer les modifications
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="securite"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-premium border border-[#D4AF37]/15">
                    <div className="flex items-center gap-5 mb-12">
                      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                        <Lock className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-serif italic font-black text-[#0a1628]">Sécurité du compte</h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Mot de passe & Accès</p>
                      </div>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-8">
                      <div className="space-y-6">
                        <FloatingInput
                          label="Mot de passe actuel"
                          type="password"
                          value={passwordData.oldPassword}
                          onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                          required
                        />

                        <div className="h-px bg-gray-50 my-4" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <FloatingInput
                            label="Nouveau mot de passe"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            required
                          />
                          <FloatingInput
                            label="Confirmer le nouveau"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Règles de sécurité</h4>
                        <ul className="text-[11px] font-medium text-gray-500 space-y-2">
                          <li className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${passwordData.newPassword.length >= 8 ? "bg-green-500" : "bg-gray-300"}`} />
                            Au moins 8 caractères
                          </li>
                          <li className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(passwordData.newPassword) ? "bg-green-500" : "bg-gray-300"}`} />
                            Une lettre majuscule
                          </li>
                          <li className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(passwordData.newPassword) ? "bg-green-500" : "bg-gray-300"}`} />
                            Un chiffre et un caractère spécial (@$!%*?&)
                          </li>
                        </ul>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(239,68,68,0.2)' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full h-16 border-2 border-[#0a1628] text-[#0a1628] rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-[#0a1628] hover:text-[#D4AF37] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-10 shadow-xl"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                        Mettre à jour le mot de passe
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
