import { socialLink } from "@/lib/const.web";

interface SocialLinkPropss {
  className?: string;
}

const SocialLink = ({ className }: SocialLinkPropss) => {
  return (
    <div className={className}>
      <div className="grid grid-cols-3 gap-2 justify-center w-full">
        {socialLink.map((Index, key) => (
          <a
            key={key}
            target="_blank"
            className="flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all"
            href={Index.url}
          >
            {(() => {
              const Icon = Index.icon as any;
              if (typeof Icon === "function") return <Icon />;
              if (Icon && typeof Icon === "object" && Icon.src)
                return (
                  <img
                    className="text-white"
                    width={60}
                    height={60}
                    src={Icon.src}
                    alt={Index.label}
                  />
                );
              return (
                <img
                  className="text-white"
                  width={60}
                  height={60}
                  src={Icon}
                  alt={Index.label}
                />
              );
            })()}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLink;