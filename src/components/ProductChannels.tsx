import { useId, useState } from "react";
import { ArrowUpRight, MapPin, Search, ShoppingBag, X } from "lucide-react";
import { DetailProductAvailableByVariant } from "@/lib/product-availability";
import { PRODUCT_VARIANTS_BY_SIZE } from "@/lib/product-catalog";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import regenWhite from "@/src/assets/icons/logo-regen-white.svg?url";
import "@/src/styles/product-channels.css";

const products = (["300ml", "450ml"] as const).flatMap((size) =>
  Object.entries(DetailProductAvailableByVariant[size]).map(([flavor, product]) => ({
    ...product, id: `${size}-${flavor}`, size,
    variant: PRODUCT_VARIANTS_BY_SIZE[size].find(variant => variant.id === flavor),
  })),
);
type Channel = "all" | "online" | "offline";

export default function ProductChannels() {
  const sizeId = useId();
  const [query, setQuery] = useState("");
  const [size, setSize] = useState("all");
  const [channel, setChannel] = useState<Channel>("all");
  const filtered = products.filter(product => {
    const stores = channel === "all" ? [...(product.stores.online ?? []), ...(product.stores.offline ?? [])] : product.stores[channel] ?? [];
    return (size === "all" || size === product.size)
      && (channel === "all" || (product.isAvailable && stores.length > 0))
      && `${product.productName} ${stores.map(store => store.name).join(" ")}`.toLowerCase().includes(query.trim().toLowerCase());
  });
  const reset = () => { setQuery(""); setSize("all"); setChannel("all"); };

  return <section className="pc-page regen-page" aria-labelledby="channel-title">
    <header className="pc-hero regen-hero">
      <div className="pc-hero-inner">
        <div><p className="pc-eyebrow regen-eyebrow"><MapPin size={15} aria-hidden="true" /> TEMUKAN REGEN</p><h1 className="regen-title" id="channel-title">Pilih rasanya.<br /><span>Temukan segarnya.</span></h1><p className="pc-intro regen-lead">Kesegaran favoritmu, lebih dekat denganmu. Pesan online atau mampir ke toko di sekitarmu.</p></div>
        <div className="pc-guide"><span className="pc-guide-number" aria-hidden="true">↗</span><h2>Dua cara.<br />Sama segarnya.</h2><p><ShoppingBag size={18} aria-hidden="true" /> Klik, pesan, nikmati di rumah.</p><p><MapPin size={18} aria-hidden="true" /> Mampir ke toko favoritmu.</p></div>
      </div>
    </header>
    <div className="pc-content">
      <div className="pc-filters" role="search" aria-label="Cari tempat membeli REGEN">
        <InputGroup className="pc-search h-12">
          <InputGroupAddon><Search aria-hidden="true" /></InputGroupAddon>
          <InputGroupInput
            aria-label="Cari rasa atau nama toko"
            placeholder="Cari rasa atau nama toko…"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
          {query && <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-sm" className="size-11" onClick={() => setQuery("")} aria-label="Hapus pencarian">
              <X aria-hidden="true" />
            </InputGroupButton>
          </InputGroupAddon>}
        </InputGroup>
        <div className="pc-size">
          <Label htmlFor={sizeId}>Ukuran</Label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger id={sizeId} className="min-h-12 min-w-36">
              <SelectValue placeholder="Semua ukuran" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="all">Semua ukuran</SelectItem>
              <SelectItem value="300ml">300ml</SelectItem>
              <SelectItem value="450ml">450ml</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ToggleGroup
          className="pc-tabs"
          type="single"
          variant="outline"
          value={channel}
          onValueChange={value => {
            if (value === "all" || value === "online" || value === "offline") setChannel(value);
          }}
          aria-label="Jenis toko"
        >
          {([{value:"all",label:"Semua"},{value:"online",label:"Online"},{value:"offline",label:"Retail"}] as const).map(option => (
            <ToggleGroupItem className="min-h-11 px-4" key={option.value} value={option.value} aria-label={option.label}>
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="pc-results"><p role="status"><strong>{filtered.length}</strong> pilihan produk <span>· Temukan tempat belinya</span></p>{(query || size !== "all" || channel !== "all") && <Button variant="ghost" className="min-h-11" type="button" onClick={reset}>Reset filter <X size={14} aria-hidden="true" /></Button>}</div>
      <div className="pc-grid">{filtered.map(product => <article className="pc-card regen-card" key={product.id} aria-labelledby={`title-${product.id}`}>
        <div className="pc-product" style={{backgroundColor:product.variant?.bgColor ?? "var(--regen-citrus)"}}>
          <div className="pc-badges"><span>{product.size}</span>{!product.isAvailable && <span className="pc-unavailable">Stok habis</span>}</div>
          <img className="pc-watermark" src={regenWhite} alt="" aria-hidden="true" />
          <img className="pc-bottle" src={product.urlImage} alt={product.ariaLabel} width={140} height={210} loading="lazy" />
          <div className="pc-product-copy"><p>REGEN / {product.size}</p><h2 id={`title-${product.id}`}>{product.variant?.displayName ?? product.productName}</h2><span>{product.usp}</span></div>
        </div>
        <div className="pc-stores">{!product.isAvailable ? <div className="pc-stock-message"><ShoppingBag size={24} aria-hidden="true" /><h3>Segarnya sedang dinanti.</h3><p>Stok sedang habis. Waktu ketersediaan kembali belum dapat dipastikan.</p></div> : <>
          {channel !== "offline" && <div className="pc-store-group"><h3><ShoppingBag size={15} aria-hidden="true" /> BELI ONLINE <span>{product.stores.online?.length ?? 0} toko</span></h3><div className="pc-online">{product.stores.online?.length ? product.stores.online.map(store => <a key={store.name} href={store.urlStore} target="_blank" rel="noopener noreferrer" aria-label={`${store.ariaLabel} (tab baru)`}><img src={store.imageURL} alt="" width={64} height={28} loading="lazy" /><span>{store.name}</span><ArrowUpRight size={18} aria-hidden="true" /></a>) : <p className="pc-empty-store">Belum ada toko online.</p>}</div></div>}
          {channel !== "online" && <div className="pc-store-group"><h3><MapPin size={15} aria-hidden="true" /> TEMUKAN DI RETAIL</h3><div className="pc-offline">{product.stores.offline?.length ? product.stores.offline.map(store => <a key={store.name} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.query)}`} target="_blank" rel="noopener noreferrer" aria-label={`Cari ${store.name} terdekat untuk ${product.productName} di Google Maps (tab baru)`} title={store.name}><img src={store.imageURL} alt={store.name} width={80} height={32} loading="lazy" /><ArrowUpRight size={13} aria-hidden="true" /></a>) : <p className="pc-empty-store">Belum ada toko retail.</p>}</div></div>}
        </>}</div>
      </article>)}</div>
      {filtered.length === 0 && <div className="pc-empty"><Search size={32} aria-hidden="true" /><h2>REGEN kamu belum ketemu.</h2><p>Coba rasa, nama toko, atau ukuran lainnya.</p><Button className="mt-5 min-h-11" type="button" onClick={reset}>Tampilkan semua produk <ArrowUpRight size={18} aria-hidden="true" /></Button></div>}
      <aside className="pc-note"><MapPin size={20} aria-hidden="true" /><p>Tautan retail membuka pencarian Google Maps. Ketersediaan produk dan stok dapat berbeda di setiap cabang; cek ke toko sebelum berkunjung.</p></aside>
    </div>
  </section>;
}
