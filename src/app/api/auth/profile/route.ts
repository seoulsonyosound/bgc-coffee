import { NextRequest, NextResponse } from "next/server";
import {
  CUSTOMER_SESSION_COOKIE,
  getCustomerBySessionToken,
  updateCustomerProfileById,
} from "@/services/auth-service";
import { isValidPhoneNumber } from "@/lib/utils";

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
    const customer = await getCustomerBySessionToken(token);

    if (!customer) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    if (body?.contactNumber && !isValidPhoneNumber(String(body.contactNumber))) {
      return NextResponse.json(
        { error: "Please enter a valid contact number." },
        { status: 400 }
      );
    }

    const result = await updateCustomerProfileById(customer.id, {
      fullName: body?.fullName,
      contactNumber: body?.contactNumber,
    });

    if (result.error || !result.customer) {
      return NextResponse.json(
        { error: result.error || "Unable to update profile." },
        { status: result.status }
      );
    }

    return NextResponse.json({ customer: result.customer }, { status: 200 });
  } catch (error) {
    console.error("[API PATCH /api/auth/profile]", error);
    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}
