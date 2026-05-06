"use client";

import { MenuNav, socialLink } from "@/lib/const";
import { Button } from "@workspace/ui/components/button";
import { ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import LogoRegen from "../global/logo";
import NavItem from "./nav-item";
import Link from "next/link";
import Image from "next/image";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const [openMenu, setOpenMenu] = useState<string | null>("Product");

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
          <Button aria-label="Close mobile navigation" onClick={onClose} size="icon" type="button" variant="ghost">
            <X className="size-6" />
          </Button>
        </div>

        <nav
          aria-label="Mobile main navigation"
          className="mt-10 flex flex-col gap-3 overflow-y-auto pb-6"
        >
          {MenuNav.map((item) => {
            if (!item.submenu?.length) {
              return (
                <NavItem
                  key={item.title}
                  title={item.title}
                  url={item.url}
                  onClick={onClose}
                  className="text-3xl hover:text-pink-500 font-bold transition-colors duration-500"
                />
              );
            }

            const isSubmenuOpen = openMenu === item.title;

            return (
              <div key={item.title} className="">
                <button
                  aria-expanded={isSubmenuOpen}
                  className="flex w-full items-center justify-between py-2 text-left text-3xl font-bold transition-colors duration-500 hover:text-pink-500"
                  onClick={() => setOpenMenu(isSubmenuOpen ? null : item.title)}
                  type="button"
                >
                  {item.title}
                  <ChevronDown className={`size-6 shrink-0 transition-transform duration-300 ${isSubmenuOpen ? "rotate-180" : ""}`} />
                </button>
                {isSubmenuOpen ? (
                  <div className="grid gap-2 px-3 pb-3">
                    <Link
                      className="rounded-md bg-[#FFD70C] px-4 py-3 text-lg font-bold text-neutral-950"
                      href={item.url}
                      onClick={onClose}
                    >
                      Semua Produk
                    </Link>
                    {item.submenu.map((submenu) => (
                      <Link
                        className="flex items-center gap-3 rounded-md bg-neutral-50 p-2 transition-colors hover:bg-neutral-100"
                        href={submenu.url}
                        key={submenu.title}
                        onClick={onClose}
                      >
                        <span className="relative flex size-16 shrink-0 overflow-hidden rounded-md">
                          <Image
                            alt={`Regen ${submenu.title}`}
                            className="object-contain"
                            fill
                            sizes="64px"
                            src={submenu.imageUrl}
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-lg font-bold text-neutral-950">{submenu.title}</span>
                          <span className="block text-sm text-neutral-600">{submenu.description}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
        <footer className="mt-auto pt-6">
            <p className="pb-2">Ikuti kami di media sosial:</p>
          <div className="grid grid-cols-4 gap-2">
            {socialLink.map((Index, key) => (
              <Link
                key={key}
                className="p-3 flex items-center justify-center rounded-lg bg-amber-300 hover:scale-110 hover:-translate-y-2 transition-all duration-500"
                href={Index.url}
              >
                {(() => {
                  const Icon = Index.icon;
                  if (typeof Icon === "function") return <Icon />;
                  if (Icon && typeof Icon === "object" && "src" in Icon)
                    return (
                      <Image width={32} height={32} src={Icon.src} alt={Index.label} />
                    );
                  return (
                    <Image width={32} height={32} src={Icon} alt={Index.label} />
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
