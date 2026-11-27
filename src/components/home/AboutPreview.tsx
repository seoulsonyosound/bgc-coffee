import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReelPlayer } from "@/components/ui/ReelPlayer";

const PILLARS = [
  {
    num: "01",
    text: "101% Handcrafted Beans roasted for clean caramel and dark cocoa balance.",
  },
  {
    num: "02",
    text: "Calibrated espresso extraction for consistency across every single cup.",
  },
  {
    num: "03",
    text: "Simple online pickup ordering designed for busy mornings and slow afternoons.",
  },
];

export function AboutPreview() {
  return (
    <section className="relative overflow-hidden bg-paper-grain py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Copy */}
          <div className="lg:col-span-6">
            <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#795548]">
              Editorial Note • About b.g.c coffee co.
            </p>
            <h2 className="mt-3 font-editorial text-4xl text-[#171717] sm:text-5xl leading-[1.06]">
              Nostalgic Coffee Craft,{" "}
              <span className="italic text-[#795548]">Without the Pretense.</span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[#171717]/80 sm:text-base">
              BGC Coffee Co. was built around a comforting idea: great specialty
              coffee should feel warm, familiar, and effortless to enjoy every
              single day. From your first crisp Iced Americano to an afternoon
              Spanish Latte, we brew every cup to order.
            </p>

            <ul className="mt-7 divide-y divide-[#171717]/15 border-y border-[#171717]/20">
              {PILLARS.map((pillar) => (
                <li
                  key={pillar.num}
                  className="flex items-start gap-4 py-3.5 text-sm text-[#171717]/85"
                >
                  <span className="font-display text-xs font-bold text-[#795548] pt-0.5">
                    {pillar.num}
                  </span>
                  <span>{pillar.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border border-[#171717] bg-[#171717] px-7 py-3.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-white vintage-shadow-sm transition-all hover:bg-[#795548] hover:border-[#795548]"
              >
                Read Our Story
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-[#171717]/55">
                FRESHLY PULLED DAILY
              </span>
            </div>
          </div>

          {/* Layered Editorial Collage Around BGC Bar Reel */}
          <div className="lg:col-span-6 relative flex justify-center py-8 sm:px-16">
            <div className="relative w-full max-w-[330px]">
              {/* Architectural Corner Registration Marks (Upper-Left & Lower-Right) */}
              <span
                aria-hidden="true"
                className="hidden sm:block pointer-events-none absolute -top-5 -left-5 h-6 w-6 border-t-2 border-l-2 border-[#795548]/70"
              />
              <span
                aria-hidden="true"
                className="hidden sm:block pointer-events-none absolute -bottom-5 -right-5 h-6 w-6 border-b-2 border-r-2 border-[#795548]/70"
              />

              {/* Offset Vintage Paper Mat Behind the Reel */}
              <div
                aria-hidden="true"
                className="hidden sm:block pointer-events-none absolute -inset-x-5 inset-y-5 -rotate-2 border border-[#171717]/25 bg-[#E8DED2]/70"
              />

              {/* Upper-Left Aesthetic Barista Brew Log Card (sits cleanly off the upper-left corner) */}
              <div className="hidden sm:block pointer-events-none absolute right-[calc(100%-18px)] -top-4 z-20 w-44 -rotate-3 border border-[#171717] bg-[#F7F4EE] px-3.5 py-3 shadow-[3px_3px_0px_#171717]">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-[9px] font-bold uppercase tracking-[0.2em] text-[#795548]">
                    Daily Brew Log
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#795548]" />
                </div>
                <p className="mt-1.5 font-editorial italic text-sm leading-snug text-[#171717]">
                  p.s hindi ito sa taguig
                </p>
                <div className="mt-2 border-t border-dashed border-[#171717]/25 pt-1.5 flex items-center justify-between font-display text-[8px] font-semibold uppercase tracking-[0.16em] text-[#171717]/60">
                  <span>18g Dose</span>
                  <span>9 Bar</span>
                </div>
              </div>

              {/* Lower-Right Aesthetic Espresso Stamp Card (sits cleanly off the lower-right corner) */}
              <div className="hidden sm:block pointer-events-none absolute left-[calc(100%-18px)] -bottom-4 z-20 w-44 rotate-2 border border-[#171717] bg-[#3B2923] px-3.5 py-3 text-[#F7F4EE] shadow-[3px_3px_0px_#795548]">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-[9px] font-bold uppercase tracking-[0.2em] text-[#E8DED2]">
                    101% Handcrafted Beans
                  </span>
                  <span className="font-display text-[8px] uppercase tracking-[0.14em] text-[#E8DED2]/60">
                    No. 01
                  </span>
                </div>
                <p className="mt-1 font-editorial text-base leading-tight text-white">
                  Counter Pickup
                </p>
                <p className="mt-1.5 border-t border-dashed border-[#E8DED2]/25 pt-1.5 font-display text-[8px] font-semibold uppercase tracking-[0.16em] text-[#E8DED2]/80">
                  Skip the Line • Fresh Pour
                </p>
              </div>

              {/* Vertical Editorial Margin Caption */}
              <span
                aria-hidden="true"
                className="hidden xl:block pointer-events-none absolute -right-10 top-6 origin-top-left rotate-90 font-display text-[9px] font-bold uppercase tracking-[0.26em] text-[#171717]/40 whitespace-nowrap"
              >
                BGC COFFEE CO. — BAR ARCHIVE
              </span>

              <div className="relative z-10">
                <ReelPlayer
                  src="/videos/bgc_reel.mp4"
                  captionLeft="REEL 01 — BEHIND THE BAR"
                  captionRight="WE ARE OPEN"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
