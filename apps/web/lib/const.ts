import type { HeroSlide } from "@/components/hero";
import BrandX from "../public/icons/brand-x.svg";
import BrandIG from "../public/icons/brand-instagram.svg";
import BrandTiktok from "../public/icons/brand-tiktok.svg";
import BrandYoutube from "../public/icons/brand-youtube.svg";

export const DEFAULT_META = {
  title: "Regen | Asli Nol Kalori - Minuman Sehat Tanpa Gula",
  description:
    "Regen adalah minuman sehat tanpa gula yang menyegarkan, terbuat dari bahan alami pilihan untuk menemani setiap momenmu dengan rasa yang lezat dan manfaat yang optimal.",
  keywords: [
    "Regen",
    "drink regen",
    "minuman sehat tanpa gula",
    "minuman tanpa gula",
    "minuman alami",
  ],
};

export const SiteLink = [
  { title: "Home", url: "/" },
  { title: "Product", url: "/product" },
  { title: "Promosi", url: "/promosi" },
  { title: "Event", url: "/event" },
  { title: "Tentang kami", url: "tentang-kami" },
  { title: "Karir", url: "/karir" },
  { title: "Kontak kami", url: "/kontak-kami" },
  { title: "Jadi reseller", url: "/reseller" },
  { title: "Channel", url: "/channel" },
];

export const QuickLink = [
  { title: "Home", url: "/" },
  { title: "Product", url: "/product" },
  { title: "Promosi", url: "/promosi" },
  { title: "Event", url: "/event" },
  { title: "Tentang kami", url: "about" },
  { title: "Karir", url: "/career" },
  { title: "Kontak kami", url: "/contact" },
  { title: "Jadi reseller", url: "/reseller" },
  { title: "Channel", url: "/channel" },
];

export const MenuNav = [
  { title: "Home", url: "/" },
  { title: "Hadiah Umroh", url: "/hadiah-umroh" },
  { title: "#AsliNolKalori", url: "/asli-nol-kalori" },
  {
    title: "Product",
    url: "/product",
    submenu: [
      {
        title: "300ml",
        url: "/product/regen-300ml",
        description: "Tersedia",
        imageUrl: "/product/orange.webp",
      },
      {
        title: "450ml",
        url: "/product/regen-450ml",
        description: "Habis",
        imageUrl: "/product/regen.webp",
      },
    ],
  },
  { title: "Tentang Regen", url: "/tentang-regen" },
];

export const BASE_URL = "https://localhost:3000";

export const socialLink = [
  {
    url: "#",
    icon: BrandIG,
    label: "Instagram",
    title: "@drinkregenid",
    bgColor: "bg-pink-500",
  },
  {
    url: "#",
    icon: BrandTiktok,
    label: "TikTok",
    title: "@drinkregenid",
    bgColor: "bg-black",
  },
  {
    url: "#",
    icon: BrandYoutube,
    label: "Youtube",
    title: "@drinkregenid",
    bgColor: "bg-red-500",
  },
];

export const HeroContent: HeroSlide[] = [
  // {
  //   type: "video",
  //   desktopVideoUrl: "/videos/tirta-lychee-peach.mp4",
  //   videoType: "video/mp4",
  //   posterImageUrl: "/slide-1.jpg",
  //   previewImageUrl: "/slide-1-mobile.jpg",
  //   alt: "Regen hero video",
  // },
  {
    desktopImageUrl: "/slide-1.jpg",
    tabletImageUrl: "/slide-1-tablet.jpg",
    mobileImageUrl: "/slide-1-mobile.jpg",
    alt: "Regen hero banner 1",
  },
  {
    desktopImageUrl: "/img-2.png",
    tabletImageUrl: "/img-2-tablet.png",
    mobileImageUrl: "/img-2-mobile.png",
    alt: "Regen hero banner 2",
  },
  {
    desktopImageUrl: "/img-3.png",
    tabletImageUrl: "/img-3-tablet.png",
    mobileImageUrl: "/img-3-mobile.png",
    alt: "Regen hero banner 3",
  },
];

export const contactInfo = {
  email: "info@drinkregen.id",
  phone: "+62 812 3456 7890",
  address: "Jl. Raya Bogor No. 123, Jakarta",
};
