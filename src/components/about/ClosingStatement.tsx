import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ClosingStatement() {
  return (
    <section className="bg-[#F7F4EE] text-[#171717] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="border border-[#171717] bg-white px-6 py-14 text-center sm:px-14 sm:py-20 vintage-shadow">
          {/* Official BGC Coffee Co. Logo */}
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#171717] bg-white p-2.5 shadow-[3px_3px_0px_#795548]">
            <Image
              src="/images/bgc-logo.png"
              alt="b.g.c coffee co. official logo"
              width={76}
              height={76}
              className="h-full w-full object-contain"
            />
          </div>

          <h2 className="mt-7 font-editorial text-3xl text-[#171717] sm:text-4xl">
            Every Cup Has a Story.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#171717]/75">
            From a dream that began in 2013 to a coffee brand built through
            passion, experience, and perseverance, BGC Coffee Co. continues to
            bring its own character to every cup.
          </p>

          {/* Main Visual Focus: Brand Tagline */}
          <p className="mx-auto mt-9 max-w-3xl font-editorial text-4xl leading-[1.06] tracking-tight text-[#171717] sm:text-5xl lg:text-6xl">
            Brewed with Passion.{" "}
            <span className="italic text-[#795548]">Crafted Differently.</span>
          </p>

          {/* Primary CTA to Existing Menu Page */}
          <div className="mt-10">
            <Link
              href="/menu"
              className="editorial-press inline-flex items-center gap-2.5 border border-[#171717] bg-[#171717] px-9 py-4 font-display text-xs font-bold uppercase tracking-[0.2em] text-white vintage-shadow-sm hover:bg-[#795548] hover:border-[#795548]"
            >
              EXPLORE OUR MENU
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
