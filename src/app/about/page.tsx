"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  ShieldCheck,
  CalendarCheck,
  Star,
  Users,
  MapPin,
  Award,
  Zap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

/* ─────────── Components ─────────── */

const AnimatedCounter = ({ value, label, icon: Icon }: { value: number; label: string; icon: any }) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      if (end === 0) return;
      
      const duration = 2000;
      const step = Math.ceil(end / (duration / 30));
      
      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div ref={ref} className="text-center group">
      <div className="w-16 h-16 bg-beige rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-premium group-hover:scale-110 group-hover:bg-secondary/10 transition-all duration-300">
        <Icon className="w-8 h-8 text-secondary transition-colors" />
      </div>
      <p className="text-4xl font-black text-primary mb-2 tracking-tighter">{count}+</p>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</p>
    </motion.div>
  );
};

/* ─────────── Main Component ─────────── */

const values = [
  {
    icon: ShieldCheck,
    title: "Exclusivité & Rareté",
    description:
      "Nous sélectionnons uniquement les établissements les plus prestigieux d'Alger, garantissant un cadre d'exception pour vos moments uniques.",
  },
  {
    icon: Zap,
    title: "Expérience Digitale",
    description:
      "Une plateforme fluide et intuitive conçue pour offrir une expérience de réservation aussi élégante que les lieux que nous proposons.",
  },
  {
    icon: Heart,
    title: "Héritage & Passion",
    description:
      "Saha-Event est née de la volonté de célébrer l'art de vivre algérois en modernisant l'organisation des grandes étapes de la vie.",
  },
  {
    icon: Award,
    title: "Standard Palace",
    description:
      "Chaque partenaire s'engage à respecter une charte de qualité stricte, assurant un service irréprochable digne des plus grands palaces.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AboutPage() {
  const [stats, setStats] = React.useState({
    totalSalles: 0,
    totalReservations: 0,
    totalUsers: 0
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      const { count: salles } = await supabase
        .from('salles')
        .select('*', { count: 'exact', head: true });
      
      const { count: reservations } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true });
      
      const { count: users } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      setStats({
        totalSalles: salles || 0,
        totalReservations: reservations || 0,
        totalUsers: users || 0
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-beige">
      {/* Immersive About Header */}
      <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 text-secondary font-black uppercase tracking-[0.3em] text-[10px] mb-6">
                <Sparkles className="w-4 h-4" /> Notre Essence
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight mb-8 italic serif font-serif">
              L'Art de <span className="text-secondary">Sublimer</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium italic">
              Saha-Event redéfinit les standards de l'événementiel en Algérie en connectant l'exigence des familles au prestige des lieux d'exception.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-[#FDFBF7] relative -mt-16 z-20 rounded-t-[4rem] shadow-[0_8px_32px_rgba(10,22,40,0.12)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <AnimatedCounter value={stats.totalSalles} label="Salles partenaires" icon={MapPin} />
            <AnimatedCounter value={stats.totalReservations} label="Réservations réussies" icon={CalendarCheck} />
            <AnimatedCounter value={stats.totalUsers} label="Membres inscrits" icon={Users} />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-square rounded-[3rem] overflow-hidden shadow-premium bg-[#0a1628]"
            >
              <img 
                src="/images/logo_prestige.png" 
                alt="Saha-Event Official Logo" 
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <Target className="w-7 h-7 text-secondary" />
                </div>
                <h2 className="text-4xl font-black text-[#0a1628] mb-6 italic serif font-serif">Notre Mission</h2>
                <p className="text-[#6B7280] text-xl leading-relaxed font-medium italic">
                  Rendre accessible l'inaccessible. Nous simplifions la recherche des lieux les plus secrets et les plus prisés d'Alger pour que chaque célébration devienne un chef-d'œuvre de souvenirs.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-premium">
                  <Eye className="w-7 h-7 text-secondary" />
                </div>
                <h2 className="text-4xl font-black text-[#0a1628] mb-6 italic serif font-serif">Notre Vision</h2>
                <p className="text-[#6B7280] text-xl leading-relaxed font-medium italic">
                  Devenir l'ambassadeur digital de l'élégance algérienne à travers le monde. Nous aspirons à porter le savoir-faire événementiel local vers des sommets d'excellence technologique et esthétique.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-[#FDFBF7] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-[#0a1628] mb-6 italic serif font-serif">L'Exigence pour <span className="text-secondary">Héritage</span></h2>
            <p className="text-[#6B7280] text-xl font-medium max-w-2xl mx-auto italic">Chaque interaction avec Saha-Event est guidée par des principes de haute volée.</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-beige rounded-[2.5rem] p-10 border border-secondary/5 shadow-premium hover:shadow-gold/10 transition-all duration-500 group"
              >
                <div className="w-14 h-14 bg-[#FDFBF7] rounded-2xl flex items-center justify-center mb-8 shadow-[0_4px_24px_rgba(10,22,40,0.08)] group-hover:bg-secondary transition-all duration-300">
                  <Icon className="w-7 h-7 text-secondary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-black text-[#0a1628] mb-4 italic serif font-serif">{title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed font-medium">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[140px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-8 italic serif font-serif">
            Écrivons <span className="text-secondary">Ensemble</span><br />votre Prochain Chapitre
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 font-medium italic">
            Rejoignez l'élite des célébrations algéroises et bénéficiez d'un accès privilégié aux plus beaux lieux d'Alger.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="gold-gradient h-16 px-10 rounded-2xl text-md font-black border-0 shadow-gold text-white" asChild>
              <Link href="/salles">Parcourir la Collection</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl text-md font-black border-white/20 text-white bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all font-sans" asChild>
              <Link href="/auth/signup">Devenir Membre Privé</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
