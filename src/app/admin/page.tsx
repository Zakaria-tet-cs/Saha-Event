"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  List,
  LogOut,
  ChevronRight,
  Building2,
  Users,
  CalendarCheck,
  Loader2,
  LayoutDashboard,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUserRole } from "@/hooks/useUserRole";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { profile, isAdmin, loading } = useUserRole();

  const [stats, setStats] = React.useState({
    salles: 0,
    users: 0,
    reservations: 0,
  });
  const [statsLoading, setStatsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!loading) {
      if (!profile) {
        router.push("/auth/login");
      } else if (profile.role !== "admin") {
        router.push("/");
      }
    }
  }, [loading, profile, router]);

  React.useEffect(() => {
    if (!isAdmin) return;

    async function fetchStats() {
      const [
        { count: sallesCount },
        { count: usersCount },
        { count: resCount },
      ] = await Promise.all([
        supabase.from("salles").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("reservations").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        salles: sallesCount || 0,
        users: usersCount || 0,
        reservations: resCount || 0,
      });
      setStatsLoading(false);
    }

    fetchStats();
  }, [isAdmin]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Salles en ligne",
      value: stats.salles,
      icon: Building2,
      color: "from-[#D4AF37] to-[#b8962e]",
      textColor: "text-[#0a1628]",
    },
    {
      label: "Utilisateurs inscrits",
      value: stats.users,
      icon: Users,
      color: "from-[#0a1628] to-[#162340]",
      textColor: "text-white",
    },
    {
      label: "Réservations totales",
      value: stats.reservations,
      icon: CalendarCheck,
      color: "from-[#1a3a6e] to-[#0a1628]",
      textColor: "text-white",
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      title: "Ajouter une Salle",
      desc: "Créez une nouvelle fiche salle avec photos et services.",
      href: "/admin/salles/new",
      style: "bg-[#D4AF37] text-[#0a1628] hover:opacity-90",
      iconBg: "bg-[#0a1628]/20",
    },
    {
      icon: List,
      title: "Voir toutes les salles",
      desc: `${stats.salles} salle(s) actuellement en ligne.`,
      href: "/salles",
      style: "bg-[#0a1628] text-white hover:bg-[#162340]",
      iconBg: "bg-white/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">

      {/* ── Header ── */}
      <div className="bg-[#0a1628] px-6 md:px-12 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-[#0a1628]" />
          </div>
          <div>
            <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-0.5">
              Administration
            </p>
            <h1 className="text-2xl font-black italic font-serif text-white">Saha-Event</h1>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">

        {/* ── Welcome ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-1">
            Bonjour,
          </p>
          <h2 className="text-4xl font-black text-[#0a1628] italic font-serif">
            {profile?.prenom || profile?.email?.split("@")[0] || "Admin"}{" "}
            <span className="text-[#D4AF37]">👋</span>
          </h2>
          <p className="text-gray-400 font-medium mt-1 text-sm">
            Panneau d&apos;administration de la plateforme Saha-Event.
          </p>
        </motion.div>

        {/* ── Stats Cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className={`relative overflow-hidden rounded-3xl p-7 bg-gradient-to-br ${card.color} shadow-lg`}
              >
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/5" />
                <div className="relative z-10">
                  <div className={`w-11 h-11 rounded-2xl ${card.textColor === "text-[#0a1628]" ? "bg-[#0a1628]/15" : "bg-white/10"} flex items-center justify-center mb-5`}>
                    <Icon className={`w-5 h-5 ${card.textColor}`} />
                  </div>
                  {statsLoading ? (
                    <div className={`w-10 h-10 border-4 ${card.textColor === "text-[#0a1628]" ? "border-[#0a1628]/20 border-t-[#0a1628]" : "border-white/20 border-t-white"} rounded-full animate-spin mb-2`} />
                  ) : (
                    <p className={`text-5xl font-black ${card.textColor} mb-1`}>{card.value}</p>
                  )}
                  <p className={`text-xs font-black uppercase tracking-widest ${card.textColor} opacity-70`}>
                    {card.label}
                  </p>
                </div>
                <TrendingUp className={`absolute bottom-5 right-5 w-8 h-8 ${card.textColor} opacity-10`} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Quick Actions ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-5">
            Actions rapides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link
                    href={action.href}
                    className={`flex items-center gap-5 p-6 rounded-3xl ${action.style} transition-all shadow-md hover:shadow-xl group`}
                  >
                    <div className={`w-14 h-14 ${action.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-lg mb-0.5">{action.title}</h4>
                      <p className="text-sm opacity-70 font-medium">{action.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Info tip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-6 bg-[#D4AF37]/8 border border-[#D4AF37]/20 rounded-2xl"
        >
          <p className="text-sm font-bold text-[#0a1628]">
            💡 <strong>Astuce :</strong> Les boutons{" "}
            <span className="text-[#D4AF37] font-black">✏️ Modifier</span> et{" "}
            <span className="text-red-600 font-black">🗑️ Supprimer</span> s&apos;affichent directement
            sur les fiches salles, uniquement pour les administrateurs.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
