import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderConfirmationView } from "@/components/checkout/OrderConfirmationView";
import { CustomerRouteGuard } from "@/components/auth/CustomerRouteGuard";

export const instant = false;

export const metadata: Metadata = {
  title: "Order Confirmation",
  description:
    "Your BGC Coffee Co. pickup order confirmation and reference number.",
};

export default function OrderConfirmationPage() {
  return (
    <div className="bg-paper-grain min-h-[75vh]">
      <Suspense
        fallback={
          <div className="mx-auto max-w-3xl px-4 py-16">
            <div className="h-72 animate-pulse border border-[#171717]/20 bg-white" />
          </div>
        }
      >
        <CustomerRouteGuard>
          <OrderConfirmationView />
        </CustomerRouteGuard>
      </Suspense>
    </div>
  );
}
