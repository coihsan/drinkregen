import { useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { ArrowUpRight, Check, X } from "lucide-react";
import "@/src/styles/nona-regen-promo.css";

const SESSION_KEY = "regen:nona-promo:session-seen";
let shownInMemory = false;

function PromoImage() {
  return <div className="nona-promo__visual">
    <span className="nona-promo__word" aria-hidden="true">NONA<br />REGEN.</span>
    <img src="/nona-regen/nona-regen.webp" alt="Nona Regen membawa minuman REGEN untuk pelanggan" width={664} height={952} loading="lazy" />
  </div>;
}

function PromoBenefits() {
  return <ul className="nona-promo__benefits">{["Jual langsung", "Pelanggan tetap", "Penghasilan fleksibel"].map(benefit => <li key={benefit}><Check size={16} aria-hidden="true" />{benefit}</li>)}</ul>;
}

export default function NonaRegenPromo() {
  return <section className="nona-promo-banner" aria-labelledby="nona-promo-banner-title">
    <div className="nona-promo nona-promo--banner">
      <PromoImage />
      <div className="nona-promo__copy">
        <p className="nona-promo__eyebrow">PELUANG SEGAR BERSAMA REGEN</p>
        <h2 id="nona-promo-banner-title">Jadi Nona Regen.<br /><span>Segarkan kotamu.</span></h2>
        <p>Bawa vitamin langsung ke rumah, kantor, dan komunitas pelanggan. Bangun pelanggan tetap dan dapatkan penghasilan fleksibel di areamu.</p>
        <PromoBenefits />
        <a id="button-nona-regen" className="nona-promo__cta" href="/nona-regen">Jadi Nona Regen <ArrowUpRight size={20} aria-hidden="true" /></a>
      </div>
    </div>
  </section>;
}

export function NonaRegenWelcomePopup() {
  const [open, setOpen] = useState(false);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const show = () => {
      if (shownInMemory) return;
      try {
        if (window.sessionStorage.getItem(SESSION_KEY) === "1") {
          shownInMemory = true;
          return;
        }
      } catch { /* Fall back to memory when browser storage is unavailable. */ }
      const active = document.activeElement;
      if (!(active instanceof HTMLElement) || !active.closest(".nona-promo-dialog")) {
        previousFocus.current = active instanceof HTMLElement ? active : null;
      }
      shownInMemory = true;
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch { /* Memory prevents repeat prompts during client-side navigation. */ }
      // Let the page settle before presenting the promotion.
      window.setTimeout(() => setOpen(true), 1000);
    };
    const close = () => setOpen(false);
    show();
    document.addEventListener("astro:before-swap", close);
    return () => {
      document.removeEventListener("astro:before-swap", close);
    };
  }, []);

  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Portal>
      <Dialog.Overlay className="nona-promo-overlay" />
      <Dialog.Content className="nona-promo-dialog" data-lenis-prevent onCloseAutoFocus={event => {
        event.preventDefault();
        if (previousFocus.current?.isConnected && previousFocus.current !== document.body) previousFocus.current.focus();
        else document.querySelector<HTMLElement>(".rn-logo")?.focus();
      }}>
        <div className="nona-promo nona-promo--popup">
          <PromoImage />
          <div className="nona-promo__copy">
            <p className="nona-promo__eyebrow">PELUANG SEGAR MENANTIMU</p>
            <Dialog.Title>Jadi Nona Regen.</Dialog.Title>
            <Dialog.Description>Bawa vitamin ke rumah, kantor, dan komunitas pelanggan. Temukan peluang penghasilan fleksibel bersama REGEN.</Dialog.Description>
            <PromoBenefits />
            <a id="button-nona-regen" className="nona-promo__cta" href="/nona-regen" onClick={() => setOpen(false)}>Kenali Nona Regen <ArrowUpRight size={20} aria-hidden="true" /></a>
            <Dialog.Close className="nona-promo__later">Lanjut jelajahi website</Dialog.Close>
          </div>
        </div>
        <Dialog.Close className="nona-promo__close" aria-label="Tutup promosi Nona Regen"><X size={21} aria-hidden="true" /></Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
