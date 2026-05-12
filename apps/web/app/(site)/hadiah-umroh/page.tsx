import BannerHeader from "@/components/global/banner-header";
import { Metadata } from "next";
import FAQTNC from "./_components/faq-tnc";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import Image from "next/image";
import { StepMendapatkanHadiah } from "@/lib/umroh";

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
      <div className="container">
        <div className="py-4 min-h-[300px] mb-4 flex flex-col items-center justify-center text-center px-4 bg-white mb-10">
          <h1 className="font-headoh text-6xl line-none text-pink-500 text-3xl uppercase">Punya Kode Unik?</h1>
          <h3 className="font-headoh text-4xl pb-5">Cek Kode Unikmu disini</h3>
          <Link target="_blank" href={'https://regen.satu.app'} className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors uppercase">
            https://regen.satu.app
          </Link>
        </div>
        <div className="min-h-[500px] flex items-center justify-center mb-20">
          <div>
            <h1 className="font-bold text-4xl text-center text-gray-500">CARA MENDAPATKAN HADIAH</h1>
            <div className="flex flex-col md:flex-row items-center justify-stretch gap-2 mx-auto w-full">
              {StepMendapatkanHadiah.map((item, key) => (
                <div className="flex flex-col items-center max-w-[300px]" key={key}>
                  <Image className="size-60 object-cover object-center" src={item.sourceImg} width={300} height={300} alt="cara mendapatkan hadiah" />
                  <h2 className="font-bold text-center text-xl text-gray-400 mx-auto w-full lg:max-w-[200px]">{item.title}</h2>
                </div>
              ))}
            </div>
          </div>
        </div>
        <FAQTNC />
      </div>
    </main>
  );
};
export default HadiahUmrohPage;
