'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Settings, 
  CalendarCheck, 
  Heart, 
  Camera, 
  LogOut, 
  Mail, 
  Phone, 
  MapPin, 
  Loader2,
  Star,
  Building2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

function EspaceClientContent() {
  const router = useRouter();
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  
  const [stats, setStats] = React.useState({ reservations: 0, favoris: 0 });
  const [uploading, setUploading] = React.useState(false);
  const [profileData, setProfileData] = React.useState<any>(null);
  const [dataLoading, setDataLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [localAvatarUrl, setLocalAvatarUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      const timeoutId = setTimeout(() => {
        if (mounted && dataLoading) {
          setDataLoading(false);
          if (!profileData) {
            setError('Le chargement prend plus de temps que prévu...');
          }
        }
      }, 5000);
      
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession) {
          if (!authLoading) router.push('/auth/login');
          return;
        }

        const currentUser = currentSession.user;

        // Parallel fetch for profile and counts
        const [profResult, resCount, favCount] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', currentUser.id).maybeSingle(),
          supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('user_id', currentUser.id),
          supabase.from('favoris').select('*', { count: 'exact', head: true }).eq('user_id', currentUser.id)
        ]);
        
        if (mounted) {
          if (profResult.data) {
            setProfileData(profResult.data);
            setLocalAvatarUrl(profResult.data.avatar_url);
          }
          setStats({
            reservations: resCount.count || 0,
            favoris: favCount.count || 0
          });
          clearTimeout(timeoutId);
          setDataLoading(false);
        }
      } catch (err: any) {
        if (mounted) {
          console.error("Error fetching data:", err);
          setError('Erreur lors du chargement des données');
          setDataLoading(false);
        }
      }
    };
    
    fetchData();
    return () => { mounted = false; };
  }, [authLoading, router]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image est trop lourde (max 5MB)");
      return;
    }

    setUploading(true);
    try {
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

      setLocalAvatarUrl(publicUrlWithTimestamp);
      if (refreshProfile) await refreshProfile();
      toast.success("Photo de profil mise à jour !");
    } catch (err: any) {
      toast.error("Erreur lors de l'upload de l'image");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] gap-4">
        <p className="text-red-500 font-bold">{error}</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#0a1628] text-white rounded-xl font-bold">Réessayer</button>
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] gap-4">
        <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
        <p className="text-[#D4AF37] font-black uppercase tracking-widest text-xs">Chargement de votre profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 px-4 md:px-8">
      <motion.div 
        className="max-w-5xl mx-auto space-y-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        
        {/* 1. HEADER PROFIL */}
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-premium border border-[#D4AF37]/15 relative overflow-hidden text-center">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col items-center space-y-10 relative z-10">
            {/* Photo de profil */}
            <div className="relative">
              <div className="w-36 h-36 md:w-52 md:h-52 rounded-full border-[6px] border-[#D4AF37] p-1.5 bg-white shadow-gold-subtle relative overflow-hidden">
                {localAvatarUrl ? (
                  <img src={localAvatarUrl} alt="Profil" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#0a1628] flex items-center justify-center">
                    <span className="text-6xl font-serif italic text-[#D4AF37] font-black">
                      {(profileData?.prenom?.[0] || user?.email?.[0] || 'S').toUpperCase()}
                    </span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-[#0a1628]/60 flex items-center justify-center rounded-full z-10">
                    <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-4 right-4 w-12 h-12 bg-[#D4AF37] text-[#0a1628] rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:scale-110 transition-transform border-4 border-white">
                <Camera className="w-6 h-6" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
            </div>

            <div className="space-y-8 w-full max-w-3xl">
              {/* Nom et Localisation */}
              <div className="space-y-3">
                <h1 className="text-5xl md:text-6xl font-serif italic font-black text-[#0a1628] tracking-tight">
                  {profileData?.prenom || "Prénom"} {profileData?.nom || "Nom"}
                </h1>
                <div className="flex items-center justify-center gap-3 text-gray-500 font-medium italic text-lg">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  <span>{profileData?.wilaya || "Localisation non définie"}</span>
                </div>
              </div>

              {/* Statistiques */}
              <div className="flex justify-center gap-12 py-8 border-y border-[#D4AF37]/15">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Favoris</span>
                  <span className="text-2xl font-serif italic font-black text-[#0a1628] uppercase">{stats.favoris} Salles</span>
                </div>
                <div className="w-px bg-[#D4AF37]/20" />
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Ancienneté</span>
                  <span className="text-2xl font-serif italic font-black text-[#0a1628] uppercase">Membre {profileData?.created_at ? new Date(profileData.created_at).getFullYear() : '2026'}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="flex items-center gap-4 text-[#0a1628] bg-[#FDFBF7] px-8 py-4 rounded-2xl border border-[#D4AF37]/15 shadow-sm">
                  <Mail className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-black tracking-tight">{user?.email}</span>
                </div>
                <div className="flex items-center gap-4 text-[#0a1628] bg-[#FDFBF7] px-8 py-4 rounded-2xl border border-[#D4AF37]/15 shadow-sm">
                  <Phone className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-black tracking-tight">{profileData?.phone ? `+213 ${profileData.phone}` : "Non renseigné"}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-5">
                 <motion.button 
                  whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(212,175,55,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/settings')}
                  className="group flex items-center justify-center gap-4 px-10 py-4.5 bg-[#D4AF37] text-[#0a1628] rounded-full font-black uppercase tracking-[0.2em] text-[12px] shadow-2xl transition-all w-full md:w-auto min-w-[220px]"
                >
                  <Settings className="w-5 h-5 transition-transform group-hover:rotate-90 duration-500" />
                  PARAMÈTRES
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(10,22,40,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="group flex items-center justify-center gap-4 px-10 py-4.5 bg-[#0a1628] text-[#D4AF37] border border-[#D4AF37]/20 rounded-full font-black uppercase tracking-[0.2em] text-[12px] shadow-2xl transition-all w-full md:w-auto min-w-[220px]"
                >
                  <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-2 duration-300" />
                  DÉCONNEXION
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. NAVIGATION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <motion.div 
            whileHover={{ y: -12, scale: 1.02 }}
            onClick={() => router.push('/reservations')}
            className="bg-[#0a1628] rounded-[3rem] p-10 border border-white/10 shadow-2xl cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <CalendarCheck size={120} color="white" />
            </div>
            <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-[1.5rem] flex items-center justify-center mb-8">
              <CalendarCheck className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3 className="text-3xl font-serif italic font-black text-[#D4AF37] mb-3">Mes Réservations</h3>
            <p className="text-white/50 text-sm font-medium leading-relaxed">Suivez et gérez l'ensemble de vos événements réservés.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -12, scale: 1.02 }}
            onClick={() => router.push('/salles')}
            className="bg-[#F8F4EC] rounded-[3rem] p-10 border border-[#D4AF37]/15 shadow-2xl cursor-pointer group"
          >
            <div className="w-16 h-16 bg-[#0a1628]/5 rounded-[1.5rem] flex items-center justify-center mb-8">
              <Building2 className="w-8 h-8 text-[#0a1628]" />
            </div>
            <h3 className="text-3xl font-serif italic font-black text-[#0a1628] mb-3">Découvrir</h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">Trouvez la salle parfaite parmi notre sélection exclusive.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -12, scale: 1.02 }}
            onClick={() => router.push('/favorites')}
            className="bg-[#D4AF37] rounded-[3rem] p-10 shadow-gold-subtle cursor-pointer group"
          >
            <div className="w-16 h-16 bg-[#0a1628]/10 rounded-[1.5rem] flex items-center justify-center mb-8">
              <Star className="w-8 h-8 text-[#0a1628]" />
            </div>
            <h3 className="text-3xl font-serif italic font-black text-[#0a1628] mb-3">Mes Favoris</h3>
            <p className="text-[#0a1628]/60 text-sm font-medium leading-relaxed">Accédez rapidement aux salles que vous avez aimées.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function EspaceClientPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
        <p className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-xs animate-pulse">Chargement...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <React.Suspense fallback={<div>Chargement...</div>}>
      <EspaceClientContent />
    </React.Suspense>
  );
}
