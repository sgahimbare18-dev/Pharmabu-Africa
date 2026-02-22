import { NextRequest, NextResponse } from "next/server";
import { createPharmacy, getPharmacyByEmail, getUserByEmail, hashPassword } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      pharmacyName,
      pharmacistName,
      email,
      phone,
      licenseNumber,
      pharmacistQualification,
      pharmacistUniversity,
      pharmacistGraduationYear,
      pharmacyRegNumber,
      pharmacyRegAuthority,
      pharmacyRegExpiry,
      country,
      city,
      address,
      operatingHours,
      servicesOffered,
      password,
      licenseDocument,
      qualificationDocument,
      pharmacyRegDocument,
    } = body as {
      pharmacyName: string;
      pharmacistName: string;
      email: string;
      phone: string;
      licenseNumber: string;
      pharmacistQualification: string;
      pharmacistUniversity: string;
      pharmacistGraduationYear: string;
      pharmacyRegNumber: string;
      pharmacyRegAuthority: string;
      pharmacyRegExpiry: string;
      country: "kenya" | "burundi";
      city: string;
      address: string;
      operatingHours: string;
      servicesOffered: string;
      password: string;
      licenseDocument?: string;
      qualificationDocument?: string;
      pharmacyRegDocument?: string;
    };

    // Required field validation
    if (
      !pharmacyName ||
      !pharmacistName ||
      !email ||
      !phone ||
      !licenseNumber ||
      !pharmacistQualification ||
      !pharmacistUniversity ||
      !pharmacistGraduationYear ||
      !pharmacyRegNumber ||
      !pharmacyRegAuthority ||
      !pharmacyRegExpiry ||
      !country ||
      !city ||
      !address ||
      !password
    ) {
      return NextResponse.json({ error: "All required fields must be filled in." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    // Check duplicate across both users and pharmacies
    const existingUser = getUserByEmail(email);
    const existingPharmacy = getPharmacyByEmail(email);
    if (existingUser || existingPharmacy) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const pharmacy = createPharmacy({
      pharmacyName,
      pharmacistName,
      email,
      phone,
      licenseNumber,
      pharmacistQualification,
      pharmacistUniversity,
      pharmacistGraduationYear,
      pharmacyRegNumber,
      pharmacyRegAuthority,
      pharmacyRegExpiry,
      country,
      city,
      address,
      operatingHours: operatingHours || "",
      servicesOffered: servicesOffered || "",
      passwordHash: hashPassword(password),
      role: "pharmacy",
      // File upload paths
      licenseDocument: licenseDocument || "",
      qualificationDocument: qualificationDocument || "",
      pharmacyRegDocument: pharmacyRegDocument || "",
    });

    return NextResponse.json(
      {
        message:
          "Pharmacy registration submitted. Your account is pending verification by our team. You will be notified by email once approved.",
        pharmacyId: pharmacy.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register pharmacy error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
