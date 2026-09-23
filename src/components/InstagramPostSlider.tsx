import { useEffect, useId, useState } from "react";
import { ArrowUpRight, Camera, Play, RefreshCw, Images, ImageOff } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { getLatestInstagramPosts, type InstagramPost } from "@/lib/api/instagram";
import "@/src/styles/instagram-slider.css";

const PROFILE = "https://www.instagram.com/drinkregenid/";
let cache: { posts: InstagramPost[]; expires: number } | undefined;

function MediaPlaceholder({ empty = false }: { empty?: boolean }) {
  return <div className="ig-media-placeholder"><span className="ig-placeholder-icon"><ImageOff size={30} aria-hidden="true" /></span><strong>{empty ? "Belum ada postingan" : "Gambar gagal dimuat"}</strong><span>{empty ? "Postingan terbaru akan tampil di sini." : "Periksa koneksi internet dan coba lagi."}</span></div>;
}

function PostMedia({ post }: { post: InstagramPost }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <MediaPlaceholder />;
  if (post.mediaType === "VIDEO" && !post.thumbnailUrl) return <video className="ig-media" src={post.mediaUrl} muted playsInline preload="metadata" onError={() => setFailed(true)} aria-label="Pratinjau video REGEN" />;
  return <img className="ig-media" src={post.thumbnailUrl || post.mediaUrl} alt={post.caption?.slice(0, 160) || "Postingan REGEN di Instagram"} loading="lazy" decoding="async" draggable={false} onError={() => setFailed(true)} />;
}

export default function InstagramPostSlider() {
  const headingId = useId();
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [position, setPosition] = useState({ current: 1, total: 1 });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    if (attempt === 0 && cache && cache.expires > Date.now()) { setPosts(cache.posts); setStatus("ready"); return; }
    setStatus("loading");
    getLatestInstagramPosts(10, controller.signal).then(data => {
      if (!active) return;
      cache = { posts: data, expires: Date.now() + 5 * 60 * 1000 };
      setPosts(data); setStatus("ready");
    }).catch(() => { if (active) setStatus("error"); });
    return () => { active = false; controller.abort(); };
  }, [attempt]);

  useEffect(() => {
    if (!api) return;
    const update = () => setPosition({ current: api.selectedScrollSnap() + 1, total: api.scrollSnapList().length });
    update(); api.on("select", update); api.on("reInit", update);
    return () => { api.off("select", update); api.off("reInit", update); };
  }, [api]);

  const showPosts = status === "ready" && posts.length > 0;
  return <section className="instagram-section" aria-labelledby={headingId}>
    <div className="ig-inner">
      <header className="ig-heading"><div><p className="ig-eyebrow"><Camera size={16} aria-hidden="true" /> TERHUBUNG BARENG REGEN</p><h2 id={headingId}>Segarnya di sini.<br /><span>Serunya di Instagram.</span></h2></div><div className="ig-heading-aside"><p>Ikuti cerita, keseruan, dan kabar terbaru REGEN di Instagram.</p><a className="ig-profile" href={PROFILE} target="_blank" rel="noopener noreferrer">@drinkregenid <ArrowUpRight size={19} aria-hidden="true" /><span className="sr-only"> (buka tab baru)</span></a></div></header>
      <div className="ig-feed-status" role="status" aria-live="polite">{status === "loading" ? "Memuat postingan Instagram…" : showPosts ? "TERBARU DARI @DRINKREGENID" : status === "error" ? "Postingan belum bisa dimuat. Silakan coba lagi." : "Belum ada postingan untuk ditampilkan."}</div>
      {status === "loading" ? <div className="ig-skeletons" aria-hidden="true">{Array.from({ length: 4 }, (_, i) => <div className="ig-skeleton" key={i} />)}</div> : <Carousel key={showPosts ? "posts" : "placeholders"} setApi={setApi} opts={{ align: "start", loop: false }} className="ig-carousel" aria-label="Postingan Instagram REGEN">
        <CarouselContent className="ig-track">{showPosts ? posts.map((post, index) => <CarouselItem className="ig-slide" key={post.id} aria-label={`${index + 1} dari ${posts.length}`}><a className="ig-post-card" href={post.permalink} target="_blank" rel="noopener noreferrer" aria-label={`Buka postingan Instagram: ${post.caption?.slice(0, 100) || `REGEN ${index + 1}`} (tab baru)`}><div className="ig-post-image"><PostMedia post={post} /><span className="ig-type">{post.mediaType === "VIDEO" ? <Play size={16} aria-hidden="true" /> : post.mediaType === "CAROUSEL_ALBUM" ? <Images size={16} aria-hidden="true" /> : <Camera size={16} aria-hidden="true" />}{post.mediaType === "VIDEO" ? "VIDEO" : "POST"}</span></div><div className="ig-post-body"><span>@drinkregenid <ArrowUpRight size={16} aria-hidden="true" /></span><p>{post.caption || "Temukan keseruan REGEN di Instagram."}</p></div></a></CarouselItem>) : Array.from({ length: 4 }, (_, index) => <CarouselItem className="ig-slide" key={index} aria-label={`Placeholder postingan ${index + 1} dari 4`}><div className="ig-post-card ig-unavailable-card"><div className="ig-post-image"><MediaPlaceholder empty={status === "ready"} /></div><div className="ig-post-body"><span><Camera size={15} aria-hidden="true" /> @drinkregenid</span><div className="ig-caption-placeholder" aria-hidden="true"><span /><span /></div></div></div></CarouselItem>)}</CarouselContent>
        <div className="ig-bottom"><div className="ig-bottom-copy"><span>CERITA REGEN, SETIAP HARI.</span>{status === "error" && <button className="ig-retry" onClick={() => setAttempt(value => value + 1)} type="button"><RefreshCw size={14} aria-hidden="true" />Coba muat lagi</button>}</div><div className="ig-controls"><span className="ig-position" aria-live="polite">{position.current} / {position.total}</span><CarouselPrevious className="ig-arrow" aria-label="Geser sebelumnya" /><CarouselNext className="ig-arrow" aria-label="Geser berikutnya" /></div></div>
      </Carousel>}
    </div>
  </section>;
}
