"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { Product } from "@/types/product";
import { ADD_ON_OPTIONS, MILK_SUB_OPTIONS } from "@/data/products";
import { formatPHP, cn } from "@/lib/utils";
import { resolveAssetUrl } from "@/lib/aws-config";
import { useCart } from "@/components/cart/CartProvider";
import { Badge } from "@/components/ui/Badge";

export function ProductDetailView() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedSubId, setSelectedSubId] = useState<string>("");
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    async function loadProduct() {
      try {
        setLoading(true);
        setNotFound(false);
        const res = await fetch(`/api/products/${encodeURIComponent(slug)}`);
        if (res.status === 404) {
          if (active) setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        if (active && data.product) {
          setProduct(data.product as Product);
        }
      } catch {
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProduct();
    return () => {
      active = false;
    };
  }, [slug]);

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedSub = useMemo(
    () => MILK_SUB_OPTIONS.find((s) => s.id === selectedSubId) ?? null,
    [selectedSubId]
  );

  const selectedAddOns = useMemo(
    () => ADD_ON_OPTIONS.filter((a) => selectedAddOnIds.includes(a.id)),
    [selectedAddOnIds]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="aspect-square border border-[#171717]/20 bg-[#E8DED2] animate-pulse" />
          <div className="space-y-4 py-4">
            <div className="h-5 w-28 bg-[#E8DED2] animate-pulse" />
            <div className="h-12 w-2/3 bg-[#E8DED2] animate-pulse" />
            <div className="h-20 w-full bg-[#F7F4EE] animate-pulse" />
            <div className="h-12 w-full bg-[#E8DED2] animate-pulse mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-editorial text-4xl text-[#171717]">
          Drink Not Found
        </h1>
        <p className="mt-3 text-sm text-[#171717]/70">
          The product you are looking for may have been removed or renamed.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-flex items-center gap-2 border border-[#171717] bg-[#171717] px-6 py-3 font-display text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-[#795548]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Menu
        </Link>
      </div>
    );
  }

  const subExtra = selectedSub ? selectedSub.price : 0;
  const addOnsExtra = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = product.price + subExtra + addOnsExtra;
  const lineTotal = unitPrice * quantity;

  const customParts: string[] = [];
  if (selectedSub) customParts.push(selectedSub.label);
  if (selectedAddOns.length > 0) {
    customParts.push(
      ...selectedAddOns.map((a) => `+${a.label}`)
    );
  }
  const variantLabel =
    customParts.length > 0 ? customParts.join(", ") : "Standard";

  const handleAddToCart = () => {
    if (!product.available) return;
    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      imageUrl: product.imageUrl,
      unitPrice,
      quantity,
      variantLabel,
      temperature: product.temperatureOptions[0] ?? "Iced",
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  return (
    <div className="bg-paper-grain min-h-[80vh]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-[#171717]/75 hover:text-[#795548] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Menu Catalog
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Editorial Framed Product Image */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 border border-[#171717] bg-white p-3 vintage-shadow">
              <div className="relative aspect-square overflow-hidden border border-[#171717] bg-[#F7F4EE] p-6">
                <div className="relative h-full w-full">
                  <Image
                    src={resolveAssetUrl(product.imageUrl)}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-contain"
                  />
                </div>
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <Badge variant="default" className="bg-white/95">
                    {product.category}
                  </Badge>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-[#171717]/70">
                <span>BGC COFFEE CO. — ITEM SPEC</span>
                <span className="text-[#795548]">MADE TO ORDER</span>
              </div>
            </div>
          </div>

          {/* Product Details & Controls */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={product.available ? "success" : "danger"}>
                {product.available
                  ? "Available for Pickup"
                  : "Currently Unavailable"}
              </Badge>
            </div>

            {/* Name + Barista's Choice / Best Seller Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <h1 className="font-editorial text-4xl text-[#171717] sm:text-5xl leading-tight">
                {product.name}
              </h1>
              {product.badges?.map((badge) => (
                <Badge
                  key={badge}
                  variant={badge === "Best Seller" ? "dark" : "brown"}
                >
                  {badge}
                </Badge>
              ))}
            </div>

            <p className="mt-3 font-display text-2xl font-bold text-[#795548]">
              {formatPHP(unitPrice)}
              {(subExtra > 0 || addOnsExtra > 0) && (
                <span className="ml-2 text-xs font-medium text-[#171717]/55">
                  (Base {formatPHP(product.price)})
                </span>
              )}
            </p>

            {/* Ingredients */}
            <div className="mt-4 border-t border-[#171717]/20 pt-4">
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-[#795548]">
                Ingredients
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-[#171717]/85">
                {product.ingredients && product.ingredients.length > 0
                  ? product.ingredients.join(", ")
                  : product.description}
              </p>
            </div>

            {/* SUB Options (Milk Substitution) */}
            <div className="mt-6">
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-[#171717]/75">
                Sub (Optional)
              </p>
              <div className="mt-2.5 grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedSubId("")}
                  className={cn(
                    "border px-3 py-2.5 text-left transition-all cursor-pointer",
                    selectedSubId === ""
                      ? "border-[#171717] bg-[#171717] text-white"
                      : "border-[#171717]/30 bg-white text-[#171717] hover:border-[#795548]"
                  )}
                >
                  <span className="block font-display text-xs font-bold">
                    None
                  </span>
                  <span className="text-[11px] opacity-75">Included</span>
                </button>
                {MILK_SUB_OPTIONS.map((sub) => {
                  const active = selectedSubId === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() =>
                        setSelectedSubId(active ? "" : sub.id)
                      }
                      className={cn(
                        "border px-3 py-2.5 text-left transition-all cursor-pointer",
                        active
                          ? "border-[#171717] bg-[#E8DED2] shadow-[2px_2px_0px_#171717]"
                          : "border-[#171717]/30 bg-white hover:border-[#795548]"
                      )}
                    >
                      <span className="block font-display text-xs font-bold text-[#171717]">
                        {sub.label.replace("Sub: ", "")}
                      </span>
                      <span className="text-[11px] font-semibold text-[#795548]">
                        +{formatPHP(sub.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ADD ON Options */}
            <div className="mt-6">
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-[#171717]/75">
                Add-Ons (Optional)
              </p>
              <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ADD_ON_OPTIONS.map((addon) => {
                  const checked = selectedAddOnIds.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      className={cn(
                        "flex items-center justify-between gap-2 border px-3.5 py-2.5 text-xs cursor-pointer transition-all select-none",
                        checked
                          ? "border-[#171717] bg-[#E8DED2] font-semibold"
                          : "border-[#171717]/25 bg-white hover:border-[#795548]"
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAddOn(addon.id)}
                          className="h-3.5 w-3.5 accent-[#795548]"
                        />
                        <span className="text-[#171717]">{addon.label}</span>
                      </span>
                      <span className="font-display font-bold text-[#795548] whitespace-nowrap">
                        +{formatPHP(addon.price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="inline-flex items-center justify-between border border-[#171717] bg-white px-2 py-1.5 sm:w-36">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-9 w-9 items-center justify-center text-[#171717] hover:bg-[#E8DED2] cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-display text-base font-bold text-[#171717] px-3">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  aria-label="Increase quantity"
                  className="flex h-9 w-9 items-center justify-center text-[#171717] hover:bg-[#E8DED2] cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                disabled={!product.available}
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-2.5 border border-[#171717] bg-[#171717] px-8 py-4 font-display text-xs font-bold uppercase tracking-[0.16em] text-white vintage-shadow-sm transition-colors hover:bg-[#795548] hover:border-[#795548] disabled:cursor-not-allowed disabled:border-[#D9D9D9] disabled:bg-[#E8DED2] disabled:text-[#171717]/40 disabled:shadow-none cursor-pointer"
              >
                {addedFeedback ? (
                  <>
                    <Check className="h-4 w-4" />
                    Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    {product.available
                      ? `Add to Cart • ${formatPHP(lineTotal)}`
                      : "Currently Unavailable"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
