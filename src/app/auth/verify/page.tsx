"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  
  const [otpValues, setOtpValues] = React.useState(['', '', '', '', '', '']);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [countdown, setCountdown] = React.useState(0);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    // Handle pasted code
    if (value.length > 1) {
      const pastedCode = value.substring(0, 6).split('');
      const newValues = [...otpValues];
      pastedCode.forEach((char, i) => {
        if (i < 6 && /^\d$/.test(char)) {
          newValues[i] = char;
        }
      });
      setOtpValues(newValues);
      const nextIndex = Math.min(pastedCode.length, 5);
      document.getElementById(`otp-${nextIndex}`)?.focus();
      if (newValues.every(v => v !== '')) {
        handleVerifyOTP(newValues.join(''));
      }
      return;
    }

    if (!/^\d*$/.test(value)) return;
    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    if (newValues.every(v => v !== '') && index === 5) {
      handleVerifyOTP(newValues.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOTP = async (code: string) => {
    if (!email) {
      toast.error("Email manquant.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'signup'
      });

      if (error) {
        setError('Code invalide. Réessayez.');
        toast.error('Code invalide.');
        setOtpValues(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
        return;
      }

      toast.success("Compte vérifié !");
      router.push("/auth/complete-profile");
    } catch (err) {
      setError("Erreur de vérification.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || !email) return;
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      });
      if (error) throw error;
      setCountdown(60);
      toast.success("Nouveau code envoyé !");
    } catch (err: any) {
      toast.error(err.message || "Erreur d'envoi.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/5 via-transparent to-transparent opacity-50" />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0a1628]/80 backdrop-blur-xl p-10 rounded-[3rem] border-2 border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.1)] text-center relative z-10"
      >
        <div className="mb-10">
          <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-[#D4AF37]/20">
            <ShieldCheck className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h2 className="text-2xl font-black text-[#D4AF37] mb-3 uppercase tracking-wider">Vérification Email</h2>
          <p className="text-gray-400 font-medium text-sm">
            Entrez le code à 6 chiffres envoyé à :<br/>
            <span className="text-white font-bold block mt-2">{email || "votre adresse email"}</span>
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleVerifyOTP(otpValues.join('')); }} className="space-y-10">
          <div className="flex justify-between gap-3">
            {otpValues.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-2xl font-black bg-transparent border-2 border-[#D4AF37]/30 rounded-xl text-white outline-none transition-all focus:border-[#D4AF37] focus:scale-105 focus:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                autoFocus={i === 0}
              />
            ))}
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs font-bold bg-red-400/10 p-3 rounded-xl border border-red-400/20"
            >
              {error}
            </motion.p>
          )}

          <div className="space-y-6">
            <Button 
              type="submit" 
              className="w-full h-14 bg-[#D4AF37] text-[#0a1628] text-sm font-black rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg uppercase tracking-widest flex items-center justify-center gap-2"
              disabled={loading || otpValues.some(v => v === '')}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Vérifier mon compte"}
            </Button>
            
            <div className="space-y-4">
              <button 
                type="button" 
                onClick={handleResend}
                disabled={countdown > 0}
                className={`text-xs font-bold uppercase tracking-widest transition-colors ${countdown > 0 ? 'text-gray-600' : 'text-gray-400 hover:text-white'}`}
              >
                {countdown > 0 ? `Renvoyer dans ${countdown}s` : "Renvoyer le code"}
              </button>
              <br/>
              <button 
                type="button" 
                onClick={() => router.push("/auth/signup")}
                className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-3 h-3" />
                Retour à l'inscription
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#0a1628] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" /></div>}>
      <VerifyContent />
    </React.Suspense>
  );
}
