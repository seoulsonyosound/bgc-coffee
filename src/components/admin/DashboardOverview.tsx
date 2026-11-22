"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock,
  Coffee,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { ORDER_STATUSES, Order } from "@/types/order";
import { formatDateTime, formatPHP } from "@/lib/utils";
import { Badge, getOrderStatusVariant } from "@/components/ui/Badge";

interface Metrics {
  totalProducts: number;
  availableProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSales: number;
}

export function DashboardOverview() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    const res = await fetch("/api/orders?metrics=true");
    if (!res.ok) throw new Error("Failed to fetch dashboard data");
    return res.json();
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboard();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setMetrics(data.metrics ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetchDashboard()
      .then((data) => {
        if (!active) return;
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setMetrics(data.metrics ?? null);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const statusBreakdown = useMemo(() => {
    const total = orders.length || 1;
    return ORDER_STATUSES.map((status) => {
      const count = orders.filter((o) => o.status === status).length;
      const pct = Math.round((count / total) * 100);
      return { status, count, pct };
    });
  }, [orders]);

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[#171717] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#795548]">
            Overview • Daily Ledger
          </p>
          <h1 className="mt-1 font-editorial text-3xl text-[#171717] sm:text-4xl">
            Store Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-2 border border-[#171717] bg-white px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.14em] text-[#171717] hover:bg-[#E8DED2] cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 border border-[#171717] bg-[#171717] px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-[#795548] hover:border-[#795548]"
          >
            Manage Products
          </Link>
        </div>
      </div>

      {/* 5 Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="border border-[#171717] bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[#171717]/65">
              Total Products
            </span>
            <Coffee className="h-4 w-4 text-[#795548]" />
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-[#171717]">
            {loading ? "—" : metrics?.totalProducts ?? 0}
          </p>
          <p className="mt-1 text-xs text-[#171717]/60">
            {loading ? "" : `${metrics?.availableProducts ?? 0} active on menu`}
          </p>
        </div>

        <div className="border border-[#171717] bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[#171717]/65">
              Total Orders
            </span>
            <ShoppingBag className="h-4 w-4 text-[#795548]" />
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-[#171717]">
            {loading ? "—" : metrics?.totalOrders ?? 0}
          </p>
          <p className="mt-1 text-xs text-[#171717]/60">All pickup orders</p>
        </div>

        <div className="border border-[#171717] bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[#171717]/65">
              Pending Orders
            </span>
            <Clock className="h-4 w-4 text-[#795548]" />
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-[#795548]">
            {loading ? "—" : metrics?.pendingOrders ?? 0}
          </p>
          <p className="mt-1 text-xs text-[#171717]/60">
            Awaiting confirmation
          </p>
        </div>

        <div className="border border-[#171717] bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[#171717]/65">
              Completed Orders
            </span>
            <CheckCircle2 className="h-4 w-4 text-[#3B2923]" />
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-[#3B2923]">
            {loading ? "—" : metrics?.completedOrders ?? 0}
          </p>
          <p className="mt-1 text-xs text-[#171717]/60">Picked up &amp; paid</p>
        </div>

        <div className="border border-[#171717] bg-[#3B2923] p-5 text-[#F7F4EE] vintage-shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[#E8DED2]">
              Total Sales
            </span>
            <Banknote className="h-4 w-4 text-[#E8DED2]" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-white">
            {loading ? "—" : formatPHP(metrics?.totalSales ?? 0)}
          </p>
          <p className="mt-1 text-xs text-[#E8DED2]/70">
            Excludes cancelled orders
          </p>
        </div>
      </div>

      {/* Order Status Breakdown + Recent Orders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Status Distribution Chart */}
        <div className="border border-[#171717] bg-white p-6">
          <h2 className="font-editorial text-xl text-[#171717] border-b border-[#D9D9D9] pb-2">
            Order Status Breakdown
          </h2>
          <p className="mt-2 text-xs text-[#171717]/60">
            Live distribution across all recorded pickup orders
          </p>

          <div className="mt-6 space-y-4">
            {statusBreakdown.map((item) => (
              <div key={item.status}>
                <div className="flex items-center justify-between font-display text-xs font-semibold">
                  <span className="text-[#171717] uppercase tracking-wider">
                    {item.status}
                  </span>
                  <span className="text-[#795548]">
                    {item.count} ({item.pct}%)
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 w-full overflow-hidden border border-[#171717]/25 bg-[#F7F4EE]">
                  <div
                    className="h-full bg-[#795548] transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="lg:col-span-2 border border-[#171717] bg-white overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-[#171717] px-6 py-4 bg-[#F7F4EE]">
            <div>
              <h2 className="font-editorial text-xl text-[#171717]">
                Recent Orders
              </h2>
              <p className="text-xs text-[#171717]/60">
                Latest customer pickup orders
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 font-display text-xs font-bold uppercase tracking-[0.14em] text-[#795548] hover:underline underline-offset-4"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-12 animate-pulse bg-[#F7F4EE]" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#171717]/60">
              No orders recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#171717] bg-white font-display text-[10px] font-bold uppercase tracking-[0.16em] text-[#171717]/70">
                  <tr>
                    <th className="px-6 py-3">Reference</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9D9D9]">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#F7F4EE]/70">
                      <td className="px-6 py-3.5 font-mono text-xs font-bold text-[#171717]">
                        {order.orderReference}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-[#171717]">
                          {order.customer.fullName}
                        </p>
                        <p className="text-xs text-[#171717]/55">
                          {order.items.reduce((s, i) => s + i.quantity, 0)}{" "}
                          item(s)
                        </p>
                      </td>
                      <td className="px-4 py-3.5 font-display font-bold text-[#171717]">
                        {formatPHP(order.totalAmount)}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={getOrderStatusVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5 text-right text-xs text-[#171717]/60 whitespace-nowrap">
                        {formatDateTime(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
