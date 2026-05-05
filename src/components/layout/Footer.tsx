"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Share2, 
  ChevronRight, 
  Copy, 
  CheckCircle2,
  X
} from "lucide-react";

/* ─────────── Icons ─────────── */
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const SnapchatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2.1c-1.3 0-2.5.4-3.5 1.1-.5.3-1.1.7-1.4 1.2-.4.7-.6 1.4-.6 2.2 0 1.2.5 2.1 1.2 2.8.2.2.4.4.4.6 0 .4-.3.9-.7 1.3-.4.4-.9.8-1.3 1.3-.4.5-.7 1.1-.7 1.7 0 .6.3 1.1.7 1.4.3.2.7.3 1 .3.4 0 .7-.1 1-.3.3-.2.5-.4.8-.5.3-.1.6-.2 1-.2.4 0 .7.1 1 .2.3.1.5.3.8.5.3.2.6.3 1 .3.3 0 .7-.1 1-.3.4-.3.7-.8.7-1.4 0-.6-.3-1.2-.7-1.7-.4-.5-.9-.9-1.3-1.3-.4-.4-.7-.9-.7-1.3 0-.2.2-.4.4-.6.7-.7 1.2-1.6 1.2-2.8 0-.8-.2-1.5-.6-2.2-.3-.5-.9-.9-1.4-1.2-1-.7-2.2-1.1-3.5-1.1zm0 1.4c1.1 0 2.1.3 3 .9.4.2.8.6 1.1 1 .3.6.5 1.2.5 1.8 0 1-.4 1.7-1 2.3-.4.4-.8.8-.8 1.4 0 .8.5 1.5 1.2 2.2.5.5.9 1 1.2 1.6.3.6.4 1.2.4 1.8 0 .8-.4 1.6-1 2.1-.5.4-1.1.6-1.7.6-.6 0-1.1-.2-1.6-.5-.3-.2-.7-.4-1.1-.4s-.8.2-1.1.4c-.5.3-1 .5-1.6.5-.6 0-1.2-.2-1.7-.6-.6-.5-1-1.3-1-2.1 0-.6.1-1.2.4-1.8.3-.6.7-1.1 1.2-1.6.7-.7 1.2-1.4 1.2-2.2 0-.6-.4-1-.8-1.4-.6-.6-1-1.3-1-2.3 0-.6.2-1.2.5-1.8.3-.4.7-.8 1.1-1 .9-.6 1.9-.9 3-.9z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.875 8.835c-.141.625-.511.781-1.036.489l-2.859-2.109-1.38 1.33c-.152.152-.281.281-.576.281l.205-2.91 5.304-4.789c.231-.205-.05-.319-.359-.114l-6.557 4.127-2.822-.882c-.614-.192-.625-.614.128-.909l11.026-4.249c.511-.192.958.114.792.831z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showShare, setShowShare] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const siteUrl = 'https://saha-event.vercel.app';
  const siteTitle = 'Saha-Event - Réservation de salles à Alger';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      color: '#25D366',
      icon: WhatsAppIcon,
      url: `https://wa.me/?text=${encodeURIComponent(siteTitle + ' ' + siteUrl)}`
    },
    {
      name: 'Facebook', 
      color: '#1877F2',
      icon: FacebookIcon,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`
    },
    {
      name: 'Instagram',
      color: '#E4405F', 
      icon: InstagramIcon,
      url: `https://instagram.com`
    },
    {
      name: 'Telegram',
      color: '#2CA5E0',
      icon: TelegramIcon,
      url: `https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(siteTitle)}`
    },
    {
      name: 'Snapchat',
      color: '#FFFC00',
      icon: SnapchatIcon,
      url: `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(siteUrl)}`
    }
  ];

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Salles des fêtes", href: "/salles" },
    { name: "À propos", href: "/about" },
    { name: "Contact", href: "/contact" }
  ];

  const pathname = usePathname();

  if (pathname.startsWith('/auth')) {
    return null;
  }

  return (
    <footer className="bg-[#0a1628] text-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-30" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 relative z-10">
        {/* Brand Section */}
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center border border-[#D4AF37]/20 overflow-hidden shadow-lg group-hover:scale-110 transition-all duration-500">
              <img src="/images/logo_prestige.png" alt="Saha-Event Official Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-black uppercase tracking-[0.2em] italic font-serif text-white">Saha-Event</span>
          </Link>
          <p className="text-gray-400 font-medium leading-relaxed max-w-xs">
            La première plateforme de réservation de salles de fêtes prestigieuses en Algérie. Vivez des moments inoubliables.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={handleCopyLink}
              title="Copier le lien"
              className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0a1628] transition-all duration-300 ${copied ? 'bg-secondary text-primary scale-110' : ''}`}
            >
              {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5 text-[#D4AF37]" />}
            </button>
            <button 
              onClick={() => setShowShare(true)}
              title="Partager"
              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0a1628] transition-all duration-300"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          {copied && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#D4AF37] text-xs font-bold"
            >
              Lien copié !
            </motion.p>
          )}
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-black uppercase tracking-widest text-[#D4AF37] mb-8">Navigation</h4>
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ChevronRight className="w-4 h-4 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all -ml-6 group-hover:ml-0" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-lg font-black uppercase tracking-widest text-[#D4AF37] mb-8">Contact</h4>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <p className="text-gray-400 font-medium">123 Rue de la Liberté,<br />Alger, Algérie</p>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <p className="text-gray-400 font-medium">+213 (0) 23 45 67 89</p>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <p className="text-gray-400 font-medium">contact@saha-event.dz</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-sm font-medium">
          © {currentYear} Saha-Event. Tous droits réservés.
        </p>
        <div className="flex gap-8">
          <Link href="#" className="text-gray-500 text-sm hover:text-white transition-colors">Confidentialité</Link>
          <Link href="#" className="text-gray-500 text-sm hover:text-white transition-colors">CGU</Link>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShare && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShare(false)}
              className="fixed inset-0 bg-[#0a1628]/80 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-12 z-[101] shadow-2xl"
            >
              <div className="max-w-xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-3xl font-black text-primary font-serif italic">Partager Saha-Event</h3>
                  <button onClick={() => setShowShare(false)} className="w-12 h-12 rounded-full bg-beige flex items-center justify-center text-primary hover:bg-red-50 hover:text-red-500 transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-8">
                  {shareOptions.map((option, i) => (
                    <motion.a
                      key={option.name}
                      href={option.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex flex-col items-center gap-4 group"
                    >
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: option.color }}
                      >
                        <option.icon />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors">
                        {option.name}
                      </span>
                    </motion.a>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-beige">
                  <button 
                    onClick={handleCopyLink}
                    className="w-full h-16 rounded-2xl bg-beige border border-secondary/20 flex items-center justify-between px-8 group hover:border-secondary transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <Copy className="w-5 h-5 text-secondary" />
                      <span className="font-black text-primary uppercase tracking-widest text-xs">Copier le lien</span>
                    </div>
                    {copied && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </footer>
  );
}