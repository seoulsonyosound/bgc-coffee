import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomerRouteGuard } from "@/components/auth/CustomerRouteGuard";
import { AccountView } from "@/components/auth/AccountView";

export const instant = false;

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your BGC Coffee Co. customer profile and order history.",
};

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="bg-paper-grain min-h-[75vh]" />}>
      <CustomerRouteGuard>
        <AccountView />
      </CustomerRouteGuard>
    </Suspense>
  );
}
