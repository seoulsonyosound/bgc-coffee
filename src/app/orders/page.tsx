import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomerRouteGuard } from "@/components/auth/CustomerRouteGuard";
import { CustomerOrdersView } from "@/components/auth/CustomerOrdersView";

export const instant = false;

export const metadata: Metadata = {
  title: "Order History",
  description: "View your past and active BGC Coffee Co. pickup orders.",
};

export default function CustomerOrdersPage() {
  return (
    <Suspense fallback={<div className="bg-paper-grain min-h-[75vh]" />}>
      <CustomerRouteGuard>
        <CustomerOrdersView />
      </CustomerRouteGuard>
    </Suspense>
  );
}
