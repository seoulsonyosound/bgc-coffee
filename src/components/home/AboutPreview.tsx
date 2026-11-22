import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const PILLARS = [
  {
    num: "01",
    text: "Specialty-grade Arabica beans roasted for clean caramel and dark cocoa balance.",
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
    <section className="bg-paper-grain py-20 sm:py-24">
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

            <div className="mt-8">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border border-[#171717] bg-[#171717] px-7 py-3.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-white vintage-shadow-sm transition-all hover:bg-[#795548] hover:border-[#795548]"
              >
                Read Our Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Framed Photography */}
          <div className="lg:col-span-6 relative">
            <div className="border border-[#171717] bg-white p-3 vintage-shadow">
              <div className="relative aspect-[4/3] overflow-hidden border border-[#171717] bg-[#E8DED2]">
                <Image
                  src="/images/about-craft.jpg"
                  alt="Barista crafting latte art at BGC Coffee Co."
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover contrast-[1.04] sepia-[0.08]"
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-[#171717]/75">
                <span>FIG. 03 — SMALL-BATCH POUR</span>
                <span className="text-[#795548]">MADE TO ORDER AT COUNTER</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
