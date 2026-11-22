"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Coffee, X } from "lucide-react";
import {
  PRODUCT_CATEGORIES,
  Product,
  ProductCategory,
} from "@/types/product";
import { ADD_ON_OPTIONS, MILK_SUB_OPTIONS } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { cn, formatPHP } from "@/lib/utils";

type CategoryFilter = "All" | ProductCategory;

export function MenuBrowser() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Unable to load coffee menu.");
        const data = await res.json();
        if (active && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Failed to load menu."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory !== "All" && product.category !== selectedCategory) {
        return false;
      }
      if (showAvailableOnly && !product.available) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matches =
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          (product.tastingNotes &&
            product.tastingNotes.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery, showAvailableOnly]);

  const categories: CategoryFilter[] = ["All", ...PRODUCT_CATEGORIES];

  return (
    <div id="catalog" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Vintage Catalog Search & Category Toolbar */}
      <div className="flex flex-col gap-5 border border-[#171717] bg-[#F7F4EE] p-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#171717]/50" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drinks, flavors, or tasting notes..."
              aria-label="Search coffee menu"
              className="w-full border border-[#171717] bg-white py-2.5 pl-10 pr-10 text-sm text-[#171717] placeholder:text-[#171717]/45 focus:border-[#795548] focus:outline-none focus:ring-1 focus:ring-[#795548]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#171717]/55 hover:text-[#171717]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Availability Toggle */}
          <label className="inline-flex items-center gap-2.5 font-display text-xs font-semibold uppercase tracking-[0.14em] text-[#171717] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
              className="h-4 w-4 border-[#171717] accent-[#795548]"
            />
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#795548]" />
            <span>In-stock only</span>
          </label>
        </div>

        {/* Vintage Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Coffee categories"
          className="flex flex-wrap gap-2 pt-3 border-t border-[#171717]/20"
        >
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "border px-4 py-2 font-display text-[11px] font-bold uppercase tracking-[0.16em] transition-all cursor-pointer",
                  active
                    ? "border-[#171717] bg-[#171717] text-white"
                    : "border-[#171717]/30 bg-white text-[#171717] hover:border-[#795548] hover:text-[#795548]"
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="mt-8 flex items-center justify-between border-b border-[#D9D9D9] pb-3 font-display text-xs uppercase tracking-[0.14em] text-[#171717]/70">
        <p>
          Showing{" "}
          <span className="font-bold text-[#171717]">
            {filteredProducts.length}
          </span>{" "}
          {filteredProducts.length === 1 ? "drink" : "drinks"}
          {selectedCategory !== "All" && (
            <>
              {" "}
              / <span className="font-bold text-[#795548]">{selectedCategory}</span>
            </>
          )}
        </p>
        {(selectedCategory !== "All" || searchQuery || showAvailableOnly) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              setShowAvailableOnly(false);
            }}
            className="font-bold text-[#795548] hover:underline underline-offset-4 cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Product Grid / States */}
      {error ? (
        <div className="mt-10 border border-[#171717] bg-[#F7F4EE] p-8 text-center">
          <p className="text-sm font-medium text-[#3B2923]">{error}</p>
        </div>
      ) : loading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="border border-[#171717]/20 bg-white">
              <div className="aspect-square w-full animate-pulse bg-[#E8DED2]" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-2/3 animate-pulse bg-[#E8DED2]" />
                <div className="h-4 w-full animate-pulse bg-[#F7F4EE]" />
                <div className="h-9 w-full animate-pulse bg-[#E8DED2]" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center border border-[#171717] bg-[#F7F4EE] px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center border border-[#171717] bg-white text-[#171717]">
            <Coffee className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-editorial text-2xl text-[#171717]">
            No drinks matched your search
          </h3>
          <p className="mt-2 max-w-md text-sm text-[#171717]/70">
            Try clearing your search keyword or switching to a different coffee
            category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              setShowAvailableOnly(false);
            }}
            className="mt-6 border border-[#171717] bg-[#171717] px-6 py-2.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-[#795548] hover:border-[#795548] transition-colors cursor-pointer"
          >
            Show All Drinks
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* SUB & ADD-ON Price Guide */}
      <div className="mt-16 grid grid-cols-1 gap-6 border-t border-[#171717] pt-12 md:grid-cols-3">
        <div className="border border-[#171717] bg-[#F7F4EE] p-6">
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-[#795548]">
            Milk Substitutions
          </p>
          <h2 className="mt-1 font-editorial text-2xl text-[#171717]">Sub</h2>
          <ul className="mt-4 divide-y divide-[#171717]/15 text-sm">
            {MILK_SUB_OPTIONS.map((sub) => (
              <li
                key={sub.id}
                className="flex items-center justify-between py-2.5"
              >
                <span className="text-[#171717]">
                  {sub.label.replace("Sub: ", "")}
                </span>
                <span className="font-display font-bold text-[#795548]">
                  +{formatPHP(sub.price)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 border border-[#171717] bg-[#F7F4EE] p-6">
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-[#795548]">
            Customize Any Cup
          </p>
          <h2 className="mt-1 font-editorial text-2xl text-[#171717]">
            Add-Ons
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2 divide-y divide-[#171717]/15 sm:divide-y-0 text-sm">
            {ADD_ON_OPTIONS.map((addon) => (
              <li
                key={addon.id}
                className="flex items-center justify-between py-2 sm:border-b sm:border-[#171717]/15"
              >
                <span className="text-[#171717]">{addon.label}</span>
                <span className="font-display font-bold text-[#795548]">
                  +{formatPHP(addon.price)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-display text-[11px] uppercase tracking-wider text-[#171717]/60">
            Click &ldquo;Customize&rdquo; on any drink to add milk subs or
            add-ons to your cup.
          </p>
        </div>
      </div>
    </div>
  );
}
