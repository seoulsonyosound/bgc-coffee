"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Edit3,
  Loader2,
  LogOut,
  Mail,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { Order } from "@/types/order";
import { formatDateTime, formatPHP, isValidPhoneNumber } from "@/lib/utils";
import { Badge, getOrderStatusVariant } from "@/components/ui/Badge";

export function AccountView() {
  const router = useRouter();
  const { customer, logout, updateProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(customer?.fullName || "");
  const [contactNumber, setContactNumber] = useState(
    customer?.contactNumber || ""
  );
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/orders?scope=customer", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { orders: [] }))
      .then((data) => {
        if (active && Array.isArray(data.orders)) {
          setRecentOrders(data.orders.slice(0, 3));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setOrdersLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!customer) return null;

  const startEdit = () => {
    setFullName(customer.fullName);
    setContactNumber(customer.contactNumber || "");
    setProfileError(null);
    setProfileSuccess(null);
    setEditing(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (fullName.trim().length < 2) {
      setProfileError("Full name must be at least 2 characters.");
      return;
    }
    if (contactNumber.trim() && !isValidPhoneNumber(contactNumber)) {
      setProfileError("Please enter a valid contact number or leave it blank.");
      return;
    }

    try {
      setSaving(true);
      await updateProfile({
        fullName: fullName.trim(),
        contactNumber: contactNumber.trim() || undefined,
      });
      setEditing(false);
      setProfileSuccess("Your profile information has been updated.");
    } catch (err) {
      setProfileError(
        err instanceof Error ? err.message : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="bg-white min-h-[75vh]">
      <section className="bg-paper-grain text-[#171717] py-12 border-b border-[#171717]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#795548]">
              Member Profile
            </p>
            <h1 className="mt-2 font-editorial text-4xl sm:text-5xl text-[#171717]">
              My Account
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex w-fit items-center gap-2 border border-[#171717] bg-white px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-[#171717] hover:bg-[#171717] hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Profile Card */}
          <div className="lg:col-span-5">
            <div className="border border-[#171717] bg-[#F7F4EE] p-6 sm:p-7 vintage-shadow">
              <div className="flex items-center justify-between border-b border-[#171717] pb-4">
                <h2 className="font-editorial text-2xl text-[#171717]">
                  Account Details
                </h2>
                {!editing && (
                  <button
                    type="button"
                    onClick={startEdit}
                    className="inline-flex items-center gap-1.5 border border-[#171717] bg-white px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[#171717] hover:bg-[#E8DED2] cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-[#795548]" />
                    Edit Profile
                  </button>
                )}
              </div>

              {profileSuccess && (
                <div className="mt-4 flex items-center gap-2 border border-[#171717] bg-white p-3 text-xs font-semibold text-[#3B2923]">
                  <CheckCircle2 className="h-4 w-4 text-[#795548] shrink-0" />
                  {profileSuccess}
                </div>
              )}

              {editing ? (
                <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
                  {profileError && (
                    <div className="border border-[#171717] bg-[#E8DED2] p-3 text-xs font-medium text-[#3B2923]">
                      {profileError}
                    </div>
                  )}

                  <div>
                    <label className="block font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[#171717]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1.5 w-full border border-[#171717] bg-white px-3.5 py-2.5 text-sm focus:border-[#795548] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[#171717]">
                      Contact Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="e.g., 0917-123-4567"
                      className="mt-1.5 w-full border border-[#171717] bg-white px-3.5 py-2.5 text-sm focus:border-[#795548] focus:outline-none"
                    />
                  </div>

                  <p className="text-[11px] text-[#171717]/60">
                    Registered email ({customer.email}) and password credentials
                    cannot be changed here.
                  </p>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 border border-[#171717] bg-[#171717] px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-[#795548] disabled:opacity-60 cursor-pointer"
                    >
                      {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Save Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="border border-[#171717] bg-white px-4 py-2.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-[#171717] hover:bg-[#E8DED2] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <dl className="mt-5 space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-4 w-4 text-[#795548] shrink-0" />
                    <div>
                      <dt className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-[#171717]/55">
                        Full Name
                      </dt>
                      <dd className="font-semibold text-[#171717]">
                        {customer.fullName}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 text-[#795548] shrink-0" />
                    <div>
                      <dt className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-[#171717]/55">
                        Email Address
                      </dt>
                      <dd className="font-semibold text-[#171717]">
                        {customer.email}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 text-[#795548] shrink-0" />
                    <div>
                      <dt className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-[#171717]/55">
                        Contact Number
                      </dt>
                      <dd className="font-semibold text-[#171717]">
                        {customer.contactNumber || "Not added yet"}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-4 w-4 text-[#795548] shrink-0" />
                    <div>
                      <dt className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-[#171717]/55">
                        Member Since
                      </dt>
                      <dd className="font-semibold text-[#171717]">
                        {formatDateTime(customer.createdAt)}
                      </dd>
                    </div>
                  </div>
                </dl>
              )}
            </div>
          </div>

          {/* Order History Preview */}
          <div className="lg:col-span-7">
            <div className="border border-[#171717] bg-white">
              <div className="flex items-center justify-between border-b border-[#171717] bg-[#F7F4EE] px-6 py-4">
                <div>
                  <h2 className="font-editorial text-2xl text-[#171717]">
                    Recent Orders
                  </h2>
                  <p className="text-xs text-[#171717]/65">
                    Your latest BGC Coffee Co. pickup orders
                  </p>
                </div>
                <Link
                  href="/orders"
                  className="inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-[#795548] hover:underline underline-offset-4"
                >
                  All Orders
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {ordersLoading ? (
                <div className="p-6 space-y-3">
                  {[1, 2].map((n) => (
                    <div key={n} className="h-16 animate-pulse bg-[#F7F4EE]" />
                  ))}
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#171717] bg-[#F7F4EE] text-[#171717]">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <p className="mt-4 font-editorial text-xl text-[#171717]">
                    No orders yet
                  </p>
                  <p className="mt-1 text-xs text-[#171717]/65">
                    Ready for your first cup? Browse our coffee catalog to place
                    a pickup order.
                  </p>
                  <Link
                    href="/menu"
                    className="mt-5 inline-flex items-center gap-2 border border-[#171717] bg-[#171717] px-6 py-2.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-[#795548]"
                  >
                    Explore Menu
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#D9D9D9]">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 hover:bg-[#F7F4EE]/50"
                    >
                      <div>
                        <p className="font-mono text-xs font-bold text-[#171717]">
                          {order.orderReference}
                        </p>
                        <p className="mt-0.5 text-xs text-[#171717]/70">
                          {order.items
                            .map((i) => `${i.quantity}× ${i.productName}`)
                            .join(", ")}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#171717]/50">
                          {formatDateTime(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={getOrderStatusVariant(order.status)}>
                          {order.status}
                        </Badge>
                        <span className="font-display text-sm font-bold text-[#171717]">
                          {formatPHP(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
