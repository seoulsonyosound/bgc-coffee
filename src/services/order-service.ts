import { readMockDb, writeMockDb } from "@/lib/mock-db";
import { generateOrderReference } from "@/lib/utils";
import { CreateOrderInput, Order, OrderItem, OrderStatus } from "@/types/order";

/**
 * Order Service (Server-Side Data Access Layer)
 *
 * Currently backed by local mock-db.ts.
 * Designed with async method signatures so it can be replaced cleanly with
 * Amazon DynamoDB (DocumentClient) in Phase 2 without changing UI or API routes.
 */

export async function getOrders(status?: OrderStatus | "All"): Promise<Order[]> {
  const db = readMockDb();
  let orders = [...db.orders];

  if (status && status !== "All") {
    orders = orders.filter((o) => o.status === status);
  }

  // Sort newest first
  orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return orders;
}

export async function getOrderByIdOrRef(idOrRef: string): Promise<Order | null> {
  const db = readMockDb();
  return (
    db.orders.find(
      (o) =>
        o.id === idOrRef ||
        o.orderReference.toLowerCase() === idOrRef.toLowerCase()
    ) ?? null
  );
}

export async function getOrdersByCustomerId(
  customerId: string
): Promise<Order[]> {
  const db = readMockDb();
  const orders = db.orders.filter((o) => o.customerId === customerId);
  orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return orders;
}

export async function createOrder(
  input: CreateOrderInput,
  customerId?: string
): Promise<Order> {
  const db = readMockDb();
  const now = new Date().toISOString();

  const normalizedItems: OrderItem[] = input.items.map((item) => {
    const qty = Math.max(1, Math.floor(Number(item.quantity)));
    const unitPrice = Number(item.unitPrice);
    return {
      productId: item.productId,
      productName: item.productName,
      productSlug: item.productSlug,
      imageUrl: item.imageUrl,
      unitPrice,
      quantity: qty,
      variantLabel: item.variantLabel,
      temperature: item.temperature,
      subtotal: unitPrice * qty,
    };
  });

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalAmount = subtotal;

  let orderReference = generateOrderReference();
  while (db.orders.some((o) => o.orderReference === orderReference)) {
    orderReference = generateOrderReference();
  }

  const newOrder: Order = {
    id: `ord-${Date.now().toString(36)}-${Math.floor(100 + Math.random() * 900)}`,
    orderReference,
    customerId,
    customer: {
      fullName: input.customer.fullName.trim(),
      contactNumber: input.customer.contactNumber.trim(),
      email: input.customer.email?.trim() || undefined,
      pickupNotes: input.customer.pickupNotes?.trim() || undefined,
    },
    items: normalizedItems,
    subtotal,
    totalAmount,
    paymentMethod: "Cash on Pickup",
    status: "Pending",
    createdAt: now,
    updatedAt: now,
  };

  db.orders.unshift(newOrder);
  writeMockDb(db);
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | null> {
  const db = readMockDb();
  const index = db.orders.findIndex(
    (o) => o.id === id || o.orderReference === id
  );
  if (index === -1) return null;

  db.orders[index] = {
    ...db.orders[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  writeMockDb(db);
  return db.orders[index];
}

export async function updateMultipleOrderStatuses(
  orderIds: string[],
  status: OrderStatus
): Promise<Order[]> {
  const db = readMockDb();
  const idSet = new Set(orderIds);
  const now = new Date().toISOString();
  const updatedOrders: Order[] = [];

  db.orders = db.orders.map((order) => {
    if (idSet.has(order.id) || idSet.has(order.orderReference)) {
      const updated: Order = {
        ...order,
        status,
        updatedAt: now,
      };
      updatedOrders.push(updated);
      return updated;
    }
    return order;
  });

  if (updatedOrders.length > 0) {
    writeMockDb(db);
  }
  return updatedOrders;
}

export async function getDashboardMetrics() {
  const db = readMockDb();
  const totalProducts = db.products.length;
  const availableProducts = db.products.filter((p) => p.available).length;
  const totalOrders = db.orders.length;
  const pendingOrders = db.orders.filter((o) => o.status === "Pending").length;
  const completedOrders = db.orders.filter(
    (o) => o.status === "Completed"
  ).length;

  // Total sales excludes Cancelled orders
  const totalSales = db.orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return {
    totalProducts,
    availableProducts,
    totalOrders,
    pendingOrders,
    completedOrders,
    totalSales,
  };
}
