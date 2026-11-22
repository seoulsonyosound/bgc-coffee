import type { Metadata } from "next";
import { MenuBrowser } from "@/components/products/MenuBrowser";

export const metadata: Metadata = {
  title: "Coffee Menu",
  description:
    "Explore BGC Coffee Co.'s handcrafted espresso, iced coffee, matcha, cold brew, and specialty drinks available for pickup.",
};

export default function MenuPage() {
  return (
    <div className="bg-white">
      {/* Vintage Catalog Header Banner */}
      <section className="bg-paper-grain text-[#171717] py-14 sm:py-18 border-b border-[#171717]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.24em] text-[#795548]">
                Catalog Index • Handcrafted Beverages
              </p>
              <h1 className="mt-2 font-editorial text-5xl text-[#171717] sm:text-6xl">
                The Coffee Menu
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#171717]/75 sm:text-base">
                Freshly pulled espresso, chilled signature lattes, and
                non-coffee favorites—priced in Philippine Pesos (₱) and made
                fresh for counter pickup.
              </p>
            </div>
            <div className="inline-block w-fit border border-[#171717] bg-white px-4 py-2 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-[#171717]">
              Cash on Pickup Only
            </div>
          </div>
        </div>
      </section>

      <MenuBrowser />
    </div>
  );
}
