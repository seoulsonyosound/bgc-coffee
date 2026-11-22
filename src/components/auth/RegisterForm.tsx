"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
} from "lucide-react";
import { BrandWordmark } from "@/components/ui/BrandWordmark";
import { useAuth } from "@/lib/auth/auth-context";
import { isValidEmail } from "@/lib/utils";

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      next.fullName = "Please enter your full name.";
    }
    if (!email.trim() || !isValidEmail(email)) {
      next.email = "Please enter a valid email address.";
    }
    if (password.length < 8) {
      next.password = "Password must be at least 8 characters long.";
    }
    if (confirmPassword !== password) {
      next.confirmPassword = "Passwords do not match.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    if (!validate()) return;

    try {
      setSubmitting(true);
      await register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
      });

      setSuccessMessage(
        "Account created! Redirecting you to the login page..."
      );
      setTimeout(() => {
        router.push("/login?registered=1");
      }, 1100);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Unable to create account."
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
              Member Registration
            </p>
            <h1 className="mt-1 font-editorial text-3xl text-[#171717]">
              Create Your Account
            </h1>
            <p className="mt-1.5 text-xs text-[#171717]/70">
              Join BGC Coffee Co. to place pickup orders and track your coffee
              order history. No email verification required.
            </p>
          </div>

          {submitError && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-2.5 border border-[#171717] bg-[#E8DED2] p-3.5 text-xs font-medium text-[#3B2923]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="mt-5 flex items-start gap-2.5 border border-[#171717] bg-[#F7F4EE] p-3.5 text-xs font-semibold text-[#3B2923]"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#795548]" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="reg-fullName"
                className="block font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#171717]"
              >
                Full Name <span className="text-[#795548]">*</span>
              </label>
              <input
                id="reg-fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Camille Santos"
                className="mt-1.5 w-full border border-[#171717] bg-[#F7F4EE]/50 px-4 py-3 text-sm text-[#171717] focus:border-[#795548] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#795548]"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs font-medium text-[#795548]">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="reg-email"
                className="block font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#171717]"
              >
                Email Address <span className="text-[#795548]">*</span>
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 w-full border border-[#171717] bg-[#F7F4EE]/50 px-4 py-3 text-sm text-[#171717] focus:border-[#795548] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#795548]"
              />
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-[#795548]">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#171717]"
              >
                Password <span className="text-[#795548]">*</span>
              </label>
              <div className="relative mt-1.5">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
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
              {errors.password && (
                <p className="mt-1 text-xs font-medium text-[#795548]">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="reg-confirm"
                className="block font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#171717]"
              >
                Confirm Password <span className="text-[#795548]">*</span>
              </label>
              <div className="relative mt-1.5">
                <input
                  id="reg-confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full border border-[#171717] bg-[#F7F4EE]/50 px-4 py-3 pr-11 text-sm text-[#171717] focus:border-[#795548] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#795548]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={
                    showConfirm
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#171717]/60 hover:text-[#171717] cursor-pointer"
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs font-medium text-[#795548]">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 border border-[#171717] bg-[#171717] px-6 py-3.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#795548] hover:border-[#795548] disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-[#D9D9D9] pt-5 text-center text-xs text-[#171717]/75">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-display font-bold uppercase tracking-[0.12em] text-[#795548] hover:underline underline-offset-4"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
