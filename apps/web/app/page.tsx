import BannerBuyRegenContent from "@/components/global/banner-buy-regen";
import RevealEffect from "@/components/global/reveal-effect";
import ScrollText from "@/components/global/scroll-text";
import HeroSection from "@/components/hero";
import BannerVideo from "@/components/global/banner-video";
import { HeroContent } from "@/lib/const";

export default async function Page() {
  
  return (
    <main>
      <div>
        <HeroSection slides={HeroContent} />
        <ScrollText />
        <div className="container">
        <RevealEffect>
          <BannerVideo isRounded source="/videos/regen-orange.mp4" />
        </RevealEffect>
        </div>
        <BannerBuyRegenContent />
      </div>
    </main>
  );
}
