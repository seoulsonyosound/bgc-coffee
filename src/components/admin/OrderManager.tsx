"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Eye, Loader2, RefreshCw, Search, X } from "lucide-react";
import { ORDER_STATUSES, Order, OrderStatus } from "@/types/order";
import { formatCompactDateTime, formatPHP } from "@/lib/utils";
import { Badge, getOrderStatusVariant } from "@/components/ui/Badge";

export function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>("Confirmed");
  const [bulkUpdating, setBulkUpdating] = useState(false);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    return res.json();
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetchOrders()
      .then((data) => {
        if (active) setOrders(Array.isArray(data.orders) ? data.orders : []);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "All" && o.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return (
          o.orderReference.toLowerCase().includes(q) ||
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.contactNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, statusFilter, search]);

  const filteredIds = useMemo(
    () => filteredOrders.map((o) => o.id),
    [filteredOrders]
  );

  const allVisibleSelected =
    filteredIds.length > 0 &&
    filteredIds.every((id) => selectedIds.includes(id));

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const toggleSelectRow = (orderId: string) => {
    setSelectedIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleStatusChange = async (
    orderId: string,
    nextStatus: OrderStatus
  ) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? data.order : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(data.order);
      }
      showFeedback(
        `Order ${data.order.orderReference} updated to "${nextStatus}"`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (selectedIds.length === 0) return;

    try {
      setBulkUpdating(true);
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderIds: selectedIds,
          status: bulkStatus,
        }),
      });
      if (!res.ok) return;
      const data = await res.json();
      const updatedMap = new Map<string, Order>(
        (Array.isArray(data.orders) ? data.orders : []).map((o: Order) => [
          o.id,
          o,
        ])
      );

      setOrders((prev) =>
        prev.map((o) => updatedMap.get(o.id) ?? o)
      );
      if (selectedOrder && updatedMap.has(selectedOrder.id)) {
        setSelectedOrder(updatedMap.get(selectedOrder.id)!);
      }
      const count = data.updatedCount ?? selectedIds.length;
      setSelectedIds([]);
      showFeedback(
        `Updated ${count} ${count === 1 ? "order" : "orders"} to "${bulkStatus}"`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setBulkUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[#171717] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#795548]">
            Pickup Queue
          </p>
          <h1 className="mt-1 font-editorial text-3xl text-[#171717] sm:text-4xl">
            Order Management
          </h1>
        </div>
        <button
          type="button"
          onClick={loadOrders}
          className="inline-flex items-center gap-2 border border-[#171717] bg-white px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.14em] text-[#171717] hover:bg-[#E8DED2] cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Orders
        </button>
      </div>

      {feedback && (
        <div
          role="status"
          className="flex items-center gap-2 border border-[#171717] bg-[#E8DED2] px-4 py-3 font-display text-xs font-bold uppercase tracking-[0.12em] text-[#3B2923]"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {feedback}
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="flex flex-col gap-3 border border-[#171717] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#171717]/45" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reference or customer name..."
            className="w-full border border-[#171717] bg-[#F7F4EE]/50 py-2 pl-9 pr-3 text-sm focus:border-[#795548] focus:bg-white focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by order status"
          className="border border-[#171717] bg-white px-3.5 py-2 font-display text-xs font-semibold uppercase tracking-wider text-[#171717] focus:border-[#795548] focus:outline-none"
        >
          <option value="All">All Statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Bulk Status Action Bar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col gap-3 border border-[#171717] bg-[#171717] px-5 py-3.5 text-[#F7F4EE] sm:flex-row sm:items-center sm:justify-between vintage-shadow-sm">
          <div className="flex items-center gap-3">
            <span className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#E8DED2]">
              {selectedIds.length}{" "}
              {selectedIds.length === 1 ? "order" : "orders"} selected
            </span>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="font-display text-[11px] uppercase tracking-wider text-[#E8DED2]/75 underline underline-offset-4 hover:text-white cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <label
              htmlFor="bulk-status-select"
              className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-[#E8DED2]"
            >
              Set status to:
            </label>
            <select
              id="bulk-status-select"
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as OrderStatus)}
              className="border border-[#E8DED2]/40 bg-white px-3 py-1.5 font-display text-xs font-bold text-[#171717] focus:outline-none"
            >
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={bulkUpdating}
              onClick={handleBulkStatusUpdate}
              className="inline-flex items-center gap-1.5 border border-[#795548] bg-[#795548] px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-[#E8DED2] hover:text-[#171717] hover:border-[#E8DED2] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {bulkUpdating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Update Selected
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="overflow-hidden border border-[#171717] bg-white">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-14 animate-pulse bg-[#F7F4EE]" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-sm text-[#171717]/60">
            No orders match the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-[#171717] bg-[#F7F4EE] font-display text-[10px] font-bold uppercase tracking-[0.14em] text-[#171717]/75">
                <tr>
                  <th className="w-10 px-3 py-3">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      aria-label="Select all visible orders"
                      className="h-4 w-4 accent-[#795548] cursor-pointer"
                    />
                  </th>
                  <th className="px-3 py-3">Ref Number</th>
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3">Items</th>
                  <th className="px-3 py-3">Total</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9D9D9]">
                {filteredOrders.map((order) => {
                  const isChecked = selectedIds.includes(order.id);
                  const fullItemsText = order.items
                    .map((i) => `${i.quantity}× ${i.productName}`)
                    .join(", ");
                  const firstItem = order.items[0];
                  const extraCount = order.items.length - 1;
                  return (
                    <tr
                      key={order.id}
                      className={
                        isChecked
                          ? "bg-[#E8DED2]/45"
                          : "hover:bg-[#F7F4EE]/60"
                      }
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectRow(order.id)}
                          aria-label={`Select order ${order.orderReference}`}
                          className="h-4 w-4 accent-[#795548] cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-3 font-mono text-xs font-bold text-[#171717] whitespace-nowrap">
                        {order.orderReference}
                      </td>
                      <td className="px-3 py-3 font-semibold text-[#171717] whitespace-nowrap">
                        {order.customer.fullName}
                      </td>
                      <td
                        className="px-3 py-3 max-w-[140px]"
                        title={fullItemsText}
                      >
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="text-xs text-[#171717]/85 truncate">
                            {firstItem
                              ? `${firstItem.quantity}× ${firstItem.productName}`
                              : "—"}
                          </span>
                          {extraCount > 0 && (
                            <span className="shrink-0 font-display text-[10px] font-bold text-[#795548]">
                              +{extraCount}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 font-display font-bold text-[#171717] whitespace-nowrap">
                        {formatPHP(order.totalAmount)}
                      </td>
                      <td className="px-3 py-3 font-mono text-[11px] text-[#171717]/70 whitespace-nowrap">
                        {formatCompactDateTime(order.createdAt)}
                      </td>
                      <td className="px-3 py-3">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id || bulkUpdating}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as OrderStatus
                            )
                          }
                          aria-label={`Update status for order ${order.orderReference}`}
                          className="border border-[#171717] bg-white px-2 py-1 font-display text-[11px] font-semibold text-[#171717] focus:border-[#795548] focus:outline-none cursor-pointer"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 border border-[#171717]/35 bg-white px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-wider text-[#171717] hover:border-[#171717] hover:bg-[#E8DED2] cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/65 p-4"
        >
          <div className="w-full max-w-xl border border-[#171717] bg-white p-6 sm:p-8 vintage-shadow max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#171717] pb-4">
              <div>
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-[#795548]">
                  Order Reference
                </p>
                <h2 className="font-editorial text-2xl text-[#171717]">
                  {selectedOrder.orderReference}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
                className="border border-[#171717]/25 p-1.5 text-[#171717] hover:bg-[#E8DED2]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-5 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border border-[#171717] bg-[#F7F4EE] p-4">
                <div>
                  <p className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-[#171717]/60">
                    Current Status
                  </p>
                  <div className="mt-1">
                    <Badge
                      variant={getOrderStatusVariant(selectedOrder.status)}
                    >
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="block font-display text-[10px] font-bold uppercase tracking-[0.16em] text-[#171717]/60 mb-1">
                    Update Status
                  </label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedOrder.id,
                        e.target.value as OrderStatus
                      )
                    }
                    className="border border-[#171717] bg-white px-3 py-1.5 font-display text-xs font-bold text-[#171717]"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <p>
                  <span className="text-[#171717]/60">Customer: </span>
                  <strong>{selectedOrder.customer.fullName}</strong>
                </p>
                <p>
                  <span className="text-[#171717]/60">Contact: </span>
                  <strong>{selectedOrder.customer.contactNumber}</strong>
                </p>
                {selectedOrder.customer.email && (
                  <p>
                    <span className="text-[#171717]/60">Email: </span>
                    <strong>{selectedOrder.customer.email}</strong>
                  </p>
                )}
                <p>
                  <span className="text-[#171717]/60">Payment: </span>
                  <strong className="text-[#795548]">
                    {selectedOrder.paymentMethod}
                  </strong>
                </p>
                {selectedOrder.customer.pickupNotes && (
                  <p className="sm:col-span-2 border border-[#171717]/25 bg-[#F7F4EE] p-3 text-xs">
                    <span className="font-bold">Pickup Notes: </span>
                    {selectedOrder.customer.pickupNotes}
                  </p>
                )}
              </div>

              <div>
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#795548]">
                  Ordered Items
                </p>
                <ul className="mt-2 divide-y divide-[#D9D9D9] border-y border-[#171717]">
                  {selectedOrder.items.map((item, idx) => (
                    <li
                      key={`${item.productId}-${idx}`}
                      className="flex justify-between py-2.5"
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
                <div className="mt-3 flex justify-between text-base font-display font-bold">
                  <span className="uppercase tracking-wider">Total Amount</span>
                  <span className="text-[#795548]">
                    {formatPHP(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
