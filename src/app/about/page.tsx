import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { FounderStory } from "@/components/about/FounderStory";
import { BrandNameStory } from "@/components/about/BrandNameStory";
import { CoffeePhilosophy } from "@/components/about/CoffeePhilosophy";
import { ClosingStatement } from "@/components/about/ClosingStatement";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Not just another cup of coffee. Discover the story of Gelo, Beverly, and BGC Coffee Co. — a dream since 2013, brewed with passion and crafted differently.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#F7F4EE]">
      <AboutHero />
      <FounderStory />
      <BrandNameStory />
      <CoffeePhilosophy />
      <ClosingStatement />
    </div>
  );
}
