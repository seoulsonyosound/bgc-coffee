import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoSection } from "@/components/home/PromoSection";
import { AboutPreview } from "@/components/home/AboutPreview";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <PromoSection />
      <AboutPreview />
    </>
  );
}
