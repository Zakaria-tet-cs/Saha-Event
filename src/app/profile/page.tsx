"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  ArrowLeft,
  Loader2,
  Edit2
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { profile, user, loading: authLoading } = useAuth();
  const [likedCount, setLikedCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      try {
        const { count, error } = await supabase
          .from('favorites')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (!error) setLikedCount(count || 0);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file || !user) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image trop lourde (max 5MB)");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type 
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrlWithTimestamp = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrlWithTimestamp })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      toast.success("✓ Photo de profil mise à jour !");
      // Instead of reload, we could update local state if we had one, 
      // but this page relies on the AuthContext profile.
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'upload", {
        style: { background: '#fee2e2', color: '#b91c1c' }
      });
    } finally {
      setUploading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] p-4 text-center">
        <h1 className="text-2xl font-serif italic text-[#0a1628] mb-4">Veuillez vous connecter</h1>
        <Link href="/auth/login" className="px-8 py-3 bg-[#0a1628] text-white rounded-full font-bold uppercase tracking-widest text-xs">Connexion</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Retour à l'accueil</span>
        </Link>

        {/* Profile Header (Instagram Style) */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(10,22,40,0.03)] border border-gray-100 flex flex-col md:flex-row gap-10 items-center md:items-start">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#D4AF37]/20 p-1 bg-white shadow-xl relative overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.prenom || "Profil"} className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full rounded-full bg-[#0a1628] flex items-center justify-center">
                  <span className="text-4xl font-serif italic text-[#D4AF37] font-black">
                    {(profile.prenom?.[0] || user.email?.[0] || 'S').toUpperCase()}
                  </span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
              )}
            </div>
            <label className="absolute bottom-1 right-1 w-10 h-10 bg-[#D4AF37] text-[#0a1628] rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform border-4 border-white">
              <Camera className="w-5 h-5" />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
            </label>
          </div>

          {/* User Info Section */}
          <div className="flex-1 text-center md:text-left space-y-6 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl md:text-4xl font-black text-[#0a1628] font-serif italic">
                  {profile.prenom} {profile.nom}
                </h1>
                <p className="text-gray-400 font-medium text-sm flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  {profile.wilaya || "Algérie"}
                </p>
              </div>
              <Link href="/settings">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 rounded-xl border-2 border-gray-100 font-bold text-xs text-[#0a1628] uppercase tracking-widest hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all flex items-center gap-2 mx-auto md:mx-0"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Modifier le profil
                </motion.button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center md:justify-start gap-12 py-6 border-y border-gray-50">
              <div className="text-center md:text-left">
                <div className="text-xl font-black text-[#0a1628]">{likedCount}</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Salles aimées</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-xl font-black text-[#0a1628]">Membre</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Depuis {new Date(profile.created_at).getFullYear()}
                </div>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FDFBF7] border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#D4AF37] shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</p>
                  <p className="text-sm font-bold text-[#0a1628] truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FDFBF7] border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#D4AF37] shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone</p>
                  <p className="text-sm font-bold text-[#0a1628]">{profile.phone || "Non renseigné"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link href="/espace-client?tab=reservations" className="group">
            <div className="bg-[#0a1628] p-8 rounded-[2rem] text-white flex justify-between items-center transition-all group-hover:bg-[#0f1e35] group-hover:translate-y-[-4px] shadow-xl">
              <div className="space-y-1">
                <h3 className="text-xl font-serif italic text-[#D4AF37]">Mes Réservations</h3>
                <p className="text-white/50 text-xs font-medium">Consultez et gérez vos événements</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/20 group-hover:text-[#D4AF37] transition-all">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </Link>
          <Link href="/salles" className="group">
            <div className="bg-white p-8 rounded-[2rem] text-[#0a1628] flex justify-between items-center transition-all group-hover:shadow-2xl group-hover:translate-y-[-4px] border border-gray-100">
              <div className="space-y-1">
                <h3 className="text-xl font-serif italic">Découvrir des salles</h3>
                <p className="text-gray-400 text-xs font-medium">Trouvez le lieu idéal</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37] transition-all">
                <Heart className="w-6 h-6" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
