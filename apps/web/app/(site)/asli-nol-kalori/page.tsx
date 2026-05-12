import BannerHeader from "@/components/global/banner-header";
import { Metadata } from "next";

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
          content={[{ 
            type:"image",
            desktopImageUrl: "/banner-product.webp", 
            tabletImageUrl: "/banner-product-tablet.webp",
            mobileImageUrl: "/banner-product-mobile.webp",
            alt: "Banner product regen" }]}
        />
        <div className="container">
          <h1 className="font-headoh text-6xl text-center">
            MANISNYA PAS,<br /><span className="text-green-500 italic">#AsliNolKalori</span>
          </h1>
            <p className="text-lg text-center md:text-xl text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Kami mendengar keinginanmu. Memperkenalkan Regen 300ml dengan inovasi pemanis alami daun Stevia. Segar maksimal, tanpa khawatir soal gula.
            </p>
        </div>
    </main>
  );
};
export default AsliNolKaloriPage;
