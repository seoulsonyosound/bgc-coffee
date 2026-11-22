import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description:
    "Review your selected BGC Coffee Co. drinks before pickup checkout.",
};

export default function CartPage() {
  return (
    <div className="bg-white min-h-[75vh]">
      <section className="bg-paper-grain text-[#171717] py-12 border-b border-[#171717]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#795548]">
            Pickup Order Bag
          </p>
          <h1 className="mt-2 font-editorial text-4xl sm:text-5xl text-[#171717]">
            Your Shopping Cart
          </h1>
        </div>
      </section>
      <CartView />
    </div>
  );
}
