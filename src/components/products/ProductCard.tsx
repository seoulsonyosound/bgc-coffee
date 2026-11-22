"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, ArrowUpRight } from "lucide-react";
import { Product } from "@/types/product";
import { formatPHP } from "@/lib/utils";
import { resolveAssetUrl } from "@/lib/aws-config";
import { useCart } from "@/components/cart/CartProvider";
import { Badge } from "@/components/ui/Badge";

type HoverDirection = "top" | "right" | "bottom" | "left";

const DIRECTION_TRANSFORMS: Record<HoverDirection, string> = {
  top: "translate3d(0, -100%, 0)",
  right: "translate3d(100%, 0, 0)",
  bottom: "translate3d(0, 100%, 0)",
  left: "translate3d(-100%, 0, 0)",
};

const OVERLAY_TRANSITION = "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)";

function getHoverDirection(
  e: React.MouseEvent<HTMLElement>,
  element: HTMLElement
): HoverDirection {
  const { width, height, top, left } = element.getBoundingClientRect();
  const x =
    (e.clientX - left - width / 2) * (width > height ? height / width : 1);
  const y =
    (e.clientY - top - height / 2) * (height > width ? width / height : 1);
  const index = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
  const directions: HoverDirection[] = ["top", "right", "bottom", "left"];
  return directions[index];
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const mediaRef = useRef<HTMLAnchorElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const defaultVariant = product.variants[0] ?? {
    id: "std",
    label: "Standard",
    priceDelta: 0,
  };
  const defaultTemp = product.temperatureOptions[0] ?? "Iced";

  const showOverlay = (direction: HoverDirection) => {
    const overlay = overlayRef.current;
    if (!overlay || !product.available) return;

    if (prefersReducedMotion()) {
      overlay.style.transition = "opacity 180ms ease";
      overlay.style.transform = "translate3d(0, 0, 0)";
      overlay.style.opacity = "1";
      return;
    }

    overlay.style.transition = "none";
    overlay.style.opacity = "1";
    overlay.style.transform = DIRECTION_TRANSFORMS[direction];
    // Commit starting edge before sliding in
    void overlay.offsetHeight;
    overlay.style.transition = OVERLAY_TRANSITION;
    overlay.style.transform = "translate3d(0, 0, 0)";
  };

  const hideOverlay = (direction: HoverDirection) => {
    const overlay = overlayRef.current;
    if (!overlay || !product.available) return;

    if (prefersReducedMotion()) {
      overlay.style.transition = "opacity 180ms ease";
      overlay.style.opacity = "0";
      return;
    }

    overlay.style.transition = OVERLAY_TRANSITION;
    overlay.style.transform = DIRECTION_TRANSFORMS[direction];
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!mediaRef.current) return;
    showOverlay(getHoverDirection(e, mediaRef.current));
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!mediaRef.current) return;
    hideOverlay(getHoverDirection(e, mediaRef.current));
  };

  const handleQuickAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.available) return;

    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      imageUrl: product.imageUrl,
      unitPrice: product.price + defaultVariant.priceDelta,
      quantity: 1,
      variantLabel: defaultVariant.label,
      temperature: defaultTemp,
    });
  };

  return (
    <article className="group flex flex-col border border-[#171717] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#171717]">
      {/* Image Container with Direction-Aware Hover Overlay */}
      <Link
        ref={mediaRef}
        href={`/menu/${product.slug}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={() => showOverlay("bottom")}
        onBlur={() => hideOverlay("bottom")}
        className="relative aspect-square w-full overflow-hidden bg-[#F7F4EE] border-b border-[#171717] block p-4"
      >
        <div className="relative h-full w-full">
          <Image
            src={resolveAssetUrl(product.imageUrl)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Category Label */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
          <Badge variant="default" className="text-[10px] bg-white/95">
            {product.category}
          </Badge>
        </div>

        {product.available ? (
          <div
            ref={overlayRef}
            aria-hidden="true"
            style={{ transform: DIRECTION_TRANSFORMS.top }}
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#171717]/80 px-5 text-center text-white backdrop-blur-[1.5px] will-change-transform"
          >
            <p className="font-editorial text-2xl leading-tight text-white">
              {product.name}
            </p>
            <span className="my-2.5 h-px w-8 bg-white/45" />
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E8DED2]">
              {product.category}
            </p>
            {product.tastingNotes && (
              <p className="mt-2 line-clamp-2 max-w-[85%] text-xs leading-relaxed text-white/80">
                {product.tastingNotes}
              </p>
            )}
            <span className="mt-4 inline-flex items-center gap-1 border border-white/60 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-white">
              {formatPHP(product.price)} • View
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        ) : (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#171717]/65">
            <span className="border border-white bg-[#171717] px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-white">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 bg-white">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <Link href={`/menu/${product.slug}`} className="group/title">
                <h3 className="font-editorial text-xl leading-snug text-[#171717] group-hover/title:text-[#795548] transition-colors">
                  {product.name}
                </h3>
              </Link>
              {product.badges?.map((badge) => (
                <Badge
                  key={badge}
                  variant={badge === "Best Seller" ? "dark" : "brown"}
                  className="text-[9px] px-2 py-0.5 leading-tight"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
          <span className="font-display text-sm font-bold text-[#795548] whitespace-nowrap pt-1">
            {formatPHP(product.price)}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#171717]/70 flex-1">
          {product.ingredients && product.ingredients.length > 0
            ? product.ingredients.join(" • ")
            : product.description}
        </p>

        {/* Action Row */}
        <div className="mt-5 flex items-center justify-between gap-2 pt-3.5 border-t border-[#D9D9D9]">
          <Link
            href={`/menu/${product.slug}`}
            className="inline-flex items-center gap-1 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-[#171717]/75 hover:text-[#795548] transition-colors"
          >
            Customize
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          <button
            type="button"
            disabled={!product.available}
            onClick={handleQuickAdd}
            className="inline-flex items-center gap-1.5 border border-[#171717] bg-[#171717] px-3.5 py-2 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#795548] hover:border-[#795548] disabled:cursor-not-allowed disabled:border-[#D9D9D9] disabled:bg-[#F7F4EE] disabled:text-[#171717]/40 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            {product.available ? "Add to Cart" : "Sold Out"}
          </button>
        </div>
      </div>
    </article>
  );
}
