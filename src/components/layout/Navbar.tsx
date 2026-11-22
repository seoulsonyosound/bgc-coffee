"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, ShoppingBag, User, X } from "lucide-react";
import { BrandWordmark } from "@/components/ui/BrandWordmark";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/lib/auth/auth-context";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, isHydrated } = useCart();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F7F4EE]/95 backdrop-blur-xs text-[#171717] border-b border-[#171717]">
      {/* Subtle Top Editorial Micro-Strip */}
      <div className="bg-[#171717] text-[#F7F4EE] px-4 py-1.5 text-center text-[10px] font-display font-medium uppercase tracking-[0.24em]">
        b.g.c coffee co. ✦ crafted daily for pickup ✦ cash on pickup available
      </div>

      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        <BrandWordmark variant="dark" href="/" size="md" />

        {/* Desktop Nav */}
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-7"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-display text-xs font-semibold uppercase tracking-[0.16em] transition-colors py-1",
                  isActive
                    ? "text-[#795548] border-b-2 border-[#795548]"
                    : "text-[#171717] hover:text-[#795548]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {!isLoading &&
            (isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href="/account"
                  className={cn(
                    "inline-flex items-center gap-1.5 border px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
                    pathname.startsWith("/account")
                      ? "border-[#171717] bg-[#E8DED2] text-[#171717]"
                      : "border-[#171717]/30 bg-white text-[#171717] hover:border-[#171717] hover:bg-[#E8DED2]"
                  )}
                >
                  <User className="h-3.5 w-3.5 text-[#795548]" />
                  My Account
                </Link>
                <Link
                  href="/orders"
                  className={cn(
                    "border px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
                    pathname.startsWith("/orders")
                      ? "border-[#171717] bg-[#E8DED2] text-[#171717]"
                      : "border-[#171717]/30 bg-white text-[#171717] hover:border-[#171717] hover:bg-[#E8DED2]"
                  )}
                >
                  Order History
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 border border-transparent px-2.5 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-[#795548] hover:border-[#171717] hover:bg-white transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href="/login"
                  className="border border-[#171717]/35 bg-white px-3.5 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-[#171717] hover:border-[#171717] hover:bg-[#E8DED2] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="border border-[#795548] bg-[#795548] px-3.5 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#3B2923] hover:border-[#3B2923] transition-colors"
                >
                  Create Account
                </Link>
              </div>
            ))}

          <Link
            href="/cart"
            aria-label={`Shopping cart with ${isHydrated ? totalItems : 0} items`}
            className="relative inline-flex items-center gap-2 border border-[#171717] bg-[#171717] px-3.5 py-2 font-display text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#795548] hover:border-[#795548] transition-colors"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cart</span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F7F4EE] px-1.5 text-[11px] font-bold text-[#171717]">
              {isHydrated ? totalItems : 0}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex lg:hidden items-center justify-center border border-[#171717] bg-white p-2 text-[#171717] hover:bg-[#E8DED2] transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#171717] bg-[#F7F4EE] px-4 pb-6 pt-4">
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col space-y-1.5"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "border px-3.5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
                    isActive
                      ? "border-[#171717] bg-[#171717] text-white"
                      : "border-transparent text-[#171717] hover:border-[#171717]/20 hover:bg-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-3 mt-2 border-t border-[#171717]/20 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="border border-[#171717]/30 bg-white px-3.5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-[#171717]"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setMobileOpen(false)}
                    className="border border-[#171717]/30 bg-white px-3.5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-[#171717]"
                  >
                    Order History
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="border border-[#171717] bg-[#171717] px-3.5 py-2.5 text-left font-display text-xs font-bold uppercase tracking-[0.16em] text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="border border-[#171717] bg-white px-3.5 py-2.5 text-center font-display text-xs font-bold uppercase tracking-[0.14em] text-[#171717]"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="border border-[#795548] bg-[#795548] px-3.5 py-2.5 text-center font-display text-xs font-bold uppercase tracking-[0.14em] text-white"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
