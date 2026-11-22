import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CoffeeSteamCanvas } from "@/components/ui/CoffeeSteamCanvas";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-paper-grain border-b border-[#171717] text-[#171717]">
      <CoffeeSteamCanvas ribbonCount={7} />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Editorial Issue Metadata Row */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-2 border-b border-[#171717] pb-3 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-[#171717]/75">
          <span>VOL. 01 — BGC COFFEE CO.</span>
          <span className="text-[#795548]">SPECIALTY BREWS &amp; DAILY PICKUP</span>
          <span className="hidden sm:inline">100% ARABICA ROAST</span>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Editorial Typography Column */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 border border-[#171717] bg-white px-3.5 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-[#171717]">
              <span className="h-2 w-2 rounded-full bg-[#795548]" />
              Vintage Coffee Culture • Order Ahead
            </div>

            <h1 className="mt-6 font-editorial text-5xl leading-[0.98] tracking-tight text-[#171717] sm:text-6xl lg:text-[5.25rem]">
              GOOD COFFEE.
              <br />
              <span className="italic text-[#795548]">GOOD MOOD.</span>
              <br />
              GOOD DAYS.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-[#171717]/80 sm:text-lg">
              A little comfort in every cup. Welcome to{" "}
              <span className="font-semibold text-[#171717]">
                BGC Coffee Co.
              </span>{" "}
              — freshly pulled espresso, chilled signature lattes, and
              ceremonial matcha made to order for counter pickup.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2.5 border border-[#171717] bg-[#171717] px-7 py-4 font-display text-xs font-bold uppercase tracking-[0.18em] text-white vintage-shadow-sm transition-all hover:bg-[#795548] hover:border-[#795548] hover:-translate-y-0.5"
              >
                Order Now
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/menu#catalog"
                className="inline-flex items-center gap-2 border border-[#171717] bg-white px-7 py-4 font-display text-xs font-bold uppercase tracking-[0.18em] text-[#171717] transition-all hover:bg-[#E8DED2]"
              >
                Explore Menu
              </Link>
            </div>

            {/* Minimal Editorial Spec Strip */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-[#171717]/25 pt-6">
              <div>
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-[#795548]">
                  01 / Roast
                </p>
                <p className="mt-1 font-editorial text-lg text-[#171717]">
                  100% Arabica
                </p>
              </div>
              <div>
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-[#795548]">
                  02 / Service
                </p>
                <p className="mt-1 font-editorial text-lg text-[#171717]">
                  Skip the Line
                </p>
              </div>
              <div>
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-[#795548]">
                  03 / Payment
                </p>
                <p className="mt-1 font-editorial text-lg text-[#171717]">
                  Cash on Pickup
                </p>
              </div>
            </div>
          </div>

          {/* Right Framed Vintage Photography Column */}
          <div className="lg:col-span-5 relative">
            {/* Retro Circular Official Logo Stamp */}
            <div
              className="hidden sm:flex absolute -top-7 -right-5 z-10 h-28 w-28 flex-col items-center justify-center rounded-full border-2 border-[#171717] bg-white p-2.5 text-center shadow-[3px_3px_0px_#795548] rotate-[8deg]"
            >
              <Image
                src="/images/bgc-logo.png"
                alt="b.g.c coffee co. logo stamp"
                width={64}
                height={64}
                className="h-14 w-14 object-contain"
              />
              <span className="mt-0.5 font-display text-[8px] font-bold uppercase tracking-[0.16em] text-[#171717]">
                b.g.c coffee co.
              </span>
            </div>

            <div className="border border-[#171717] bg-white p-3 vintage-shadow">
              <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#171717] bg-[#3B2923]">
                <Image
                  src="/images/hero-coffee.jpg"
                  alt="Freshly poured iced espresso latte at BGC Coffee Co."
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-center contrast-[1.06] sepia-[0.08]"
                />
              </div>
              <div className="mt-3 flex items-center justify-between font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-[#171717]/75">
                <span>FIG. 01 — ICED HOUSE ESPRESSO</span>
                <span className="text-[#795548]">FRESHLY PULLED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
