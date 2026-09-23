import { MenuNav } from "@/lib/const.web";
import { ArrowUpRight, ChevronDown, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { isNavigationActive } from "@/lib/navigation";

interface MobileNavProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  pathname?: string;
}

export default function MobileNav({ id, isOpen, onClose, pathname = "" }: MobileNavProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [expanded, setExpanded] = useState(false);
  const titleId = useId();
  const productsId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    setExpanded(isNavigationActive(pathname, "/product"));
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [isOpen, pathname]);

  return <dialog className="rn-mobile-dialog" id={id} ref={dialogRef} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }} onClose={() => { if (isOpen) onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }} data-lenis-prevent>
    <div className="rn-mobile-panel">
      <div className="rn-mobile-top"><a className="rn-logo" href="/" aria-label="REGEN — Beranda" onClick={onClose}><img src="/regen.webp" alt="REGEN" width={115} height={42} /></a><button className="rn-close" type="button" onClick={onClose} aria-label="Tutup menu navigasi" autoFocus><X size={23} aria-hidden="true" /></button></div>
      <div className="rn-mobile-scroll">
        <p className="rn-mobile-eyebrow" id={titleId}>JELAJAHI KESEGARAN REGEN</p>
        <nav aria-label="Navigasi utama mobile" className="rn-mobile-links">
          {MenuNav.map((item, index) => <div className="rn-mobile-row" key={item.title}>
            {item.submenu?.length ? <><button className={`rn-mobile-link ${isNavigationActive(pathname, "/product") ? "is-active" : ""}`} type="button" aria-expanded={expanded} aria-controls={productsId} onClick={() => setExpanded(value => !value)}><span className="rn-index">0{index + 1}</span><span>{item.title}</span><ChevronDown size={24} className={expanded ? "rn-rotated" : ""} aria-hidden="true" /></button>
              <div className="rn-mobile-products" id={productsId} hidden={!expanded}>
                <div className="rn-mobile-product-grid">{item.submenu.map(product => <a className="rn-mobile-product" href={product.url} key={product.url} onClick={onClose} aria-current={isNavigationActive(pathname, product.url) ? "page" : undefined}><img src={product.imageUrl} alt={`REGEN ${product.title}`} width={90} height={100} className={product.description === "Habis" ? "rn-sold-out" : ""} /><span><strong>{product.title}</strong><ArrowUpRight size={16} aria-hidden="true" /></span><small>{product.description}</small></a>)}</div>
                <a className="rn-mobile-all" href="/product" onClick={onClose}>Lihat semua produk <ArrowUpRight size={17} aria-hidden="true" /></a>
              </div></> : <a className={`rn-mobile-link ${isNavigationActive(pathname, item.url) ? "is-active" : ""}`} href={item.url} aria-current={isNavigationActive(pathname, item.url) ? "page" : undefined} onClick={onClose}><span className="rn-index">0{index + 1}</span><span>{item.title}</span><ArrowUpRight size={22} aria-hidden="true" /></a>}
          </div>)}
        </nav>
        <a className="rn-mobile-partner" href="/jadi-reseller-regen" onClick={onClose}><span><small>TUMBUH BERSAMA REGEN</small><strong>Jadi mitra kami.</strong></span><ArrowUpRight size={28} aria-hidden="true" /></a>
        <footer className="rn-mobile-footer"><span>IKUTI KESEGARANNYA</span><div>{[{ name: "Instagram", url: "https://www.instagram.com/drinkregenid/" }, { name: "TikTok", url: "https://www.tiktok.com/@drinkregenid" }, { name: "YouTube", url: "https://www.youtube.com/@drinkregenid" }].map(social => <a href={social.url} key={social.name} target="_blank" rel="noopener noreferrer" aria-label={`${social.name} REGEN (tab baru)`}>{social.name}<ArrowUpRight size={13} aria-hidden="true" /></a>)}</div><p>PT Global Enak Nikmat</p></footer>
      </div>
    </div>
  </dialog>;
}
