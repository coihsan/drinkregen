import type { InstagramPost } from "@/lib/instagram";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type InstagramPostSliderProps = {
  posts: InstagramPost[];
  title?: string;
};

const getPostAlt = (post: InstagramPost, index: number) => {
  const caption = post.caption?.replace(/\s+/g, " ").trim();

  if (caption) {
    const characters = Array.from(caption);
    return characters.length > 120
      ? `${characters.slice(0, 117).join("")}...`
      : caption;
  }

  return `Instagram Regen post ${index + 1}`;
};

const InstagramPostSlider = ({ posts }: InstagramPostSliderProps) => {
  if (posts.length === 0) return null;

  return (
    <section className="w-full overflow-hidden relative px-4 md:px-9 py-10 md:py-30 z-50 bg-[#F23D6D] relative">
      <div className="flex items-center justify-center w-full relative z-10">
        {/* <h1 className="text-center text-6xl md:text-8xl lg:text-[7rem] font-black italic uppercase leading-[0.85] tracking-tighter text-white mb-10">Our Social<br />Media Post</h1> */}
        <div className="">
          <h1
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
            className="px-6 bg-[#8DF227] bg-blend-overlay mb-10 flex items-center justify-center text-center font-headoh text-4xl md:text-8xl lg:text-[7rem] text-[#F23D6D] leading-none"
          >
            Our Social Media Post
          </h1>
        </div>
       <div>
       </div>
      </div>
      <div className="relative z-10">
        <div className="mx-auto w-full">
          <Carousel
            aria-label="Slider postingan Instagram Regen"
            className=""
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-5">
              {posts.map((post, index) => (
                <CarouselItem
                  className="basis-[82%] pl-5 sm:basis-[48%] md:basis-[34%] lg:basis-[25%] xl:basis-[22%]"
                  key={post.id}
                >
                  <a
                    aria-label={`Buka postingan Instagram ${index + 1}`}
                    className="group block border border-4 border-white overflow-hidden rounded-lg bg-neutral-100"
                    href={post.permalink}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className="relative aspect-[3/4] block overflow-hidden">
                      <img
                        alt={getPostAlt(post, index)}
                        className="h-full w-full block object-cover transition duration-500 group-hover:scale-105"
                        draggable={false}
                        loading={index < 5 ? "eager" : "lazy"}
                        src={post.mediaUrl}
                      />
                      <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                    </span>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-5 hidden size-10 border-0 bg-green-500 text-white shadow-none hover:bg-green-600 hover:text-white disabled:opacity-40 md:inline-flex" />
            <CarouselNext className="-right-5 hidden size-10 border-0 bg-green-500 text-white shadow-none hover:bg-green-600 hover:text-white disabled:opacity-40 md:inline-flex" />
          </Carousel>
        </div>
      </div>
      <img
        className="absolute w-full h-full inset-0 block bottom-35 object-cover object-top opacity-20 z-1 "
        src={"/element/halftone-wave.svg"}
        alt=""
      />
    </section>
  );
};

export default InstagramPostSlider;
