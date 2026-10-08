import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, UserRound } from "lucide-react";

// Replace these placeholders with approved testimonials when available.
const testimonials = [1, 2, 3];

export default function NonaTestimonialCarousel() {
  const [viewportRef, carousel] = useEmblaCarousel({ align: "start", loop: false });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const update = useCallback(() => {
    if (!carousel) return;
    setSelected(carousel.selectedScrollSnap());
    setSnaps(carousel.scrollSnapList());
    setCanPrevious(carousel.canScrollPrev());
    setCanNext(carousel.canScrollNext());
  }, [carousel]);

  useEffect(() => {
    if (!carousel) return;
    update();
    carousel.on("select", update).on("reInit", update);
    return () => { carousel.off("select", update).off("reInit", update); };
  }, [carousel, update]);

  return <div className="nv2-carousel" role="region" aria-roledescription="carousel" aria-label="Testimoni Nona Regen">
    <div className="nv2-carousel-viewport" ref={viewportRef}>
      <div className="nv2-carousel-track">
        {testimonials.map((number) => <div className="nv2-carousel-slide" key={number} role="group" aria-roledescription="slide" aria-label={`${number} dari ${testimonials.length}`}>
          <figure className="nv2-testimonial-card">
            <span className="nv2-quote" aria-hidden="true">“</span>
            <blockquote><p>[Placeholder testimoni {number}]</p></blockquote>
            <figcaption><span className="nv2-avatar"><UserRound size={23} aria-hidden="true" /></span><div><strong>[Nama Nona Regen]</strong><span>[Kota / area]</span></div></figcaption>
          </figure>
        </div>)}
      </div>
    </div>
    <div className="nv2-carousel-controls">
      <button type="button" className="nv2-carousel-arrow" aria-label="Testimoni sebelumnya" disabled={!canPrevious} onClick={() => carousel?.scrollPrev()}><ArrowLeft size={20} aria-hidden="true" /></button>
      <div className="nv2-carousel-dots" aria-label="Pilih posisi carousel">{snaps.map((_, index) => <button type="button" key={index} aria-label={`Ke posisi ${index + 1}`} aria-current={selected === index ? "true" : undefined} onClick={() => carousel?.scrollTo(index)} />)}</div>
      <button type="button" className="nv2-carousel-arrow" aria-label="Testimoni berikutnya" disabled={!canNext} onClick={() => carousel?.scrollNext()}><ArrowRight size={20} aria-hidden="true" /></button>
    </div>
    <p className="sr-only" aria-live="polite" aria-atomic="true">Posisi {selected + 1} dari {snaps.length || 1}</p>
  </div>;
}
