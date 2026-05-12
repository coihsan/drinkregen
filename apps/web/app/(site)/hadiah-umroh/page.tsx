import BannerHeader from "@/components/global/banner-header";
import { Metadata } from "next";
import FAQTNC from "./_components/faq-tnc";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

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
    <main>
      <BannerHeader
        content={[{ 
          type:"image",
          desktopImageUrl: "/banner-umroh-desktop.webp", 
          tabletImageUrl: "/slide-1-tablet.jpg",
          mobileImageUrl: "/slide-1-mobile.jpg",
          alt: "Banner product regen" }]}
        />
      <div className="px-4 py-12 h-full mx-auto max-w-7xl">
        <div className="py-4 mb-4 flex flex-col items-center text-center px-4 rounded-lg bg-white shadow">
          <h1 className="font-headoh text-6xl line-none text-pink-500 text-3xl uppercase">Punya Kode Unik?</h1>
          <h3 className="font-headoh text-4xl pb-5">Cek Kode Unikmu disini</h3>
          <Link target="_blank" href={'https://regen.satu.app'} className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors uppercase">
            https://regen.satu.app
          </Link>
        </div>
        <h1 className="font-bold text-4xl text-center text-green-500">CARA MENDAPATKAN HADIAH</h1>
        <FAQTNC />
      </div>
    </main>
  );
};
export default HadiahUmrohPage;
