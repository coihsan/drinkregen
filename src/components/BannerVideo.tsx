"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import "../styles/banner-video.css";

interface BannerVideoProps {
  source: string;
  type?: string;
  className?: string;
  isRounded?: boolean;
  poster?: string;
}

const BannerVideo = ({ source, type, className, isRounded, poster }: BannerVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let active = true;
    setIsPlaying(false);
    setHasError(false);
    setIsMuted(true);
    video.muted = true;
    video.load();

    // A blocked autoplay still leaves the manual play control available.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      void video.play().catch(() => {
        if (active) setIsPlaying(false);
      });
    }

    const stopVideo = () => {
      video.pause();
      video.muted = true;
    };
    document.addEventListener("astro:before-swap", stopVideo);
    return () => {
      active = false;
      document.removeEventListener("astro:before-swap", stopVideo);
      stopVideo();
    };
  }, [source, type]);

  const togglePlayback = async () => {
    const video = ref.current;
    if (!video) return;
    if (!video.paused) {
      video.pause();
      return;
    }
    try {
      await video.play();
    } catch {
      setIsPlaying(false);
    }
  };

  const toggleMuted = () => {
    const video = ref.current;
    if (video) video.muted = !video.muted;
  };

  return (
    <div className={cn("banner-video", className)}>
      <div
        className={cn("banner-video__frame", isRounded && "banner-video__frame--rounded")}
        role="group"
        aria-label="Video REGEN"
      >
        <div className="banner-video__screen">
          <video
            ref={ref}
            className="banner-video__media"
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            poster={poster}
            aria-label="Video REGEN"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
            onError={() => { setHasError(true); setIsPlaying(false); }}
          >
            <source src={source} type={type || "video/mp4"} onError={() => { setHasError(true); setIsPlaying(false); }} />
          </video>
          {!hasError && (
            <button
              type="button"
              className={cn("banner-video__surface", !isPlaying && "banner-video__surface--paused")}
              aria-label={isPlaying ? "Jeda video" : "Putar video"}
              onClick={togglePlayback}
            >
              {!isPlaying && (
                <span className="banner-video__play" aria-hidden="true">
                  <Play size={28} fill="currentColor" />
                </span>
              )}
            </button>
          )}
          {hasError && (
            <div className="banner-video__error" role="status">
              Video belum bisa dimuat. Silakan muat ulang halaman.
            </div>
          )}
          <span className="banner-video__badge" aria-hidden="true">REGEN IN MOTION</span>
        </div>
        <div className="banner-video__toolbar">
          <div className="banner-video__caption">
            <span className="banner-video__dot" aria-hidden="true" />
            <span>BUKA REGEN. <span className="banner-video__caption-accent">RASAKAN SEGARNYA.</span></span>
          </div>
          <div className="banner-video__controls">
            <button type="button" className="banner-video__control" onClick={togglePlayback}
              disabled={hasError} aria-label={isPlaying ? "Jeda video" : "Putar video"}>
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>
            <button type="button" className="banner-video__control" onClick={toggleMuted}
              disabled={hasError} aria-label={isMuted ? "Aktifkan suara" : "Bisukan video"}>
              {isMuted ? <VolumeX size={19} /> : <Volume2 size={19} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BannerVideo;

