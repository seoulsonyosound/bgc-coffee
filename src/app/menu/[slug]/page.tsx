import { Suspense } from "react";
import { ProductDetailView } from "@/components/products/ProductDetailView";

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="aspect-square max-w-md rounded-3xl bg-[#F5F0E8] animate-pulse" />
        </div>
      }
    >
      <ProductDetailView />
    </Suspense>
  );
}
