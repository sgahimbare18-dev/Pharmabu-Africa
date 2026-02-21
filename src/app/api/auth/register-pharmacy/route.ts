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
      country,
      city,
      address,
      password,
    } = body as {
      pharmacyName: string;
      pharmacistName: string;
      email: string;
      phone: string;
      licenseNumber: string;
      country: "kenya" | "burundi";
      city: string;
      address: string;
      password: string;
    };

    // Validation
    if (
      !pharmacyName ||
      !pharmacistName ||
      !email ||
      !phone ||
      !licenseNumber ||
      !country ||
      !city ||
      !address ||
      !password
    ) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
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
      country,
      city,
      address,
      passwordHash: hashPassword(password),
      role: "pharmacy",
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
