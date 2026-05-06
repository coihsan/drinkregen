import BannerHeader from "@/components/global/banner-header";
import { Metadata } from "next";
import { ViewTransition } from "react";

export const metadata: Metadata = {
  title: "Tentang Regen",
  description: "Tempat belajar Next.js App Router terlengkap di Indonesia.",
  keywords: ["Regen Asli Nol Kalori", "Bebas Gula", "Manis Alami", "Stevia"],
  authors: [{ name: "Regen" }],
  robots: {
    index: true,
    follow: true,
  },
};

const KontakKamiPage = () => {
  return (
    <ViewTransition>
      <div className="w-full h-full mx-auto">
        <BannerHeader
          content={[
            {
              desktopImageUrl: "/banner-product.webp",
              tabletImageUrl: "/banner-product-tablet.webp",
              mobileImageUrl: "/banner-product-mobile.webp",
              alt: "Banner product regen",
            },
          ]}
        />
      </div>
    </ViewTransition>
  );
};
export default KontakKamiPage;
