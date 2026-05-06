import BannerHeader from "@/components/global/banner-header";
import { Metadata } from "next";
import { ViewTransition } from "react";
import FAQTNC from "./_components/faq-tnc";

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

const HadiahUmrohPage = () => {
  return (
    <ViewTransition share={"auto"}>
      <BannerHeader
        content={[{ 
          desktopImageUrl: "/banner-umroh-desktop.webp", 
          tabletImageUrl: "/slide-1-tablet.jpg",
          mobileImageUrl: "/slide-1-mobile.jpg",
          alt: "Banner product regen" }]}
        />
      <div className="px-4 py-12 h-full">
        <h1 className="font-bold text-4xl text-center text-green-500">CARA MENDAPATKAN HADIAH</h1>
        <FAQTNC />
      </div>
    </ViewTransition>
  );
};
export default HadiahUmrohPage;
