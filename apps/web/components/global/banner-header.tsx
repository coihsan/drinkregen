import Image from "next/image";

type BannerHeaderImage = {
  desktopImageUrl: string;
  tabletImageUrl?: string;
  mobileImageUrl?: string;
  alt?: string;
  arialLabel?: string;
};

interface BannerHeaderProps {
  content: BannerHeaderImage[];
}

const BannerHeader = ({ content }: BannerHeaderProps) => {
  return (
    <div 
    aria-label={content[0]?.arialLabel ?? "Banner header"}
    className="w-full mx-auto overflow-hidden h-dvh relative">
      <picture>
        <source media="(max-width: 767px)" srcSet={content[0]?.mobileImageUrl ?? content[0]?.tabletImageUrl ?? content[0]?.desktopImageUrl} />
        <source media="(max-width: 1023px)" srcSet={content[0]?.tabletImageUrl ?? content[0]?.desktopImageUrl} />
        <Image alt={content[0]?.alt ?? `Hero slide 1`} className="object-cover" draggable={false} fill loading="eager" sizes="100vw" src={content[0]?.desktopImageUrl ?? "/img-1.png"} />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/35" />
    </div>
  );
};
export default BannerHeader;
