"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  Settings,
  ChevronDown,
  CalendarCheck,
  Menu,
  X,
  Building2,
  MessageCircle,
  UserCircle,
  CalendarDays,
  Home,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, user, loading, signOut } = useAuth();
  const [scrolled, setScrolled] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Smart Hide/Show Scroll Logic
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 60);

      if (isMobileMenuOpen || dropdownOpen) return;

      if (currentScrollY < 10) {
        setHidden(false);
      } else if (currentScrollY > lastScrollY + 8) {
        setHidden(true);
      } else if (currentScrollY < lastScrollY - 8) {
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobileMenuOpen, dropdownOpen]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdownOpen && !target.closest('.user-dropdown-container')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      setIsMobileMenuOpen(false);
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback to manual signout and redirect
      await supabase.auth.signOut();
      window.location.href = '/';
    }
  };

  const handleNavClick = (href: string) => {
    setDropdownOpen(false);
    setIsMobileMenuOpen(false);
    
    if (href.includes('/espace-client')) {
      window.location.href = href;
    } else {
      router.push(href);
    }
  };

  // Final Order: Accueil | Salles | Contact | Profil
  const navLinks = [
    { label: "Accueil", href: "/", icon: Home },
    { label: "Salles", href: "/salles", icon: Building2 },
    { label: "Contact", href: "/contact", icon: MessageCircle },
    ...(!user ? [{ label: "Profil", href: "/espace-client", icon: UserCircle }] : [])
  ];

  const dropdownItems = [
    { label: "Mon Profil", href: "/espace-client?tab=profil", icon: User },
    { label: "Mes Réservations", href: "/espace-client?tab=reservations", icon: CalendarCheck },
    { label: "Paramètres", href: "/espace-client?tab=parametres", icon: Settings },
  ];

  if (pathname.startsWith('/auth')) return null;

  const isHeroPage = pathname === '/';
  const forceScrolled = !isHeroPage;
  const isSolid = scrolled || forceScrolled;

  return (
    <motion.nav
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: hidden ? -120 : 0,
        opacity: hidden ? 0 : 1,
        x: "-50%"
      }}
      transition={{
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1]
      }}
      className="fixed top-4 left-1/2 w-[95%] max-w-7xl z-[100]"
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes gold-pulse-glow {
          0%, 100% { box-shadow: 0 4px 16px rgba(212,175,55,0.35); }
          50% { box-shadow: 0 4px 25px rgba(212,175,55,0.6), 0 0 40px rgba(212,175,55,0.2); }
        }
      `}} />

      <div
        className="w-full flex items-center justify-between px-8 rounded-full border transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          background: isSolid
            ? 'linear-gradient(135deg, #0a1628 0%, #0f1e35 100%)'
            : 'rgba(10, 22, 40, 0.15)',
          backdropFilter: isSolid ? 'blur(20px)' : 'blur(12px) saturate(180%)',
          borderColor: isSolid ? 'rgba(212,175,55,0.25)' : 'rgba(212,175,55,0.15)',
          boxShadow: isSolid ? '0 4px 30px rgba(10,22,40,0.4)' : 'none',
          paddingTop: isSolid ? '5px' : '8px',
          paddingBottom: isSolid ? '5px' : '8px',
        }}
      >
        {/* Logo */}
        <Link 
          href="/" 
          onClick={(e) => {
            if (pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-3 group transition-all duration-300"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[#D4AF37]/20 blur-xl rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#9A7A20] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 group-hover:scale-105 transition-all duration-300">
              <Sparkles className="w-6 h-6 text-[#0a1628]" />
            </div>
          </div>
          <div className="flex items-center text-[18px] tracking-widest font-serif italic uppercase select-none">
            <span className="text-white font-bold">Saha</span>
            <span className="text-[#D4AF37] font-bold ml-0.5">-Event</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href === '/' && pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="relative group"
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-[3px]"
                >
                  <motion.div
                    whileHover={{ scale: 1.15, filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.6))' }}
                    transition={{ duration: 0.2 }}
                    className={`transition-colors duration-200 ${isActive ? "text-[#D4AF37]" : "text-[#D4AF37]/75 group-hover:text-[#D4AF37]"}`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <span className={`text-[11px] font-medium tracking-[0.5px] uppercase transition-colors duration-200 ${isActive ? "text-[#D4AF37]" : "text-white/75 group-hover:text-[#D4AF37]"}`}>
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#D4AF37]"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-5">
          {!loading && user ? (
            <div className="relative flex items-center gap-4" ref={dropdownRef}>
              {/* Prénom */}
              <span className="text-[#D4AF37] font-semibold text-[0.9rem] italic serif font-serif">
                {profile?.prenom || user.email?.split('@')[0]}
              </span>

              {/* Avatar cercle cliquable */}
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-[#0a1628] flex items-center justify-center cursor-pointer transition-all duration-300"
                style={{
                  boxShadow: dropdownOpen ? '0 0 14px rgba(212,175,55,0.5)' : 'none'
                }}
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#D4AF37] font-bold text-base">
                    {(profile?.prenom?.[0] || user.email?.[0] || 'U').toUpperCase()}
                  </span>
                )}
              </div>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-[56px] right-0 bg-white border border-[#D4AF37]/25 rounded-2xl shadow-[0_15px_40px_rgba(10,22,40,0.15)] min-w-[220px] z-[1000] overflow-hidden"
                  >
                    <div className="p-4 border-b border-[#D4AF37]/10 bg-[#D4AF37]/5">
                      <div className="font-bold text-[#0a1628] text-sm truncate">
                        {profile?.prenom} {profile?.nom}
                      </div>
                      <div className="text-gray-400 text-[10px] font-medium truncate uppercase tracking-widest mt-0.5">
                        {user.email}
                      </div>
                    </div>

                    <div className="py-1">
                      {[
                        { icon: '👤', label: 'Mon profil', href: '/espace-client' },
                        { icon: '📋', label: 'Mes réservations', href: '/reservations' },
                        { icon: '❤️', label: 'Mes favoris', href: '/favorites' },
                        { icon: '⚙️', label: 'Paramètres', href: '/espace-client?tab=parametres' },
                      ].map((item) => (
                        <div
                          key={item.label}
                          onClick={() => handleNavClick(item.href)}
                          className="px-4 py-3 flex items-center gap-3 text-sm text-[#0a1628] font-medium cursor-pointer hover:bg-[#D4AF37]/5 transition-colors"
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="h-px bg-[#D4AF37]/10" />

                    <div
                      onClick={handleLogout}
                      className="px-4 py-3 flex items-center gap-3 text-sm text-red-500 font-bold cursor-pointer hover:bg-red-50 transition-colors"
                    >
                      <span className="text-lg">🚪</span>
                      <span className="uppercase tracking-wider text-[11px]">Se déconnecter</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : !loading ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/auth/login')}
                className="px-6 py-2 rounded-full border-1.5 border-[#D4AF37]/50 bg-transparent text-[#D4AF37] font-semibold text-sm hover:bg-[#D4AF37]/5 transition-all"
              >
                Se connecter
              </button>
              <button
                onClick={() => router.push('/auth/signup')}
                className="px-6 py-2 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#9A7A20] text-[#0a1628] font-bold text-sm shadow-lg shadow-[#D4AF37]/20 hover:scale-105 transition-all"
              >
                S'inscrire →
              </button>
            </div>
          ) : null}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-full bg-white/5 border border-white/10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5 text-[#D4AF37]" /> : <Menu className="w-5 h-5 text-[#D4AF37]" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-[88px] left-1/2 -translate-x-1/2 w-[95%] max-w-lg bg-gradient-to-br from-[#0a1628] to-[#0f1e35] z-[110] p-6 rounded-b-2xl border border-[#D4AF37]/20 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              <Link 
                href="/" 
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  if (pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-3 px-4 py-3 mb-2 border-b border-[#D4AF37]/10"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#9A7A20] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#0a1628]" />
                </div>
                <div className="flex items-center text-[16px] tracking-widest font-serif italic uppercase">
                  <span className="text-white font-bold">Saha</span>
                  <span className="text-[#D4AF37] font-bold ml-0.5">-Event</span>
                </div>
              </Link>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      if (link.href === '/' && pathname === '/') {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#D4AF37]/10 transition-colors group"
                  >
                    <Icon className="w-6 h-6 text-[#D4AF37]" />
                    <span className="text-lg font-medium text-white group-hover:text-[#D4AF37] transition-colors">
                      {link.label}
                    </span>
                  </Link>
                );
              })}

              <div className="h-px bg-[#D4AF37]/15 my-4" />

              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-red-500/10 text-red-500 font-bold uppercase tracking-widest border border-red-500/20"
                >
                  <LogOut className="w-6 h-6" />
                  Déconnexion
                </button>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link href="/auth/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full h-14 rounded-full border-2 border-[#D4AF37]/70 text-[#D4AF37] font-bold uppercase tracking-widest">
                      Se connecter
                    </button>
                  </Link>
                  <Link href="/auth/signup" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full h-14 rounded-full bg-[#D4AF37] text-[#0a1628] font-bold uppercase tracking-widest shadow-lg shadow-[#D4AF37]/30">
                      S'inscrire
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
