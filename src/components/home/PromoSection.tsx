import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function PromoSection() {
  return (
    <section className="bg-[#3B2923] text-[#F7F4EE] py-20 sm:py-24 border-b border-[#171717]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 border border-[#E8DED2]/30 bg-[#171717] lg:grid-cols-2">
          {/* Framed Editorial Image Half */}
          <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-full border-b lg:border-b-0 lg:border-r border-[#E8DED2]/25">
            <Image
              src="/images/promo-signature.jpg"
              alt="BGC Coffee Co. Signature Spanish Latte and Ceremonial Matcha Latte"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover contrast-[1.04] sepia-[0.06]"
            />
            <div className="absolute bottom-4 left-4 border border-[#171717] bg-[#F7F4EE] px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-[#171717]">
              FIG. 02 — SIGNATURE PAIRING
            </div>
          </div>

          {/* Editorial Copy Half */}
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <span className="inline-block w-fit border border-[#E8DED2]/40 bg-[#3B2923] px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E8DED2]">
              House Feature • Special Edition
            </span>

            <h2 className="mt-5 font-editorial text-4xl text-white sm:text-5xl leading-[1.05]">
              Two Icons.
              <br />
              <span className="italic text-[#E8DED2]">One Daily Ritual.</span>
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-[#E8DED2]/80 sm:text-base">
              Meet our most-loved duo: the velvety{" "}
              <strong className="text-white font-semibold">
                Salted Spanish Oat Latte
              </strong>{" "}
              crafted with double espresso and oat milk, and our classic{" "}
              <strong className="text-white font-semibold">Matcha Latte</strong>.
              Customize with milk subs and add-ons on any order.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 border-y border-white/15 py-5">
              <div>
                <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[#E8DED2]/65">
                  Salted Spanish Oat Latte
                </p>
                <p className="mt-1 font-display text-xl font-bold text-white">
                  ₱100.00
                </p>
              </div>
              <div>
                <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[#E8DED2]/65">
                  Matcha Latte
                </p>
                <p className="mt-1 font-display text-xl font-bold text-white">
                  ₱100.00
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/menu/salted-spanish-oat-latte"
                className="inline-flex items-center gap-2 border border-white bg-white px-6 py-3.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-[#171717] transition-colors hover:bg-[#E8DED2]"
              >
                Order Spanish Oat Latte
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/menu/matcha-latte"
                className="inline-flex items-center gap-2 border border-[#E8DED2]/45 px-6 py-3.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-[#F7F4EE] transition-colors hover:border-white hover:bg-[#795548]"
              >
                Try Matcha Latte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
