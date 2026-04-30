"use client";

import { SiteLink, socialLink } from "@/lib/const";
import { Button } from "@workspace/ui/components/button";
import { X } from "lucide-react";
import { useEffect } from "react";
import LogoRegen from "../global/logo";
import NavItem from "./nav-item";
import SocialLink from "../footer/social-link";
import Link from "next/link";
import Image from "next/image";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] md:hidden">
      <aside
        aria-label="Mobile navigation"
        aria-modal="true"
        className="absolute right-0 top-0 flex h-dvh w-full flex-col bg-white p-6 shadow-2xl"
        role="dialog"
      >
        <div className="flex items-center justify-between">
          <LogoRegen isLink width={100} height={10} />
          <Button
            aria-label="Close mobile navigation"
            onClick={onClose}
            size="icon"
            type="button"
            variant="ghost"
          >
            <X className="size-6" />
          </Button>
        </div>

        <nav
          aria-label="Mobile main navigation"
          className="mt-10 flex flex-col gap-3"
          onClick={onClose}
        >
          {SiteLink.map((item, key) => (
            <NavItem
              key={key}
              title={item.title}
              url={item.url}
              className="text-3xl hover:text-pink-500 font-bold"
            />
          ))}
        </nav>
        <footer className="mt-auto pt-6">
            <p className="pb-2">Ikuti kami di media sosial:</p>
          <div className="grid grid-cols-4 gap-2">
            {socialLink.map((Index, key) => (
              <Link
                key={key}
                className="p-3 flex items-center justify-center rounded-lg bg-amber-300 hover:scale-110 hover:-translate-y-2 transition-all"
                href={Index.url}
              >
                {(() => {
                  const Icon = Index.icon as any;
                  if (typeof Icon === "function") return <Icon />;
                  if (Icon && typeof Icon === "object" && Icon.src)
                    return (
                      <Image
                        width={32}
                        height={32}
                        src={Icon.src}
                        alt={Index.label}
                      />
                    );
                  return (
                    <Image
                      width={32}
                      height={32}
                      src={Icon}
                      alt={Index.label}
                    />
                  );
                })()}
              </Link>
            ))}
          </div>
          <p className="pt-2">PT Global Enak Nikmat</p>
        </footer>
      </aside>
    </div>
  );
};

export default MobileNav;
