"use client";

import { useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import "@/src/styles/wave-text.css";

interface WaveTextProps {
  text: string;
  className?: string;
  once?: boolean;
}

const letterVariants: Variants = {
  resting: { opacity: 1, y: 0, rotate: 0, scale: 1 },
  wave: (index: number) => ({
    opacity: [0, 1, 1, 1],
    y: ["0.65em", "-0.12em", "0.04em", "0em"],
    rotate: [index % 2 === 0 ? -9 : 9, -2, 1, 0],
    scale: [0.92, 1.04, 0.99, 1],
    transition: {
      duration: 0.8,
      delay: Math.min(index * 0.035, 0.6),
      times: [0, 0.55, 0.8, 1],
      ease: "easeOut",
    },
  }),
};

export function WaveText({ text, className, once = false }: WaveTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: 0.25 });
  const reducedMotion = useReducedMotion();
  const words = useMemo(() => {
    let offset = 0;
    return text.trim().split(/\s+/u).filter(Boolean).map(word => {
      const letters = Array.from(word).map(character => ({ character, index: offset++ }));
      return letters;
    });
  }, [text]);

  return (
    <div ref={ref} className={cn("wave-text flex flex-wrap items-center gap-x-[0.22em] gap-y-[0.12em]", className)}>
      <span className="sr-only">{text}</span>
      {words.map((letters, wordIndex) => (
        <span className="wave-text__word" aria-hidden="true" key={`${text}-${wordIndex}`}>
          {letters.map(({ character, index }) => (
            <motion.span
              className="wave-text__letter"
              key={index}
              custom={index}
              variants={letterVariants}
              initial={false}
              animate={inView && !reducedMotion ? "wave" : "resting"}
            >
              {character}
            </motion.span>
          ))}
        </span>
      ))}
    </div>
  );
}
