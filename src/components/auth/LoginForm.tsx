"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
} from "lucide-react";
import { BrandWordmark } from "@/components/ui/BrandWordmark";
import { useAuth } from "@/lib/auth/auth-context";
import { isValidEmail } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const redirectParam = searchParams.get("redirect");
  const justRegistered = searchParams.get("registered") === "1";

  // Allow only safe relative redirects
  const safeRedirect =
    redirectParam &&
    redirectParam.startsWith("/") &&
    !redirectParam.startsWith("//")
      ? redirectParam
      : "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setSubmitting(true);
      await login({
        email: email.trim().toLowerCase(),
        password,
        rememberMe,
      });
      router.push(safeRedirect);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid email address or password."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-paper-grain min-h-[82vh] flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="flex justify-center">
          <BrandWordmark variant="dark" href="/" size="lg" showSubtext />
        </div>

        <div className="mt-8 border border-[#171717] bg-white p-7 sm:p-9 vintage-shadow">
          <div className="border-b border-[#171717] pb-4">
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-[#795548]">
              Customer Sign In
            </p>
            <h1 className="mt-1 font-editorial text-3xl text-[#171717]">
              Welcome Back
            </h1>
            <p className="mt-1.5 text-xs text-[#171717]/70">
              {redirectParam === "/checkout"
                ? "Please log in to complete your pickup checkout. Your cart items are saved."
                : "Log in with your registered email and password to order and view your pickup history."}
            </p>
          </div>

          {justRegistered && (
            <div
              role="status"
              className="mt-5 flex items-start gap-2.5 border border-[#171717] bg-[#F7F4EE] p-3.5 text-xs font-semibold text-[#3B2923]"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#795548]" />
              <span>
                Account created successfully! Please log in with your email and
                password.
              </span>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-2.5 border border-[#171717] bg-[#E8DED2] p-3.5 text-xs font-medium text-[#3B2923]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#171717]"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 w-full border border-[#171717] bg-[#F7F4EE]/50 px-4 py-3 text-sm text-[#171717] focus:border-[#795548] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#795548]"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#171717]"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-[#171717] bg-[#F7F4EE]/50 px-4 py-3 pr-11 text-sm text-[#171717] focus:border-[#795548] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#795548]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#171717]/60 hover:text-[#171717] cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-[#171717]/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 accent-[#795548]"
                />
                Remember me on this device
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 border border-[#171717] bg-[#171717] px-6 py-3.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#795548] hover:border-[#795548] disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging In...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Log In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-[#D9D9D9] pt-5 text-center text-xs text-[#171717]/75">
            New to BGC Coffee Co.?{" "}
            <Link
              href="/register"
              className="font-display font-bold uppercase tracking-[0.12em] text-[#795548] hover:underline underline-offset-4"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
