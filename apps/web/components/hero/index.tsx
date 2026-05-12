"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type HeroImageSlide = {
  type?: "image";
  id?: string;
  desktopImageUrl: string;
  tabletImageUrl?: string;
  mobileImageUrl?: string;
  alt?: string;
};

type HeroVideoSlide = {
  type: "video";
  id?: string;
  desktopVideoUrl: string;
  tabletVideoUrl?: string;
  mobileVideoUrl?: string;
  videoType?: string;
  posterImageUrl?: string;
  posterTabletImageUrl?: string;
  posterMobileImageUrl?: string;
  previewImageUrl?: string;
  alt?: string;
};

export type HeroSlide = HeroImageSlide | HeroVideoSlide;

interface HeroSectionProps {
  slides: HeroSlide[];
}

const swipeThreshold = 60;
const autoSlideDelay = 5000;
const slideTransitionDuration = 700;

const isVideoSlide = (slide: HeroSlide): slide is HeroVideoSlide =>
  slide.type === "video";

const getSlideKey = (slide: HeroSlide) =>
  slide.id ??
  (isVideoSlide(slide) ? slide.desktopVideoUrl : slide.desktopImageUrl);

const getPreviewImage = (slide: HeroSlide) => {
  if (isVideoSlide(slide)) {
    return (
      slide.previewImageUrl ??
      slide.posterMobileImageUrl ??
      slide.posterTabletImageUrl ??
      slide.posterImageUrl
    );
  }

  return slide.mobileImageUrl ?? slide.tabletImageUrl ?? slide.desktopImageUrl;
};

const getPreviewVideo = (slide: HeroVideoSlide) =>
  slide.mobileVideoUrl ?? slide.tabletVideoUrl ?? slide.desktopVideoUrl;

const HeroMedia = ({
  isPriority,
  slide,
  slideNumber,
}: {
  isPriority: boolean;
  slide: HeroSlide;
  slideNumber: number;
}) => {
  const alt = slide.alt ?? `Hero slide ${slideNumber}`;

  if (isVideoSlide(slide)) {
    return (
      <video
        aria-label={alt}
        autoPlay
        className="h-full w-full object-cover"
        loop
        muted
        playsInline
        poster={
          slide.posterImageUrl ??
          slide.posterTabletImageUrl ??
          slide.posterMobileImageUrl
        }
        preload={isPriority ? "auto" : "metadata"}
      >
        {slide.mobileVideoUrl ? (
          <source
            media="(max-width: 767px)"
            src={slide.mobileVideoUrl}
            type={slide.videoType ?? "video/mp4"}
          />
        ) : null}
        {slide.tabletVideoUrl ? (
          <source
            media="(max-width: 1023px)"
            src={slide.tabletVideoUrl}
            type={slide.videoType ?? "video/mp4"}
          />
        ) : null}
        <source
          src={slide.desktopVideoUrl}
          type={slide.videoType ?? "video/mp4"}
        />
      </video>
    );
  }

  return (
    <picture>
      <source
        media="(max-width: 767px)"
        srcSet={
          slide.mobileImageUrl ?? slide.tabletImageUrl ?? slide.desktopImageUrl
        }
      />
      <source
        media="(max-width: 1023px)"
        srcSet={slide.tabletImageUrl ?? slide.desktopImageUrl}
      />
      <Image
        loading="eager"
        alt={alt}
        className="object-cover"
        draggable={false}
        fill
        priority={isPriority}
        sizes="100vw"
        src={slide.desktopImageUrl}
      />
    </picture>
  );
};

const HeroPreview = ({ slide }: { slide: HeroSlide }) => {
  const previewImage = getPreviewImage(slide);

  if (previewImage) {
    return (
      <Image
        alt={slide.alt ?? "Next hero slide"}
        className="object-cover transition duration-500 group-hover:scale-105"
        draggable={false}
        fill
        sizes="96px"
        src={previewImage}
      />
    );
  }

  if (isVideoSlide(slide)) {
    return (
      <video
        aria-label={slide.alt ?? "Next hero slide"}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source
          src={getPreviewVideo(slide)}
          type={slide.videoType ?? "video/mp4"}
        />
      </video>
    );
  }

  return null;
};

const HeroSection = ({ slides }: HeroSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(() =>
    slides.length > 1 ? 1 : 0,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [interactionKey, setInteractionKey] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const startXRef = useRef<number | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextIndex = slides.length > 0 ? (activeIndex + 1) % slides.length : 0;

  const goToSlide = (index: number) => {
    const slideCount = slides.length;
    const targetIndex = (index + slideCount) % slideCount;

    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }

    setIsTransitionEnabled(true);
    setActiveIndex(targetIndex);
    setTrackIndex(targetIndex + 1);
  };

  const pauseAutoSlideBriefly = () => {
    setInteractionKey((key) => key + 1);
  };

  const resetTrackAfterLoop = useCallback((targetTrackIndex: number) => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    resetTimeoutRef.current = setTimeout(() => {
      setIsTransitionEnabled(false);
      setTrackIndex(targetTrackIndex);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resetTimeoutRef.current = null;
          setIsTransitionEnabled(true);
        });
      });
    }, slideTransitionDuration);
  }, []);

  const moveSlide = useCallback(
    (direction: 1 | -1) => {
      if (slides.length < 2) return;
      if (resetTimeoutRef.current) return;

      const isMovingPastLastSlide =
        direction === 1 && activeIndex === slides.length - 1;
      const isMovingBeforeFirstSlide = direction === -1 && activeIndex === 0;
      const nextActiveIndex =
        (activeIndex + direction + slides.length) % slides.length;

      setIsTransitionEnabled(true);
      setActiveIndex(nextActiveIndex);
      setTrackIndex((currentIndex) => currentIndex + direction);

      if (isMovingPastLastSlide) {
        resetTrackAfterLoop(1);
      }

      if (isMovingBeforeFirstSlide) {
        resetTrackAfterLoop(slides.length);
      }
    },
    [activeIndex, resetTrackAfterLoop, slides.length],
  );

  const finishSwipe = (clientX: number) => {
    if (startXRef.current === null) return;

    const distance = startXRef.current - clientX;

    if (Math.abs(distance) >= swipeThreshold) {
      moveSlide(distance > 0 ? 1 : -1);
      pauseAutoSlideBriefly();
    }

    startXRef.current = null;
    setIsDragging(false);
  };

  useEffect(() => {
    if (slides.length < 2 || isDragging) {
      return;
    }

    const timeout = setTimeout(() => {
      moveSlide(1);
    }, autoSlideDelay);

    return () => clearTimeout(timeout);
  }, [activeIndex, interactionKey, isDragging, moveSlide, slides.length]);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  if (slides.length === 0) return null;

  const carouselSlides =
    slides.length > 1
      ? [slides[slides.length - 1]!, ...slides, slides[0]!]
      : slides;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Hero media slider"
      className={`relative h-dvh w-full touch-pan-y overflow-hidden bg-black select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      onMouseDown={(event) => {
        startXRef.current = event.clientX;
        setIsDragging(true);
      }}
      onMouseLeave={() => {
        startXRef.current = null;
        setIsDragging(false);
      }}
      onMouseUp={(event) => finishSwipe(event.clientX)}
      onTouchStart={(event) => {
        startXRef.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const touch = event.changedTouches[0];

        if (touch) finishSwipe(touch.clientX);
      }}
    >
      <div
        className={`flex h-full ${
          isTransitionEnabled
            ? "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            : ""
        }`}
        style={{ transform: `translateX(-${trackIndex * 100}%)` }}
      >
        {carouselSlides.map((slide, index) => {
          const originalIndex =
            slides.length > 1
              ? (index - 1 + slides.length) % slides.length
              : index;
          const isFirstRealSlide =
            slides.length > 1 ? index === 1 : index === 0;

          return (
            <div
              aria-hidden={activeIndex !== originalIndex}
              className="relative h-full w-full shrink-0"
              key={`${getSlideKey(slide)}-${index}`}
            >
              <HeroMedia
                isPriority={isFirstRealSlide}
                slide={slide}
                slideNumber={originalIndex + 1}
              />
              {/* overlay */}
              {/* <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/35" /> */}
            </div>
          );
        })}
      </div>

      {slides.length > 1 ? (
        <>
          <button
            aria-label={`Preview next slide ${nextIndex + 1}`}
            className="group absolute bottom-6 p-3 left-5 z-10 hidden md:flex flex-col items-center  rounded-3xl border border-white/25 bg-black/35 p-2 shadow-2xl backdrop-blur-md transition hover:bg-black/45 md:bottom-8 md:left-8"
            onClick={() => {
              moveSlide(1);
              pauseAutoSlideBriefly();
            }}
            type="button"
          >
            <span className="relative block aspect-[4/3] w-20 overflow-hidden rounded-2xl bg-white/10 md:w-24">
              <HeroPreview slide={slides[nextIndex]!} />
            </span>
            <span className="w-20 md:w-24">
              <span className="mt-3 block h-1 overflow-hidden rounded-full bg-white/25">
                <span
                  className="block h-full origin-left animate-[hero-progress_5s_linear_forwards] rounded-full bg-white"
                  key={`${activeIndex}-${interactionKey}`}
                  style={{
                    animationDuration: `${autoSlideDelay}ms`,
                    animationPlayState: isDragging ? "paused" : "running",
                  }}
                />
              </span>
            </span>
          </button>

          <div className="absolute bottom-8 right-6 z-10 flex items-center gap-2 md:right-10">
            {slides.map((slide, index) => (
              <button
                aria-label={`Go to slide ${index + 1}`}
                aria-current={activeIndex === index}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === index ? "w-9 bg-white" : "w-2 bg-white/45"
                }`}
                key={`${getSlideKey(slide)}-indicator`}
                onClick={() => {
                  goToSlide(index);
                  pauseAutoSlideBriefly();
                }}
                type="button"
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
};

export default HeroSection;
