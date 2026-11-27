import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CoffeeSteamCanvas } from "@/components/ui/CoffeeSteamCanvas";
import { IcedCoffeeModelViewer } from "@/components/ui/IcedCoffeeModelViewer";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-paper-grain border-b border-[#171717] text-[#171717]">
      <CoffeeSteamCanvas ribbonCount={7} />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Editorial Issue Metadata Row */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-2 border-b border-[#171717] pb-3 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-[#171717]/75">
          <span>VOL. 01 — BGC COFFEE CO.</span>
          <span className="text-[#795548]">SPECIALTY BREWS &amp; DAILY PICKUP</span>
          <span className="hidden sm:inline">101% HANDCRAFTED BEANS</span>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Editorial Typography Column */}
          <div className="lg:col-span-7">
            <h1 className="font-editorial text-5xl leading-[0.98] tracking-tight text-[#171717] sm:text-6xl lg:text-[5.25rem]">
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
          </div>

          {/* Right Frameless Interactive 3D Coffee Column */}
          <div className="lg:col-span-5 relative">
            <IcedCoffeeModelViewer modelUrl="/models/iced-coffee.glb" />
          </div>
        </div>
      </div>
    </section>
  );
}
