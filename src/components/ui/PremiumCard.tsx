import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface PremiumCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'gold';
  hover?: boolean;
  glow?: boolean;
  index?: number;
}

export function PremiumCard({ 
  children, 
  className = "", 
  variant = 'light', 
  hover = false, 
  glow = false,
  index = 0,
  ...props 
}: PremiumCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'dark':
        return "bg-gradient-to-br from-[#0a1628] to-[#112240] border border-[#D4AF37]/25 shadow-[0_8px_32px_rgba(10,22,40,0.4)] text-white";
      case 'gold':
        return "bg-gradient-to-br from-[#D4AF37]/12 to-[#D4AF37]/5 border border-[#D4AF37]/40 shadow-[0_4px_20px_rgba(212,175,55,0.15)]";
      case 'light':
      default:
        return "bg-[#FDFBF7] border border-[#D4AF37]/20 shadow-[0_4px_24px_rgba(10,22,40,0.08)] text-[#0a1628]";
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }
    })
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      whileHover={hover ? { 
        y: -4,
        boxShadow: glow ? "0 12px 40px rgba(212,175,55,0.15)" : undefined
      } : undefined}
      className={`rounded-[20px] p-[28px] ${getVariantStyles()} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
