import crypto from "crypto";
import { readMockDb, writeMockDb } from "@/lib/mock-db";
import { isValidEmail } from "@/lib/utils";
import { Customer, CustomerRecord } from "@/types/auth";

/**
 * Server-Side Local Mock Customer Authentication Service
 *
 * SECURITY & PROTOTYPE NOTICE:
 * - Uses Node.js `crypto.scryptSync` with per-user random salt and constant-time
 *   comparison (`crypto.timingSafeEqual`) so passwords are never stored in plain text.
 * - Sessions use cryptographically random tokens stored in an HttpOnly, SameSite=Lax cookie.
 * - This is an academic local prototype and NOT production-grade authentication.
 * - In Phase 2 (AWS), this service will be replaced by Amazon Cognito + DynamoDB.
 */

export const CUSTOMER_SESSION_COOKIE = "bgc_customer_session";
export const ADMIN_SESSION_COOKIE = "bgc_admin_demo_session";

const SESSION_DURATION_DEFAULT_MS = 1000 * 60 * 60 * 12; // 12 hours
const SESSION_DURATION_REMEMBER_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

function toPublicCustomer(record: CustomerRecord): Customer {
  return {
    id: record.id,
    fullName: record.fullName,
    email: record.email,
    contactNumber: record.contactNumber,
    createdAt: record.createdAt,
  };
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string
): boolean {
  const derived = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHash, "hex");
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}

export async function registerCustomerRecord(input: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<{ customer?: Customer; error?: string; status: number }> {
  const fullName = String(input.fullName || "").trim();
  const email = String(input.email || "").trim().toLowerCase();
  const password = String(input.password || "");
  const confirmPassword = String(input.confirmPassword || "");

  if (fullName.length < 2) {
    return { error: "Please enter your full name.", status: 400 };
  }
  if (!isValidEmail(email)) {
    return { error: "Please enter a valid email address.", status: 400 };
  }
  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters long.",
      status: 400,
    };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match.", status: 400 };
  }

  const db = readMockDb();
  const existing = db.customers.find((c) => c.email.toLowerCase() === email);
  if (existing) {
    return {
      error: "An account with this email address already exists.",
      status: 409,
    };
  }

  const now = new Date().toISOString();
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(password, salt);

  const newRecord: CustomerRecord = {
    id: `cust-${crypto.randomUUID()}`,
    fullName,
    email,
    passwordHash,
    passwordSalt: salt,
    createdAt: now,
    updatedAt: now,
  };

  db.customers.push(newRecord);
  writeMockDb(db);

  return { customer: toPublicCustomer(newRecord), status: 201 };
}

export async function authenticateCustomerCredentials(input: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<{
  customer?: Customer;
  sessionToken?: string;
  maxAgeSeconds?: number;
  error?: string;
  status: number;
}> {
  const email = String(input.email || "").trim().toLowerCase();
  const password = String(input.password || "");

  if (!isValidEmail(email) || !password) {
    return {
      error: "Please enter a valid email address and password.",
      status: 400,
    };
  }

  const db = readMockDb();
  const record = db.customers.find((c) => c.email.toLowerCase() === email);

  if (!record || !verifyPassword(password, record.passwordSalt, record.passwordHash)) {
    return {
      error: "Invalid email address or password.",
      status: 401,
    };
  }

  // Clean up expired sessions for hygiene
  const nowMs = Date.now();
  db.sessions = db.sessions.filter(
    (s) => new Date(s.expiresAt).getTime() > nowMs
  );

  const durationMs = input.rememberMe
    ? SESSION_DURATION_REMEMBER_MS
    : SESSION_DURATION_DEFAULT_MS;

  const token = crypto.randomBytes(32).toString("hex");
  const nowIso = new Date(nowMs).toISOString();
  const expiresIso = new Date(nowMs + durationMs).toISOString();

  db.sessions.push({
    token,
    customerId: record.id,
    createdAt: nowIso,
    expiresAt: expiresIso,
  });

  writeMockDb(db);

  return {
    customer: toPublicCustomer(record),
    sessionToken: token,
    maxAgeSeconds: Math.floor(durationMs / 1000),
    status: 200,
  };
}

export async function getCustomerBySessionToken(
  token: string | undefined
): Promise<Customer | null> {
  if (!token) return null;

  const db = readMockDb();
  const session = db.sessions.find((s) => s.token === token);
  if (!session) return null;

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    db.sessions = db.sessions.filter((s) => s.token !== token);
    writeMockDb(db);
    return null;
  }

  const record = db.customers.find((c) => c.id === session.customerId);
  if (!record) return null;

  return toPublicCustomer(record);
}

export async function revokeCustomerSession(
  token: string | undefined
): Promise<void> {
  if (!token) return;
  const db = readMockDb();
  const nextSessions = db.sessions.filter((s) => s.token !== token);
  if (nextSessions.length !== db.sessions.length) {
    db.sessions = nextSessions;
    writeMockDb(db);
  }
}

export async function updateCustomerProfileById(
  customerId: string,
  updates: { fullName: string; contactNumber?: string }
): Promise<{ customer?: Customer; error?: string; status: number }> {
  const fullName = String(updates.fullName || "").trim();
  const contactNumber = updates.contactNumber?.trim() || undefined;

  if (fullName.length < 2) {
    return { error: "Full name must be at least 2 characters.", status: 400 };
  }

  const db = readMockDb();
  const index = db.customers.findIndex((c) => c.id === customerId);
  if (index === -1) {
    return { error: "Customer account not found.", status: 404 };
  }

  db.customers[index] = {
    ...db.customers[index],
    fullName,
    contactNumber,
    updatedAt: new Date().toISOString(),
  };

  writeMockDb(db);
  return { customer: toPublicCustomer(db.customers[index]), status: 200 };
}
