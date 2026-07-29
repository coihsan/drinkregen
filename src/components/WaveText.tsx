import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { Variants } from "motion"

import { useMemo } from 'react';

interface WaveTextProps {
  text: string;
  className?: string;
  once?: boolean;
}

export function WaveText({ text, className, once = false }: WaveTextProps) {
  const letters = useMemo(() => Array.from(text), [text]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04, 
      },
    },
  };

  const letterVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,  
        stiffness: 150,
        mass: 0.8,
      },
    },
  };

  return (
    <motion.div
      className={cn("flex flex-wrap items-center", className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      aria-label={text}
    >
      {letters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={letterVariants}
          aria-hidden="true"
          className={cn(
            char === " " ? "whitespace-pre" : "inline-block",
          )}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}
