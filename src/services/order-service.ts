import {
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { isDynamoDbMode } from "@/lib/aws-config";
import { getDynamoDbDocClient, getTableNames } from "@/lib/dynamodb";
import { readMockDb, writeMockDb } from "@/lib/mock-db";
import { generateOrderReference } from "@/lib/utils";
import { getProducts } from "@/services/product-service";
import { CreateOrderInput, Order, OrderItem, OrderStatus } from "@/types/order";

/**
 * Order Service (Server-Side Data Access Layer)
 *
 * Switches cleanly between local mock-db.ts (BGC_DATA_SOURCE=mock) and
 * Amazon DynamoDB (BGC_DATA_SOURCE=dynamodb) using the EC2 IAM Instance Role.
 */

async function scanAllOrders(): Promise<Order[]> {
  const doc = getDynamoDbDocClient();
  const { orders: tableName } = getTableNames();
  const items: Order[] = [];
  let lastEvaluatedKey: Record<string, unknown> | undefined;

  do {
    const res = await doc.send(
      new ScanCommand({
        TableName: tableName,
        ExclusiveStartKey: lastEvaluatedKey,
      })
    );
    if (res.Items) {
      items.push(...(res.Items as Order[]));
    }
    lastEvaluatedKey = res.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return items;
}

export async function getOrders(status?: OrderStatus | "All"): Promise<Order[]> {
  if (isDynamoDbMode()) {
    let orders = await scanAllOrders();
    if (status && status !== "All") {
      orders = orders.filter((o) => o.status === status);
    }
    return orders;
  }

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
  if (isDynamoDbMode()) {
    const doc = getDynamoDbDocClient();
    const { orders: tableName } = getTableNames();

    const byId = await doc.send(
      new GetCommand({
        TableName: tableName,
        Key: { id: idOrRef },
      })
    );
    if (byId.Item) {
      return byId.Item as Order;
    }

    const candidates = Array.from(new Set([idOrRef, idOrRef.toUpperCase()]));
    for (const ref of candidates) {
      const byRef = await doc.send(
        new QueryCommand({
          TableName: tableName,
          IndexName: "orderReference-index",
          KeyConditionExpression: "orderReference = :ref",
          ExpressionAttributeValues: { ":ref": ref },
          Limit: 1,
        })
      );
      if (byRef.Items && byRef.Items.length > 0) {
        return byRef.Items[0] as Order;
      }
    }
    return null;
  }

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
  if (isDynamoDbMode()) {
    const doc = getDynamoDbDocClient();
    const { orders: tableName } = getTableNames();
    const res = await doc.send(
      new QueryCommand({
        TableName: tableName,
        IndexName: "customerId-index",
        KeyConditionExpression: "customerId = :cid",
        ExpressionAttributeValues: { ":cid": customerId },
        ScanIndexForward: false,
      })
    );
    const orders = (res.Items as Order[] | undefined) ?? [];
    orders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return orders;
  }

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

  if (isDynamoDbMode()) {
    let orderReference = generateOrderReference();
    while (await getOrderByIdOrRef(orderReference)) {
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

    const doc = getDynamoDbDocClient();
    const { orders: tableName } = getTableNames();
    await doc.send(
      new PutCommand({
        TableName: tableName,
        Item: newOrder,
      })
    );
    return newOrder;
  }

  const db = readMockDb();
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
  if (isDynamoDbMode()) {
    const existing = await getOrderByIdOrRef(id);
    if (!existing) return null;

    const updatedAt = new Date().toISOString();
    const doc = getDynamoDbDocClient();
    const { orders: tableName } = getTableNames();

    const res = await doc.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { id: existing.id },
        UpdateExpression: "SET #s = :status, updatedAt = :updatedAt",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: {
          ":status": status,
          ":updatedAt": updatedAt,
        },
        ReturnValues: "ALL_NEW",
      })
    );
    return (res.Attributes as Order | undefined) ?? { ...existing, status, updatedAt };
  }

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
  if (isDynamoDbMode()) {
    const results = await Promise.all(
      orderIds.map((orderId) => updateOrderStatus(orderId, status))
    );
    return results.filter((order): order is Order => order !== null);
  }

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
  if (isDynamoDbMode()) {
    const [products, orders] = await Promise.all([getProducts(), getOrders()]);
    const totalProducts = products.length;
    const availableProducts = products.filter((p) => p.available).length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === "Pending").length;
    const completedOrders = orders.filter(
      (o) => o.status === "Completed"
    ).length;

    const totalSales = orders
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
