import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log In",
  description:
    "Log in to your BGC Coffee Co. customer account to place pickup orders and view your order history.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="bg-paper-grain min-h-[82vh]" />}
    >
      <LoginForm />
    </Suspense>
  );
}
