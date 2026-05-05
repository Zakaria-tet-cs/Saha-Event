"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  CalendarDays,
  ShieldCheck,
  Zap,
  Star,
  AlertCircle,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Clock,
  Crown
} from "lucide-react";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const getPasswordStrength = (pwd: string) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};

const strengthConfig = {
  0: { label: '', color: '#E5E7EB', width: '0%' },
  1: { label: 'Faible', color: '#EF4444', width: '25%' },
  2: { label: 'Moyen', color: '#F59E0B', width: '50%' },
  3: { label: 'Bon', color: '#10B981', width: '75%' },
  4: { label: 'Excellent', color: '#D4AF37', width: '100%' },
};

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form State
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const strength = getPasswordStrength(password);
  const config = strengthConfig[strength as keyof typeof strengthConfig];

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            prenom: firstName,
            nom: lastName,
            full_name: `${firstName} ${lastName}` 
          },
        }
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        toast.success("Veuillez vérifier votre email !");
        router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      setError("Une erreur est survenue.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FDFBF7] overflow-x-hidden">
      
      {/* ══════════ PANNEAU GAUCHE (50%) - HERO SECTION ══════════ */}
      <div className="w-full lg:w-1/2 relative flex flex-col justify-center p-8 md:p-12 lg:p-16 overflow-hidden bg-gradient-to-b from-[#0a1628] via-[#0f2040] to-[#1a1200]">
        {/* Motif SVG Losanges Subtil */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30-30-30z' fill='%23D4AF37' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`, backgroundSize: '30px 30px' }} />
        
        <div className="relative z-10 max-w-lg mx-auto lg:mx-0 space-y-8 lg:space-y-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] md:text-xs font-black uppercase tracking-[0.15em] w-fit"
          >
            <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" />
            <span>Plateforme N°1 à Alger</span>
          </motion.div>

          {/* Titre */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-serif italic font-black leading-[1.1] flex flex-col"
            >
              <span className="text-white">Rejoignez</span>
              <span className="text-[#D4AF37] relative inline-block w-fit">
                l'Excellence
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
                  className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-transparent"
                />
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="space-y-4"
            >
              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-[380px] font-medium">
                Créez votre compte et accédez aux meilleures salles prestigieuses d'Alger pour vos moments d'exception.
              </p>
              <p className="text-[#D4AF37]/70 text-sm md:text-base italic font-serif leading-relaxed">
                Un univers de luxe, de raffinement et d'accessibilité vous attend.
              </p>
            </motion.div>
          </div>

          {/* Highlight Cards */}
          <div className="hidden sm:grid grid-cols-1 gap-4 pt-4 lg:pt-8">
            {[
              { icon: Building2, title: "Salles Prestigieuses", subtitle: "120+ venues vérifiées" },
              { icon: Clock, title: "Réservation Rapide", subtitle: "Confirmée en 24h" },
              { icon: Crown, title: "Service Premium", subtitle: "Accompagnement dédié" }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + idx * 0.15 }}
                whileHover={{ x: 4, backgroundColor: 'rgba(212, 175, 55, 0.08)', borderColor: 'rgba(212, 175, 55, 0.5)' }}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-[#D4AF37]/20 backdrop-blur-sm transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-full bg-[#D4AF37]/12 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all">
                  <card.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{card.title}</h3>
                  <p className="text-white/50 text-[11px] font-medium">{card.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ PANNEAU DROIT (50%) - FORMULAIRE ══════════ */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 relative bg-[#FDFBF7]">
        <div className="lg:hidden absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-[#D4AF37]" />
            <span className="text-base font-black text-[#0a1628] italic font-serif">Saha-Event</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            x: error ? [0, -8, 8, -6, 6, 0] : 0
          }}
          className="w-full max-w-[460px] bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(10,22,40,0.04)] border border-gray-100"
        >
          <div className="space-y-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-[#0a1628] font-serif italic">Inscription</h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Quelques secondes pour commencer</p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-600 text-xs font-bold leading-relaxed">{error}</p>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <FloatingInput label="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <FloatingInput label="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>

              <FloatingInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

              <div className="space-y-2">
                <div className="relative group">
                  <FloatingInput 
                    label="Mot de passe" 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] z-20"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="px-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1 flex-grow max-w-[200px]">
                        {[1, 2, 3, 4].map((i) => (
                          <div 
                            key={i} 
                            className="h-1 flex-grow rounded-full transition-all duration-500"
                            style={{ backgroundColor: i <= strength ? config.color : '#E5E7EB' }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: config.color }}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative group">
                <FloatingInput 
                  label="Confirmer le mot de passe" 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] z-20"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-14 gold-gradient rounded-xl text-[#0a1628] font-bold text-sm shadow-[0_8px_25px_rgba(212,175,55,0.25)] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Création en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Créer mon compte</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>

              <div className="text-center pt-6">
                <p className="text-sm text-gray-500 font-medium">
                  Déjà inscrit ?{" "}
                  <Link href="/auth/login" className="text-[#D4AF37] font-black hover:underline ml-1">
                    Se connecter →
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
