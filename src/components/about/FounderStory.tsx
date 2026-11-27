import Image from "next/image";

export function FounderStory() {
  return (
    <section
      id="founder-story"
      className="scroll-mt-24 bg-white text-[#171717] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: Story Copy */}
          <div className="lg:col-span-6">
            <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#795548]">
              THE STORY OF GELO
            </p>

            <h2 className="mt-3 font-editorial text-4xl leading-[1.06] text-[#171717] sm:text-5xl">
              From a Barista&apos;s Dream to a{" "}
              <span className="italic text-[#795548]">Coffee Brand.</span>
            </h2>

            <div className="mt-7 space-y-5 text-base leading-relaxed text-[#171717]/80">
              <p className="text-lg font-medium text-[#171717]">
                BGC Coffee Co. began with a simple passion: the love of making
                coffee.
              </p>

              <p>
                For its founder, Gelo, coffee was more than just a drink. His
                journey started with his first job as a barista in Makati, where
                he developed his skills and appreciation for the craft. His
                experience later took him overseas to Singapore, where he worked
                in different roles as a server, barista, and bartender.
              </p>

              <div className="border border-[#171717]/20 border-l-2 border-l-[#795548] bg-[#F7F4EE] px-5 py-4">
                <p className="font-editorial italic text-xl leading-snug text-[#3B2923]">
                  Even before these experiences, he had already dreamed of
                  starting his own coffee business back in 2013.
                </p>
              </div>

              <p>
                After returning to the Philippines due to unforeseen
                circumstances, he decided to turn that long-time dream into
                something real. What began as a way to support everyday needs
                eventually became an opportunity to pursue what he genuinely
                loved: creating coffee.
              </p>
            </div>
          </div>

          {/* Right: Full-Size Uncropped Vintage Photograph */}
          <div className="lg:col-span-6">
            <div className="overflow-hidden border border-[#171717] bg-[#E8DED2] vintage-shadow">
              <Image
                src="/images/others/kuyag2.jpg"
                alt="Gelo, founder of BGC Coffee Co."
                width={1200}
                height={1600}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="block h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
