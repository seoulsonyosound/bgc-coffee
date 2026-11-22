import { NextRequest, NextResponse } from "next/server";
import {
  CUSTOMER_SESSION_COOKIE,
  getCustomerBySessionToken,
} from "@/services/auth-service";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
    const customer = await getCustomerBySessionToken(token);

    if (!customer) {
      return NextResponse.json(
        { authenticated: false, customer: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { authenticated: true, customer },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API GET /api/auth/me]", error);
    return NextResponse.json(
      { authenticated: false, customer: null },
      { status: 200 }
    );
  }
}
