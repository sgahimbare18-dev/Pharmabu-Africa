import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pharmacies } from "@/db/schema";

export async function GET(req: NextRequest) {
  try {
    const adminSession = req.headers.get("x-admin-session");
    if (adminSession !== "pharmalink-admin") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const rows = await db.select().from(pharmacies);
    const pharmaciesList = rows.map((p) => ({
      id: p.id,
      pharmacyName: p.pharmacyName,
      pharmacistName: p.pharmacistName,
      email: p.email,
      phone: p.phone,
      // Pharmacist credentials
      licenseNumber: p.licenseNumber || "",
      pharmacistQualification: p.pharmacistQualification || "",
      pharmacistUniversity: p.pharmacistUniversity || "",
      pharmacistGraduationYear: p.pharmacistGraduationYear || "",
      // Pharmacy registration
      pharmacyRegNumber: p.pharmacyRegNumber || "",
      pharmacyRegAuthority: p.pharmacyRegAuthority || "",
      pharmacyRegExpiry: p.pharmacyRegExpiry || "",
      // Location
      country: p.country,
      city: p.city,
      address: p.address,
      // Operations
      operatingHours: p.operatingHours || "",
      servicesOffered: p.servicesOffered || "",
      // File uploads
      licenseDocument: p.licenseDocument || "",
      qualificationDocument: p.qualificationDocument || "",
      pharmacyRegDocument: p.pharmacyRegDocument || "",
      // Meta
      status: p.status,
      createdAt: p.createdAt,
    }));

    return NextResponse.json({ pharmacies: pharmaciesList });
  } catch (err) {
    console.error("List pharmacies error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
