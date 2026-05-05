"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  Zap
} from "lucide-react";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  
  // États demandés par l'utilisateur
  const [email, setEmail] = React.useState('');
  const [otpCode, setOtpCode] = React.useState('');
  const [nouveauMdp, setNouveauMdp] = React.useState('');
  const [confirmMdp, setConfirmMdp] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [step, setStep] = React.useState<1 | 2 | 3>(1);

  // États additionnels pour l'UI
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);
  const [otpArray, setOtpArray] = React.useState(['', '', '', '', '', '']);

  // Timer pour le renvoi du code
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Synchroniser otpArray avec otpCode
  React.useEffect(() => {
    setOtpCode(otpArray.join(''));
  }, [otpArray]);

  // ÉTAPE 1 : Envoi du code
  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Envoi du code de récupération à:', email);
      const { error: resetError } = await supabase.auth
        .resetPasswordForEmail(email);

      if (resetError) {
        console.error('Erreur resetPasswordForEmail:', resetError.message);
        setError('Erreur : ' + resetError.message);
        setLoading(false);
        return;
      }

      console.log('Code envoyé avec succès !');
      setStep(2);
      setCountdown(60);
      setLoading(false);
      toast.success("Code de récupération envoyé !");
    } catch (err: unknown) {
      console.error('Erreur inattendue handleSendCode:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erreur inattendue');
      }
      setLoading(false);
    }
  };

  // ÉTAPE 2 : Vérification OTP et changement de mot de passe
  const handleReset = async () => {
    // Réinitialiser les états
    setError('');
    setSuccess(false);

    // Validation des champs
    if (!otpCode || otpCode.length !== 6) {
      setError('Veuillez entrer le code à 6 chiffres');
      return;
    }

    if (!nouveauMdp || nouveauMdp.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (nouveauMdp !== confirmMdp) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      // ÉTAPE 1 : Vérifier le code OTP
      console.log('Vérification OTP...');
      
      const { data: verifyData, error: verifyError } = 
        await supabase.auth.verifyOtp({
          email: email,        // email saisi par l'utilisateur
          token: otpCode,      // code à 6 chiffres
          type: 'recovery'     // OBLIGATOIRE pour reset password
        });

      console.log('Résultat verifyOtp:', { verifyData, verifyError });

      if (verifyError) {
        console.error('Erreur verifyOtp:', verifyError.message);
        setError('Code incorrect ou expiré. Demandez un nouveau code.');
        setLoading(false);
        return;
      }

      if (!verifyData?.session) {
        console.error('Pas de session après verifyOtp');
        setError('Code invalide. Veuillez réessayer.');
        setLoading(false);
        return;
      }

      // ÉTAPE 2 : Attendre que la session soit bien établie
      await new Promise(resolve => setTimeout(resolve, 500));

      // ÉTAPE 3 : Changer le mot de passe
      console.log('Changement du mot de passe...');
      
      const { data: updateData, error: updateError } = 
        await supabase.auth.updateUser({
          password: nouveauMdp
        });

      console.log('Résultat updateUser:', { updateData, updateError });

      if (updateError) {
        console.error('Erreur updateUser:', updateError.message);
        
        // Message d'erreur selon le type
        if (updateError.message.includes('same password')) {
          setError('Le nouveau mot de passe doit être différent de l\'ancien');
        } else if (updateError.message.includes('weak')) {
          setError('Mot de passe trop faible. Ajoutez des chiffres et des majuscules');
        } else {
          setError('Erreur lors du changement : ' + updateError.message);
        }
        
        setLoading(false);
        return;
      }

      // ÉTAPE 4 : Succès
      console.log('Mot de passe changé avec succès !');
      setSuccess(true);
      setStep(3); // On passe au step 3 (succès)
      setLoading(false);
      toast.success("Mot de passe réinitialisé !");

      // Déconnecter et rediriger vers login après 2.5s
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push('/auth/login');
      }, 2500);

    } catch (err: unknown) {
      // Attraper toute erreur inattendue
      console.error('Erreur inattendue:', err);
      if (err instanceof Error) {
        setError('Une erreur inattendue : ' + err.message);
      } else {
        setError('Une erreur inattendue est survenue. Réessayez.');
      }
      setLoading(false);  // ← TOUJOURS libérer le loading
    }
  };

  // Gestion des cases OTP
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    // Si on colle un code complet
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split('');
      const newArray = [...otpArray];
      pasted.forEach((char, idx) => {
        if (idx < 6) newArray[idx] = char;
      });
      setOtpArray(newArray);
      document.getElementById(`otp-${Math.min(5, pasted.length - 1)}`)?.focus();
      return;
    }

    const newValues = [...otpArray];
    newValues[index] = value;
    setOtpArray(newValues);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const getPasswordStrength = () => {
    let score = 0;
    if (nouveauMdp.length >= 8) score++;
    if (/[A-Z]/.test(nouveauMdp)) score++;
    if (/[0-9]/.test(nouveauMdp)) score++;
    if (/[^A-Za-z0-9]/.test(nouveauMdp)) score++;
    return score;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-[#0a1628] via-[#1a2f4a] to-[#0a1628] relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#D4AF37] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#D4AF37] rounded-full blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="bg-[#FDFBF7] rounded-[2.5rem] p-10 md:p-12 shadow-[0_25px_80px_rgba(10,22,40,0.5)] border border-white/10">
          
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <Link href="/" className="flex items-center gap-2">
              <CalendarDays className="w-8 h-8 text-[#D4AF37]" />
              <div className="flex items-center text-xl tracking-widest font-serif italic uppercase">
                <span className="text-[#0a1628] font-bold">Saha</span>
                <span className="text-[#D4AF37] font-bold ml-0.5">-Event</span>
              </div>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            
            {/* ÉCRAN 1: SAISIE EMAIL */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black text-[#0a1628] font-serif italic">Mot de passe oublié</h2>
                  <p className="text-gray-400 text-sm font-medium">Entrez votre email pour recevoir un code de récupération</p>
                </div>

                <div className="space-y-6">
                  {error && (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-3 text-red-600 text-xs font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <FloatingInput 
                    label="Adresse Email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />

                  <motion.button
                    onClick={handleSendCode}
                    disabled={loading || !email}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-16 gold-gradient rounded-2xl text-[#0a1628] font-black uppercase tracking-widest text-sm shadow-gold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Envoyer le code"}
                  </motion.button>

                  <Link href="/auth/login" className="flex items-center justify-center gap-2 text-gray-400 hover:text-[#0a1628] text-xs font-black uppercase tracking-widest transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la connexion
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ÉCRAN 2: OTP + NOUVEAU MOT DE PASSE */}
            {step === 2 && !success && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black text-[#0a1628] font-serif italic">Vérification</h2>
                  <p className="text-gray-400 text-sm font-medium">
                    Code envoyé à <span className="text-[#0a1628] font-bold">{email.replace(/(.{1}).*(@.*)/, '$1***$2')}</span>
                  </p>
                </div>

                <div className="space-y-6">
                  {error && (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-3 text-red-600 text-xs font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  {/* Cases OTP */}
                  <div className="flex justify-between gap-2">
                    {otpArray.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !otpArray[i] && i > 0) {
                            document.getElementById(`otp-${i - 1}`)?.focus();
                          }
                        }}
                        className="w-[48px] h-[56px] text-center text-xl font-black bg-white border-2 border-gray-100 rounded-xl focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all text-[#0a1628]"
                      />
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <FloatingInput 
                        label="Nouveau mot de passe" 
                        type={showPassword ? "text" : "password"} 
                        value={nouveauMdp} 
                        onChange={(e) => setNouveauMdp(e.target.value)} 
                        required 
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Password Strength */}
                    {nouveauMdp.length > 0 && (
                      <div className="flex gap-1 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`flex-1 transition-all duration-500 ${
                            i <= getPasswordStrength() ? (i <= 2 ? "bg-red-400" : i === 3 ? "bg-blue-400" : "bg-[#D4AF37]") : "bg-transparent"
                          }`} />
                        ))}
                      </div>
                    )}

                    <div className="relative">
                      <FloatingInput 
                        label="Confirmer le mot de passe" 
                        type={showConfirmPassword ? "text" : "password"} 
                        value={confirmMdp} 
                        onChange={(e) => setConfirmMdp(e.target.value)} 
                        required 
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleReset}
                    disabled={loading || otpCode.length !== 6 || !nouveauMdp}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-16 gold-gradient rounded-2xl text-[#0a1628] font-black uppercase tracking-widest text-sm shadow-gold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Vérification en cours...</span>
                      </>
                    ) : "Réinitialiser le mot de passe"}
                  </motion.button>

                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Renvoyer dans {countdown}s</p>
                    ) : (
                      <button 
                        onClick={handleSendCode}
                        className="text-[10px] font-black text-[#D4AF37] hover:underline uppercase tracking-widest"
                      >
                        Renvoyer le code
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ÉCRAN 3: SUCCÈS */}
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-8"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border-2 border-green-100">
                  <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </motion.div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-green-600 font-serif italic">Mot de passe modifié !</h2>
                  <p className="text-gray-400 text-sm font-medium">Votre accès a été réinitialisé avec succès.</p>
                </div>

                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest animate-pulse">
                  Redirection vers la connexion...
                </p>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}
