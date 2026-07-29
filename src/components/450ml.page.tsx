import { PRODUCT450mlFLAVORS } from "@/lib/types/450ml.types";
import BannerHeader from "./BannerHeader";
import RevealEffect from "./RevealEffect";
import BannerVideo from "./BannerVideo";
import { ShowcaseSection } from "./ShowcaseSection";


const Regen450mlPage = () => {
  return (
    <main>
      <BannerHeader
        content={[
          {
            type: "image",
            desktopImageUrl: "/banner-product/450ml/all-products-desktop.webp",
            tabletImageUrl: "/banner-product/450ml/all-products-desktop.webp",
            mobileImageUrl: "/banner-product/450ml/all-products-mobile.webp",
            alt: "Banner product regen",
          },
        ]}
      />
      <div className="container bg-rose-400">
        <RevealEffect>
          <BannerVideo
            isRounded
            source="/videos/Regen-450ml-60s.webm"
            type="video/webm"
          />
        </RevealEffect>
      </div>
      {PRODUCT450mlFLAVORS.map((flavor, index) => (
        <ShowcaseSection key={flavor.id} flavor={flavor} index={index} />
      ))}
    </main>
  );
};
export default Regen450mlPage;
