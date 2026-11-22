import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Register for a BGC Coffee Co. customer account to place pickup orders and view your order history.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
