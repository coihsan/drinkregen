import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { PRODUCT300mlFLAVORS } from "@/lib/types/300ml.types";
import BannerHeader from "./BannerHeader";
import BGDot from "@/src/components/design/BGDot";
import TextHighLight from "@/src/components/TextHighlight";
import RevealEffect from "@/src/components/RevealEffect";
import BannerVideo from "@/src/components/BannerVideo";
import { ShowcaseSection } from "@/src/components/ShowcaseSection";

const Regen300mlPage = () => {
  const containerVariants: Variants = {
    offscreen: { opacity: 0 },
    onscreen: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const textVariants: Variants = {
    offscreen: {
      opacity: 0,
      y: 20,
    },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const sentence =
    "Regen yang hadir dengan kemasan praktis dan ukuran yang pas untuk kebutuhan harian Anda.";
  const words = sentence.split(" ");
  return (
    <main>
      <BannerHeader
        content={[
          {
            type: "image",
            desktopImageUrl: "/banner-all-varian-300ml.webp",
            tabletImageUrl: "/banner-all-varian-300ml.webp",
            mobileImageUrl: "/banner-all-varian-300ml-mobile.webp",
            alt: "Banner product regen",
          },
        ]}
      />
      <div className="h-full">
        <BGDot
          className="bg-brand-green-50 selection:bg-brand-red-500 selection:text-white"
          dotColor="var(--regen-green-soft)"
        >
          <div className="min-h-screen md:min-h-[700px] flex-col flex flex-row items-center justify-center relative">
            <motion.div
              variants={containerVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              className="max-w-[1000px] mx-auto text-center relative"
            >
              <motion.h1
                variants={textVariants}
                className="text-lg font-bold mb-4"
              >
                <TextHighLight text="Formula Baru Regen 300ml" />
              </motion.h1>

              <motion.p className="text-2xl md:text-4xl lg:text-6xl px-6 md:px-12 lg:px-0 text-muted-foreground">
                {words.map((word, i) => (
                  <motion.span
                    key={i}
                    variants={textVariants}
                    className="inline-block mr-2"
                  >
                    {word}
                  </motion.span>
                ))}
                <motion.span
                  variants={textVariants}
                  className="font-bold text-brand-green-700"
                >
                  Regen 300ml cocok untuk menemani aktivitas Anda kapan saja dan
                  di mana saja.
                </motion.span>
              </motion.p>
            </motion.div>
          </div>
        </BGDot>
        <div className="bg-brand-green-500 selection:bg-brand-red-500 selection:text-white">
          <RevealEffect>
            <div className="h-full md:min-h-screen flex items-center justify-center container">
              <BannerVideo
                isRounded
                source="/videos/tirta-lychee-peach.mp4"
                type="video/mp4"
              />
            </div>
          </RevealEffect>
        </div>
        {PRODUCT300mlFLAVORS.map((flavor, index) => (
          <ShowcaseSection key={flavor.id} flavor={flavor} index={index} />
        ))}
      </div>
    </main>
  );
};
export default Regen300mlPage;
