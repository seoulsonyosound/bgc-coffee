import { NextRequest, NextResponse } from "next/server";
import { createProduct, getProducts } from "@/services/product-service";
import { isAdminRequest } from "@/lib/admin-auth";
import { PRODUCT_CATEGORIES, ProductCategory } from "@/types/product";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category");
    const search = searchParams.get("search") || undefined;
    const featuredOnly = searchParams.get("featured") === "true";
    const availableOnly = searchParams.get("available") === "true";

    const category =
      categoryParam &&
      categoryParam !== "All" &&
      PRODUCT_CATEGORIES.includes(categoryParam as ProductCategory)
        ? (categoryParam as ProductCategory)
        : "All";

    const products = await getProducts({
      category,
      search,
      featuredOnly,
      availableOnly,
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("[API GET /api/products]", error);
    return NextResponse.json(
      { error: "Failed to load products." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(
        { error: "Administrator authentication required." },
        { status: 403 }
      );
    }

    const body = await request.json();

    if (!body?.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { error: "Product name is required." },
        { status: 400 }
      );
    }

    if (
      !body?.description ||
      typeof body.description !== "string" ||
      !body.description.trim()
    ) {
      return NextResponse.json(
        { error: "Product description is required." },
        { status: 400 }
      );
    }

    if (
      !body?.category ||
      !PRODUCT_CATEGORIES.includes(body.category as ProductCategory)
    ) {
      return NextResponse.json(
        { error: "A valid product category is required." },
        { status: 400 }
      );
    }

    const price = Number(body.price);
    if (Number.isNaN(price) || price <= 0) {
      return NextResponse.json(
        { error: "Price must be a valid positive number." },
        { status: 400 }
      );
    }

    const product = await createProduct({
      name: body.name,
      description: body.description,
      ingredients: body.ingredients,
      badges: body.badges,
      category: body.category,
      price,
      imageUrl:
        body.imageUrl || "/images/final-products/Iced-Spanish-Oat-Latte.png",
      available: body.available ?? true,
      featured: body.featured ?? false,
      temperatureOptions: body.temperatureOptions,
      variants: body.variants,
      tastingNotes: body.tastingNotes,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("[API POST /api/products]", error);
    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 }
    );
  }
}
