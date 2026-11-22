import type { Metadata } from "next";
import { Suspense } from "react";
import {
  DM_Sans,
  DM_Serif_Display,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { CartProvider } from "@/components/cart/CartProvider";
import { StorefrontShell } from "@/components/layout/StorefrontShell";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "b.g.c coffee co. — Good Coffee. Good Mood. Good Days.",
    template: "%s | b.g.c coffee co.",
  },
  description:
    "A little comfort in every cup. Welcome to BGC Coffee Co. — vintage-inspired specialty coffee crafted for everyday pickup rituals.",
  icons: {
    icon: "/images/bgc-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${spaceGrotesk.variable} ${dmSerif.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F4EE] text-[#171717]">
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={<div className="min-h-screen bg-[#F7F4EE]" />}>
              <StorefrontShell>{children}</StorefrontShell>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
