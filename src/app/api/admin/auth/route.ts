import { NextRequest, NextResponse } from "next/server";

/**
 * Prototype Admin Authentication Route Handler
 *
 * WARNING: This is a local prototype authentication mechanism using documented
 * demo credentials. It is NOT production-grade security.
 *
 * Future Production Architecture:
 * Replace with secure server-side session management (e.g., AWS Cognito or
 * signed HTTP-only JWT sessions backed by bcrypt/Argon2 password hashes).
 */

const DEMO_ADMIN_EMAIL = "admin@bgccoffee.demo";
const DEMO_ADMIN_PASSWORD = "BgcAdmin2026!";
const SESSION_COOKIE_NAME = "bgc_admin_demo_session";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (token === "authenticated-demo-admin") {
    return NextResponse.json({
      authenticated: true,
      admin: {
        name: "BGC Store Manager",
        email: DEMO_ADMIN_EMAIL,
        role: "Administrator (Prototype)",
      },
    });
  }
  return NextResponse.json({ authenticated: false }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (email !== DEMO_ADMIN_EMAIL || password !== DEMO_ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid demo credentials. Use the documented prototype login." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      authenticated: true,
      admin: {
        name: "BGC Store Manager",
        email: DEMO_ADMIN_EMAIL,
        role: "Administrator (Prototype)",
      },
    });

    const isHttps =
      request.headers.get("x-forwarded-proto") === "https" ||
      request.nextUrl.protocol === "https:";

    response.cookies.set(SESSION_COOKIE_NAME, "authenticated-demo-admin", {
      httpOnly: true,
      sameSite: "lax",
      secure: isHttps,
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
