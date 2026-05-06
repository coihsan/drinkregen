import BrandX from "../public/icons/brand-x.svg";
import BrandIG from "../public/icons/brand-instagram.svg";
import BrandTiktok from "../public/icons/brand-tiktok.svg";
import BrandYoutube from "../public/icons/brand-youtube.svg";

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
  { title: "Asli Nol Kalori", url: "/asli-nol-kalori" },
  {
    title: "Product",
    url: "/product",
    submenu: [
      {
        title: "450ml",
        url: "/product/regen-450ml",
        description: "Regen 450ml",
        imageUrl: "/product/regen.webp",
      },
      {
        title: "300ml",
        url: "/product/regen-300ml",
        description: "Regen 300ml",
        imageUrl: "/product/orange.webp",
      },
    ],
  },
  { title: "Tentang Regen", url: "/tentang-regen" },
];

export const BASE_URL = "https://localhost:3000";

export const socialLink = [
  {
    url: "#",
    icon: BrandX,
    label: "X/Twitter",
    title: "@drinkregenid",
    bgColor: "bg-black",
  },
  {
    url: "#",
    icon: BrandIG,
    label: "Instagram",
    title: "@drinkregenid",
    bgColor: "bg-pink-600",
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
    bgColor: "bg-red-600",
  },
];

export const HeroContent = [
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
