"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock,
  Sparkles,
  Crown,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [nomComplet, setNomComplet] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [telephone, setTelephone] = React.useState("");
  const [sujet, setSujet] = React.useState("Réservation de Gala");
  const [message, setMessage] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nomComplet || !email || !message) {
      toast.error("Veuillez remplir les champs obligatoires.");
      return;
    }

    const subject = encodeURIComponent(
      `[Saha-Event] Message de ${nomComplet}`
    );
    const body = encodeURIComponent(
      `Nom complet : ${nomComplet}\n` +
      `Email : ${email}\n` +
      `Téléphone : ${telephone}\n` +
      `Sujet : ${sujet}\n\n` +
      `Message :\n${message}\n\n` +
      `---\n` +
      `Envoyé depuis saha-event.vercel.app`
    );
    
    const mailtoLink = `mailto:contact@saha-event.dz?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
    
    // Affiche un toast de confirmation
    toast.success("Votre application email s'est ouverte avec succès !");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    
    // Reset le formulaire
    setNomComplet('');
    setEmail('');
    setTelephone('');
    setSujet('Réservation de Gala');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-beige">
      {/* Immersive Contact Header */}
      <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2000" 
            alt="Contact Background" 
            className="w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary" />
        </div>
        
        <div className="relative z-10 text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="inline-flex items-center gap-3 text-secondary font-black uppercase tracking-[0.3em] text-[10px] mb-6">
                    <MessageSquare className="w-4 h-4" />
                    Conciergerie Privée
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 italic serif font-serif text-shadow-lg">
                   NOUS <span className="text-secondary">CONTACTER</span>
                </h1>
                <p className="text-gray-400 font-medium max-w-xl mx-auto italic">
                    "Votre évènement mérite une attention exclusive. Nos conseillers en prestige sont à votre entière disposition."
                </p>
            </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-40">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                
                {/* Contact Info */}
                <div className="lg:col-span-5 space-y-12">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-black text-[#0a1628] italic serif font-serif">Lignes Directes</h2>
                        <p className="text-[#6B7280] font-medium italic serif font-serif text-lg leading-relaxed">
                            "Le luxe, c'est d'abord d'être entendu. Choisissez votre canal de communication privilégié."
                        </p>
                    </div>

                    {/* Official Logo Integration */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative aspect-square w-full max-w-[400px] mx-auto rounded-[3rem] overflow-hidden shadow-premium bg-black border border-secondary/30 flex items-center justify-center group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <img 
                            src="/images/logo_prestige.png" 
                            alt="Saha-Event Prestige Logo" 
                            className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105"
                        />
                    </motion.div>

                    <div className="space-y-8">
                        {[
                            { icon: Phone, label: "Ligne Prestige", value: "+213 21 00 00 00", sub: "Disponible 24/7 pour les membres", href: "tel:+21321000000" },
                            { icon: Mail, label: "Email Conciergerie", value: "contact@saha-event.dz", sub: "Réponse sous 2 heures", href: "mailto:contact@saha-event.dz" },
                            { icon: Clock, label: "Horaires Bureau", value: "09:00 - 18:00", sub: "Du Dimanche au Jeudi", href: null }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-6 group"
                            >
                                <div className="w-14 h-14 bg-[#FDFBF7] rounded-2xl flex items-center justify-center shadow-[0_4px_24px_rgba(10,22,40,0.08)] group-hover:bg-secondary group-hover:shadow-[0_4px_20px_rgba(212,175,55,0.4)] transition-all duration-500 flex-shrink-0">
                                    <item.icon className="w-6 h-6 text-secondary group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{item.label}</p>
                                    {item.href ? (
                                        <a href={item.href} className="text-xl font-black text-[#0a1628] mb-1 hover:text-secondary transition-colors block">
                                            {item.value}
                                        </a>
                                    ) : (
                                        <p className="text-xl font-black text-[#0a1628] mb-1">{item.value}</p>
                                    )}
                                    <p className="text-xs font-medium text-gray-400 italic">{item.sub}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="p-10 bg-primary rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <Crown className="w-12 h-12 text-secondary mb-6 relative z-10" />
                        <h4 className="text-2xl font-black mb-4 relative z-10 italic serif font-serif">Service VIP</h4>
                        <p className="text-gray-400 text-sm leading-relaxed relative z-10 font-medium italic">
                            Les membres détenteurs d'un pass "Prestige" bénéficient d'un accès prioritaire et d'un conseiller dédié pour l'organisation de leurs galas.
                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-7">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#FDFBF7] rounded-[3rem] p-10 md:p-16 shadow-[0_8px_32px_rgba(10,22,40,0.12)] border border-gray-100"
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-4">Nom Complet</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="Votre Excellence"
                                        value={nomComplet}
                                        onChange={(e) => setNomComplet(e.target.value)}
                                        className="w-full h-16 px-8 bg-beige rounded-2xl border-2 border-transparent focus:border-secondary outline-none font-bold text-[#111827] transition-all placeholder-[#6B7280]"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-4">Email</label>
                                    <input 
                                        required
                                        type="email" 
                                        placeholder="email@domaine.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-16 px-8 bg-beige rounded-2xl border-2 border-transparent focus:border-secondary outline-none font-bold text-[#111827] transition-all placeholder-[#6B7280]"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-4">Téléphone</label>
                                    <input 
                                        type="tel" 
                                        placeholder="+213..."
                                        value={telephone}
                                        onChange={(e) => setTelephone(e.target.value)}
                                        className="w-full h-16 px-8 bg-beige rounded-2xl border-2 border-transparent focus:border-secondary outline-none font-bold text-[#111827] transition-all placeholder-[#6B7280]"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-4">Objet de la Demande</label>
                                    <div className="relative">
                                        <select 
                                            value={sujet}
                                            onChange={(e) => setSujet(e.target.value)}
                                            className="w-full h-16 px-8 bg-beige rounded-2xl border-2 border-transparent focus:border-secondary outline-none font-bold text-[#111827] transition-all appearance-none cursor-pointer"
                                        >
                                            <option>Réservation de Gala</option>
                                            <option>Demande de Partenariat</option>
                                            <option>Support Technique</option>
                                            <option>Autre Demande Exclusive</option>
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-4">Votre Message</label>
                                <textarea 
                                    required
                                    rows={5}
                                    placeholder="Dites-nous tout sur votre évènement..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full p-8 bg-beige rounded-[2rem] border-2 border-transparent focus:border-secondary outline-none font-bold text-[#111827] transition-all placeholder-[#6B7280] resize-none"
                                />
                            </div>
                            <Button 
                                type="submit"
                                className="w-full h-16 gold-gradient rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-gold hover:scale-[1.02] transition-all group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                <span className="relative flex items-center justify-center">
                                    <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    Envoyer la demande
                                </span>
                            </Button>
                        </form>

                        <AnimatePresence>
                            {success && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="mt-8 p-6 bg-green-500 text-white rounded-2xl flex items-center gap-4 shadow-xl shadow-green-500/20"
                                >
                                    <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                                    <p className="font-bold text-sm">Votre application email s'est ouverte avec succès !</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
