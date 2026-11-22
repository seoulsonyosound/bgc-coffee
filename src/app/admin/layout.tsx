import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-[#F5F0E8]/35" />}
    >
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
