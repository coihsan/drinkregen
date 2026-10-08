import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "motion/react";
import { PRODUCT300ML_VARIANTS, type FlavorId, type ProductVariant } from "@/lib/product-catalog";
import "@/src/styles/home-products.css";

const FEATURED_VITAMIN: Record<FlavorId, string> = {
  orange: "C",
  lychee: "B2",
  peach: "B3",
  watermelon: "B5",
  apple: "B6",
  lemonlime: "B12",
};

function ProductCard({ product }: { product: ProductVariant }) {
  const vitamin = FEATURED_VITAMIN[product.id];
  return <a className="product-card" href={product.detailUrl} aria-label={`Lihat detail ${product.name} ${product.productSize}, Vitamin ${vitamin}`}>
    <div className="product-visual" style={{ backgroundColor: product.bgColor }}>
      <div className="product-card-topline">
        <span className="product-vitamin">
          <span className="product-vitamin-label">Mengandung<br />Vitamin</span>
          <span className="product-vitamin-value">{vitamin}</span>
        </span>
        <span className="product-volume">{product.productSize}</span>
      </div>
      <div className="product-bottle-stage">
        <img src={product.bottleImage} alt={`${product.name} ${product.productSize}`} width="300" height="300" loading="lazy" decoding="async" draggable={false} />
      </div>
    </div>
    <div className="product-copy">
      <div className="product-copy-text">
        <h3>{product.displayName}</h3>
        <p>{product.usp}</p>
      </div>
      <span className="product-card-arrow" aria-hidden="true">↗</span>
    </div>
  </a>;
}

export default function HomeProducts() {
  const reducedMotion = useReducedMotion();
  const [viewportRef, api] = useEmblaCarousel({
    align: "start", containScroll: "trimSnaps", active: true,
    breakpoints: { "(min-width: 768px)": { active: false } },
  });
  const [position, setPosition] = useState({ current: 1, prev: false, next: true });
  useEffect(() => {
    if (!api) return;
    const update = () => setPosition({ current: api.selectedScrollSnap() + 1, prev: api.canScrollPrev(), next: api.canScrollNext() });
    update();
    api.on("select", update).on("reInit", update);
    return () => { api.off("select", update).off("reInit", update); };
  }, [api]);

  return <section className="home-products" aria-labelledby="home-products-title">
    <div className="container">
      <header className="heading">
        <div><p className="eyebrow">PILIH RASA FAVORITMU</p><h2 id="home-products-title">Kesegaran REGEN <span>300ml</span></h2><p className="intro">Enam pilihan rasa dengan manis alami dari stevia. Temukan favoritmu!</p></div>
        <a className="all-products" href="/product">Lihat semua produk <span aria-hidden="true">↗</span></a>
      </header>
      <div className="products-viewport" ref={viewportRef}>
        <ul className="products-grid" id="home-products-carousel" aria-label="Pilihan produk REGEN 300ml">
          {PRODUCT300ML_VARIANTS.map(product => <li key={product.id}><ProductCard product={product} /></li>)}
        </ul>
      </div>
      <div className="carousel-controls">
        <span className="carousel-position" aria-live="polite" aria-atomic="true">{position.current} / {PRODUCT300ML_VARIANTS.length}</span>
        <div>
          <button type="button" disabled={!position.prev} onClick={() => api?.scrollPrev(Boolean(reducedMotion))} aria-label="Produk sebelumnya" aria-controls="home-products-carousel">←</button>
          <button type="button" disabled={!position.next} onClick={() => api?.scrollNext(Boolean(reducedMotion))} aria-label="Produk berikutnya" aria-controls="home-products-carousel">→</button>
        </div>
      </div>
    </div>
  </section>;
}
