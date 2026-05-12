import BannerHeader from "@/components/global/banner-header";
import BannerVideo from "@/components/global/banner-video";
import RevealEffect from "@/components/global/reveal-effect";

const Regen450mlPage = () => {
  return (
    <main>
      <BannerHeader
        content={[
          {
            type: "image",
            desktopImageUrl: "/banner-product.webp",
            tabletImageUrl: "/banner-product.webp",
            mobileImageUrl: "/banner-product.webp",
            alt: "Banner product regen",
          },
        ]}
      />
      <div className="container">
        <RevealEffect>
          <BannerVideo isRounded source="/videos/regen-450ml-60s.webm" type="video/webm" />
        </RevealEffect>
      </div>
    </main>
  );
};
export default Regen450mlPage;
