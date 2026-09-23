import { ArrowUpRight } from "lucide-react";
import { PRODUCT_VARIANTS_BY_SIZE, type ProductVariant } from "@/lib/product-catalog";
import "@/src/styles/related-products.css";

export default function RelatedProducts({ product }: { product: ProductVariant }) {
  const related = PRODUCT_VARIANTS_BY_SIZE[product.productSize]
    .filter(variant => variant.id !== product.id)
    .slice(0, 3);

  if (!related.length) return null;

  return (
    <section className="related-products" aria-labelledby="related-products-title">
      <header className="related-products__heading">
        <div>
          <p className="related-products__eyebrow">PRODUK TERKAIT</p>
          <h2 id="related-products-title">Temukan rasa lainnya</h2>
        </div>
        <a className="related-products__all" href={`/product/regen-${product.productSize}/`}>
          Semua REGEN {product.productSize} <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </header>
      <ul className="related-products__grid">
        {related.map(variant => (
          <li key={variant.id}>
            <a className="related-products__card" href={variant.detailUrl} aria-label={`Lihat ${variant.name} ${variant.productSize}`}>
              <div className="related-products__visual" style={{ backgroundColor: variant.bgColor }}>
                <span className="related-products__size">{variant.productSize}</span>
                <img src={variant.bottleImage} alt={`${variant.name} ${variant.productSize}`} width={180} height={260} loading="lazy" />
              </div>
              <div className="related-products__copy">
                <div><h3>{variant.displayName}</h3><p>{variant.usp}</p></div>
                <span className="related-products__arrow" aria-hidden="true"><ArrowUpRight size={22} /></span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
