import BannerBuyRegenContent from "@/components/global/banner-buy-regen";
import BannerHeader from "@/components/global/banner-header";
import BannerVideo from "@/components/global/banner-video";
import ProductItem300ml from "./_components/300ml-product-item";
import * as motion from "motion/react-client";
import type { Variants } from "motion/react";
import TextHighLight from "@/components/global/text-highlight";
import TextStyleHeadline from "@/components/global/text-style-headline";
import RevealEffect from "@/components/global/reveal-effect";
import { ItemProduct300ml } from "@/lib/product";
import Ellipse from "@/components/design/element/ellipse";
import BGDot from "@/components/design/background/bg-dot";

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
            desktopImageUrl: "/img-3.png",
            tabletImageUrl: "/img-3-tablet.png",
            mobileImageUrl: "/img-3-mobile.png",
            alt: "Banner product regen",
          },
        ]}
      />
      <div className="h-full">
        <div className="min-h-[500px] md:min-h-[700px] bg-green-50 flex-col flex flex-row items-center justify-center relative">
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
              <TextHighLight text="Regen 300ml" />
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
                className="font-bold text-green-500"
              >
                Regen 300ml cocok untuk menemani aktivitas Anda kapan saja dan
                di mana saja.
              </motion.span>
            </motion.p>
          </motion.div>
        </div>
        <div className="container">
          <RevealEffect>
            <BannerVideo
              isRounded
              source="/videos/tirta-lychee-peach.mp4"
              type="video/mp4"
            />
          </RevealEffect>
          <div className="py-12 md:py-24">
            {ItemProduct300ml.map((item, key) => (
              <ProductItem300ml
              bgColor={item.bgColor}
                key={key}
                titleColor={item.titleColor}
                productName={item.name}
                description={item.description}
                sourceImage={item.imageUrl}
                productUSP={item.usp}
                urlProduct={item.url}
              />
            ))}
          </div>
        </div>
      </div>
      <BGDot />
      <BannerBuyRegenContent />
    </main>
  );
};
export default Regen300mlPage;
