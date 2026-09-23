"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";


const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const ParallaxText = ({ children, baseVelocity = 100 }: { children: React.ReactNode; baseVelocity?: number }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 1000
  });
  
  const velocityFactor = useTransform(smoothVelocity, [0, 4000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  const directionFactor = useRef(1);
  
  useAnimationFrame((t: number, delta: number) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 4000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap py-2">
      <motion.div
        className="flex whitespace-nowrap flex-nowrap font-black text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tighter"
        style={{ x }}
      >
        {[...Array(8)].map((_, i) => (
          <span key={i} className="inline-flex items-center uppercase">
            {children} <span className="text-brand-lime-500 mx-2">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const ScrollText = () => {
  const mobile = useIsMobile()
  return (
    <div className={`${mobile ? "h-auto" : "min-h-screen"} flex flex-col py-40 font-bold relative overflow-hidden`}>

      <div className="flex flex-col gap-4 transform -rotate-2 scale-110">
        <ParallaxText baseVelocity={-3}>Asli Nol Kalori</ParallaxText>
        <ParallaxText baseVelocity={3}>Bebas Gula</ParallaxText>
        <ParallaxText baseVelocity={-3}>Glikosida Steviol</ParallaxText>
        <ParallaxText baseVelocity={3}><span className="flex items-center gap-3">GRADE <span className="min-w-22 min-h-22 h-full w-full flex items-center justify-center bg-brand-lime-400 aspect-square rounded-full"><span className="text-white">B</span></span></span></ParallaxText>
      </div>

    </div>
  );
};

export default ScrollText;