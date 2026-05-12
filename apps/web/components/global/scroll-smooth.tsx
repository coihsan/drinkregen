"use client";
import { motion } from "motion/react";
import { ReactLenis } from "lenis/react";

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {

  return (
    <ReactLenis root>
      <motion.main>{children}</motion.main>
    </ReactLenis>
  );
};
export default SmoothScroll;
