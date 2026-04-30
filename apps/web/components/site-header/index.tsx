"use client";

import { SiteLink } from "@/lib/const";
import NavItem from "./nav-item";
import LogoRegen from "../global/logo";
import { Button } from "@workspace/ui/components/button";
import { Menu } from "lucide-react";
import MobileNav from "./mobile-nav";
import { useEffect, useState } from "react";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

const SiteHeader = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const mobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative z-[100]">
      <div
        className={`fixed left-0 top-0 mx-auto w-full transition-all duration-300 ${
          hasScrolled
            ? "bg-[#FFD70C] shadow-lg shadow-black/5 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <header className="flex items-center justify-between py-6 px-5">
          <div>
            <LogoRegen isLink width={mobile ? 100 : 120} height={mobile ? 10 : 20} />
          </div>
          <nav
            aria-label="Main navigation"
            className={`hidden items-center gap-4 transition-colors duration-300 md:flex ${
              hasScrolled ? "text-neutral-950" : "text-white"
            }`}
          >
            {SiteLink.map((item, key) => (
              <NavItem
                key={key}
                title={item.title}
                url={item.url}
                className="text-lg font-medium"
              />
            ))}
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
        </header>
      </div>
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </div>
  );
};
export default SiteHeader;
