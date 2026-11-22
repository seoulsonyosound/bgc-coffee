import { NextRequest, NextResponse } from "next/server";
import { registerCustomerRecord } from "@/services/auth-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await registerCustomerRecord({
      fullName: body?.fullName,
      email: body?.email,
      password: body?.password,
      confirmPassword: body?.confirmPassword,
    });

    if (result.error || !result.customer) {
      return NextResponse.json(
        { error: result.error || "Unable to create account." },
        { status: result.status }
      );
    }

    // Registration does NOT automatically start an authenticated session.
    // Customer is redirected to /login to authenticate with their new credentials.
    return NextResponse.json(
      {
        customer: result.customer,
        message: "Account created successfully. Please log in to continue.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API POST /api/auth/register]", error);
    return NextResponse.json(
      { error: "Failed to process registration." },
      { status: 500 }
    );
  }
}
