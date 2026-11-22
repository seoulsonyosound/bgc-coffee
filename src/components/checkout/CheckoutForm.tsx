"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/lib/auth/auth-context";
import { formatPHP, isValidEmail, isValidPhoneNumber } from "@/lib/utils";
import { STORAGE_KEYS, writeLocalStorage } from "@/lib/storage";

interface FormErrors {
  fullName?: string;
  contactNumber?: string;
  email?: string;
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, isHydrated, subtotal, clearCart } = useCart();
  const { customer } = useAuth();

  const [fullName, setFullName] = useState(() => customer?.fullName || "");
  const [contactNumber, setContactNumber] = useState(
    () => customer?.contactNumber || ""
  );
  const [email, setEmail] = useState(() => customer?.email || "");
  const [pickupNotes, setPickupNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-64 animate-pulse border border-[#171717]/20 bg-[#F7F4EE]" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#171717] bg-[#F7F4EE] text-[#171717]">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <h2 className="mt-5 font-editorial text-3xl text-[#171717]">
          No items to check out
        </h2>
        <p className="mt-2 text-sm text-[#171717]/70">
          Add drinks to your cart before placing a pickup order.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-flex items-center gap-2 border border-[#171717] bg-[#171717] px-7 py-3 font-display text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-[#795548]"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      nextErrors.fullName = "Please enter your full name.";
    }

    if (!contactNumber.trim() || !isValidPhoneNumber(contactNumber)) {
      nextErrors.contactNumber =
        "Enter a valid mobile or phone number (e.g., 0917-123-4567).";
    }

    if (email.trim() && !isValidEmail(email)) {
      nextErrors.email =
        "Please enter a valid email address or leave it blank.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            fullName: fullName.trim(),
            contactNumber: contactNumber.trim(),
            email: email.trim() || undefined,
            pickupNotes: pickupNotes.trim() || undefined,
          },
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productSlug: item.productSlug,
            imageUrl: item.imageUrl,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            variantLabel: item.variantLabel,
            temperature: item.temperature,
          })),
          paymentMethod: "Cash on Pickup",
        }),
      });

      const data = await res.json();
      if (res.status === 401) {
        router.push("/login?redirect=%2Fcheckout");
        return;
      }
      if (!res.ok) {
        throw new Error(data.error || "Unable to place your order.");
      }

      const orderRef = data.order.orderReference;
      writeLocalStorage(STORAGE_KEYS.LAST_ORDER_REF, orderRef);
      clearCart();
      router.push(`/order-confirmation?ref=${encodeURIComponent(orderRef)}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-[#171717]/75 hover:text-[#795548]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Shopping Bag
      </Link>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3"
      >
        {/* Customer Details Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-[#171717] bg-white p-6 sm:p-8">
            <h2 className="font-editorial text-2xl text-[#171717] border-b border-[#171717] pb-3">
              Customer &amp; Pickup Information
            </h2>
            <p className="mt-3 text-sm text-[#171717]/70">
              We&apos;ll use your name and contact number to call out your order
              at the pickup counter.
            </p>

            {submitError && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2.5 border border-[#171717] bg-[#E8DED2] p-4 text-sm text-[#3B2923]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="fullName"
                  className="block font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#171717]"
                >
                  Full Name <span className="text-[#795548]">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Juan Dela Cruz"
                  className="mt-2 w-full border border-[#171717] bg-[#F7F4EE]/50 px-4 py-3 text-sm text-[#171717] focus:border-[#795548] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#795548]"
                />
                {errors.fullName && (
                  <p className="mt-1.5 text-xs font-medium text-[#795548]">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contactNumber"
                  className="block font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#171717]"
                >
                  Contact Number <span className="text-[#795548]">*</span>
                </label>
                <input
                  id="contactNumber"
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="e.g., 0917-123-4567"
                  className="mt-2 w-full border border-[#171717] bg-[#F7F4EE]/50 px-4 py-3 text-sm text-[#171717] focus:border-[#795548] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#795548]"
                />
                {errors.contactNumber && (
                  <p className="mt-1.5 text-xs font-medium text-[#795548]">
                    {errors.contactNumber}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#171717]"
                >
                  Email Address{" "}
                  <span className="text-[#171717]/45 font-normal normal-case">
                    (Optional)
                  </span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., juan@example.com"
                  className="mt-2 w-full border border-[#171717] bg-[#F7F4EE]/50 px-4 py-3 text-sm text-[#171717] focus:border-[#795548] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#795548]"
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-[#795548]">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="pickupNotes"
                  className="block font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#171717]"
                >
                  Pickup Instructions or Notes{" "}
                  <span className="text-[#171717]/45 font-normal normal-case">
                    (Optional)
                  </span>
                </label>
                <textarea
                  id="pickupNotes"
                  rows={3}
                  value={pickupNotes}
                  onChange={(e) => setPickupNotes(e.target.value)}
                  placeholder="e.g., Less ice, 50% sweetness, arriving in 15 minutes..."
                  className="mt-2 w-full border border-[#171717] bg-[#F7F4EE]/50 px-4 py-3 text-sm text-[#171717] focus:border-[#795548] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#795548]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section (Cash on Pickup ONLY) */}
          <div className="border border-[#171717] bg-white p-6 sm:p-8">
            <h2 className="font-editorial text-2xl text-[#171717] border-b border-[#171717] pb-3">
              Payment Method
            </h2>
            <div className="mt-5 flex items-start gap-4 border border-[#171717] bg-[#F7F4EE] p-4 shadow-[3px_3px_0px_#795548]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#171717] bg-[#171717] text-white">
                <Banknote className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-display text-sm font-bold uppercase tracking-wider text-[#171717]">
                    Cash on Pickup
                  </p>
                  <CheckCircle2 className="h-5 w-5 text-[#795548]" />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[#171717]/75">
                  Pay in Philippine Pesos (₱) directly at the BGC Coffee Co.
                  pickup counter when you collect your order. No online payment
                  gateway is required.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Review Summary Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 border border-[#171717] bg-[#F7F4EE] p-6 vintage-shadow">
            <h2 className="font-editorial text-2xl text-[#171717] border-b border-[#171717] pb-3">
              Order Summary
            </h2>

            <ul className="mt-4 divide-y divide-[#171717]/15">
              {items.map((item) => (
                <li
                  key={item.key}
                  className="py-3 flex items-start justify-between gap-3 text-sm"
                >
                  <div>
                    <p className="font-semibold text-[#171717]">
                      {item.quantity}× {item.productName}
                    </p>
                    <p className="font-display text-[11px] uppercase tracking-wider text-[#171717]/60">
                      {item.temperature} • {item.variantLabel}
                    </p>
                  </div>
                  <p className="font-display font-bold text-[#171717] whitespace-nowrap">
                    {formatPHP(item.unitPrice * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2.5 border-t border-[#171717] pt-4 text-sm">
              <div className="flex justify-between text-[#171717]/75">
                <dt>Subtotal</dt>
                <dd className="font-display font-semibold text-[#171717]">
                  {formatPHP(subtotal)}
                </dd>
              </div>
              <div className="flex justify-between text-[#171717]/75">
                <dt>Payment</dt>
                <dd className="font-display font-semibold text-[#795548]">
                  Cash on Pickup
                </dd>
              </div>
              <div className="flex justify-between border-t border-[#171717] pt-3 text-base">
                <dt className="font-display font-bold uppercase tracking-wider text-[#171717]">
                  Total Amount
                </dt>
                <dd className="font-display font-bold text-[#171717]">
                  {formatPHP(subtotal)}
                </dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 border border-[#171717] bg-[#171717] px-6 py-4 font-display text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#795548] hover:border-[#795548] disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                `Place Pickup Order • ${formatPHP(subtotal)}`
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
