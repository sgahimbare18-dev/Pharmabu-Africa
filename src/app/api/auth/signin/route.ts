import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, pharmacies, pharmacyStaff } from "@/db/schema";
import { like } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const passwordHash = hashPassword(password);
    const emailQuery = email.toLowerCase();

    // Check patients first
    const userRows = await db
      .select()
      .from(users)
      .where(like(users.email, emailQuery))
      .limit(1);
    const user = userRows[0];
    if (user) {
      if (user.passwordHash !== passwordHash) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }
      return NextResponse.json({
        message: "Sign in successful.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          country: user.country,
        },
      });
    }

    // Check pharmacy owner (main pharmacy account)
    const pharmacyRows = await db
      .select()
      .from(pharmacies)
      .where(like(pharmacies.email, emailQuery))
      .limit(1);
    const pharmacy = pharmacyRows[0];
    if (pharmacy) {
      if (pharmacy.passwordHash !== passwordHash) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }
      if (pharmacy.status === "pending") {
        return NextResponse.json(
          {
            error:
              "Your pharmacy account is pending verification. You will be notified by email once approved.",
          },
          { status: 403 }
        );
      }
      if (pharmacy.status === "rejected") {
        return NextResponse.json(
          { error: "Your pharmacy registration was not approved. Please contact support." },
          { status: 403 }
        );
      }
      return NextResponse.json({
        message: "Sign in successful.",
        user: {
          id: pharmacy.id,
          name: pharmacy.pharmacistName,
          email: pharmacy.email,
          role: pharmacy.role,
          pharmacyName: pharmacy.pharmacyName,
          country: pharmacy.country,
          isOwner: true,
        },
      });
    }

    // Check pharmacy staff
    const staffRows = await db
      .select()
      .from(pharmacyStaff)
      .where(like(pharmacyStaff.email, emailQuery))
      .limit(1);
    const staff = staffRows[0];
    if (staff) {
      if (staff.passwordHash !== passwordHash) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }
      if (!staff.isActive) {
        return NextResponse.json(
          { error: "Your staff account has been deactivated. Please contact your pharmacy administrator." },
          { status: 403 }
        );
      }
      return NextResponse.json({
        message: "Sign in successful.",
        user: {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: "pharmacy_staff",
          staffRole: staff.role,
          pharmacyId: staff.pharmacyId,
          isOwner: false,
        },
      });
    }

    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  } catch (err) {
    console.error("Sign in error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
