/**
 * Format a numeric value as Philippine Pesos (₱).
 */
export function formatPHP(amount: number): string {
  return `₱${amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Generate a URL-safe slug from a product name.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generate a unique, human-friendly order reference (e.g., BGC-261122-4829).
 */
export function generateOrderReference(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BGC-${yy}${mm}${dd}-${rand}`;
}

/**
 * Format an ISO date string into a readable local date/time string.
 */
export function formatDateTime(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

/**
 * Format an ISO date string into a compact format like "11-22-26 7:28 PM".
 */
export function formatCompactDateTime(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    const rawHours = d.getHours();
    const ampm = rawHours >= 12 ? "PM" : "AM";
    const hours = rawHours % 12 || 12;
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${mm}-${dd}-${yy} ${hours}:${minutes} ${ampm}`;
  } catch {
    return isoDate;
  }
}

/**
 * Simple className merger.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Validate Philippine-style or general contact phone numbers.
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return /^(\+?\d{10,15})$/.test(cleaned);
}

/**
 * Basic email validation for optional email fields.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
