import { NextRequest, NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminConfig,
  isAdminConfigured,
  isAdminRequest,
  verifyAdminCredentials,
} from "@/lib/admin-auth";
import { ADMIN_SESSION_COOKIE } from "@/services/auth-service";

export async function GET(request: NextRequest) {
  if (isAdminRequest(request)) {
    const { email } = getAdminConfig();
    return NextResponse.json({
      authenticated: true,
      admin: {
        name: "BGC Store Manager",
        email,
        role: "Administrator",
      },
    });
  }
  return NextResponse.json({ authenticated: false }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Administrator credentials are not configured on the server." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!verifyAdminCredentials(email, password)) {
      return NextResponse.json(
        { error: "Invalid administrator email or password." },
        { status: 401 }
      );
    }

    const { email: adminEmail } = getAdminConfig();
    const response = NextResponse.json({
      authenticated: true,
      admin: {
        name: "BGC Store Manager",
        email: adminEmail,
        role: "Administrator",
      },
    });

    const isHttps =
      request.headers.get("x-forwarded-proto") === "https" ||
      request.nextUrl.protocol === "https:";

    response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), {
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

export async function DELETE(request: NextRequest) {
  const isHttps =
    request.headers.get("x-forwarded-proto") === "https" ||
    request.nextUrl.protocol === "https:";

  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: 0,
  });
  return response;
}
