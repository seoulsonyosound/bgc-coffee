"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Loader2, Lock } from "lucide-react";
import { BrandWordmark } from "@/components/ui/BrandWordmark";
import { STORAGE_KEYS, writeLocalStorage } from "@/lib/storage";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed.");
      }

      writeLocalStorage(STORAGE_KEYS.ADMIN_SESSION, {
        email: data.admin?.email,
        loggedInAt: new Date().toISOString(),
      });
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper-grain flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="flex justify-center">
          <BrandWordmark variant="dark" href="/" size="lg" showSubtext />
        </div>

        <div className="mt-8 border border-[#171717] bg-white p-8 vintage-shadow">
          <div className="flex items-center gap-3 border-b border-[#171717] pb-4">
            <div className="flex h-10 w-10 items-center justify-center border border-[#171717] bg-[#F7F4EE] text-[#171717]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-editorial text-2xl text-[#171717]">
                Admin Portal Login
              </h1>
              <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-[#795548]">
                b.g.c coffee co. management
              </p>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2 border border-[#171717] bg-[#E8DED2] p-3 text-xs font-medium text-[#3B2923]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#171717]"
              >
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full border border-[#171717] bg-[#F7F4EE]/50 px-4 py-3 text-sm text-[#171717] focus:border-[#795548] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#795548]"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#171717]"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full border border-[#171717] bg-[#F7F4EE]/50 px-4 py-3 text-sm text-[#171717] focus:border-[#795548] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#795548]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 border border-[#171717] bg-[#171717] px-6 py-3.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#795548] hover:border-[#795548] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-[0.14em] text-[#171717]/70 hover:text-[#795548]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
