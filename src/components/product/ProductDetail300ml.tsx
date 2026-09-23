import { useId } from "react";
import { ArrowDown, Check, Sparkles } from "lucide-react";
import type { NilaiGiziItem, VitaminGiziItem } from "@/lib/InformasiGizi";
import "@/src/styles/product-detail.css";

interface ProductItem300mlProps {
  sourceImage: string;
  productName: string;
  productUSP: string;
  titleColor: string;
  description?: string;
  productComp?: string;
  vitaminContent: string[];
  vitaminColor: string;
  nutritionFacts?: NilaiGiziItem[];
  vitaminFacts?: VitaminGiziItem[];
  nutritionTags?: string[];
  compositionNote?: string;
}

const DEFAULT_NUTRITION_TAGS = ["0 Kalori", "0% Gula", "Glikosida Steviol"];

export default function ProductDetail300ml({
  sourceImage, productName, productUSP, titleColor, description, productComp,
  vitaminContent, vitaminColor, nutritionFacts = [], vitaminFacts = [],
  nutritionTags = DEFAULT_NUTRITION_TAGS, compositionNote = "Tanpa pemanis buatan",
}: ProductItem300mlProps) {
  const id = useId();
  const titleId = `product-title-${id}`;
  const factsId = `product-facts-${id}`;
  const hasNutrition = nutritionFacts.length > 0 || vitaminFacts.length > 0;

  return (
    <article className="product-detail" aria-labelledby={titleId} lang="id">
      <section className="pd-intro" aria-labelledby={titleId}>
        <div className="pd-visual">
          <div className={`pd-color-wash ${vitaminColor}`} aria-hidden="true" />
          <div className="pd-visual-top"><span>REGEN / VITAMIN DRINK</span><Sparkles size={21} aria-hidden="true" /></div>
          <span className="pd-backdrop-word" aria-hidden="true">REGEN</span>
          <div className="pd-orbit" aria-hidden="true" />
          <img className="pd-bottle" src={sourceImage} alt={`REGEN ${productName}`} width={450} height={650} loading="lazy" />
          <div className="pd-flavor-label"><span>PILIHAN RASAMU</span><strong>{productName}</strong></div>
        </div>

        <div className="pd-copy">
          <p className="pd-eyebrow">KENALI KESEGARANNYA</p>
          <h2 id={titleId}>REGEN <span className={titleColor}>{productName}</span></h2>
          <p className="pd-usp">{productUSP}</p>
          {description && <p className="pd-description">{description}</p>}
          {nutritionTags.length > 0 && <ul className="pd-tags" aria-label="Keunggulan produk">{nutritionTags.map((tag, index) => <li key={`${tag}-${index}`}><Check size={15} aria-hidden="true" />{tag}</li>)}</ul>}
          {vitaminContent.length > 0 && <div className="pd-vitamins"><div className="pd-vitamin-heading"><h3>Sumber vitamin</h3><span>DALAM SETIAP BOTOL</span></div><ul aria-label="Vitamin dalam produk">{vitaminContent.map((vitamin, index) => <li key={`${vitamin}-${index}`}><span className={`pd-vitamin-dot ${vitaminColor}`} aria-hidden="true" /><span className="sr-only">Vitamin </span>{vitamin}</li>)}</ul></div>}
          <a className="pd-facts-link" href={`#${factsId}`}>Kenali kandungannya <ArrowDown size={17} aria-hidden="true" /></a>
        </div>
      </section>

      <section className="pd-facts" id={factsId} aria-labelledby={`${factsId}-title`}>
        <div className="pd-facts-heading"><div><p className="pd-eyebrow">LEBIH DEKAT DENGAN ISINYA</p><h2 id={`${factsId}-title`}>Kenali setiap teguknya.</h2></div><span className="pd-facts-flavor">REGEN {productName}</span></div>
        <div className={`pd-facts-grid ${!hasNutrition ? "pd-facts-grid-single" : ""}`}>
          {hasNutrition && <div className="pd-nutrition"><div className="pd-panel-heading"><span>01</span><h3>Informasi nilai gizi</h3></div>
            {nutritionFacts.length > 0 && <div className="pd-table-wrap"><table><caption className="sr-only">Informasi nilai gizi REGEN {productName}</caption><thead><tr><th scope="col">Zat gizi</th><th scope="col">Jumlah</th><th scope="col"><abbr title="Angka Kecukupan Gizi">%AKG</abbr></th></tr></thead><tbody>{nutritionFacts.map((fact, index) => <tr key={`${fact.label}-${index}`}><th scope="row">{fact.label}</th><td>{fact.amount}</td><td>{fact.dailyValue ?? "—"}</td></tr>)}</tbody></table></div>}
            {vitaminFacts.length > 0 && <div className="pd-table-wrap pd-vitamin-table"><table><caption>Kandungan vitamin</caption><thead><tr><th scope="col">Vitamin</th><th scope="col"><abbr title="Angka Kecukupan Gizi">%AKG</abbr></th></tr></thead><tbody>{vitaminFacts.map((fact, index) => <tr key={`${fact.vitamin}-${index}`}><th scope="row">Vitamin {fact.vitamin}</th><td>{fact.dailyValue}</td></tr>)}</tbody></table></div>}
            <p className="pd-table-note">AKG = Angka Kecukupan Gizi.</p>
          </div>}
          <div className="pd-composition"><div className="pd-panel-heading"><span>{hasNutrition ? "02" : "01"}</span><h3>Komposisi</h3></div>
            {productComp && <p className="pd-composition-text">{productComp}</p>}
            {compositionNote && <div className="pd-composition-note"><Check size={19} aria-hidden="true" /><p>{compositionNote}</p></div>}
            <div className="pd-certifications"><span className="pd-eyebrow">INFORMASI PRODUK</span><div><img src="/element/halal.svg" alt="Halal Indonesia" width={100} height={60} loading="lazy" /><img src="/element/BPOM.svg" alt="BPOM" width={140} height={60} loading="lazy" /></div></div>
          </div>
        </div>
      </section>
    </article>
  );
}
