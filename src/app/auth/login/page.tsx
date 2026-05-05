"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  CheckCircle2
} from "lucide-react";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get('reset') === 'success';

  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Login result:', data, error);
      
      if (error) throw error;
      router.push('/espace-client');
      
    } catch (err: any) {
      console.error('Login error details:', 
        err?.message, err?.status, err?.code);
      setError(err?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-[#F8F4EC] via-[#FDFBF7] to-[#F0EBE0] overflow-hidden">
      
      {/* ══════════ CÔTÉ GAUCHE (45%) - PANNEAU DÉCORATIF ══════════ */}
      <div className="hidden lg:flex w-[45%] relative flex-col justify-between p-16 overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#1a2f4a] to-[#0a1628]">
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              opacity: [0.05, 0.12, 0.05],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            className="absolute rounded-full bg-[#D4AF37] blur-[60px]"
            style={{
              width: `${40 + i * 15}px`,
              height: `${40 + i * 15}px`,
              top: `${15 + i * 12}%`,
              left: `${10 + i * 14}%`,
            }}
          />
        ))}

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 group">
            <CalendarDays className="w-8 h-8 text-[#D4AF37]" />
            <div className="flex items-center text-[22px] tracking-widest font-serif italic uppercase select-none">
              <span className="text-white font-bold">Saha</span>
              <span className="text-[#D4AF37] font-bold ml-0.5">-Event</span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-black text-white font-serif italic leading-tight mb-4">
              Bienvenue
            </h1>
            <p className="text-[#D4AF37] font-medium text-lg italic serif font-serif">
              L'excellence au service de vos rêves
            </p>
            <div className="w-16 h-px bg-[#D4AF37] mt-8" />
          </motion.div>

          <div className="space-y-8">
            {[
              { icon: Star, text: "Salles prestigieuses à Alger" },
              { icon: Zap, text: "Réservation instantanée" },
              { icon: ShieldCheck, text: "Paiement sécurisé" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4 text-white/75"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <feature.icon className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <span className="font-bold text-sm tracking-wide">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
          <Link href="/about" className="hover:text-[#D4AF37] transition-colors">À Propos</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">Support</Link>
          <span>•</span>
          <span className="opacity-50 italic uppercase tracking-widest">© 2026 Saha-Event</span>
        </div>
      </div>

      {/* ══════════ CÔTÉ DROIT (55%) - FORMULAIRE ══════════ */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center p-8 md:p-16 relative">
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-8 left-1/2 -translate-x-1/2">
          <Link href="/" className="flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-[#D4AF37]" />
            <div className="flex items-center text-lg tracking-widest font-serif italic uppercase">
              <span className="text-[#0a1628] font-bold">Saha</span>
              <span className="text-[#D4AF37] font-bold ml-0.5">-Event</span>
            </div>
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
          transition={{ 
            duration: error ? 0.4 : 0.6,
            ease: "easeOut" 
          }}
          className="w-full max-w-[440px] bg-[#FDFBF7] p-10 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(10,22,40,0.06)] border border-gray-100"
        >
          <div className="space-y-2 mb-10">
            <h2 className="text-3xl font-black text-[#0a1628] font-serif italic">Connexion</h2>
            <p className="text-gray-400 text-sm font-medium">Accédez à votre espace prestige</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {resetSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-500/5 border-l-4 border-emerald-500 p-4 rounded-r-xl flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <p className="text-emerald-700 text-xs font-bold">Mot de passe mis à jour ! Connectez-vous.</p>
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-600 text-xs font-bold leading-relaxed">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <FloatingInput 
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error}
            />

            <div className="relative group">
              <FloatingInput 
                label="Mot de passe"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!error}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors z-20"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link 
                href="/auth/reset-password" 
                className="text-[12px] font-bold text-[#D4AF37] hover:underline transition-all underline-offset-4"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-[56px] gold-gradient rounded-[14px] text-[#0a1628] font-bold text-base shadow-[0_8px_25px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connexion...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>

            <div className="text-center pt-6">
              <p className="text-sm text-gray-500 font-medium">
                Pas encore de compte ?{" "}
                <Link href="/auth/signup" className="text-[#D4AF37] font-black hover:underline underline-offset-4 ml-1">
                  S'inscrire →
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    }>
      <LoginContent />
    </React.Suspense>
  );
}