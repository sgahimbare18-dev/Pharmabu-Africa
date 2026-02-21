import { NextRequest, NextResponse } from "next/server";
import { getPharmacies } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    const adminSession = req.headers.get("x-admin-session");
    if (adminSession !== "pharmalink-admin") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const pharmacies = getPharmacies().map((p) => ({
      id: p.id,
      pharmacyName: p.pharmacyName,
      pharmacistName: p.pharmacistName,
      email: p.email,
      phone: p.phone,
      licenseNumber: p.licenseNumber,
      country: p.country,
      city: p.city,
      address: p.address,
      status: p.status,
      createdAt: p.createdAt,
    }));

    return NextResponse.json({ pharmacies });
  } catch (err) {
    console.error("List pharmacies error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
