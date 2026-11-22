"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock,
  FileText,
  Receipt,
} from "lucide-react";
import { Order } from "@/types/order";
import { formatDateTime, formatPHP } from "@/lib/utils";
import { readLocalStorage, STORAGE_KEYS } from "@/lib/storage";
import { Badge, getOrderStatusVariant } from "@/components/ui/Badge";

export function OrderConfirmationView() {
  const searchParams = useSearchParams();
  const queryRef = searchParams.get("ref");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadOrder() {
      const refToLoad =
        queryRef ||
        readLocalStorage<string | null>(STORAGE_KEYS.LAST_ORDER_REF, null);

      if (!refToLoad) {
        if (active) {
          setError("No order reference found.");
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch(
          `/api/orders?ref=${encodeURIComponent(refToLoad)}`
        );
        if (!res.ok) {
          throw new Error("We could not find an order matching this reference.");
        }
        const data = await res.json();
        if (active && data.order) {
          setOrder(data.order);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Unable to load order details."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadOrder();
    return () => {
      active = false;
    };
  }, [queryRef]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="h-72 animate-pulse border border-[#171717]/20 bg-white" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#171717] bg-white text-[#171717]">
          <Receipt className="h-7 w-7" />
        </div>
        <h1 className="mt-5 font-editorial text-3xl text-[#171717]">
          Order Not Found
        </h1>
        <p className="mt-2 text-sm text-[#171717]/70">
          {error ||
            "Please place an order from our menu to view a confirmation."}
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-flex items-center gap-2 border border-[#171717] bg-[#171717] px-7 py-3 font-display text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-[#795548]"
        >
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="border border-[#171717] bg-white vintage-shadow">
        {/* Vintage Receipt Header Banner */}
        <div className="bg-[#171717] px-6 py-10 text-center text-[#F7F4EE] sm:px-10 border-b border-[#171717]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#E8DED2]/40 bg-[#795548] text-white">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <p className="mt-4 font-display text-xs font-bold uppercase tracking-[0.24em] text-[#E8DED2]">
            b.g.c coffee co. • Pickup Receipt
          </p>
          <h1 className="mt-2 font-editorial text-3xl sm:text-4xl text-white">
            Thank You, {order.customer.fullName}!
          </h1>
          <p className="mt-2 text-sm text-[#E8DED2]/75">
            Show your order reference at the counter when picking up your
            drinks.
          </p>

          <div className="mt-6 inline-flex flex-col items-center border border-[#E8DED2]/35 bg-[#3B2923] px-6 py-4">
            <span className="font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E8DED2]/75">
              Order Reference
            </span>
            <span className="mt-1 font-display text-2xl font-bold tracking-wider text-white">
              {order.orderReference}
            </span>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-6 sm:p-10 space-y-8">
          <div className="grid grid-cols-1 gap-4 border border-[#171717] bg-[#F7F4EE] p-5 sm:grid-cols-3">
            <div>
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-[#171717]/60">
                Order Status
              </p>
              <div className="mt-1.5">
                <Badge variant={getOrderStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </div>

            <div>
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-[#171717]/60">
                Payment Method
              </p>
              <p className="mt-1.5 inline-flex items-center gap-1.5 font-display text-sm font-bold text-[#171717]">
                <Banknote className="h-4 w-4 text-[#795548]" />
                {order.paymentMethod}
              </p>
            </div>

            <div>
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-[#171717]/60">
                Placed On
              </p>
              <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#171717]">
                <Clock className="h-4 w-4 text-[#795548]" />
                {formatDateTime(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[#795548]">
              Pickup Customer
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <p>
                <span className="text-[#171717]/60">Name: </span>
                <span className="font-semibold text-[#171717]">
                  {order.customer.fullName}
                </span>
              </p>
              <p>
                <span className="text-[#171717]/60">Contact: </span>
                <span className="font-semibold text-[#171717]">
                  {order.customer.contactNumber}
                </span>
              </p>
              {order.customer.email && (
                <p>
                  <span className="text-[#171717]/60">Email: </span>
                  <span className="font-semibold text-[#171717]">
                    {order.customer.email}
                  </span>
                </p>
              )}
              {order.customer.pickupNotes && (
                <p className="sm:col-span-2 flex items-start gap-2 border border-[#171717]/25 bg-[#F7F4EE] p-3 mt-1">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#795548]" />
                  <span>
                    <span className="font-semibold text-[#171717]">
                      Notes:{" "}
                    </span>
                    {order.customer.pickupNotes}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Ordered Items */}
          <div>
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[#795548]">
              Ordered Items
            </h2>
            <ul className="mt-3 divide-y divide-[#D9D9D9] border-y border-[#171717]">
              {order.items.map((item, idx) => (
                <li
                  key={`${item.productId}-${idx}`}
                  className="flex items-center justify-between gap-4 py-3.5 text-sm"
                >
                  <div>
                    <p className="font-semibold text-[#171717]">
                      {item.quantity}× {item.productName}
                    </p>
                    <p className="font-display text-[11px] uppercase tracking-wider text-[#171717]/60">
                      {item.temperature ? `${item.temperature} • ` : ""}
                      {item.variantLabel || "Regular"} ({formatPHP(item.unitPrice)}{" "}
                      each)
                    </p>
                  </div>
                  <p className="font-display font-bold text-[#171717]">
                    {formatPHP(item.subtotal)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between text-lg">
              <span className="font-display font-bold uppercase tracking-wider text-[#171717]">
                Total Due on Pickup
              </span>
              <span className="font-display font-bold text-[#795548]">
                {formatPHP(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#D9D9D9]">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 border border-[#171717] bg-[#171717] px-7 py-3.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-[#795548] hover:border-[#795548] transition-colors"
            >
              Order More Coffee
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#171717]/70 hover:text-[#171717]"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
