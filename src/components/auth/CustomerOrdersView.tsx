"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Banknote, Clock, Receipt } from "lucide-react";
import { Order } from "@/types/order";
import { formatDateTime, formatPHP } from "@/lib/utils";
import { Badge, getOrderStatusVariant } from "@/components/ui/Badge";

export function CustomerOrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/orders?scope=customer", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unable to load orders.");
        return data;
      })
      .then((data) => {
        if (active && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Failed to load order history."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-white min-h-[75vh]">
      <section className="bg-paper-grain text-[#171717] py-12 border-b border-[#171717]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#795548]">
              Customer Ledger
            </p>
            <h1 className="mt-2 font-editorial text-4xl sm:text-5xl text-[#171717]">
              Order History
            </h1>
          </div>
          <Link
            href="/menu"
            className="inline-flex w-fit items-center gap-2 border border-[#171717] bg-[#171717] px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-[#795548]"
          >
            Order Coffee
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {error ? (
          <div className="border border-[#171717] bg-[#E8DED2] p-6 text-sm text-[#3B2923]">
            {error}
          </div>
        ) : loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-32 animate-pulse border border-[#171717]/20 bg-[#F7F4EE]"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="border border-[#171717] bg-[#F7F4EE] p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#171717] bg-white text-[#171717]">
              <Receipt className="h-7 w-7" />
            </div>
            <h2 className="mt-5 font-editorial text-3xl text-[#171717]">
              No pickup orders yet
            </h2>
            <p className="mt-2 text-sm text-[#171717]/70 max-w-md mx-auto">
              Once you place a Cash on Pickup order, your receipt and live
              status will appear right here.
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-flex items-center gap-2 border border-[#171717] bg-[#171717] px-7 py-3 font-display text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-[#795548]"
            >
              Browse Coffee Menu
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="border border-[#171717] bg-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#171717] bg-[#F7F4EE] px-6 py-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-[#171717]/55">
                        Order Reference
                      </p>
                      <p className="font-mono text-sm font-bold text-[#171717]">
                        {order.orderReference}
                      </p>
                    </div>
                    <div className="hidden sm:block h-8 w-px bg-[#171717]/20" />
                    <div>
                      <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-[#171717]/55">
                        Order Date
                      </p>
                      <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#171717]">
                        <Clock className="h-3.5 w-3.5 text-[#795548]" />
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={getOrderStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                    <Link
                      href={`/order-confirmation?ref=${encodeURIComponent(
                        order.orderReference
                      )}`}
                      className="border border-[#171717] bg-white px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-wider text-[#171717] hover:bg-[#E8DED2]"
                    >
                      Receipt
                    </Link>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <ul className="divide-y divide-[#D9D9D9]">
                    {order.items.map((item, idx) => (
                      <li
                        key={`${item.productId}-${idx}`}
                        className="flex items-center justify-between gap-4 py-2.5 text-sm"
                      >
                        <div>
                          <p className="font-semibold text-[#171717]">
                            {item.quantity}× {item.productName}
                          </p>
                          <p className="font-display text-[11px] uppercase tracking-wider text-[#171717]/60">
                            {item.temperature ? `${item.temperature} • ` : ""}
                            {item.variantLabel || "Regular"}
                          </p>
                        </div>
                        <p className="font-display font-bold text-[#171717]">
                          {formatPHP(item.subtotal)}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#171717] pt-3">
                    <span className="inline-flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-wider text-[#795548]">
                      <Banknote className="h-4 w-4" />
                      {order.paymentMethod}
                    </span>
                    <div className="text-right">
                      <span className="font-display text-xs uppercase tracking-wider text-[#171717]/60 mr-3">
                        Total Amount
                      </span>
                      <span className="font-display text-lg font-bold text-[#171717]">
                        {formatPHP(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
