
import type { HeroSlide } from "@/src/components/HeroSection";
import BrandIG from "@/src/assets/icons/brand-instagram.svg";
import BrandTiktok from "@/src/assets/icons/brand-tiktok.svg";
import BrandYoutube from "@/src/assets/icons/brand-youtube.svg";

export const DEFAULT_COPYRIGHT = "PT Global Enak Nikmat | 2026 © Copyright Regen";

export const socialLink = [
  {
    url: "https://www.instagram.com/drinkregenid/",
    icon: BrandIG,
    label: "Instagram",
    title: "@drinkregenid",
    bgColor: "bg-brand-coral-500",
  },
  {
    url: "https://www.tiktok.com/@drinkregenid",
    icon: BrandTiktok,
    label: "TikTok",
    title: "@drinkregenid",
    bgColor: "bg-black",
  },
  {
    url: "https://www.youtube.com/@drinkregenid",
    icon: BrandYoutube,
    label: "Youtube",
    title: "@drinkregenid",
    bgColor: "bg-brand-red-500",
  },
];

export const HeroContent: HeroSlide[] = [
  // {
  //   type: "video",
  //   desktopVideoUrl: "/videos/tirta-lychee-peach.mp4",
  //   videoType: "video/mp4",
  //   posterImageUrl: "/slide-1.jpg",
  //   previewImageUrl: "/slide-1-mobile.jpg",
  //   alt: "Regen hero video",d
  // },
  {
    desktopImageUrl: "/banner-nutrilevel.webp",
    tabletImageUrl: "/banner-nutrilevel.webp",
    mobileImageUrl: "/banner-nutrilevel-mobile.webp",
    alt: "Regen hero banner 2",
  },
  {
    desktopImageUrl: "/slide-1.jpg",
    tabletImageUrl: "/slide-1-tablet.jpg",
    mobileImageUrl: "/slide-1-mobile.jpg",
    alt: "Regen hero banner 1",
  },
  // {
  //   desktopImageUrl: "/banner-hero/img-1-desktop.webp",
  //   tabletImageUrl: "/banner-hero/img-1-tablet-tablet.webp",
  //   mobileImageUrl: "/banner-hero/img-1-mobile-mobile.webp",
  //   alt: "Regen hero banner 3",
  // },
];

interface Metadata {
  title: string;
  description: string;
  keywords: string[];
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    locale: string;
    type: string;
    images: {
      url: string;
      width: number;
      height: number;
      alt: string;
    }[];
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
    images?: string[];
  };
}


export const DEFAULT_META: Metadata = {
  title: "Regen | Minuman Vitamin #BebasGula",
  description:
    "Minuman vitamin bebas gula yang menyegarkan dari bahan alami. Nikmati kesegaran lezat Regen dengan manfaat optimal untuk temani aktivitasmu.",
  keywords: [
    "Regen",
    "drink regen",
    "minuman vitamin bebas gula",
    "minuman bebas gula",
    "minuman alami",
  ],
  openGraph: {
    title: "Regen | Minuman Vitamin #BebasGula",
    description:
      "Minuman vitamin bebas gula yang menyegarkan dari bahan alami. Nikmati kesegaran lezat Regen dengan manfaat optimal untuk temani aktivitasmu.",
    url: "https://drinkregen.com",
    siteName: "Regen",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "https://drinkregen.com/banner-product.webp",
        width: 1200,
        height: 630,
        alt: "Regen - Minuman Vitamin Bebas Gula",
      },
    ],
  },
  // Tambahan untuk Twitter/X Card
  twitter: {
    card: "summary_large_image",
    title: "Regen | Minuman Vitamin #BebasGula",
    description: "Minuman vitamin bebas gula yang menyegarkan dari bahan alami.",
    images: ["https://drinkregen.com/og-image.jpg"],
  },
};

export const SiteLink = [
  { title: "Home", url: "/" },
  { title: "Product", url: "#" },
  { title: "Promosi", url: "#" },
  { title: "Event", url: "#" },
  { title: "Tentang kami", url: "#" },
  { title: "Karir", url: "/karir" },
  { title: "Kontak kami", url: "#" },
  { title: "Jadi reseller", url: "/jadi-reseller-regen" },
  { title: "Channel", url: "/#" },
];

export const QuickLink = [
  { title: "Home", url: "/" },
  { title: "Product", url: "#" },
  { title: "Promosi", url: "#" },
  { title: "Event", url: "#" },
  { title: "Tentang kami", url: "#" },
  { title: "Karir", url: "#" },
  { title: "Kontak kami", url: "#" },
  { title: "Jadi reseller", url: "/jadi-reseller-regen" },
  { title: "Channel", url: "#" },
];

export const MenuNav = [
  { title: "Home", url: "/" },
  { title: "Hadiah Umroh", url: "/regen-berhadiah-umroh" },
  // { title: "#BebasGula", url: "/bebas-gula" },
  {
    title: "Product",
    url: "#",
    submenu: [
      {
        title: "300ml",
        url: "/product/regen-300ml",
        description: "Regen 300ml",
        imageUrl: "/300ml/orange.webp",
      },
      {
        title: "450ml",
        url: "/product/regen-450ml",
        description: "Regen 450ml",
        imageUrl: "/450ml/regen.webp",
      },
    ],
  },
  { title: "Temukan Regen", url: "/temukan-regen" },
  { title: "Tentang Regen", url: "/tentang-regen" },
  { title: "Blog", url: "/blog" },
];

export const BASE_URL = "https://localhost:3000";

export const contactInfo = {
  email: "info@drinkregen.id",
  phone: "+62 812 3456 7890",
  address: "Jl. Raya Bogor No. 123, Jakarta",
};
