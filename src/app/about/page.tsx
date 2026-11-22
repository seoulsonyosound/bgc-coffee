import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover the story, coffee philosophy, and mission behind BGC Coffee Co.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Editorial Header */}
      <section className="bg-paper-grain text-[#171717] py-16 sm:py-20 border-b border-[#171717]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="font-display text-xs font-bold uppercase tracking-[0.24em] text-[#795548]">
            Editorial Story • b.g.c coffee co.
          </p>
          <h1 className="mt-3 font-editorial text-5xl text-[#171717] sm:text-6xl max-w-3xl leading-[1.03]">
            A Little Comfort in Every Cup.{" "}
            <span className="italic text-[#795548]">Brewed Daily.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#171717]/75">
            BGC Coffee Co. brings together specialty-grade beans, nostalgic café
            warmth, and seamless online pickup ordering so great coffee fits
            effortlessly into your day.
          </p>
        </div>
      </section>

      {/* Brand Story + Framed Photo */}
      <section className="py-16 sm:py-24 border-b border-[#171717]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="border border-[#171717] bg-[#F7F4EE] p-3 vintage-shadow">
              <div className="relative aspect-[4/3] overflow-hidden border border-[#171717] bg-[#E8DED2]">
                <Image
                  src="/images/about-craft.jpg"
                  alt="BGC Coffee Co. barista crafting espresso"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover contrast-[1.04] sepia-[0.08]"
                />
              </div>
              <div className="mt-3 flex items-center justify-between font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-[#171717]/75">
                <span>ARCHIVE PHOTO — ESPRESSO BAR</span>
                <span className="text-[#795548]">CRAFTED IN SMALL BATCHES</span>
              </div>
            </div>

            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#795548]">
                The BGC Philosophy
              </p>
              <h2 className="mt-2 font-editorial text-4xl text-[#171717] sm:text-5xl">
                Quality Coffee Without the Pretense
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#171717]/80">
                We started BGC Coffee Co. around a straightforward conviction:
                exceptional coffee shouldn&apos;t require waiting half an hour
                or feeling intimidating. Every shot we pull is calibrated for
                clarity, sweetness, and consistency—whether served black over
                clear ice or layered with velvety milk.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#171717]/80">
                By pairing hands-on barista craft with a clean online pickup
                workflow, our customers spend less time queuing and more time
                enjoying their favorite cup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Placeholders */}
      <section className="bg-paper-grain py-16 sm:py-20 border-b border-[#171717]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="border border-[#171717] bg-white p-8 sm:p-10 vintage-shadow-sm">
              <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#795548]">
                01 / Our Mission
              </p>
              <h3 className="mt-3 font-editorial text-3xl text-[#171717]">
                Mission Statement
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[#171717]/80">
                [Mission Placeholder] To deliver consistently crafted specialty
                coffee and warm, reliable pickup service that elevates everyday
                routines for professionals, students, and coffee enthusiasts.
              </p>
            </div>

            <div className="border border-[#171717] bg-[#3B2923] p-8 sm:p-10 text-[#F7F4EE] vintage-shadow-sm">
              <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#E8DED2]">
                02 / Our Vision
              </p>
              <h3 className="mt-3 font-editorial text-3xl text-white">
                Vision Statement
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[#E8DED2]/85">
                [Vision Placeholder] To become a beloved independent Philippine
                coffee brand recognized for approachable specialty beverages,
                distinctive creative identity, and cloud-resilient operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality & Experience Pillars */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#795548]">
              What Sets Us Apart
            </p>
            <h2 className="mt-2 font-editorial text-4xl text-[#171717]">
              Crafted Around Your Daily Ritual
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                num: "NO. 01",
                title: "Selected Arabica Beans",
                desc: "Medium-dark house roasts chosen for chocolatey body, caramel sweetness, and smooth finish in both iced and hot drinks.",
              },
              {
                num: "NO. 02",
                title: "Calibrated Consistency",
                desc: "Every espresso shot, matcha whisk, and milk pour follows disciplined recipes so your favorite drink tastes right every time.",
              },
              {
                num: "NO. 03",
                title: "Effortless Pickup",
                desc: "Browse, customize, and place your Cash on Pickup order online so our baristas can prepare your cup ahead of arrival.",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="border border-[#171717] bg-[#F7F4EE] p-7"
              >
                <span className="font-display text-xs font-bold tracking-[0.2em] text-[#795548]">
                  {item.num}
                </span>
                <h3 className="mt-3 font-editorial text-2xl text-[#171717]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#171717]/75">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 border border-[#171717] bg-[#171717] px-8 py-4 font-display text-xs font-bold uppercase tracking-[0.16em] text-white vintage-shadow-sm hover:bg-[#795548] hover:border-[#795548] transition-colors"
            >
              Explore Our Menu
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
