import BannerHeader from "@/components/global/banner-header";
import { Metadata } from "next";
import ProductDetail300ml from "../_components/product-detail";

export const metadata: Metadata = {
  title: "Regen Orange - High Vitamin C",
  description: "Bebas Gula, Manis Alami, Stevia dan Tanpa bahan pengawet.",
  keywords: ["Regen Asli Nol Kalori", "Bebas Gula", "Manis Alami", "Stevia"],
  authors: [{ name: "Regen" }],
  robots: {
    index: true,
    follow: true,
  },
};

const data = {
  name: "Orange",
  titleColor: "text-orange-500",
  vitaminColor: "bg-orange-500",
  usp: "High Vitamin C",
  description:
    "Kesegaran buah Orange yang autentik dipadukan dengan manisnya Stevia. Cocok dikonsumsi setelah olahraga, saat bekerja, atau kapanpun kamu butuh hidrasi yang ringan.",
  imageUrl: "/300ml/orange.webp",
  vitamin: ["C", "B2", "B3", "B5", "B6", "B12"],
  url: "/product/regen-300ml/orange",
  komposisi:
    "Air, Pengatur Keasaman (Asam Malat, Asam Sitrat, Natrium Sitrat), Pengemulsi (Natrium Karboksimetil Selulosa, Pati Natrium Oktenilsuksinat), Perisa Alami, Perisa Sintetik Jeruk (mengandung antioksidan alfa tokoferol), Garam, Antioksidan Asam Askorbat, Pengawet Natrium Benzoat, Pemanis Alami Glikosida Steviol (0,031%), Pengental Gom Xanthan, Pewarna Alami Beta Karoten, Ekstrak Guarana, Perisa Alami, Konsentrat Jeruk (0.005%), Premiks Vitamin B (B2,B3,B5,B6,B12).",
};

const OrangePage = () => {
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
        <ProductDetail300ml
        vitaminColor={data.vitaminColor} 
        vitaminContent={data.vitamin}
        productName={data.name} 
        productUSP={data.usp} 
        productComp={data.komposisi} 
        description={data.description}
        titleColor={"text-orange-500"}
        sourceImage={'/300ml/orange.webp'}
        />
      </div>
    </main>
  );
};
export default OrangePage;
