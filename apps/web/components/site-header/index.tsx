"use client";

import { MenuNav } from "@/lib/const";
import LogoRegen from "../global/logo";
import { Button } from "@workspace/ui/components/button";
import { ChevronDown, Menu } from "lucide-react";
import MobileNav from "./mobile-nav";
import { useEffect, useState } from "react";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "motion/react";

const SiteHeader = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const mobile = useIsMobile();

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (current > previous && current > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 164);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <div className="relative z-[100]">
      <div
        className={`fixed left-0 top-2 mx-auto w-full transition-all duration-300 px-4`}
      >
        <motion.header
          className={`flex items-center justify-between py-2 ${mobile ? "px-3" : "px-9"} rounded-full ${
            hasScrolled
              ? "bg-white shadow-lg shadow-black/5 backdrop-blur-md"
              : "bg-transparent"
          }}`}
          animate={{
            y: hidden ? -140 : 0,
            opacity: hidden ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div>
            <LogoRegen
              isLink
              width={mobile ? 100 : 120}
              height={mobile ? 10 : 20}
            />
          </div>
          <nav
            aria-label="Main navigation"
            className={`hidden items-center gap-1 transition-colors duration-300 md:flex lg:gap-3 ${
              hasScrolled ? "text-neutral-950" : "text-white"
            }`}
          >
            {MenuNav.map((item) => {
              if (!item.submenu?.length) {
                return (
                  <Link
                    className="rounded-lg px-2.5 py-2 text-base font-semibold text-current transition-colors hover:bg-white/15 focus:bg-white/15 focus:outline-none lg:text-lg"
                    href={item.url}
                    key={item.title}
                  >
                    {item.title}
                  </Link>
                );
              }

              const isDropdownOpen = openDropdown === item.title;

              return (
                <div
                  className="group"
                  key={item.title}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setOpenDropdown(null);
                    }
                  }}
                  onFocus={() => setOpenDropdown(item.title)}
                  onMouseEnter={() => setOpenDropdown(item.title)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                    className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-base font-semibold text-current transition-colors hover:bg-white/15 focus:bg-white/15 focus:outline-none lg:text-lg"
                    href={item.url}
                    onClick={() => setOpenDropdown(null)}
                  >
                    {item.title}
                    <ChevronDown
                      className={`size-4 transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Link>
                  <div
                    className={`fixed left-1/2 top-[88px] z-[130] max-h-[calc(100vh-112px)] w-[min(calc(100vw-2rem),900px)] -translate-x-1/2 overflow-y-auto rounded-lg bg-white p-4 text-neutral-950 shadow-2xl ring-1 ring-black/10 transition-all duration-200 ${
                      isDropdownOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible translate-y-2 opacity-0"
                    }`}
                  >
                    <div className="grid min-h-[300px] gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
                      <Link
                        className="group/link flex h-full min-h-36 flex-col items-start justify-between rounded-lg bg-[#FFD70C] p-5 text-neutral-950 transition-colors hover:bg-[#FFD70C]/90 focus:bg-[#FFD70C]/90 focus:outline-none"
                        href={item.url}
                        onClick={() => setOpenDropdown(null)}
                      >
                        <span>
                          <span className="block text-2xl font-black">
                            Semua Produk
                          </span>
                          <span className="mt-2 block text-sm font-medium text-neutral-800">
                            Lihat seluruh pilihan varian Regen.
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="mt-6 text-lg font-bold group-hover/link:translate-x-1 transition-transform"
                        >
                          -&gt;
                        </span>
                      </Link>
                      <div className="grid content-start gap-3 sm:grid-cols-2 xl:grid-cols-2">
                        {item.submenu.map((submenu) => (
                          <Link
                            className="group/product flex flex-col h-full items-center gap-4 rounded-lg border border-neutral-200 p-3 transition-colors hover:border-fuchsia-600 hover:bg-neutral-50 focus:border-fuchsia-600 focus:bg-neutral-50 focus:outline-none"
                            href={submenu.url}
                            key={submenu.title}
                            onClick={() => setOpenDropdown(null)}
                          >
                            <span className="relative flex size-60 shrink-0 overflow-hidden rounded-md">
                              <Image
                                alt={`Regen ${submenu.title}`}
                                className="object-contain transition duration-300 group-hover/product:scale-105"
                                fill
                                sizes="80px"
                                src={submenu.imageUrl}
                              />
                            </span>
                            <span className="min-w-0 text-center">
                              <span className="block text-base font-bold text-neutral-600 group-hover/product:text-fuchsia-600 group-focus-within/product:text-fuchsia-600">
                                {submenu.title}
                              </span>
                                {submenu.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
          <div className="md:hidden">
            <Button
              aria-label="Open mobile navigation"
              onClick={() => setIsMobileNavOpen(true)}
              size={"lg"}
              type="button"
              variant={"default"}
            >
              <Menu />
            </Button>
          </div>
        </motion.header>
      </div>
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </div>
  );
};
export default SiteHeader;
