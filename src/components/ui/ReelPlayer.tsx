"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

interface ReelPlayerProps {
  src: string;
  captionLeft?: string;
  captionRight?: string;
}

export function ReelPlayer({
  src,
  captionLeft = "REEL 01 — BEHIND THE BAR",
  captionRight = "MADE TO ORDER AT COUNTER",
}: ReelPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries[0]?.isIntersecting ?? false;
        if (inView && !reducedMotion) {
          video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        } else if (!inView) {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div className="mx-auto w-full max-w-[330px] border border-[#171717] bg-white p-3 vintage-shadow">
      <div className="relative aspect-[9/16] w-full overflow-hidden border border-[#171717] bg-[#171717]">
        <video
          ref={videoRef}
          src={src}
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          onClick={togglePlay}
          className="h-full w-full object-cover cursor-pointer"
        />

        {/* Subtle Top-Left Reel Badge */}
        <div className="pointer-events-none absolute top-3 left-3 border border-[#171717] bg-[#F7F4EE]/95 px-2.5 py-1 font-display text-[9px] font-bold uppercase tracking-[0.18em] text-[#171717]">
          BGC BAR REEL
        </div>

        {/* Minimal Editorial Controls */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause reel" : "Play reel"}
            className="flex h-8 w-8 items-center justify-center border border-[#171717] bg-white/95 text-[#171717] transition-colors hover:bg-[#171717] hover:text-white cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute reel" : "Mute reel"}
            className="flex h-8 w-8 items-center justify-center border border-[#171717] bg-white/95 text-[#171717] transition-colors hover:bg-[#171717] hover:text-white cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="h-3.5 w-3.5" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-[#171717]/75">
        <span>{captionLeft}</span>
        <span className="text-[#795548]">{captionRight}</span>
      </div>
    </div>
  );
}
