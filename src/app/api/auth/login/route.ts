import { NextRequest, NextResponse } from "next/server";
import {
  authenticateCustomerCredentials,
  CUSTOMER_SESSION_COOKIE,
} from "@/services/auth-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await authenticateCustomerCredentials({
      email: body?.email,
      password: body?.password,
      rememberMe: Boolean(body?.rememberMe),
    });

    if (result.error || !result.customer || !result.sessionToken) {
      return NextResponse.json(
        { error: result.error || "Invalid credentials." },
        { status: result.status }
      );
    }

    const response = NextResponse.json(
      {
        authenticated: true,
        customer: result.customer,
      },
      { status: 200 }
    );

    const isHttps =
      request.headers.get("x-forwarded-proto") === "https" ||
      request.nextUrl.protocol === "https:";

    response.cookies.set(CUSTOMER_SESSION_COOKIE, result.sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isHttps,
      path: "/",
      maxAge: result.maxAgeSeconds,
    });

    return response;
  } catch (error) {
    console.error("[API POST /api/auth/login]", error);
    return NextResponse.json(
      { error: "Failed to sign in." },
      { status: 500 }
    );
  }
}
