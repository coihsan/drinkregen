import BannerHeader from "@/components/global/banner-header";
import { Metadata } from "next";
import BeralihKeRegen from "./_components/beralih-ke-regen";

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

const AsliNolKaloriPage = () => {
  return (
    <main>
      <BannerHeader
        content={[
          {
            type: "image",
            desktopImageUrl: "/banner-product.webp",
            tabletImageUrl: "/banner-product-tablet.webp",
            mobileImageUrl: "/banner-product-mobile.webp",
            alt: "Banner product regen",
          },
        ]}
      />
      <div className="container">
        <div className="">
          <h1 className="font-black text-5xl md:text-3xl lg:text-4xl text-center shadow-lg">
            MANISNYA PAS,
            <br />
            <span className="text-green-500 italic">#AsliNolKalori</span>
          </h1>
          <p className="text-lg pt-5 text-center md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Kami mendengar keinginanmu. Memperkenalkan Regen 300ml dengan
            inovasi pemanis alami daun Stevia. Segar maksimal, tanpa khawatir
            soal gula.
          </p>
        </div>
        <BeralihKeRegen />
      </div>
    </main>
  );
};
export default AsliNolKaloriPage;
