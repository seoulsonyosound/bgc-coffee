import { NextRequest, NextResponse } from "next/server";
import {
  deleteProduct,
  getProductById,
  getProductBySlug,
  updateProduct,
} from "@/services/product-service";
import { ADMIN_SESSION_COOKIE } from "@/services/auth-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const product = (await getProductById(id)) ?? (await getProductBySlug(id));

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("[API GET /api/products/[id]]", error);
    return NextResponse.json(
      { error: "Failed to load product." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    if (
      request.cookies.get(ADMIN_SESSION_COOKIE)?.value !==
      "authenticated-demo-admin"
    ) {
      return NextResponse.json(
        { error: "Administrator authentication required." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    if (body.price !== undefined) {
      const parsed = Number(body.price);
      if (Number.isNaN(parsed) || parsed <= 0) {
        return NextResponse.json(
          { error: "Price must be a valid positive number." },
          { status: 400 }
        );
      }
    }

    const updated = await updateProduct(id, body);
    if (!updated) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ product: updated }, { status: 200 });
  } catch (error) {
    console.error("[API PATCH /api/products/[id]]", error);
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    if (
      request.cookies.get(ADMIN_SESSION_COOKIE)?.value !==
      "authenticated-demo-admin"
    ) {
      return NextResponse.json(
        { error: "Administrator authentication required." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const deleted = await deleteProduct(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ deleted: true, id }, { status: 200 });
  } catch (error) {
    console.error("[API DELETE /api/products/[id]]", error);
    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
