"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const buttonVariants = {
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-[#1e3a5f] text-white hover:bg-[#152a45] shadow-md hover:shadow-lg",
      secondary: "bg-[#d4af37] text-white hover:bg-[#b8952b] shadow-md hover:shadow-lg",
      outline: "border-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#f6f8fb]",
      ghost: "hover:bg-gray-100 text-gray-800",
      link: "text-[#1e3a5f] underline-offset-4 hover:underline",
      danger: "bg-red-500 text-white hover:bg-red-600",
      success: "bg-green-500 text-white hover:bg-green-600",
    },
    size: {
      default: "h-11 px-6 py-2",
      sm: "h-9 rounded-md px-4",
      lg: "h-14 rounded-xl px-10 text-base",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default" as const,
    size: "default" as const,
  },
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variants.variant;
  size?: keyof typeof buttonVariants.variants.size;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
        <Comp
          className={cn(
            buttonVariants.base,
            buttonVariants.variants.variant[variant],
            buttonVariants.variants.size[size],
            className
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
