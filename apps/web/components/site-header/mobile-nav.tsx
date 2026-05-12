"use client";

import { MenuNav, socialLink } from "@/lib/const";
import { Button } from "@workspace/ui/components/button";
import { ChevronDown, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Transition, Variants } from "motion/react";
import { useEffect, useState } from "react";
import LogoRegen from "../global/logo";
import NavItem from "./nav-item";
import Link from "next/link";
import Image from "next/image";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const smoothEase = [0.22, 1, 0.36, 1] as const;
const exitEase = [0.4, 0, 1, 1] as const;

const panelTransition: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 36,
  mass: 0.9,
};

const navListVariants: Variants = {
  open: {
    transition: {
      delayChildren: 0.14,
      staggerChildren: 0.055,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.035,
      staggerDirection: -1,
    },
  },
};

const navItemVariants: Variants = {
  open: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.34, ease: smoothEase },
  },
  closed: {
    opacity: 0,
    x: 24,
    filter: "blur(6px)",
    transition: { duration: 0.18, ease: exitEase },
  },
};

const submenuVariants: Variants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.32, ease: smoothEase },
      opacity: { duration: 0.22, delay: 0.05 },
    },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.22, ease: exitEase },
      opacity: { duration: 0.14 },
    },
  },
};

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

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[120] bg-black/25 backdrop-blur-sm md:hidden"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: smoothEase }}
        >
          <motion.aside
            animate={{ opacity: 1, x: 0 }}
            aria-label="Mobile navigation"
            aria-modal="true"
            className="absolute right-0 top-0 flex h-dvh w-full flex-col overflow-hidden bg-white p-6 shadow-2xl"
            exit={{ opacity: 0, x: "100%" }}
            initial={{ opacity: 0.95, x: "100%" }}
            role="dialog"
            transition={panelTransition}
          >
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.12, duration: 0.24 }}
            >
              <LogoRegen isLink width={100} height={10} />
              <Button aria-label="Close mobile navigation" onClick={onClose} size="icon" type="button" variant="ghost">
                <X className="size-6" />
              </Button>
            </motion.div>

            <motion.nav
              animate="open"
              aria-label="Mobile main navigation"
              className="mt-10 flex flex-col gap-3 overflow-y-auto pb-6"
              exit="closed"
              initial="closed"
              variants={navListVariants}
            >
              {MenuNav.map((item) => {
                if (!item.submenu?.length) {
                  return (
                    <motion.div key={item.title} variants={navItemVariants}>
                      <NavItem
                        title={item.title}
                        url={item.url}
                        onClick={onClose}
                        className="text-3xl hover:text-pink-500 font-bold transition-colors duration-500"
                      />
                    </motion.div>
                  );
                }

                const isSubmenuOpen = openMenu === item.title;

                return (
                  <motion.div key={item.title} variants={navItemVariants}>
                    <button
                      aria-expanded={isSubmenuOpen}
                      className="flex w-full items-center justify-between py-2 text-left text-3xl font-bold transition-colors duration-500 hover:text-pink-500"
                      onClick={() => setOpenMenu(isSubmenuOpen ? null : item.title)}
                      type="button"
                    >
                      {item.title}
                      <motion.span
                        animate={{ rotate: isSubmenuOpen ? 180 : 0 }}
                        className="flex size-6 shrink-0 items-center justify-center"
                        transition={{ duration: 0.24, ease: smoothEase }}
                      >
                        <ChevronDown className="size-6" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isSubmenuOpen ? (
                        <motion.div
                          animate="open"
                          className="overflow-hidden"
                          exit="closed"
                          initial="closed"
                          variants={submenuVariants}
                        >
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
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.nav>
            <motion.footer
              animate={{ opacity: 1, y: 0 }}
              className="mt-auto pt-6"
              exit={{ opacity: 0, y: 12 }}
              initial={{ opacity: 0, y: 16 }}
              transition={{ delay: 0.24, duration: 0.28, ease: smoothEase }}
            >
              <p className="pb-2">Ikuti kami di media sosial:</p>
              <div className="grid grid-cols-4 gap-2">
                {socialLink.map((Index, key) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.08, y: -6 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <Link
                      className="flex items-center justify-center rounded-lg bg-amber-300 p-3 transition-colors duration-300 hover:bg-amber-300/90"
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
                  </motion.div>
                ))}
              </div>
              <p className="pt-2">PT Global Enak Nikmat</p>
            </motion.footer>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default MobileNav;
