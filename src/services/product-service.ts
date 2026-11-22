import { readMockDb, writeMockDb } from "@/lib/mock-db";
import { slugify } from "@/lib/utils";
import {
  CreateProductInput,
  Product,
  ProductCategory,
  UpdateProductInput,
} from "@/types/product";

/**
 * Product Service (Server-Side Data Access Layer)
 *
 * Currently backed by local mock-db.ts.
 * Designed with async method signatures so it can be replaced cleanly with
 * Amazon DynamoDB (DocumentClient: ScanCommand, GetCommand, PutCommand,
 * UpdateCommand, DeleteCommand) without changing UI components or API contracts.
 */

export interface ProductFilterOptions {
  category?: ProductCategory | "All";
  search?: string;
  featuredOnly?: boolean;
  availableOnly?: boolean;
}

export async function getProducts(
  filters: ProductFilterOptions = {}
): Promise<Product[]> {
  const db = readMockDb();
  let items = [...db.products];

  if (filters.category && filters.category !== "All") {
    items = items.filter((p) => p.category === filters.category);
  }

  if (filters.featuredOnly) {
    items = items.filter((p) => p.featured);
  }

  if (filters.availableOnly) {
    items = items.filter((p) => p.available);
  }

  if (filters.search && filters.search.trim().length > 0) {
    const q = filters.search.trim().toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tastingNotes && p.tastingNotes.toLowerCase().includes(q))
    );
  }

  return items;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = readMockDb();
  return db.products.find((p) => p.id === id) ?? null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = readMockDb();
  return db.products.find((p) => p.slug === slug || p.id === slug) ?? null;
}

export async function createProduct(
  input: CreateProductInput
): Promise<Product> {
  const db = readMockDb();
  const now = new Date().toISOString();
  const baseSlug = slugify(input.name) || `coffee-${Date.now()}`;

  let uniqueSlug = baseSlug;
  let counter = 2;
  while (db.products.some((p) => p.slug === uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const newProduct: Product = {
    id: `prod-${uniqueSlug}-${Date.now().toString(36).slice(-4)}`,
    slug: uniqueSlug,
    name: input.name.trim(),
    description: input.description.trim(),
    ingredients: input.ingredients,
    badges: input.badges,
    category: input.category,
    price: Number(input.price),
    imageUrl:
      input.imageUrl.trim() ||
      "/images/final-products/Iced-Spanish-Oat-Latte.png",
    available: Boolean(input.available),
    featured: Boolean(input.featured),
    temperatureOptions:
      input.temperatureOptions && input.temperatureOptions.length > 0
        ? input.temperatureOptions
        : ["Iced"],
    variants:
      input.variants && input.variants.length > 0
        ? input.variants
        : [{ id: "std", label: "Standard", priceDelta: 0 }],
    tastingNotes: input.tastingNotes?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  db.products.unshift(newProduct);
  writeMockDb(db);
  return newProduct;
}

export async function updateProduct(
  id: string,
  updates: UpdateProductInput
): Promise<Product | null> {
  const db = readMockDb();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const existing = db.products[index];
  const updated: Product = {
    ...existing,
    ...updates,
    name: updates.name !== undefined ? updates.name.trim() : existing.name,
    description:
      updates.description !== undefined
        ? updates.description.trim()
        : existing.description,
    price: updates.price !== undefined ? Number(updates.price) : existing.price,
    imageUrl:
      updates.imageUrl !== undefined && updates.imageUrl.trim()
        ? updates.imageUrl.trim()
        : existing.imageUrl,
    updatedAt: new Date().toISOString(),
  };

  db.products[index] = updated;
  writeMockDb(db);
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = readMockDb();
  const initialLength = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length === initialLength) return false;
  writeMockDb(db);
  return true;
}
