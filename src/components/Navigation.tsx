import { MenuNav } from "@/lib/const.web";
import { ArrowUpRight, ChevronDown, Menu } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import MobileNav from "./MobileNav";
import { isNavigationActive } from "@/lib/navigation";
import "@/src/styles/navigation.css";



export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pathname, setPathname] = useState("");
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const closeMenus = useCallback(() => { setMobileOpen(false); setProductsOpen(false); }, []);

  useEffect(() => {
    const update = () => { setPathname(window.location.pathname.replace(/\/$/, "") || "/"); closeMenus(); };
    const scroll = () => setScrolled(window.scrollY > 24);
    const media = window.matchMedia("(min-width: 1024px)");
    const resize = () => closeMenus();
    update(); scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("astro:page-load", update);
    document.addEventListener("astro:before-swap", closeMenus);
    media.addEventListener("change", resize);
    return () => {
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("astro:page-load", update);
      document.removeEventListener("astro:before-swap", closeMenus);
      media.removeEventListener("change", resize);
    };
  }, [closeMenus]);

  useEffect(() => {
    if (!productsOpen) return;
    const outside = (event: PointerEvent) => { if (!headerRef.current?.contains(event.target as Node)) setProductsOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setProductsOpen(false); triggerRef.current?.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [productsOpen]);

  return <div className={`regen-navigation ${scrolled ? "is-scrolled" : ""}`}>
    <header className="rn-header" ref={headerRef}>
      <a className="rn-logo" href="/" aria-label="REGEN — Beranda" onClick={closeMenus}><img src="/regen.webp" alt="REGEN" width={125} height={44} /></a>
      <nav className="rn-desktop" aria-label="Main navigation">
        {MenuNav.map(item => item.submenu?.length ? <div className="rn-product-menu" key={item.title} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setProductsOpen(false); }}>
          <button ref={triggerRef} className={`rn-link ${isNavigationActive(pathname, "/product") ? "is-active" : ""}`} type="button" aria-expanded={productsOpen} aria-controls={`${id}-products`} onClick={() => setProductsOpen(open => !open)} onKeyDown={event => { if (event.key === "ArrowDown") { event.preventDefault(); setProductsOpen(true); requestAnimationFrame(() => panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus()); } }}>
            {item.title}<ChevronDown size={15} className={productsOpen ? "rn-rotated" : ""} aria-hidden="true" />
          </button>
          <div className="rn-dropdown" id={`${id}-products`} ref={panelRef} hidden={!productsOpen}>
            <div className="rn-dropdown-heading"><span>PILIH KESEGARANMU</span><span>REGEN / BEBAS GULA</span></div>
            <div className="rn-products">
              <a className="rn-all-products" href="/product" onClick={closeMenus}><span className="rn-eyebrow">TEMUKAN FAVORITMU</span><strong>Banyak rasa.<br />Sama segarnya.</strong><span className="rn-all-link">Lihat semua produk <ArrowUpRight size={20} aria-hidden="true" /></span></a>
              {item.submenu.map((product, index) => <a className={`rn-product rn-product-${index}`} href={product.url} key={product.url} aria-current={isNavigationActive(pathname, product.url) ? "page" : undefined} onClick={closeMenus}><img src={product.imageUrl} alt={`REGEN ${product.title}`} width={135} height={150} className={product.description === "Habis" ? "rn-sold-out" : ""} /><span className="rn-product-name"><strong>{product.title}</strong><ArrowUpRight size={18} aria-hidden="true" /></span><span className="rn-product-description">{product.description}</span></a>)}
            </div>
          </div>
        </div> : <a className={`rn-link ${isNavigationActive(pathname, item.url) ? "is-active" : ""}`} href={item.url} aria-current={isNavigationActive(pathname, item.url) ? "page" : undefined} onClick={closeMenus} key={item.url}>{item.title}</a>)}
      </nav>
      <a className="rn-partner" href="/jadi-reseller-regen" aria-current={isNavigationActive(pathname, "/jadi-reseller-regen") ? "page" : undefined}>Jadi Mitra <ArrowUpRight size={16} aria-hidden="true" /></a>
      <button className="rn-menu-toggle" type="button" aria-label="Buka menu navigasi" aria-expanded={mobileOpen} aria-controls={`${id}-mobile`} onClick={() => { setProductsOpen(false); setMobileOpen(true); }}><span>Menu</span><Menu size={21} aria-hidden="true" /></button>
    </header>
    <MobileNav id={`${id}-mobile`} isOpen={mobileOpen} onClose={closeMobile} pathname={pathname} />
  </div>;
}
