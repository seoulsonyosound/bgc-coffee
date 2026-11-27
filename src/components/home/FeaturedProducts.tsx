"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadFeatured() {
      try {
        const res = await fetch("/api/products?featured=true");
        if (!res.ok) throw new Error("Failed to fetch featured products");
        const data = await res.json();
        if (active && Array.isArray(data.products)) {
          setProducts(data.products.slice(0, 4));
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadFeatured();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="bg-white py-20 sm:py-24 border-b border-[#171717]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 border-b border-[#171717] pb-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-editorial text-4xl text-[#171717] sm:text-5xl">
              Featured Brews
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#171717]/70">
              Our most-ordered house favorites—crafted daily with signature
              espresso and ready to add to your pickup bag.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 border border-[#171717] bg-[#F7F4EE] px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-[#171717] hover:bg-[#171717] hover:text-white transition-colors"
          >
            View Full Menu
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((skeleton) => (
              <div
                key={skeleton}
                className="border border-[#171717]/20 bg-[#F7F4EE]"
              >
                <div className="aspect-square w-full animate-pulse bg-[#E8DED2]" />
                <div className="p-5 space-y-3 bg-white">
                  <div className="h-5 w-2/3 animate-pulse bg-[#E8DED2]" />
                  <div className="h-4 w-full animate-pulse bg-[#F7F4EE]" />
                  <div className="h-9 w-full animate-pulse bg-[#E8DED2] mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="mt-10 border border-[#171717] bg-[#F7F4EE] p-10 text-center">
            <p className="text-sm text-[#171717]/75">
              No featured drinks are currently highlighted. Browse our complete
              menu instead.
            </p>
            <Link
              href="/menu"
              className="mt-4 inline-flex items-center gap-2 border border-[#171717] bg-[#171717] px-6 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-white"
            >
              Go to Menu
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
