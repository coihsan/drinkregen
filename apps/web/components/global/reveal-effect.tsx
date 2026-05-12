"use client"

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { ReactNode, useRef } from "react";

interface RevealEffectProps {
  children: ReactNode;
}

const RevealEffect = ({ children }: RevealEffectProps) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "center center"]
})

const clipPath = useTransform(
  scrollYProgress,
  [0, 1],
  ["inset(0% 50% 0% 50%)", "inset(0% 0% 0% 0%)"]
)
  return <motion.div ref={ref} style={{ clipPath }}>{children}</motion.div>;
};
export default RevealEffect;
