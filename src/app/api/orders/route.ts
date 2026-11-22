import { NextRequest, NextResponse } from "next/server";
import {
  createOrder,
  getDashboardMetrics,
  getOrderByIdOrRef,
  getOrders,
  getOrdersByCustomerId,
  updateMultipleOrderStatuses,
} from "@/services/order-service";
import {
  ADMIN_SESSION_COOKIE,
  CUSTOMER_SESSION_COOKIE,
  getCustomerBySessionToken,
} from "@/services/auth-service";
import { isValidEmail, isValidPhoneNumber } from "@/lib/utils";
import { ORDER_STATUSES, OrderStatus } from "@/types/order";

function isAdminRequest(request: NextRequest): boolean {
  return (
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value ===
    "authenticated-demo-admin"
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get("ref");
    const scope = searchParams.get("scope");
    const statusParam = searchParams.get("status");
    const includeMetrics = searchParams.get("metrics") === "true";

    const adminAuthed = isAdminRequest(request);
    const customerToken = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
    const customer = await getCustomerBySessionToken(customerToken);

    // 1. Customer-scoped order history (/orders)
    if (scope === "customer") {
      if (!customer) {
        return NextResponse.json(
          { error: "Please log in to view your order history." },
          { status: 401 }
        );
      }
      const orders = await getOrdersByCustomerId(customer.id);
      return NextResponse.json({ orders }, { status: 200 });
    }

    // 2. Single order lookup by reference (/order-confirmation)
    if (ref) {
      if (!customer && !adminAuthed) {
        return NextResponse.json(
          { error: "Authentication required to view order details." },
          { status: 401 }
        );
      }
      const order = await getOrderByIdOrRef(ref);
      if (!order) {
        return NextResponse.json(
          { error: "Order not found." },
          { status: 404 }
        );
      }
      if (!adminAuthed && order.customerId !== customer?.id) {
        return NextResponse.json(
          { error: "You do not have permission to view this order." },
          { status: 403 }
        );
      }
      return NextResponse.json({ order }, { status: 200 });
    }

    // 3. Full orders list / dashboard metrics (Admin only)
    if (!adminAuthed) {
      return NextResponse.json(
        { error: "Administrator authentication required." },
        { status: 403 }
      );
    }

    const status =
      statusParam &&
      statusParam !== "All" &&
      ORDER_STATUSES.includes(statusParam as OrderStatus)
        ? (statusParam as OrderStatus)
        : "All";

    const orders = await getOrders(status);

    if (includeMetrics) {
      const metrics = await getDashboardMetrics();
      return NextResponse.json({ orders, metrics }, { status: 200 });
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("[API GET /api/orders]", error);
    return NextResponse.json(
      { error: "Failed to load orders." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Server-side enforcement: customer MUST be authenticated to place an order.
    // Never trust a customerId supplied by the browser.
    const customerToken = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
    const authenticatedCustomer =
      await getCustomerBySessionToken(customerToken);

    if (!authenticatedCustomer) {
      return NextResponse.json(
        { error: "You must be logged in to submit an order." },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body?.customer?.fullName || !body.customer.fullName.trim()) {
      return NextResponse.json(
        { error: "Full name is required." },
        { status: 400 }
      );
    }

    if (
      !body?.customer?.contactNumber ||
      !isValidPhoneNumber(body.customer.contactNumber)
    ) {
      return NextResponse.json(
        { error: "A valid contact number is required." },
        { status: 400 }
      );
    }

    if (body.customer.email && !isValidEmail(body.customer.email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        {
          error:
            "Your cart is empty. Add at least one item to place an order.",
        },
        { status: 400 }
      );
    }

    const order = await createOrder(
      {
        customer: {
          fullName: body.customer.fullName,
          contactNumber: body.customer.contactNumber,
          email: body.customer.email || authenticatedCustomer.email,
          pickupNotes: body.customer.pickupNotes,
        },
        items: body.items,
        paymentMethod: "Cash on Pickup",
      },
      authenticatedCustomer.id
    );

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("[API POST /api/orders]", error);
    return NextResponse.json(
      { error: "Failed to place order." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(
        { error: "Administrator authentication required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const orderIds: unknown = body?.orderIds;
    const status: unknown = body?.status;

    if (
      !Array.isArray(orderIds) ||
      orderIds.length === 0 ||
      !orderIds.every((id) => typeof id === "string")
    ) {
      return NextResponse.json(
        { error: "Select at least one order to update." },
        { status: 400 }
      );
    }

    if (
      typeof status !== "string" ||
      !ORDER_STATUSES.includes(status as OrderStatus)
    ) {
      return NextResponse.json(
        { error: "Invalid order status." },
        { status: 400 }
      );
    }

    const updatedOrders = await updateMultipleOrderStatuses(
      orderIds,
      status as OrderStatus
    );

    return NextResponse.json(
      { updatedCount: updatedOrders.length, orders: updatedOrders },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API PATCH /api/orders]", error);
    return NextResponse.json(
      { error: "Failed to bulk update order statuses." },
      { status: 500 }
    );
  }
}
