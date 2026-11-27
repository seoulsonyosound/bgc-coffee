"use client";

import { useState } from "react";
import Image from "next/image";
import { RotateCw } from "lucide-react";

interface MonogramCardProps {
  eyebrow: string;
  initial: string;
  italicInitial?: boolean;
  name: string;
  role: string;
  imageSrc: string;
  imageAlt: string;
  instagramHandle: string;
  instagramUrl: string;
  variant: "light" | "dark";
}

function FlipMonogramCard({
  eyebrow,
  initial,
  italicInitial = false,
  name,
  role,
  imageSrc,
  imageAlt,
  instagramHandle,
  instagramUrl,
  variant,
}: MonogramCardProps) {
  const [flipped, setFlipped] = useState(false);
  const isDark = variant === "dark";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={
        flipped
          ? `${name} photo card — click to flip back`
          : `${name} monogram card — click to reveal photo and Instagram`
      }
      onClick={() => setFlipped((prev) => !prev)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((prev) => !prev);
        }
      }}
      className="lg:col-span-3 min-h-[350px] sm:min-h-[370px] cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#795548]"
      style={{ perspective: "1100px" }}
    >
      <div
        className="relative h-full w-full transition-transform duration-500 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Face: Monogram */}
        <div
          className={`absolute inset-0 flex flex-col justify-between border border-[#171717] p-7 vintage-shadow-sm ${
            isDark
              ? "bg-[#3B2923] text-[#F7F4EE]"
              : "bg-white text-[#171717]"
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className={`font-display text-[10px] font-bold uppercase tracking-[0.22em] ${
                isDark ? "text-[#E8DED2]/75" : "text-[#795548]"
              }`}
            >
              {eyebrow}
            </span>
            <span
              className={`inline-flex items-center gap-1 font-display text-[9px] font-semibold uppercase tracking-[0.16em] ${
                isDark ? "text-[#E8DED2]/60" : "text-[#171717]/45"
              }`}
            >
              <RotateCw className="h-3 w-3" />
              Flip
            </span>
          </div>

          <span
            className={`my-6 font-editorial text-8xl sm:text-9xl leading-none ${
              italicInitial ? "italic" : ""
            } ${isDark ? "text-white" : "text-[#171717]"}`}
          >
            {initial}
          </span>

          <div>
            <p
              className={`font-editorial text-2xl ${
                isDark ? "text-white" : "text-[#171717]"
              }`}
            >
              {name}
            </p>
            <p
              className={`mt-0.5 text-xs ${
                isDark ? "text-[#E8DED2]/75" : "text-[#171717]/60"
              }`}
            >
              {role}
            </p>
          </div>
        </div>

        {/* Back Face: Portrait Photo & Instagram */}
        <div
          className="absolute inset-0 flex flex-col overflow-hidden border border-[#171717] bg-[#171717] vintage-shadow-sm"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="relative flex-1 w-full bg-[#3B2923]">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 25vw"
              className="object-cover object-center"
            />
          </div>

          <div
            className={`border-t border-[#171717] px-4 py-3.5 ${
              isDark
                ? "bg-[#3B2923] text-[#F7F4EE]"
                : "bg-white text-[#171717]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p
                className={`font-editorial text-lg leading-tight ${
                  isDark ? "text-white" : "text-[#171717]"
                }`}
              >
                {name}
              </p>
              <span
                className={`inline-flex items-center gap-1 font-display text-[9px] font-semibold uppercase tracking-[0.14em] ${
                  isDark ? "text-[#E8DED2]/65" : "text-[#171717]/50"
                }`}
              >
                <RotateCw className="h-2.5 w-2.5" />
                Back
              </span>
            </div>
            <p
              className={`mt-1 text-xs ${
                isDark ? "text-[#E8DED2]/85" : "text-[#171717]/80"
              }`}
            >
              Instagram:{" "}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`font-semibold underline underline-offset-4 transition-colors ${
                  isDark
                    ? "text-white hover:text-[#E8DED2]"
                    : "text-[#795548] hover:text-[#171717]"
                }`}
              >
                {instagramHandle}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BrandNameStory() {
  return (
    <section
      id="the-name"
      className="scroll-mt-24 bg-[#F7F4EE] text-[#171717] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-2xl">
          <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#795548]">
            B = BEVERLY · G = GELO
          </p>
          <h2 className="mt-3 font-editorial text-4xl leading-[1.06] text-[#171717] sm:text-5xl">
            A Name Built on{" "}
            <span className="italic text-[#795548]">Two People.</span>
          </h2>
        </div>

        {/* Bento Monogram & Story Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* B — Beverly Interactive Flip Card */}
          <FlipMonogramCard
            eyebrow="B · BEVERLY"
            initial="B"
            name="Beverly"
            role="The Founder's Wife"
            imageSrc="/images/others/ateb.jpg"
            imageAlt="Beverly of BGC Coffee Co."
            instagramHandle="@bebehushush"
            instagramUrl="https://instagram.com/bebehushush"
            variant="light"
          />

          {/* G — Gelo Interactive Flip Card */}
          <FlipMonogramCard
            eyebrow="G · GELO"
            initial="G"
            italicInitial
            name="Gelo"
            role="The Founder"
            imageSrc="/images/others/kuyag.jpg"
            imageAlt="Gelo, founder of BGC Coffee Co."
            instagramHandle="@mr.change_me"
            instagramUrl="https://instagram.com/mr.change_me"
            variant="dark"
          />

          {/* Story Card */}
          <div className="lg:col-span-6 flex flex-col justify-center border border-[#171717] bg-[#E8DED2]/65 p-8 sm:p-10 vintage-shadow-sm">
            <div className="space-y-5 text-base leading-relaxed text-[#171717]/80">
              <p className="font-editorial text-2xl leading-snug text-[#171717]">
                Behind the name BGC is a personal story.
              </p>

              <p>
                The letters come from the initials of the people behind the
                brand: Beverly, the founder&apos;s wife, and Gelo, the founder
                himself. What started as a simple way to name their coffee
                business became a meaningful representation of their shared
                journey.
              </p>

              <p>
                BGC Coffee Co. is more than just a business name. It carries a
                personal connection and the story of two people who became part
                of one coffee journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
