"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, value, onFocus, onBlur, className, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = value !== undefined && value !== null && value.toString().length > 0;
    const isFloating = isFocused || hasValue;

    return (
      <div className="relative w-full group">
        <motion.label
          animate={{
            top: isFloating ? "10px" : "50%",
            fontSize: isFloating ? "11px" : "14px",
            color: error ? "#EF4444" : isFloating ? "#D4AF37" : "#9CA3AF",
            y: isFloating ? 0 : "-50%",
            fontWeight: isFloating ? 600 : 400,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute left-4 pointer-events-none z-10 select-none"
        >
          {label}
        </motion.label>
        <input
          {...props}
          ref={ref}
          value={value}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          className={cn(
            "w-full h-[60px] px-4 pt-5 pb-2 bg-white border-1.5 rounded-[14px] text-[15px] text-[#111827] outline-none transition-all duration-200 font-sans",
            error 
              ? "border-red-500 bg-red-50" 
              : isFocused 
                ? "border-[#D4AF37] ring-4 ring-[#D4AF37]/10" 
                : "border-[#E5E7EB] hover:border-gray-300",
            className
          )}
        />
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";
