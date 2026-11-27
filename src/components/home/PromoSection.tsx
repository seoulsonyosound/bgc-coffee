"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Pause,
  Play,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const IG_PHOTOS = [
  {
    src: "/images/ig-post/1.jpg",
    alt: "BGC Coffee Co. story 1",
    label: "01",
  },
  {
    src: "/images/ig-post/2.jpg",
    alt: "BGC Coffee Co. story 2",
    label: "02",
  },
  {
    src: "/images/ig-post/3.jpg",
    alt: "BGC Coffee Co. story 3",
    label: "03",
  },
  {
    src: "/images/ig-post/4.jpg",
    alt: "BGC Coffee Co. story 4",
    label: "04",
  },
  {
    src: "/images/ig-post/5.jpg",
    alt: "BGC Coffee Co. story 5",
    label: "05",
  },
];

export function PromoSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);

  const isPaused = isHovered || isManuallyPaused || lightboxOpen;

  const prevSlide = () => {
    setActiveIndex((i) => (i === 0 ? IG_PHOTOS.length - 1 : i - 1));
  };

  const nextSlide = () => {
    setActiveIndex((i) => (i === IG_PHOTOS.length - 1 ? 0 : i + 1));
  };

  // Auto-advance every 2 seconds (pauses on hover, manual pause, or lightbox)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((i) => (i === IG_PHOTOS.length - 1 ? 0 : i + 1));
    }, 2000);
    return () => clearInterval(timer);
  }, [activeIndex, isPaused]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) => (i === 0 ? IG_PHOTOS.length - 1 : i - 1));
      }
      if (e.key === "ArrowRight") {
        setActiveIndex((i) => (i === IG_PHOTOS.length - 1 ? 0 : i + 1));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen]);

  const currentPhoto = IG_PHOTOS[activeIndex];

  return (
    <section className="bg-[#171717] text-[#F7F4EE] py-20 sm:py-24 border-b border-[#171717]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-center">
          {/* Left: Sleek Instagram Story Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-[#0e0e0e] ring-1 ring-white/15 shadow-2xl select-none"
            >
              {/* Smooth Crossfade Photos */}
              {IG_PHOTOS.map((photo, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={photo.src}
                    aria-hidden={!isActive}
                    className={cn(
                      "absolute inset-0 transition-all duration-700 ease-out",
                      isActive
                        ? "opacity-100 scale-100 z-10"
                        : "opacity-0 scale-[1.03] z-0 pointer-events-none"
                    )}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 1024px) 100vw, 448px"
                      className="object-cover"
                    />
                  </div>
                );
              })}

              {/* Top & Bottom Soft Story Gradients */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Instagram Story Progress Bars */}
              <div className="absolute top-3.5 inset-x-4 z-30 flex gap-1.5">
                {IG_PHOTOS.map((photo, idx) => {
                  const isCurrent = idx === activeIndex;
                  const isCompleted = idx < activeIndex;
                  return (
                    <button
                      key={photo.src}
                      type="button"
                      aria-label={`Jump to story ${photo.label}`}
                      onClick={() => setActiveIndex(idx)}
                      className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30 cursor-pointer"
                    >
                      {isCompleted && (
                        <span className="block h-full w-full rounded-full bg-white" />
                      )}
                      {isCurrent && (
                        <span
                          key={`progress-${activeIndex}`}
                          className="block h-full rounded-full bg-white animate-story-fill"
                          style={{
                            animationPlayState: isPaused ? "paused" : "running",
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instagram Story Header Row */}
              <div className="absolute top-7 inset-x-4 z-30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-white p-1 ring-2 ring-[#E8DED2]/80 overflow-hidden shrink-0">
                    <Image
                      src="/images/bgc-logo.png"
                      alt="b.g.c coffee co."
                      width={36}
                      height={36}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="leading-tight">
                    <p className="font-display text-xs font-semibold text-white tracking-wide">
                      b.g.c coffee co.
                    </p>
                    <p className="text-[11px] text-white/70">
                      {currentPhoto.label} / 0{IG_PHOTOS.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsManuallyPaused((p) => !p)}
                    aria-label={
                      isManuallyPaused ? "Play story" : "Pause story"
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-[#171717] cursor-pointer"
                  >
                    {isManuallyPaused ? (
                      <Play className="h-3.5 w-3.5 fill-current" />
                    ) : (
                      <Pause className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    aria-label="View full size photo"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-[#171717] cursor-pointer"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Tap Left / Right Zones (Instagram Story Interaction) */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous story"
                className="absolute inset-y-16 left-0 z-20 w-1/3 cursor-pointer focus:outline-none"
              />
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next story"
                className="absolute inset-y-16 right-0 z-20 w-1/3 cursor-pointer focus:outline-none"
              />

              {/* Visible Glass Prev / Next Buttons */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 z-30 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md ring-1 ring-white/15 transition-all hover:bg-white hover:text-[#171717] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 z-30 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md ring-1 ring-white/15 transition-all hover:bg-white hover:text-[#171717] cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Subtle Bottom Caption Pill */}
              <div className="absolute bottom-4 inset-x-4 z-30 flex items-center justify-between text-[11px] text-white/80">
                <span className="font-display tracking-wider uppercase text-[10px]">
                  brewing from our little corner
                </span>
                <span className="text-white/60 text-[10px] font-display">
                  {isPaused ? "Paused" : "Tap edges or arrows"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Editorial Brand Note Caption */}
          <div className="lg:col-span-7 flex flex-col justify-center lg:pl-4">
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[2.7rem] text-white leading-tight">
              we&apos;ll save you from disappointment —
            </h2>

            <div className="mt-5 space-y-4 text-sm sm:text-[15px] leading-relaxed text-[#E8DED2]/80 max-w-xl">
              <p>
                we&apos;re not trying to be everyone&apos;s coffee shop — simply
                trying to make a good coffee, keep it accessible and build
                community.
              </p>

              <ul className="border-y border-white/10 py-4 space-y-2 font-display text-xs sm:text-sm tracking-wide text-white/95">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#795548] font-bold">—</span>
                  <span>one coffee bean variant</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#795548] font-bold">—</span>
                  <span>no aesthetic interior</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#795548] font-bold">—</span>
                  <span>no fancy menu</span>
                </li>
              </ul>

              <p>
                just small, but we deeply care about what we serve and the
                people we serve it to.
              </p>

              <p>
                we hope to have a space of our own — a space where friends of
                bgc can chill, sit comfortably and feel at home.
              </p>

              <p>until then, we&apos;ll keep brewing from this little corner.</p>

              <p className="text-white font-medium">keep growing with us.</p>

              <p className="pt-1 font-editorial italic text-2xl text-[#E8DED2]">
                - b&amp;g ♡
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-[#171717] ring-1 ring-white/15 p-3 shadow-2xl"
          >
            <div className="mb-2.5 flex items-center justify-between px-2 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E8DED2]">
              <span>
                b.g.c coffee co. • {currentPhoto.label} / 0{IG_PHOTOS.length}
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close lightbox"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-[#171717] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative aspect-[4/5] max-h-[78vh] w-full overflow-hidden rounded-xl bg-black">
              <Image
                src={currentPhoto.src}
                alt={currentPhoto.alt}
                fill
                sizes="(max-width: 768px) 95vw, 640px"
                className="object-contain"
              />
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-white hover:text-[#171717] transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-white hover:text-[#171717] transition-colors cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
