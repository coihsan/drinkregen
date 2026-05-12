"use client";

import type { InstagramPost } from "@/lib/instagram";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import Image from "next/image";
import Link from "next/link";

type InstagramPostSliderProps = {
  posts: InstagramPost[];
  title?: string;
};

const getPostAlt = (post: InstagramPost, index: number) => {
  if (post.caption) {
    return post.caption.length > 120
      ? `${post.caption.slice(0, 117)}...`
      : post.caption;
  }

  return `Instagram Regen post ${index + 1}`;
};

const InstagramPostSlider = ({
  posts,
}: InstagramPostSliderProps) => {

  const isMobile = useIsMobile()
  if (posts.length === 0) return null;

  return (
    <section className="w-full overflow-hidden relative">
      <div className="relative">
        <div className="mx-auto w-full px-9 py-10 z-50">
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
                <Link
                  aria-label={`Buka postingan Instagram ${index + 1}`}
                  className="group block overflow-hidden rounded-lg bg-neutral-100"
                  href={post.permalink}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className="relative aspect-[3/4] block overflow-hidden">
                    <Image
                      alt={getPostAlt(post, index)}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      draggable={false}
                      loading={index < 5 ? "eager" : "lazy"}
                      src={post.mediaUrl}
                      fill
                    />
                    <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                  </span>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          {isMobile ? null : (
            <>
              <CarouselPrevious className="left-0 size-10 border-0 bg-green-500 text-white shadow-none hover:bg-green-600 hover:text-white disabled:opacity-40" />
              <CarouselNext className="right-0 size-10 border-0 bg-green-500 text-white shadow-none hover:bg-green-600 hover:text-white disabled:opacity-40" />
            </>
          )}
        </Carousel>
      </div>
      </div>
      <div className="bg-hero-pattern bg-repeat object-cover w-full md:object-cover object-center absolute top-0 opacity-30 pointer-events-none" />
      {/* <Image src={"/img-1.png"} alt="background slider instagram" width={1440} height={810} className="object-cover w-full md:object-cover object-center absolute top-0 opacity-30 pointer-events-none" /> */}
    </section>
  );
};

export default InstagramPostSlider;
