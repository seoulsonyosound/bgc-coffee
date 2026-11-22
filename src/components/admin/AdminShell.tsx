"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Coffee,
  ExternalLink,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  ShoppingBag,
  X,
} from "lucide-react";
import { BrandWordmark } from "@/components/ui/BrandWordmark";
import { cn } from "@/lib/utils";
import { removeLocalStorage, STORAGE_KEYS } from "@/lib/storage";

const ADMIN_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Coffee },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const [checkingAuth, setCheckingAuth] = useState(!isLoginPage);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState("BGC Store Manager");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoginPage) {
      return;
    }

    let active = true;
    async function verifySession() {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();
        if (active) {
          if (data.authenticated) {
            setAuthenticated(true);
            if (data.admin?.name) setAdminName(data.admin.name);
          } else {
            setAuthenticated(false);
            router.replace("/admin/login");
          }
        }
      } catch {
        if (active) {
          setAuthenticated(false);
          router.replace("/admin/login");
        }
      } finally {
        if (active) setCheckingAuth(false);
      }
    }
    verifySession();
    return () => {
      active = false;
    };
  }, [isLoginPage, pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } finally {
      removeLocalStorage(STORAGE_KEYS.ADMIN_SESSION);
      setAuthenticated(false);
      router.push("/admin/login");
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F4EE]">
        <div className="flex items-center gap-3 border border-[#171717] bg-white px-6 py-4 vintage-shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-[#795548]" />
          <span className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#171717]">
            Verifying admin session...
          </span>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#F7F4EE] text-[#171717]">
      {/* Desktop Minimalist Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white text-[#171717] border-r border-[#171717]">
        <div className="flex h-20 items-center px-5 border-b border-[#171717]">
          <BrandWordmark variant="dark" href="/admin/dashboard" size="sm" />
        </div>

        <div className="px-5 py-3.5 border-b border-[#D9D9D9] bg-[#F7F4EE]">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-[#795548]">
            Management Portal
          </p>
          <p className="mt-0.5 text-xs font-semibold text-[#171717] truncate">
            {adminName}
          </p>
        </div>

        <nav aria-label="Admin sidebar" className="flex-1 space-y-1.5 px-3 py-5">
          {ADMIN_LINKS.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 border px-3.5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.14em] transition-colors",
                  active
                    ? "border-[#171717] bg-[#171717] text-white"
                    : "border-transparent text-[#171717]/75 hover:border-[#171717]/25 hover:bg-[#F7F4EE] hover:text-[#171717]"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#171717] p-3 space-y-1.5 bg-[#F7F4EE]">
          <Link
            href="/"
            className="flex items-center gap-3 border border-[#171717]/25 bg-white px-3.5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-[#171717] hover:border-[#171717] hover:bg-[#E8DED2] transition-colors"
          >
            <ExternalLink className="h-4 w-4 shrink-0 text-[#795548]" />
            View Website
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 border border-transparent px-3.5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-[#3B2923] hover:border-[#171717] hover:bg-[#171717] hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Topbar & Drawer */}
      <div className="flex flex-1 flex-col lg:pl-64 min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#171717] bg-white px-4 sm:px-6 lg:hidden">
          <BrandWordmark variant="dark" href="/admin/dashboard" size="sm" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle admin navigation"
            className="border border-[#171717] p-2 text-[#171717] hover:bg-[#E8DED2]"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </header>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white text-[#171717] px-4 py-4 space-y-1.5 border-b border-[#171717]">
            {ADMIN_LINKS.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 border px-3.5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.14em]",
                    active
                      ? "border-[#171717] bg-[#171717] text-white"
                      : "border-transparent text-[#171717] hover:bg-[#F7F4EE]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 mt-2 border-t border-[#D9D9D9] flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-[#171717]"
              >
                <ExternalLink className="h-4 w-4 text-[#795548]" />
                View Website
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 border border-[#171717] bg-[#171717] px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
