import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { isDynamoDbMode } from "@/lib/aws-config";
import { getDynamoDbDocClient, getTableNames } from "@/lib/dynamodb";
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
 * Switches cleanly between local mock-db.ts (BGC_DATA_SOURCE=mock) and
 * Amazon DynamoDB (BGC_DATA_SOURCE=dynamodb) using the EC2 IAM Instance Role.
 */

export interface ProductFilterOptions {
  category?: ProductCategory | "All";
  search?: string;
  featuredOnly?: boolean;
  availableOnly?: boolean;
}

function applyProductFilters(
  products: Product[],
  filters: ProductFilterOptions
): Product[] {
  let items = [...products];

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

async function scanAllProducts(): Promise<Product[]> {
  const doc = getDynamoDbDocClient();
  const { products: tableName } = getTableNames();
  const items: Product[] = [];
  let lastEvaluatedKey: Record<string, unknown> | undefined;

  do {
    const res = await doc.send(
      new ScanCommand({
        TableName: tableName,
        ExclusiveStartKey: lastEvaluatedKey,
      })
    );
    if (res.Items) {
      items.push(...(res.Items as Product[]));
    }
    lastEvaluatedKey = res.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  // Sort newest created first (matching unshift behavior in mock mode)
  items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return items;
}

export async function getProducts(
  filters: ProductFilterOptions = {}
): Promise<Product[]> {
  if (isDynamoDbMode()) {
    const all = await scanAllProducts();
    return applyProductFilters(all, filters);
  }

  const db = readMockDb();
  return applyProductFilters(db.products, filters);
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isDynamoDbMode()) {
    const doc = getDynamoDbDocClient();
    const { products: tableName } = getTableNames();
    const res = await doc.send(
      new GetCommand({
        TableName: tableName,
        Key: { id },
      })
    );
    return (res.Item as Product | undefined) ?? null;
  }

  const db = readMockDb();
  return db.products.find((p) => p.id === id) ?? null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isDynamoDbMode()) {
    const doc = getDynamoDbDocClient();
    const { products: tableName } = getTableNames();
    const res = await doc.send(
      new QueryCommand({
        TableName: tableName,
        IndexName: "slug-index",
        KeyConditionExpression: "slug = :slug",
        ExpressionAttributeValues: { ":slug": slug },
        Limit: 1,
      })
    );
    if (res.Items && res.Items.length > 0) {
      return res.Items[0] as Product;
    }
    return getProductById(slug);
  }

  const db = readMockDb();
  return db.products.find((p) => p.slug === slug || p.id === slug) ?? null;
}

export async function createProduct(
  input: CreateProductInput
): Promise<Product> {
  const now = new Date().toISOString();
  const baseSlug = slugify(input.name) || `coffee-${Date.now()}`;

  if (isDynamoDbMode()) {
    let uniqueSlug = baseSlug;
    let counter = 2;
    while (await getProductBySlug(uniqueSlug)) {
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

    const doc = getDynamoDbDocClient();
    const { products: tableName } = getTableNames();
    await doc.send(
      new PutCommand({
        TableName: tableName,
        Item: newProduct,
      })
    );
    return newProduct;
  }

  const db = readMockDb();
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
  if (isDynamoDbMode()) {
    const existing = await getProductById(id);
    if (!existing) return null;

    const updated: Product = {
      ...existing,
      ...updates,
      id: existing.id,
      slug: existing.slug,
      name: updates.name !== undefined ? updates.name.trim() : existing.name,
      description:
        updates.description !== undefined
          ? updates.description.trim()
          : existing.description,
      price:
        updates.price !== undefined ? Number(updates.price) : existing.price,
      imageUrl:
        updates.imageUrl !== undefined && updates.imageUrl.trim()
          ? updates.imageUrl.trim()
          : existing.imageUrl,
      updatedAt: new Date().toISOString(),
    };

    const doc = getDynamoDbDocClient();
    const { products: tableName } = getTableNames();
    await doc.send(
      new PutCommand({
        TableName: tableName,
        Item: updated,
      })
    );
    return updated;
  }

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
  if (isDynamoDbMode()) {
    const doc = getDynamoDbDocClient();
    const { products: tableName } = getTableNames();
    const res = await doc.send(
      new DeleteCommand({
        TableName: tableName,
        Key: { id },
        ReturnValues: "ALL_OLD",
      })
    );
    return Boolean(res.Attributes);
  }

  const db = readMockDb();
  const initialLength = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length === initialLength) return false;
  writeMockDb(db);
  return true;
}
