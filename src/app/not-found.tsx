"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-beige flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl w-full text-center space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-[12rem] font-black text-primary/10 tracking-tighter leading-none select-none">
            404
          </h1>
          <div className="mt-[-4rem]">
            <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tight italic serif font-serif">
              Lieu <span className="text-secondary">Introuvable</span>
            </h2>
            <p className="text-gray-500 font-medium mt-4 max-w-md mx-auto">
              Il semblerait que cette destination ne figure pas encore dans nos archives de prestige. Laissez-nous vous reconduire.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="/">
            <Button size="lg" className="gold-gradient h-16 px-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-gold border-0 transition-transform active:scale-95 text-white">
              <Home className="w-4 h-4 mr-2" /> Retour au Palais
            </Button>
          </Link>
          <Link href="/salles">
            <Button size="lg" variant="secondary" className="h-16 px-10 rounded-2xl bg-white border border-secondary/20 text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:bg-beige transition-all">
              <Compass className="w-4 h-4 mr-2" /> Explorer la Collection
            </Button>
          </Link>
        </motion.div>

        <div className="pt-20">
            <div className="flex items-center justify-center gap-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
                <div className="h-[1px] w-12 bg-gray-200" />
                Saha-Event Conciergerie
                <div className="h-[1px] w-12 bg-gray-200" />
            </div>
        </div>
      </div>
    </div>
  );
}
