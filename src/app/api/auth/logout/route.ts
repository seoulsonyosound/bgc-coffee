import { NextRequest, NextResponse } from "next/server";
import {
  CUSTOMER_SESSION_COOKIE,
  revokeCustomerSession,
} from "@/services/auth-service";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
    await revokeCustomerSession(token);

    const response = NextResponse.json({ authenticated: false }, { status: 200 });
    response.cookies.set(CUSTOMER_SESSION_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch (error) {
    console.error("[API POST /api/auth/logout]", error);
    return NextResponse.json(
      { error: "Failed to log out." },
      { status: 500 }
    );
  }
}
