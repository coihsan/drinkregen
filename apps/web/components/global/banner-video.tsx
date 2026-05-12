"use client";

import { Button } from "@workspace/ui/components/button";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { Play, Volume2, VolumeX } from "lucide-react";
import { div } from "motion/react-client";
import { type MouseEvent, useRef, useState } from "react";

interface BannerVideoProps {
  source: string;
  type?: string;
  className?: string;
  isRounded?: boolean
}
const BannerVideo = ({ source, type, className, isRounded }: BannerVideoProps) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const mobile = useIsMobile();
  const [isMuted, setIsMuted] = useState(true);
  const ref = useRef<HTMLVideoElement | null>(null);

  const pauseVideo = () => {
    ref.current?.pause();
    setIsOverlayVisible(true);
  };

  const playVideo = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    try {
      await ref.current?.play();
      setIsOverlayVisible(false);
    } catch {
      setIsOverlayVisible(true);
    }
  };

  const toggleMuted = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsMuted((currentMuted) => !currentMuted);
  };

  return (
    <div className={`${className}`}>
      <div className="w-full mx-auto relative">
        {isOverlayVisible ? (
          <div className={`${isRounded ? "rounded-2xl overflow-hidden" : ""} absolute inset-0 z-10 flex items-center justify-center gap-3 bg-black/30`}>
            <Button
              aria-label="Play video"
              className="size-12 rounded-full bg-background/90 shadow-lg backdrop-blur hover:bg-background"
              size="icon"
              variant="outline"
              onClick={playVideo}
            >
              <Play className="size-6 fill-current" />
            </Button>
            <Button
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="size-12 rounded-full bg-background/90 shadow-lg backdrop-blur hover:bg-background"
              size="icon"
              variant="outline"
              onClick={toggleMuted}
            >
              {isMuted ? (
                <VolumeX className="size-5" />
              ) : (
                <Volume2 className="size-5" />
              )}
            </Button>
          </div>
        ) : null}
        {isOverlayVisible ? (
          null
        ) : (
          <>
            <button
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="absolute bottom-3 right-3 z-50 text-white cursor-pointer"
              onClick={toggleMuted}
            >
              {isMuted ? (
                <VolumeX className="size-5" />
              ) : (
                <Volume2 className="size-5" />
              )}
            </button>
          </>
        )}
        <div className={`${isRounded ? "rounded-2xl overflow-hidden" : ""}`}>
          <video
          onClick={pauseVideo}
          ref={ref}
          className="w-full h-auto aspect-video"
          autoPlay
          muted={isMuted}
          loop
        >
          <source src={source} type={type || "video/mp4"} />
        </video>
        </div>
      </div>
    </div>
  );
};
export default BannerVideo;
