/**
 * Client-side browser storage helpers.
 *
 * NOTE: Browser localStorage is used strictly for client-side UX state
 * (shopping cart persistence and prototype admin UI state).
 * It is NOT a production database.
 */

export const STORAGE_KEYS = {
  CART: "bgc_coffee_cart_v1",
  LAST_ORDER_REF: "bgc_coffee_last_order_ref_v1",
  ADMIN_SESSION: "bgc_coffee_admin_demo_session_v1",
} as const;

export function readLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeLocalStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private browsing errors gracefully
  }
}

export function removeLocalStorage(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore errors
  }
}
