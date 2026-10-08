import { useId } from "react";
import { ArrowUpRight, MapPin, ShoppingBag } from "lucide-react";
import type { OnlineStore, OfflineStore, ProductAvailability } from "@/lib/product-availability";
import "@/src/styles/product-buy-banner.css";

interface DataProductByItem {
  content: ProductAvailability;
}

function StoreGroup({ stores, type, productName }: {
  stores: (OnlineStore | OfflineStore)[];
  type: "online" | "offline";
  productName: string;
}) {
  if (!stores.length) return null;
  const online = type === "online";
  const Icon = online ? ShoppingBag : MapPin;

  return <div className="buy-banner__group">
    <div className="buy-banner__group-heading">
      <span className="buy-banner__icon"><Icon size={20} aria-hidden="true" /></span>
      <div><h3>{online ? "Belanja online" : "Mampir ke toko"}</h3><p>{online ? "Pilih toko online favoritmu." : "Cari lokasi toko terdekat di Google Maps."}</p></div>
    </div>
    <ul className="buy-banner__stores">
      {stores.map(store => {
        const href = "urlStore" in store ? store.urlStore : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.query)}`;
        const label = store.ariaLabel ?? `${online ? "Beli" : "Cari toko untuk membeli"} REGEN ${productName} di ${store.name}`;
        return <li key={store.name}><a id={store.id} data-tracking-id={store.id} data-product={productName} data-channel={type} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (buka tab baru)`}>
          <img src={store.imageURL} width={160} height={48} alt={store.name} loading="lazy" />
          <span>{online ? "Belanja sekarang" : "Cari lokasi"}<ArrowUpRight size={16} aria-hidden="true" /></span>
        </a></li>;
      })}
    </ul>
  </div>;
}

export default function BannerBuyProductRegenByItem({ content }: DataProductByItem) {
  const titleId = useId();
  const onlineStores = content.stores.online ?? [];
  const offlineStores = content.stores.offline ?? [];
  if (!content.isAvailable || (!onlineStores.length && !offlineStores.length)) return null;

  return <section className="buy-banner" aria-labelledby={titleId}>
    <div className="buy-banner__layout">
      <div className={`buy-banner__product ${content.bgProduct}`}>
        <p className="buy-banner__eyebrow">PILIHAN SEGAR BUAT HARIMU</p>
        <div className="buy-banner__art">
          <span className="buy-banner__word" aria-hidden="true">REGEN</span>
          <div className="buy-banner__orbit" aria-hidden="true" />
          <img className="buy-banner__bottle" src={content.urlImage} alt={content.ariaLabel} width={300} height={400} loading="lazy" />
        </div>
        <div className="buy-banner__flavor"><span>REGEN {content.productName}</span><strong>{content.usp}</strong></div>
      </div>
      <div className="buy-banner__content">
        <header className="buy-banner__heading">
          <p className="buy-banner__eyebrow">TINGGAL PILIH TOKONYA</p>
          <h2 id={titleId}>Segarnya dekat.<br />Dapatkannya mudah.</h2>
          <p>Dapatkan REGEN {content.productName} di toko favoritmu.</p>
        </header>
        <StoreGroup stores={onlineStores} type="online" productName={content.productName} />
        <StoreGroup stores={offlineStores} type="offline" productName={content.productName} />
      </div>
    </div>
  </section>;
}
