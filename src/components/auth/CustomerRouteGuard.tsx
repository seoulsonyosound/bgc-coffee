"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

interface CustomerRouteGuardProps {
  children: React.ReactNode;
}

export function CustomerRouteGuard({ children }: CustomerRouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      const qs = searchParams.toString();
      const target = qs ? `${pathname}?${qs}` : pathname;
      router.replace(`/login?redirect=${encodeURIComponent(target)}`);
    }
  }, [isAuthenticated, isLoading, pathname, searchParams, router]);

  if (isLoading) {
    return (
      <div className="bg-paper-grain min-h-[65vh] flex items-center justify-center px-4">
        <div className="flex items-center gap-3 border border-[#171717] bg-white px-6 py-4 vintage-shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-[#795548]" />
          <span className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#171717]">
            Checking your session...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
