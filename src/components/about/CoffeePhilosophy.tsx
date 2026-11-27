import { ReelPlayer } from "@/components/ui/ReelPlayer";

const PHILOSOPHY_PHRASES = [
  { num: "01", phrase: "Crafted Differently" },
  { num: "02", phrase: "Beyond the Usual Brew" },
  { num: "03", phrase: "A Distinct Character in Every Cup" },
];

export function CoffeePhilosophy() {
  return (
    <section
      id="philosophy"
      className="scroll-mt-24 bg-[#171717] text-[#F7F4EE] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: Clean Editorial Philosophy Copy */}
          <div className="lg:col-span-6">
            <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#E8DED2]/70">
              OUR COFFEE PHILOSOPHY
            </p>

            <h2 className="mt-3 font-editorial text-4xl leading-[1.04] text-white sm:text-5xl lg:text-6xl">
              Beyond the{" "}
              <span className="italic text-[#E8DED2]">Usual Brew.</span>
            </h2>

            <div className="mt-7 space-y-5 text-base leading-relaxed text-[#E8DED2]/80">
              <p className="text-lg font-medium text-white">
                At BGC Coffee Co., coffee is an opportunity to explore,
                experiment, and create something different.
              </p>

              <p>
                Gelo believes in going beyond the usual approach. While many
                coffee shops follow familiar practices, he enjoys experimenting
                with coffee and developing a distinctive character for every
                cup.
              </p>

              <p>
                The coffee-making process is handcrafted and guided by his own
                approach. Although the exact process remains a closely kept
                secret, one thing is certain: BGC Coffee Co. takes pride in
                doing things differently.
              </p>
            </div>
          </div>

          {/* Right: BGC Coffee Reel */}
          <div className="lg:col-span-6 flex justify-center">
            <ReelPlayer
              src="/videos/bgc-reel2.mp4"
              captionLeft="REEL 02 — CRAFTED DIFFERENTLY"
              captionRight="BGC COFFEE CO."
            />
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {PHILOSOPHY_PHRASES.map((item) => (
            <div
              key={item.num}
              className="border border-[#E8DED2]/25 bg-[#3B2923]/65 p-6 sm:p-7 transition-colors hover:border-[#E8DED2]/60 hover:bg-[#3B2923]"
            >
              <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E8DED2]/65">
                {item.num}
              </span>
              <p className="mt-3 font-editorial text-2xl leading-snug text-white">
                {item.phrase}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
