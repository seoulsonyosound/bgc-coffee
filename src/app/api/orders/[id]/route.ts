import { NextRequest, NextResponse } from "next/server";
import { getOrderByIdOrRef, updateOrderStatus } from "@/services/order-service";
import {
  ADMIN_SESSION_COOKIE,
  CUSTOMER_SESSION_COOKIE,
  getCustomerBySessionToken,
} from "@/services/auth-service";
import { ORDER_STATUSES, OrderStatus } from "@/types/order";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isAdminRequest(request: NextRequest): boolean {
  return (
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value ===
    "authenticated-demo-admin"
  );
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const adminAuthed = isAdminRequest(request);
    const customerToken = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
    const customer = await getCustomerBySessionToken(customerToken);

    if (!adminAuthed && !customer) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const order = await getOrderByIdOrRef(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (!adminAuthed && order.customerId !== customer?.id) {
      return NextResponse.json(
        { error: "You do not have permission to view this order." },
        { status: 403 }
      );
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error("[API GET /api/orders/[id]]", error);
    return NextResponse.json(
      { error: "Failed to load order." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(
        { error: "Administrator authentication required." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    if (
      !body?.status ||
      !ORDER_STATUSES.includes(body.status as OrderStatus)
    ) {
      return NextResponse.json(
        { error: "Invalid order status." },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(id, body.status as OrderStatus);
    if (!updated) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ order: updated }, { status: 200 });
  } catch (error) {
    console.error("[API PATCH /api/orders/[id]]", error);
    return NextResponse.json(
      { error: "Failed to update order status." },
      { status: 500 }
    );
  }
}
