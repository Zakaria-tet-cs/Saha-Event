"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  ArrowRight, 
  Loader2, 
  CalendarDays,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || "";

  const [loading, setLoading] = React.useState(false);
  const [otpValues, setOtpValues] = React.useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = React.useState(60);
  const [isSuccess, setIsSuccess] = React.useState(false);

  React.useEffect(() => {
    if (!email) {
      router.push("/auth/signup");
    }
  }, [email, router]);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const { error: otpError } = await supabase.auth.verifyOtp({
        email,
        token: otpValues.join(''),
        type: 'signup'
      });

      if (otpError) {
        toast.error("Code invalide");
        setOtpValues(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
        return;
      }

      setIsSuccess(true);
      toast.success("Email vérifié !");
      setTimeout(() => {
        router.push("/auth/complete-profile");
      }, 1500);
    } catch (err) {
      toast.error("Erreur de vérification");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      });
      if (error) throw error;
      setCountdown(60);
      toast.success("Nouveau code envoyé !");
    } catch (err) {
      toast.error("Erreur d'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-[#F8F4EC] via-[#FDFBF7] to-[#F0EBE0] overflow-hidden">
      <div className="w-full flex flex-col justify-center items-center p-8 md:p-16 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-[500px] bg-[#FDFBF7] p-10 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(10,22,40,0.06)] border border-gray-100"
        >
          <div className="text-center space-y-8">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="otp-screen"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <motion.div 
                      animate={{ rotate: [-5, 5, -5] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-20 h-20 bg-[#D4AF37]/10 rounded-[2rem] flex items-center justify-center mx-auto border-2 border-[#D4AF37]/20"
                    >
                      <Mail className="w-10 h-10 text-[#D4AF37]" />
                    </motion.div>
                    <h2 className="text-2xl font-black text-[#0a1628] font-serif italic">Vérifiez votre email</h2>
                    <p className="text-gray-400 text-sm font-medium">
                      Code envoyé à <span className="text-[#0a1628] font-bold">{email.replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3) => gp2 + gp3.replace(/./g, '*'))}</span>
                    </p>
                  </div>

                  <div className="flex justify-center gap-2 md:gap-3">
                    {otpValues.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !otpValues[i] && i > 0) {
                            document.getElementById(`otp-${i - 1}`)?.focus();
                          }
                        }}
                        className={`w-11 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-white border-2 rounded-xl outline-none transition-all ${digit ? 'border-[#D4AF37] bg-[#FEF9E7] text-[#0a1628]' : 'border-[#E5E7EB] focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 shadow-[0_4px_24px_rgba(10,22,40,0.06)]'}`}
                      />
                    ))}
                  </div>

                  <div className="space-y-6">
                    <div className="relative w-16 h-16 mx-auto">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-gray-100" />
                        <motion.circle
                          cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" fill="transparent"
                          className="text-[#D4AF37]"
                          strokeDasharray="188.5"
                          animate={{ strokeDashoffset: 188.5 * (1 - countdown / 60) }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-[#0a1628]">
                        {countdown}s
                      </span>
                    </div>

                    <motion.button
                      onClick={handleVerifyOTP}
                      disabled={loading || otpValues.some(v => v === '')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-[56px] gold-gradient rounded-[14px] text-[#0a1628] font-bold text-base shadow-xl disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Vérifier le code"}
                    </motion.button>
                    
                    <div className="flex flex-col gap-4">
                      {countdown === 0 && (
                        <button 
                          onClick={handleResend}
                          className="text-xs font-black text-[#D4AF37] hover:underline uppercase tracking-widest"
                        >
                          Renvoyer le code
                        </button>
                      )}
                      <Link 
                        href="/auth/signup"
                        className="flex items-center justify-center gap-2 mx-auto text-xs font-black text-gray-400 hover:text-[#0a1628] transition-colors uppercase tracking-widest"
                      >
                        <ArrowLeft className="w-3 h-3" /> Modifier l'email
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success-otp"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 space-y-6"
                >
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-[#0a1628] font-serif italic">Succès !</h2>
                    <p className="text-gray-500 font-medium">Email vérifié avec succès !</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]"><Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" /></div>}>
      <VerifyOtpContent />
    </React.Suspense>
  );
}
