"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  readLocalStorage,
  STORAGE_KEYS,
  writeLocalStorage,
} from "@/lib/storage";
import { CheckCircle2 } from "lucide-react";

export interface CartItem {
  key: string; // unique composite key: productId::variantLabel::temperature
  productId: string;
  productSlug: string;
  productName: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  variantLabel: string;
  temperature: "Iced" | "Hot";
}

interface AddToCartPayload {
  productId: string;
  productSlug: string;
  productName: string;
  imageUrl: string;
  unitPrice: number;
  quantity?: number;
  variantLabel?: string;
  temperature?: "Iced" | "Hot";
}

interface CartContextValue {
  items: CartItem[];
  isHydrated: boolean;
  totalItems: number;
  subtotal: number;
  addItem: (payload: AddToCartPayload) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      const saved = readLocalStorage<CartItem[]>(STORAGE_KEYS.CART, []);
      if (Array.isArray(saved)) {
        setItems(saved);
      }
      setIsHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    writeLocalStorage(STORAGE_KEYS.CART, items);
  }, [items, isHydrated]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2600);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const addItem = useCallback((payload: AddToCartPayload) => {
    const variantLabel = payload.variantLabel || "Regular (12oz)";
    const temperature = payload.temperature || "Iced";
    const quantityToAdd = Math.max(1, payload.quantity ?? 1);
    const key = `${payload.productId}::${variantLabel}::${temperature}`;

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + quantityToAdd } : i
        );
      }
      return [
        ...prev,
        {
          key,
          productId: payload.productId,
          productSlug: payload.productSlug,
          productName: payload.productName,
          imageUrl: payload.imageUrl,
          unitPrice: payload.unitPrice,
          quantity: quantityToAdd,
          variantLabel,
          temperature,
        },
      ];
    });

    setToastMessage(`Added ${payload.productName} to cart`);
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.key !== key));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      isHydrated,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      isHydrated,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 border border-[#171717] bg-[#171717] px-4 py-3 font-display text-xs font-semibold uppercase tracking-[0.12em] text-[#F7F4EE] shadow-[3px_3px_0px_#795548]"
        >
          <CheckCircle2 className="h-4 w-4 text-[#E8DED2] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider.");
  }
  return ctx;
}
