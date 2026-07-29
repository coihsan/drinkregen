import React from 'react';
import { motion, useSpring } from 'motion/react';
import { type FlavorMetadata } from '@/lib/types/300ml.types';
import { type FlavorMetadata450ml } from '@/lib/types/450ml.types';
import { fizzySound } from './FizzySound';

interface RegenBottleProps {
  flavor: FlavorMetadata | FlavorMetadata450ml;
  scrollYProgress?: any;
}

export const RegenBottle: React.FC<RegenBottleProps> = ({ flavor }) => {
  // Create beautiful, spring-based interactive rotation logic on hover!
  const rotateX = useSpring(0, { stiffness: 150, damping: 15 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 15 });
  const scale = useSpring(1, { stiffness: 200, damping: 20 });

  // Handle subtle 3D tilt effect on mouse move!
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Convert to maximum 12 degrees rotation
    rotateX.set(-mouseY / height * 18);
    rotateY.set(mouseX / width * 18);
    scale.set(1.05);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  const handleInteractBottle = () => {
    // Play can open hiss on click!
    fizzySound.playCanOpen();
  };

  return (
    <motion.div
      className="relative w-full max-w-[340px] md:max-w-[360px] aspect-[1/2] mx-auto cursor-pointer select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleInteractBottle}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        rotateX,
        rotateY,
        scale,
      }}
      id={`bottle-container-${flavor.productSize}-${flavor.id}`}
    >
      {/* ========================================================= */}
      {/* LAYER 1: Base Shadow (Berada paling belakang) */}
      <svg
        viewBox="0 0 200 520"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <defs>
          <radialGradient id="bottomShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.6)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        <ellipse cx="100" cy="510" rx="60" ry="10" fill="url(#bottomShadow)" opacity="0.65" />
      </svg>

      {/* ========================================================= */}
      {/* LAYER 2: Main product bottle image from product-size metadata */}
      <img
        src={flavor.bottleImage}
        alt={`${flavor.name} ${flavor.productSize} - ${flavor.sweetener}`}
        width={420}
        height={840}
        className="relative z-10 w-full h-full object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.35)]"
      />
    </motion.div>
  );
};
