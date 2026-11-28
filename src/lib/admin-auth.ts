import crypto from "crypto";
import { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/services/auth-service";

export function getAdminConfig() {
  return {
    email: (process.env.ADMIN_EMAIL || "").trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "",
    sessionSecret: process.env.ADMIN_SESSION_SECRET || "",
  };
}

export function isAdminConfigured(): boolean {
  const cfg = getAdminConfig();
  return Boolean(cfg.email && cfg.password && cfg.sessionSecret);
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  if (!isAdminConfigured()) return false;
  const cfg = getAdminConfig();
  return (
    safeEqual(email.trim().toLowerCase(), cfg.email) &&
    safeEqual(password, cfg.password)
  );
}

export function createAdminSessionToken(): string {
  const cfg = getAdminConfig();
  if (!cfg.email || !cfg.sessionSecret) {
    throw new Error("Admin authentication environment variables are not configured.");
  }
  const payload = `admin:${cfg.email}`;
  const sig = crypto
    .createHmac("sha256", cfg.sessionSecret)
    .update(payload)
    .digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${sig}`;
}

export function isAdminRequest(request: NextRequest): boolean {
  if (!isAdminConfigured()) return false;
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;

  const expected = createAdminSessionToken();
  return safeEqual(token, expected);
}
