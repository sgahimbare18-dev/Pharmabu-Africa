import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { pharmacyStaff } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pharmacyId = searchParams.get("pharmacyId");
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (id) {
      const rows = await db.select().from(pharmacyStaff).where(eq(pharmacyStaff.id, id)).limit(1);
      const staff = rows[0];
      if (!staff) {
        return NextResponse.json({ error: "Staff not found" }, { status: 404 });
      }
      return NextResponse.json(staff);
    }

    if (email) {
      const rows = await db
        .select()
        .from(pharmacyStaff)
        .where(eq(sql`lower(${pharmacyStaff.email})`, email.toLowerCase()))
        .limit(1);
      const staff = rows[0];
      if (!staff) {
        return NextResponse.json({ error: "Staff not found" }, { status: 404 });
      }
      return NextResponse.json(staff);
    }

    if (pharmacyId) {
      const rows = await db.select().from(pharmacyStaff).where(eq(pharmacyStaff.pharmacyId, pharmacyId));
      return NextResponse.json(rows);
    }

    // Return all staff (admin only)
    const rows = await db.select().from(pharmacyStaff);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching pharmacy staff:", error);
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if email already exists
    const existingRows = await db
      .select()
      .from(pharmacyStaff)
      .where(eq(sql`lower(${pharmacyStaff.email})`, String(body.email).toLowerCase()))
      .limit(1);
    if (existingRows.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const staff = {
      id: crypto.randomUUID(),
      pharmacyId: body.pharmacyId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      role: (body.role || "assistant") as "pharmacist" | "assistant" | "technician" | "delivery" | "counselor",
      qualification: body.qualification || "",
      licenseNumber: body.licenseNumber || "",
      isActive: true,
      passwordHash: hashPassword(body.password || "changeme123"),
      createdAt: new Date().toISOString(),
    };

    await db.insert(pharmacyStaff).values(staff);

    // Don't return password hash
    const { passwordHash, ...safeStaff } = staff;
    void passwordHash;
    return NextResponse.json(safeStaff, { status: 201 });
  } catch (error) {
    console.error("Error creating pharmacy staff:", error);
    return NextResponse.json({ error: "Failed to create staff" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, password, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Staff ID required" }, { status: 400 });
    }

    const existing = await db.select().from(pharmacyStaff).where(eq(pharmacyStaff.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { ...data };
    if (password) {
      updateData.passwordHash = hashPassword(password);
    }

    await db.update(pharmacyStaff).set(updateData).where(eq(pharmacyStaff.id, id));

    const rows = await db.select().from(pharmacyStaff).where(eq(pharmacyStaff.id, id)).limit(1);

    // Don't return password hash
    const { passwordHash, ...safeStaff } = rows[0];
    void passwordHash;
    return NextResponse.json(safeStaff);
  } catch (error) {
    console.error("Error updating pharmacy staff:", error);
    return NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Staff ID required" }, { status: 400 });
    }

    const existing = await db.select().from(pharmacyStaff).where(eq(pharmacyStaff.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    await db.delete(pharmacyStaff).where(eq(pharmacyStaff.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting pharmacy staff:", error);
    return NextResponse.json({ error: "Failed to delete staff" }, { status: 500 });
  }
}
