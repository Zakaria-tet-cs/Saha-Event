"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Loader2, Mail, Lock, User, Check, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "signup";
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = "login" }) => {
  const router = useRouter();
  const [tab, setTab] = React.useState<"login" | "signup">(initialTab);
  const [loading, setLoading] = React.useState(false);
  
  // Login fields
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [showLoginPassword, setShowLoginPassword] = React.useState(false);

  // Signup fields
  const [nom, setNom] = React.useState("");
  const [prenom, setPrenom] = React.useState("");
  const [signupEmail, setSignupEmail] = React.useState("");
  const [signupPassword, setSignupPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showSignupPassword, setShowSignupPassword] = React.useState(false);
  
  // OTP Verification
  const [showOtp, setShowOtp] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState(["", "", "", "", "", ""]);
  const otpRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setShowOtp(false);
      setLoading(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, initialTab]);

  // Particles Canvas Effect
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: any[] = [];
    const colors = ["#C9A84C", "#E2C373", "#FFFFFF"];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: cx,
        y: cy,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: {
          x: (Math.random() - 0.5) * 15,
          y: (Math.random() - 0.5) * 15
        },
        alpha: 1,
        life: Math.random() * 60 + 30
      });
    }

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeParticles = false;
      
      particles.forEach(p => {
        if (p.life > 0) {
          activeParticles = true;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          
          p.x += p.velocity.x;
          p.y += p.velocity.y;
          p.life--;
          p.alpha = Math.max(0, p.life / 60);
          
          // add trail effect (simulate by slowing down)
          p.velocity.x *= 0.95;
          p.velocity.y *= 0.95;
        }
      });
      
      if (activeParticles) {
        animationId = requestAnimationFrame(render);
      }
    };
    
    render();
    return () => cancelAnimationFrame(animationId);
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    
    setLoading(false);
    
    if (error) {
      console.error("Login error:", error);
      toast.error(error.message);
    } else {
      toast.success(`✓ Bienvenue !`);
      onClose();
      window.location.href = "/";
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            prenom,
            nom,
          }
        }
      });
      
      setLoading(false);
      
      if (error) {
        console.error("Signup error:", error);
        toast.error(error.message);
      } else {
        toast.success("Code envoyé à votre email");
        onClose();
        router.push(`/auth/verify?email=${encodeURIComponent(signupEmail)}`);
      }
    } catch (err) {
      setLoading(false);
      console.error("Unexpected signup error:", err);
      toast.error("Erreur de connexion au serveur (Failed to fetch)");
    }
  };

  const handleOtpSubmit = async () => {
    const code = otpCode.join("");
    if (code.length !== 6) return;
    
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email: signupEmail,
      token: code,
      type: 'signup'
    });
    setLoading(false);
    
    if (error) {
      console.error("OTP verification error:", error);
      toast.error(error.message);
    } else {
      toast.success("Inscription réussie !");
      onClose();
      router.push("/");
      router.refresh();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6).split("");
    if (paste.length > 0) {
      const newOtp = [...otpCode];
      paste.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtpCode(newOtp);
      // focus the next available or last
      const nextIdx = Math.min(paste.length, 5);
      otpRefs.current[nextIdx]?.focus();
    }
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1]; // take last char
    const newOtp = [...otpCode];
    newOtp[idx] = val;
    setOtpCode(newOtp);
    
    if (val && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
  };
  
  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpCode[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  // Password Strength
  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0 to 4
  };
  const passStrength = getStrength(signupPassword);
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-400", "bg-green-600"];
  const strengthLabels = ["Très faible", "Faible", "Acceptable", "Fort", "Très fort"];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Particles Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

          {/* Halo Effect */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute pointer-events-none w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%)" }}
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275], delay: 0.1 }}
            className="relative w-full max-w-[420px] bg-[#0D1B3E] rounded-3xl border border-[#C9A84C]/25 shadow-[0_25px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(201,168,76,0.15)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-2 relative z-10">
              <h2 className="text-2xl font-serif italic font-black text-[#C9A84C]">
                ✦ SahaEvent
              </h2>
              <button onClick={onClose} className="text-white/60 hover:text-white transition-all hover:rotate-90">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Switcher */}
            {!showOtp ? (
              <div className="px-6 py-4">
                {/* Tabs */}
                <div className="flex bg-white/5 rounded-xl p-1 mb-8 relative">
                  <div 
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#C9A84C] rounded-lg transition-transform duration-300 ease-in-out ${tab === 'signup' ? 'translate-x-full' : 'translate-x-0'}`} 
                  />
                  <button 
                    onClick={() => setTab("login")}
                    className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${tab === 'login' ? 'text-[#0D1B3E]' : 'text-white/60 hover:text-white'}`}
                  >
                    Connexion
                  </button>
                  <button 
                    onClick={() => setTab("signup")}
                    className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${tab === 'signup' ? 'text-[#0D1B3E]' : 'text-white/60 hover:text-white'}`}
                  >
                    Inscription
                  </button>
                </div>

                <div className="relative overflow-hidden min-h-[300px]">
                  <AnimatePresence mode="wait">
                    {/* LOGIN TAB */}
                    {tab === "login" && (
                      <motion.form 
                        key="login"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                        onSubmit={handleLogin}
                        className="space-y-4"
                      >
                        <div className="space-y-4">
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A84C]" />
                            <input 
                              type="email" 
                              required
                              placeholder="Email" 
                              value={loginEmail}
                              onChange={e => setLoginEmail(e.target.value)}
                              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white focus:border-[#C9A84C] focus:bg-white/10 outline-none transition-all placeholder:text-white/30 font-medium"
                            />
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A84C]" />
                            <input 
                              type={showLoginPassword ? "text" : "password"} 
                              required
                              placeholder="Mot de passe" 
                              value={loginPassword}
                              onChange={e => setLoginPassword(e.target.value)}
                              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 text-white focus:border-[#C9A84C] focus:bg-white/10 outline-none transition-all placeholder:text-white/30 font-medium"
                            />
                            <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#C9A84C] transition-colors">
                              <motion.div animate={{ rotate: showLoginPassword ? 180 : 0 }}>
                                {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </motion.div>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 pb-6">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="w-4 h-4 rounded border border-white/20 group-hover:border-[#C9A84C] bg-white/5 flex items-center justify-center transition-colors">
                              <Check className="w-3 h-3 text-[#C9A84C] opacity-0 group-hover:opacity-50" />
                            </div>
                            <span className="text-xs text-white/60 group-hover:text-white/90">Se souvenir de moi</span>
                          </label>
                          <a href="#" className="text-xs text-[#C9A84C] hover:underline hover:text-white transition-colors">Mot de passe oublié ?</a>
                        </div>

                        <button 
                          disabled={loading}
                          className="w-full h-12 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#9A7230] text-[#0D1B3E] font-bold text-sm relative overflow-hidden group hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(201,168,76,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                          {loading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Connexion...</>
                          ) : (
                            <>Se connecter <ArrowRight className="w-4 h-4" /></>
                          )}
                        </button>
                      </motion.form>
                    )}

                    {/* SIGNUP TAB */}
                    {tab === "signup" && (
                      <motion.form 
                        key="signup"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        onSubmit={handleSignup}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <input 
                              type="text" 
                              required
                              placeholder="Prénom" 
                              value={prenom}
                              onChange={e => setPrenom(e.target.value)}
                              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-[#C9A84C] outline-none transition-all placeholder:text-white/30 text-sm"
                            />
                          </div>
                          <div className="relative">
                            <input 
                              type="text" 
                              required
                              placeholder="Nom" 
                              value={nom}
                              onChange={e => setNom(e.target.value)}
                              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-[#C9A84C] outline-none transition-all placeholder:text-white/30 text-sm"
                            />
                          </div>
                        </div>

                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A84C]" />
                          <input 
                            type="email" 
                            required
                            placeholder="Email" 
                            value={signupEmail}
                            onChange={e => setSignupEmail(e.target.value)}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white focus:border-[#C9A84C] outline-none transition-all placeholder:text-white/30 text-sm"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A84C]" />
                            <input 
                              type={showSignupPassword ? "text" : "password"} 
                              required
                              placeholder="Mot de passe" 
                              value={signupPassword}
                              onChange={e => setSignupPassword(e.target.value)}
                              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 text-white focus:border-[#C9A84C] outline-none transition-all placeholder:text-white/30 text-sm"
                            />
                            <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#C9A84C]">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                          {signupPassword && (
                            <div className="px-2 pt-2">
                              <div className="flex gap-1 h-1 mb-1">
                                {[1, 2, 3, 4].map(i => (
                                  <div key={i} className={`flex-1 rounded-full ${i <= passStrength ? strengthColors[passStrength] : 'bg-white/10'} transition-colors duration-300`} />
                                ))}
                              </div>
                              <p className={`text-[10px] uppercase font-bold tracking-wider ${strengthColors[passStrength].replace('bg-', 'text-')}`}>
                                {strengthLabels[passStrength]}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="relative pb-4">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A84C]" />
                          <input 
                            type={showSignupPassword ? "text" : "password"} 
                            required
                            placeholder="Confirmer mot de passe" 
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white focus:border-[#C9A84C] outline-none transition-all placeholder:text-white/30 text-sm"
                          />
                        </div>

                        <button 
                          disabled={loading}
                          className="w-full h-12 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#9A7230] text-[#0D1B3E] font-bold text-sm relative overflow-hidden group hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(201,168,76,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Création...</>
                          ) : (
                            <>Créer mon compte <ArrowRight className="w-4 h-4" /></>
                          )}
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              /* OTP VERIFICATION VIEW */
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-6 py-10 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-[#C9A84C]/10 rounded-full flex items-center justify-center mb-6 relative">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-[#C9A84C]/20 rounded-full blur-md"
                  />
                  <Mail className="w-8 h-8 text-[#C9A84C] relative z-10" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Vérifiez votre email</h3>
                <p className="text-sm text-white/60 mb-8">Un code à 6 chiffres a été envoyé à <br/><span className="text-[#C9A84C] font-semibold">{signupEmail}</span></p>

                <div className="flex gap-2 mb-8">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => { otpRefs.current[idx] = el; }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="w-10 h-12 bg-white/5 border border-white/20 rounded-lg text-center text-xl font-bold text-white focus:border-[#C9A84C] focus:bg-[#C9A84C]/10 focus:scale-110 transition-all outline-none"
                    />
                  ))}
                </div>

                <button 
                  onClick={handleOtpSubmit}
                  disabled={loading || otpCode.join("").length !== 6}
                  className="w-full h-12 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#9A7230] text-[#0D1B3E] font-bold text-sm hover:shadow-[0_0_20px_rgba(201,168,76,0.4)] transition-all active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Vérifier et continuer"}
                </button>
                
                <p className="mt-6 text-xs text-white/50">
                  Code non reçu ? <button className="text-[#C9A84C] hover:underline hover:text-white">Renvoyer le code</button>
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
