import BannerHeader from "@/components/global/banner-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Regen",
  description: 'Bebas Gula, Manis Alami, Stevia dan Tanpa bahan pengawet.',
  keywords: ["Regen Asli Nol Kalori", "Bebas Gula", "Manis Alami", "Stevia", "Glikosida Steviol", "Regen Komposisi", "PT Global Enak Nikmat"],
  authors: [{ name: "Regen" }],
  robots: {
    index: true,
    follow: true,
  },
};

const ProductPage = () => {
  return (
    <main>
      <div className="w-full h-full mx-auto">
        <BannerHeader
          content={[{ 
            type:"image",
            desktopImageUrl: "/banner-product.webp", 
            tabletImageUrl: "/banner-product-tablet.webp",
            mobileImageUrl: "/banner-product-mobile.webp",
            alt: "Banner product regen" }]}
        />
        <div className="p-6">
          <h1>Product Page</h1>
        </div>
      </div>
    </main>
  );
};
export default ProductPage;
