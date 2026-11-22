import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CustomerRouteGuard } from "@/components/auth/CustomerRouteGuard";

export const instant = false;

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your BGC Coffee Co. pickup order with Cash on Pickup payment.",
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="bg-paper-grain min-h-[75vh]" />}>
      <CustomerRouteGuard>
        <div className="bg-white min-h-[75vh]">
          <section className="bg-paper-grain text-[#171717] py-12 border-b border-[#171717]">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#795548]">
                Store Pickup • Cash on Pickup
              </p>
              <h1 className="mt-2 font-editorial text-4xl sm:text-5xl text-[#171717]">
                Checkout
              </h1>
            </div>
          </section>
          <CheckoutForm />
        </div>
      </CustomerRouteGuard>
    </Suspense>
  );
}
