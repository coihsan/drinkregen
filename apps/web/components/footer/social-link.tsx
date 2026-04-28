import { socialLink } from "@/lib/const";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@workspace/ui/components/hover-card";
import Image from "next/image";
import Link from "next/link";

interface SocialLinkPropss {
  className?: string
}

const SocialLink = ({className} : SocialLinkPropss) => {
  return (
    <div className={className}>
      <div>
        <p>Ikuti Kami:</p>
      </div>
      <div className="grid grid-cols-4 gap-2 w-full">
      {socialLink.map((Index, key) => (
        <HoverCard openDelay={100} closeDelay={200} key={key}>
          <HoverCardTrigger  asChild> 
            <Link className="p-3 rounded-lg bg-amber-300 hover:scale-110 hover:-translate-y-2 transition-all" href={Index.url}>
              {(() => {
                const Icon = Index.icon as any;
                if (typeof Icon === "function") return <Icon />;
                if (Icon && typeof Icon === "object" && Icon.src)
                  return (
                    <Image width={32} height={32} src={Icon.src} alt={Index.label} />
                  );
                return (
                  <Image width={32} height={32} src={Icon} alt={Index.label} />
                );
              })()}
            </Link>
          </HoverCardTrigger>
          <HoverCardContent className={`${Index.bgColor} rounded-xl`}>
            {(() => {
                const Icon = Index.icon as any;
                if (typeof Icon === "function") return <Icon />;
                if (Icon && typeof Icon === "object" && Icon.src)
                  return (
                    <div className="flex items-center gap-2 text-white">
                      <Image className="fill-white" width={32} height={32} src={Icon.src} alt={Index.label} />
                      <span>{Index.label}</span>
                    </div>
                  );
                return (
                  <Image width={32} height={32} src={Icon} alt={Index.label} />
                );
              })()}
            <Link target="_blank" className="hover:underline text-lg font-semibold text-white" href={Index.url}>
              {Index.title}
            </Link>
            <div className="pb-2 flex items-center">
              <div className="rounded-lg flex items-center">
                <p className="bg-white px-2 py-1  rounded-l-lg">Followers</p>
                <span className="bg-green-500 px-4 py-1 rounded-r-lg font-bold">12</span>
              </div>
              <p>Post :</p>
              <p></p>
            </div>
            <Link className="p-2 flex rounded-md bg-background w-full flex items-center justify-center hover:bg-muted" href={Index.url}>Follow</Link>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
    </div>
  );
};
export default SocialLink;
