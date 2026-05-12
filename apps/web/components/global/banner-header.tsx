import Image from "next/image";

type BaseBannerInfo = {
  alt?: string;
  arialLabel?: string;
};

export type BannerImage = BaseBannerInfo & {
  type: "image";
  desktopImageUrl: string;
  tabletImageUrl?: string;
  mobileImageUrl?: string;
};

export type BannerVideo = BaseBannerInfo & {
  type: "video";
  videoUrl: string;
  mobileVideoUrl?: string; // Opsional jika punya video vertikal untuk HP
};

// Gabungkan menjadi satu Union Type
export type BannerHeaderItem = BannerImage | BannerVideo;

interface BannerHeaderProps {
  content: BannerHeaderItem[];
}

const BannerHeader = ({ content }: BannerHeaderProps) => {
  const data = content[0];

  if (!data) return null;
  return (
    <div
      aria-label={data.arialLabel ?? "Banner header"}
      className="w-full mx-auto overflow-hidden h-dvh relative"
    >
      {data.type === "image" && (
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet={data.mobileImageUrl ?? data.tabletImageUrl ?? data.desktopImageUrl}
          />
          <source
            media="(max-width: 1023px)"
            srcSet={data.tabletImageUrl ?? data.desktopImageUrl}
          />
          <Image
            alt={data.alt ?? `Hero slide 1`}
            className="object-cover"
            draggable={false}
            fill
            loading="eager"
            sizes="100vw"
            src={data.desktopImageUrl ?? "/img-1.png"}
          />
        </picture>
      )}

      {/* 
        Begitu juga di sini, TypeScript tahu data.videoUrl aman dipanggil
      */}
      {data.type === "video" && (
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          {/* Opsi tambahan: Jika ada video khusus format mobile (vertikal) */}
          {data.mobileVideoUrl && (
            <source 
               src={data.mobileVideoUrl} 
               media="(max-width: 767px)" 
               type="video/mp4" 
            />
          )}
          
          <source src={data.videoUrl} type="video/mp4" />
          Browser Anda tidak mendukung tag video.
        </video>
      )}
    </div>
  );
};
export default BannerHeader;
