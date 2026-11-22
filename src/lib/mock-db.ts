import fs from "fs";
import path from "path";
import { INITIAL_PRODUCTS } from "@/data/products";
import { INITIAL_ORDERS } from "@/data/orders";
import { Product } from "@/types/product";
import { Order } from "@/types/order";
import { CustomerRecord, CustomerSession } from "@/types/auth";

/**
 * Local File-Backed Mock Database (Server-Side Prototype Only)
 *
 * IMPORTANT:
 * - This module simulates a persistent NoSQL store for local development and demo purposes.
 * - It is NOT a production database.
 * - In Phase 2 (AWS Integration), `src/services/product-service.ts`,
 *   `src/services/order-service.ts`, and `src/services/auth-service.ts` will be
 *   switched to Amazon DynamoDB + Amazon Cognito.
 */

export interface MockDatabaseSchema {
  products: Product[];
  orders: Order[];
  customers: CustomerRecord[];
  sessions: CustomerSession[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE_PATH = path.join(DATA_DIR, "mock-db.json");

function createSeedData(): MockDatabaseSchema {
  return {
    products: structuredClone(INITIAL_PRODUCTS),
    orders: structuredClone(INITIAL_ORDERS),
    customers: [],
    sessions: [],
  };
}

function ensureDbFile(): MockDatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE_PATH)) {
      const seed = createSeedData();
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(seed, null, 2), "utf-8");
      return seed;
    }
    const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<MockDatabaseSchema>;
    if (!Array.isArray(parsed.products) || !Array.isArray(parsed.orders)) {
      const seed = createSeedData();
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(seed, null, 2), "utf-8");
      return seed;
    }
    return {
      products: parsed.products,
      orders: parsed.orders,
      customers: Array.isArray(parsed.customers) ? parsed.customers : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    };
  } catch {
    return createSeedData();
  }
}

export function readMockDb(): MockDatabaseSchema {
  return ensureDbFile();
}

export function writeMockDb(data: MockDatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("[mock-db] Failed to persist local mock database:", err);
  }
}
