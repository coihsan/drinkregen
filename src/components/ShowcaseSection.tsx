import React, { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { MoveRight, ChevronDown } from "lucide-react";
import { type FlavorMetadata, PRODUCT300mlFLAVORS } from "@/lib/types/300ml.types";
import { type FlavorMetadata450ml, PRODUCT450mlFLAVORS } from "@/lib/types/450ml.types";
import LogoRegen from "./LogoRegen.tsx";
import { RegenBottle } from "./RegenBottle";
import LogoRegenWhite from "../assets/icons/logo-regen-white.svg";

interface ShowcaseSectionProps {
  flavor: FlavorMetadata | FlavorMetadata450ml;
  index: number;
}

export const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({
  flavor,
  index,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position of this index container from beginning to end
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Track if this section is currently visible in the active viewport
  const isInView = useInView(containerRef, {
    margin: "-30% 0px -30% 0px", // When the section takes up at least 40% of standard viewport
  });

  //   // Trigger active section ID callback upward so sidebar and nav can sync
  //   useEffect(() => {
  //     if (isInView) {
  //       onActive(flavor.id);
  //     }
  //   }, [isInView, flavor.id, onActive]);

  // Smooth springs for scroll mappings to eliminate raw scrolling friction jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  // Unique block colors mapping for Artistic Flair theme
  const ARTISTIC_BG_COLORS: Record<string, string> = {
    orange: "#F5BF18",
    lychee: "#F2606B",
    peach: "#F2606B",
    watermelon: "#58B648",
    lemonlime: "#9CCB3D",
    apple: "#EF3C59",
  };

  const currentBgColor = ARTISTIC_BG_COLORS[flavor.id] || "#0A0A0A";

  // =========================================================
  // PARALLAX ANIMATION SPEEDS
  // Left side content: Elegant delayed fade & slide mapping
  const contentOpacity = useTransform(
    smoothProgress,
    [0.15, 0.4, 0.75, 0.95],
    [0.0, 1.0, 1.0, 0.0],
  );

  const contentY = useTransform(
    smoothProgress,
    [0.15, 0.4, 0.75, 0.95],
    [100, 0, 0, -100],
  );

  // Big background letter "REGEN" parallax scaling
  const textBgOpacity = useTransform(
    smoothProgress,
    [0.15, 0.4, 0.75, 0.95],
    [0.0, 0.15, 0.15, 0.0],
  );

  // Main 3D bottle animations
  const bottleOpacity = useTransform(
    smoothProgress,
    [0.15, 0.45, 0.7, 0.95],
    [0.0, 1.0, 1.0, 0.0],
  );

  const bottleY = useTransform(
    smoothProgress,
    [0.15, 0.45, 0.7, 0.95],
    [120, 0, 0, -120],
  );

  const bottleScale = useTransform(
    smoothProgress,
    [0.15, 0.45, 0.7, 0.95],
    [0.85, 1.02, 1.02, 0.85],
  );

  const nextBarY = useTransform(smoothProgress, [0.75, 0.9], [95, 0]);

  //   const handleOpenSpecs = () => {
  //     fizzySound.playCanOpen();
  //     onOpenDetails(flavor.id);
  //   };

  const handleScrollToSection = (id: string) => {
    const targetElement = document.getElementById(`section-container-${id}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const productFlavors =
    flavor.productSize === "450ml" ? PRODUCT450mlFLAVORS : PRODUCT300mlFLAVORS;
  const nextIndex = productFlavors.length ? (index + 1) % productFlavors.length : 0;
  const nextFlavor = productFlavors[nextIndex] ?? flavor;
  const nextBgColor = ARTISTIC_BG_COLORS[nextFlavor.id] || "#0A0A0A";
  const detailUrl =
    flavor.productSize === "300ml"
      ? `/product/regen-300ml/${flavor.id}`
      : `/product/regen-450ml/${flavor.id}`;

  const sectionBgColor = useTransform(
    smoothProgress,
    [0.75, 1],
    [currentBgColor, nextBgColor],
  );

  const flashOpacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.85, 1],
    [1, 0, 0, 1],
  );

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-[200vh]"
      style={{ backgroundColor: sectionBgColor }}
      id={`section-container-${flavor.id}`}
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-radial opacity-35"
          style={{
            background: `radial-gradient(circle at 75% 50%, rgba(255,255,255,0.15) 0%, transparent 65%)`,
          }}
        />

        <motion.div
          style={{ y: useTransform(smoothProgress, [0, 1], [30, -100]) }}
          className="absolute top-1/4 right-[28%] w-24 h-24 rounded-full bg-white/10 blur-2xl"
        />
        <motion.div
          style={{ y: useTransform(smoothProgress, [0, 1], [120, -180]) }}
          className="absolute bottom-1/3 right-[8%] w-40 h-40 rounded-full bg-white/5 blur-3xl"
        />
        <motion.div
          style={{ y: useTransform(smoothProgress, [0, 1], [-40, 120]) }}
          className="absolute bottom-10 left-[15%] w-32 h-32 rounded-full bg-black/10 blur-2xl"
        />
      </div>

      {/* BACKGROUND DISPLAY WORDMARK: Giant Parallax Outline Title */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{
            opacity: textBgOpacity,
            scale: useTransform(smoothProgress, [0, 1], [0.95, 1.1]),
          }}
          className="select-none text-center"
        >
          <img
            className="w-full"
            src={LogoRegenWhite.src}
            alt="Regen Logo"
            width={600}
            height={200}
          />
        </motion.div>
      </div>

      <div className="sticky top-0 left-0 w-full h-screen flex flex-col md:flex-row items-center justify-between overflow-hidden z-10 px-6 sm:px-12 md:px-16 lg:px-24 py-8 md:py-16">
        <motion.div
          style={{ opacity: flashOpacity }}
          className="absolute inset-0 z-50 pointer-events-none bg-white/25 backdrop-blur-2xl"
        />
        <motion.div
          style={{
            opacity: contentOpacity,
            y: contentY,
          }}
          className="w-full md:w-1/2 h-full flex flex-col justify-between py-2 sm:py-4 md:py-8 z-20 text-white"
        >
          <div className="space-y-4 my-auto pt-4 sm:pt-6 md:pt-0">
            <p className="text-sm md:text-base font-mono font-light tracking-widest uppercase opacity-80">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(productFlavors.length).padStart(2, "0")}
            </p>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-outfit font-black uppercase leading-[0.9] text-white">
              <LogoRegen width={130} height={40} />
              {flavor.name.replace("Regen ", "")}
            </h2>

            <div className="pt-4 md:pt-8 bg-transparent">
              <p className="text-2xl md:text-3xl font-outfit font-black italic tracking-wide text-white uppercase drop-shadow-md">
                {flavor.usp}
              </p>
              <p className="mt-4 max-w-sm text-xs sm:text-sm leading-relaxed text-white font-sans drop-shadow-sm">
                {flavor.tagline}
              </p>
            </div>
          </div>

          <div className="flex space-x-8 sm:space-x-12 items-end pt-4 sm:pt-6">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest opacity-60 font-mono">
                Calories
              </p>
              <p className="text-base sm:text-xl font-outfit font-black text-white">
                {flavor.nutrition.calories}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest opacity-60 font-mono">
                Sugar
              </p>
              <p className="text-base sm:text-xl font-outfit font-black text-white">
                {flavor.nutrition.sugar}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest opacity-60 font-mono">
                Nutri-Level
              </p>
              <p className="text-base sm:text-xl font-outfit font-black text-white">
                B
              </p>
            </div>
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Interactive 3D Bottle display */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full relative flex items-center justify-center z-10 mt-6 md:mt-0">
          <div
            className="relative w-full max-w-[280px] sm:max-w-[310px] md:max-w-[340px] flex items-center justify-center"
            id={`parallax-bottle-wrapper-${flavor.id}`}
          >
            <motion.div
              style={{
                opacity: bottleOpacity,
                y: bottleY,
                scale: bottleScale,
              }}
              className="w-full h-full flex justify-center items-center"
            >
              <RegenBottle
                flavor={flavor}
                scrollYProgress={smoothProgress}
              />
            </motion.div>

            {/* Micro Interaction specs selector */}
          </div>
          <motion.a
            href={detailUrl}
            style={{ opacity: bottleOpacity }}
            whileHover={{
              scale: 1.05,
              backgroundColor: "#FFFFFF",
              color: "#000000",
              borderColor: "#FFFFFF",
            }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-45 md:bottom-0 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 px-5 py-2.5 rounded-full border border-brand-ink/30 bg-black/40 hover:bg-black text-white font-mono text-[9px] sm:text-[11px] tracking-widest font-black uppercase transition-all duration-200 shadow-xl cursor-pointer flex items-center w-max gap-2 backdrop-blur-sm z-30"
            id={`btn-open-specs-${flavor.id}`}
          >
            <MoveRight className="w-3.5 h-3.5" /> LIHAT DETAIL
          </motion.a>

          {/* Small scroll arrow for early slides */}
          {index === 0 && (
            <motion.div
              style={{
                opacity: useTransform(smoothProgress, [0.5, 0.65], [1.0, 0.0]),
              }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20 pointer-events-none md:hidden"
            >
              <ChevronDown className="w-5 h-5 text-white animate-bounce" />
            </motion.div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* NEXT UP SLIDING / PEEK BAR: Dynamic Variant Continuation Bar */}
      <motion.div
        style={{ y: nextBarY, backgroundColor: nextBgColor }}
        onClick={() => handleScrollToSection(nextFlavor?.id || "")}
        className="absolute bottom-0 left-0 w-full h-20 md:h-24 flex items-center justify-between px-6 sm:px-12 md:px-16 lg:px-24 z-40 shadow-[0_-15px_40px_rgba(0,0,0,0.15)] cursor-pointer select-none group border-t border-brand-ink/10"
        title={`Lompat ke Variant Selanjutnya: ${nextFlavor?.name}`}
      >
        <div className="flex items-center space-x-6 sm:space-x-8">
          <span className="text-[10px] md:text-sm font-mono font-bold tracking-widest text-white group-hover:text-white transition-colors duration-200">
            NEXT UP
          </span>
          <h4 className="text-base sm:text-xl md:text-2xl font-outfit font-black uppercase text-white group-hover:translate-x-1 transition-transform duration-300">
            {nextFlavor?.name}
          </h4>
          <span className="hidden sm:inline-block text-[11px] md:text-xs tracking-widest text-white italic uppercase font-mono font-semibold">
            {nextFlavor?.usp}
          </span>
        </div>

        <div className="w-8 h-8 rounded-full border border-brand-ink/20 group-hover:border-brand-ink flex items-center justify-center text-white group-hover:text-white transition-all duration-300 group-hover:scale-110">
          <ChevronDown className="w-4 h-4 transform -rotate-90 group-hover:-rotate-180 transition-transform duration-300" />
        </div>
      </motion.div>
    </motion.div>
  );
};
