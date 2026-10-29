import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface RelatedPost {
  slug: string;
  title: string;
  category: string;
  image: string;
  minutes: number;
}

export default function RelatedPostCarousel({ posts, imageFallback }: { posts: RelatedPost[]; imageFallback: string }) {
  if (!posts.length) return null;
  const controlClass = "static size-11 border-[var(--regen-ink)] bg-[var(--regen-paper)] text-[var(--regen-ink)] hover:bg-[var(--regen-ink)] hover:text-[var(--regen-paper)]";
  return (
    <Carousel className="w-full min-w-0" aria-label="Artikel terkait" opts={{ align: "start", breakpoints: { "(prefers-reduced-motion: reduce)": { duration: 0 } } }}>
      <CarouselContent className="-ml-5">
        {posts.map((other, index) => (
          <CarouselItem key={other.slug} aria-label={`${index + 1} dari ${posts.length}`} className="basis-[85%] pl-5 py-6 min-[700px]:basis-1/2 min-[1100px]:basis-1/3">
              <a
                className="block h-full p-5 bg-lime-100 rounded-xl shadow-xl relative"
                href={`/blog/${other.slug}`}
              >
                <span className="block aspect-[3/2] overflow-hidden rounded-xl bg-[#edf2df] [&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
                  <img src={other.image} alt="" width={1200} height={800} loading="lazy" onError={(event) => { if (event.currentTarget.getAttribute("src") !== imageFallback) event.currentTarget.src = imageFallback; }} />
                </span>
                <span className="grid gap-2 leading-normal [overflow-wrap:anywhere]">
                  <span className="flex items-center gap-2 mt-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19.293 9.951l-2.333-2.8c-.353-.423-.53-.635-.746-.787a2 2 0 0 0-.632-.295C15.327 6 15.052 6 14.502 6H7.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C4 7.52 4 8.08 4 9.2v5.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218H14.5c.551 0 .826 0 1.081-.069c.226-.06.44-.16.632-.296c.216-.152.393-.363.746-.786l2.333-2.8c.608-.729.91-1.093 1.027-1.5c.102-.359.102-.74 0-1.098c-.116-.407-.42-.77-1.027-1.5" />
                    </svg>
                    <span className="text-xs uppercase tracking-[.08em]">{other.category}</span>
                  </span>
                  <span className="font-bold">{other.title}</span>
                  <span className="text-xs font-normal text-[var(--regen-muted)]">
                    {other.minutes} menit baca
                  </span>
                </span>
                <span className="text-2xl max-[700px]:hidden absolute bottom-2 right-5" aria-hidden="true">↗</span>
              </a>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-3 flex justify-center gap-3">
        <CarouselPrevious type="button" aria-label="Artikel sebelumnya" className={controlClass} />
        <CarouselNext type="button" aria-label="Artikel berikutnya" className={controlClass} />
      </div>
    </Carousel>
  );
}