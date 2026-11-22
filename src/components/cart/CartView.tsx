"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useCart } from "./CartProvider";
import { formatPHP } from "@/lib/utils";
import { resolveAssetUrl } from "@/lib/aws-config";

export function CartView() {
  const { items, isHydrated, subtotal, updateQuantity, removeItem, clearCart } =
    useCart();

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-48 animate-pulse border border-[#171717]/20 bg-[#F7F4EE]" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#171717] bg-[#F7F4EE] text-[#171717]">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <h2 className="mt-6 font-editorial text-3xl text-[#171717] sm:text-4xl">
          Your pickup bag is empty
        </h2>
        <p className="mt-3 text-sm text-[#171717]/70 max-w-md mx-auto">
          Looks like you haven&apos;t picked your coffee yet. Explore our
          signature espresso, iced lattes, and specialty drinks.
        </p>
        <Link
          href="/menu"
          className="mt-8 inline-flex items-center gap-2 border border-[#171717] bg-[#171717] px-8 py-3.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-white vintage-shadow-sm hover:bg-[#795548] hover:border-[#795548] transition-colors"
        >
          Browse Coffee Menu
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between border-b border-[#171717] pb-4">
        <p className="font-display text-xs uppercase tracking-[0.14em] text-[#171717]/75">
          You have{" "}
          <span className="font-bold text-[#171717]">{items.length}</span>{" "}
          {items.length === 1 ? "line item" : "line items"} in your pickup bag.
        </p>
        <button
          type="button"
          onClick={clearCart}
          className="font-display text-xs font-bold uppercase tracking-[0.14em] text-[#795548] hover:underline underline-offset-4 cursor-pointer"
        >
          Clear Cart
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Line Items */}
        <div className="lg:col-span-2 divide-y divide-[#171717] border border-[#171717] bg-white">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5"
            >
              <Link
                href={`/menu/${item.productSlug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden border border-[#171717] bg-[#E8DED2]"
              >
                <Image
                  src={resolveAssetUrl(item.imageUrl)}
                  alt={item.productName}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/menu/${item.productSlug}`}
                      className="font-editorial text-xl text-[#171717] hover:text-[#795548]"
                    >
                      {item.productName}
                    </Link>
                    <p className="mt-0.5 font-display text-[11px] uppercase tracking-[0.12em] text-[#171717]/65">
                      {item.temperature} • {item.variantLabel}
                    </p>
                    <p className="mt-1 font-display text-xs font-semibold text-[#795548]">
                      {formatPHP(item.unitPrice)} each
                    </p>
                  </div>

                  <p className="font-display text-base font-bold text-[#171717]">
                    {formatPHP(item.unitPrice * item.quantity)}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="inline-flex items-center border border-[#171717] bg-[#F7F4EE]">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      aria-label={`Decrease quantity of ${item.productName}`}
                      className="flex h-8 w-8 items-center justify-center bg-white text-[#171717] hover:bg-[#E8DED2] cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-4 font-display text-sm font-bold text-[#171717]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      aria-label={`Increase quantity of ${item.productName}`}
                      className="flex h-8 w-8 items-center justify-center bg-white text-[#171717] hover:bg-[#E8DED2] cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    className="inline-flex items-center gap-1.5 font-display text-[11px] font-semibold uppercase tracking-wider text-[#171717]/60 hover:text-[#3B2923] transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 border border-[#171717] bg-[#F7F4EE] p-6 vintage-shadow">
            <h2 className="font-editorial text-2xl text-[#171717] border-b border-[#171717] pb-3">
              Order Summary
            </h2>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-[#171717]/75">
                <dt>Subtotal</dt>
                <dd className="font-display font-semibold text-[#171717]">
                  {formatPHP(subtotal)}
                </dd>
              </div>
              <div className="flex justify-between text-[#171717]/75">
                <dt>Pickup Fee</dt>
                <dd className="font-display font-semibold text-[#3B2923]">
                  Free
                </dd>
              </div>
              <div className="flex justify-between text-[#171717]/75">
                <dt>Payment Method</dt>
                <dd className="font-display font-semibold text-[#795548]">
                  Cash on Pickup
                </dd>
              </div>
              <div className="border-t border-[#171717] pt-3 flex justify-between text-base">
                <dt className="font-display font-bold uppercase tracking-wider text-[#171717]">
                  Total
                </dt>
                <dd className="font-display font-bold text-[#171717]">
                  {formatPHP(subtotal)}
                </dd>
              </div>
            </dl>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 border border-[#171717] bg-[#171717] px-6 py-3.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#795548] hover:border-[#795548]"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/menu"
              className="mt-3 block text-center font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-[#171717]/70 hover:text-[#795548]"
            >
              Continue Browsing Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
