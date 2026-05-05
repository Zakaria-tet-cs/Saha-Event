"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  CalendarDays,
  ShieldCheck,
  MapPin,
  Star,
  Sparkles,
  ArrowRight,
  Gem,
  ChevronRight,
  CheckCircle2,
  Users,
  Search,
  ChevronLeft,
  Quote,
  Zap,
  Heart,
  Clock,
  PartyPopper
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { supabase } from "@/lib/supabase";

/* ─────────── Components ─────────── */

const BackgroundParticles = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: any[] = [];
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.2 + 0.15,
      });
    }

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "#D4AF37";
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none hidden md:block" style={{ mixBlendMode: 'screen' }} />;
};

const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const capsules = [
  { text: "✨ Mariage", top: "15%", left: "5%", displayClass: "block" },
  { text: "🎤 Conférence", top: "20%", right: "4%", displayClass: "block" },
  { text: "🎂 Anniversaire", top: "65%", left: "3%", displayClass: "block" },
  { text: "🥂 Gala", top: "70%", right: "5%", displayClass: "block" },
  { text: "💼 Séminaire", top: "40%", left: "1%", displayClass: "hidden md:block" },
  { text: "🎭 Cérémonie", top: "38%", right: "2%", displayClass: "hidden md:block" },
  { text: "🌹 Fiançailles", top: "85%", left: "20%", displayClass: "hidden lg:block" },
  { text: "🎪 Événement VIP", top: "10%", right: "25%", displayClass: "hidden lg:block" },
];

const capsuleAnimations = [
  { y: [-8, 8, -8], x: [-3, 3, -3], duration: 4.2, delay: 0 },
  { y: [6, -10, 6], x: [4, -4, 4], duration: 5.1, delay: 0.5 },
  { y: [-5, 9, -5], x: [-5, 2, -5], duration: 4.8, delay: 1.0 },
  { y: [10, -6, 10], x: [3, -3, 3], duration: 5.5, delay: 1.5 },
  { y: [-7, 5, -7], x: [-2, 5, -2], duration: 4.0, delay: 0.8 },
  { y: [5, -8, 5], x: [5, -2, 5], duration: 5.8, delay: 1.2 },
  { y: [-9, 4, -9], x: [-4, 4, -4], duration: 4.5, delay: 0.3 },
  { y: [7, -5, 7], x: [2, -5, 2], duration: 5.2, delay: 0.9 },
];

/* ─────────── Main Component ─────────── */

export default function Home() {
  const [salles, setSalles] = React.useState<any[]>([]);
  const { scrollYProgress } = useScroll();
  const yRange = useTransform(scrollYProgress, [0, 1], [0, -200]);

  React.useEffect(() => {
    async function loadSalles() {
      const { data } = await supabase.from('salles').select('*').limit(3);
      if (data) setSalles(data);
    }
    loadSalles();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">

      {/* ══════════ 1. HERO SECTION ══════════ */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0a1628]">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <BackgroundParticles />
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-[#D4AF37]/10 rounded-full blur-[120px] animate-pulse" />

          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img 
              src="/images/hero-bg.jpg" 
              alt="Luxury Event Background" 
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </motion.div>

          {/* Gradient Overlay (navy to transparent) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/80 via-transparent to-[#0a1628]/80 hidden md:block z-[1]" />
        </div>

        {/* CSS for Capsule Glow */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes capsule-glow {
            0%, 100% { 
              box-shadow: 0 0 12px rgba(212,175,55,0.3), 0 0 24px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.1);
            }
            50% { 
              box-shadow: 0 0 20px rgba(212,175,55,0.5), 0 0 40px rgba(212,175,55,0.25), 0 0 60px rgba(212,175,55,0.1), inset 0 1px 0 rgba(255,255,255,0.2);
            }
          }
        `}} />

        {/* Floating Capsules Layer */}
        <div className="absolute inset-0 z-[5] pointer-events-none">
          <div className="relative w-full h-full max-w-7xl mx-auto pointer-events-auto overflow-hidden">
            {capsules.map((capsule, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: capsuleAnimations[i].y,
                  x: capsuleAnimations[i].x
                }}
                transition={{
                  opacity: { delay: i * 0.15, duration: 0.5, ease: "backOut" },
                  scale: { delay: i * 0.15, duration: 0.5, ease: "backOut" },
                  y: { duration: capsuleAnimations[i].duration, delay: capsuleAnimations[i].delay, repeat: Infinity, ease: "easeInOut" },
                  x: { duration: capsuleAnimations[i].duration, delay: capsuleAnimations[i].delay, repeat: Infinity, ease: "easeInOut" }
                }}
                className={`select-none rounded-full px-[14px] py-[8px] md:px-[20px] md:py-[10px] backdrop-blur-[8px] border border-[#D4AF37]/50 text-white text-[11px] md:text-[13px] font-medium transition-transform duration-300 hover:scale-[1.08] cursor-default ${capsule.displayClass}`}
                style={{
                  background: 'linear-gradient(135deg, rgba(10,22,40,0.85) 0%, rgba(212,175,55,0.25) 100%)',
                  position: 'absolute',
                  top: capsule.top,
                  ...(capsule.left ? { left: capsule.left } : {}),
                  ...(capsule.right ? { right: capsule.right } : {}),
                  animation: `capsule-glow ${3 + i * 0.5}s ease-in-out infinite`
                }}
              >
                {capsule.text}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">
                Plateforme N°1 en Algérie
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-5xl sm:text-7xl md:text-[7rem] font-black text-white tracking-tighter mb-8 leading-[0.85] font-serif italic"
            >
              Vivez l'<span className="text-[#D4AF37]">Exception</span><br />
              <span className="text-4xl sm:text-5xl md:text-6xl font-sans not-italic font-light text-white/50 tracking-normal block mt-4">Pour vos moments précieux</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-lg md:text-xl text-white/60 font-medium max-w-2xl mx-auto mb-12 italic leading-relaxed"
            >
              "Rejoignez Saha-Event pour réserver vos salles prestigieuses et organiser des événements inoubliables."
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link href="/salles">
                <Button className="bg-[#D4AF37] text-[#0a1628] h-16 px-12 rounded-2xl text-base font-black border-0 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.7)] hover:scale-[1.03] transition-all duration-300 group">
                  <span className="flex items-center gap-3">
                    Explorer la Collection
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link href="/about" className="text-white/60 font-bold hover:text-white hover:scale-[1.03] transition-all duration-300 flex items-center gap-2 group px-6 py-4">
                En savoir plus <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ══════════ 2. HOW IT WORKS ══════════ */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-24">
            <span className="text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Processus Simple</span>
            <h2 className="text-5xl md:text-6xl font-black text-primary font-serif italic italic leading-none">
              Comment ça <span className="text-[#D4AF37]">Marche ?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: Search, title: "Cherchez", desc: "Parcourez notre collection exclusive de salles." },
              { icon: Zap, title: "Choisissez", desc: "Filtrez par prix, zone et capacité." },
              { icon: CalendarDays, title: "Réservez", desc: "Bloquez votre date en quelques clics." },
              { icon: PartyPopper, title: "Profitez", desc: "Vivez un moment magique sans stress." },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <div className="w-24 h-24 bg-beige/50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-gray-100 group-hover:bg-[#D4AF37] group-hover:scale-110 transition-all duration-500">
                  <step.icon className="w-10 h-10 text-[#D4AF37] group-hover:text-white transition-colors" />
                  <span className="absolute -top-4 -right-4 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center font-black text-primary text-sm group-hover:bg-[#0a1628] group-hover:text-[#D4AF37] transition-all">0{i + 1}</span>
                </div>
                <h3 className="text-xl font-black mb-3 text-primary uppercase tracking-wider">{step.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 3. WHY CHOOSE US ══════════ */}
      <section className="py-32 bg-beige relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">L'Excellence Saha-Event</span>
            <h2 className="text-5xl md:text-6xl font-black text-primary font-serif italic">Pourquoi choisir <br /><span className="text-[#D4AF37]">Saha-Event ?</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: CheckCircle2, title: "Réservation simple", desc: "Une interface intuitive pour réserver en quelques clics." },
              { icon: ShieldCheck, title: "Salles vérifiées", desc: "Chaque établissement est rigoureusement sélectionné." },
              { icon: Zap, title: "Paiement sécurisé", desc: "Transactions protégées et confirmation immédiate." },
              { icon: Users, title: "Support client", desc: "Une équipe dédiée pour vous accompagner 24h/24." },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-10 rounded-[2.5rem] shadow-premium border border-white/20 text-center group"
              >
                <div className="w-16 h-16 bg-beige rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#D4AF37] transition-all duration-300">
                  <item.icon className="w-8 h-8 text-[#D4AF37] group-hover:text-white" />
                </div>
                <h3 className="text-xl font-black text-primary mb-4 uppercase tracking-wider">{item.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 4. TESTIMONIALS ══════════ */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <Quote className="w-16 h-16 text-[#D4AF37]/20 mx-auto mb-6" />
            <h2 className="text-5xl md:text-6xl font-black text-primary font-serif italic leading-none">
              Ils nous font <span className="text-[#D4AF37]">Confiance</span>
            </h2>
          </div>

          <div className="flex overflow-x-auto pb-12 gap-8 no-scrollbar snap-x">
            {[
              { name: "Sonia Belhadj", text: "Un service incroyable. La salle était exactement comme sur les photos. Une expérience prestige garantie !", role: "Mariée" },
              { name: "Karim Benani", text: "Idéal pour nos séminaires d'entreprise. Tout est fluide, de la recherche à la réservation.", role: "CEO TechZ" },
              { name: "Leila Touati", text: "La conciergerie m'a aidé à trouver le lieu parfait en 24h. Je recommande à 100%.", role: "Organisatrice" },
              { name: "Amine Rezki", text: "Saha-Event a révolutionné la manière de louer une salle en Algérie. Enfin du sérieux !", role: "Photographe Pro" },
            ].map((t, i) => (
              <motion.div
                key={i}
                className="min-w-[350px] bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl snap-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />)}
                </div>
                <p className="text-gray-600 font-medium text-lg leading-relaxed mb-8 italic">"{t.text}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                  <div className="w-12 h-12 bg-beige rounded-full flex items-center justify-center font-black text-[#D4AF37] text-lg uppercase tracking-tighter">{t.name[0]}</div>
                  <div>
                    <h4 className="font-black text-primary text-sm uppercase tracking-wider">{t.name}</h4>
                    <p className="text-xs text-[#D4AF37] font-black uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 5. CALL TO ACTION ══════════ */}
      <section className="py-24 max-w-7xl mx-auto px-6 mb-24">
        <div className="relative bg-[#0a1628] rounded-[4rem] p-12 md:p-24 overflow-hidden text-center">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0a1628]/80 to-[#D4AF37]/20" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-white font-serif italic mb-8 leading-tight">
              Prêt à organiser votre prochain <span className="text-[#D4AF37]">Moment d'Exception ?</span>
            </h2>
            <p className="text-xl text-white/60 font-medium mb-12 italic">
              Inscrivez-vous dès aujourd'hui pour bénéficier de nos accès privilégiés et de notre conciergerie dédiée.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="h-16 px-12 rounded-2xl bg-[#D4AF37] text-[#0a1628] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                S'inscrire maintenant
              </Button>
              <Link href="/contact" className="h-16 px-12 rounded-2xl border-2 border-white/10 text-white font-black uppercase tracking-widest flex items-center justify-center hover:bg-white/5 transition-all">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
