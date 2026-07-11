import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { familyPharmacists } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const patientId = searchParams.get("patientId");
    const pharmacyId = searchParams.get("pharmacyId");
    const active = searchParams.get("active");

    if (id) {
      const rows = await db.select().from(familyPharmacists).where(eq(familyPharmacists.id, id)).limit(1);
      const familyPharm = rows[0];
      if (!familyPharm) {
        return NextResponse.json({ error: "Family pharmacist not found" }, { status: 404 });
      }
      return NextResponse.json(familyPharm);
    }

    if (patientId && active === "true") {
      const rows = await db
        .select()
        .from(familyPharmacists)
        .where(and(eq(familyPharmacists.patientId, patientId), eq(familyPharmacists.status, "active")))
        .limit(1);
      return NextResponse.json(rows[0] || null);
    }

    if (patientId) {
      const rows = await db.select().from(familyPharmacists).where(eq(familyPharmacists.patientId, patientId));
      return NextResponse.json(rows);
    }

    if (pharmacyId) {
      const rows = await db.select().from(familyPharmacists).where(eq(familyPharmacists.pharmacyId, pharmacyId));
      return NextResponse.json(rows);
    }

    // Return all family pharmacists (admin only)
    const rows = await db.select().from(familyPharmacists);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching family pharmacists:", error);
    return NextResponse.json({ error: "Failed to fetch family pharmacists" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Deactivate any existing active assignment for this patient
    await db
      .update(familyPharmacists)
      .set({ status: "inactive" })
      .where(and(eq(familyPharmacists.patientId, body.patientId), eq(familyPharmacists.status, "active")));

    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const familyPharm = {
      id: crypto.randomUUID(),
      patientId: body.patientId,
      patientName: body.patientName,
      pharmacyId: body.pharmacyId,
      pharmacyName: body.pharmacyName,
      pharmacistName: body.pharmacistName,
      status: "pending_payment" as const, // Wait for payment
      monthlyFee: body.monthlyFee || 500,
      paymentStatus: "pending" as const,
      paymentMethod: "" as unknown as "mpesa" | "mobile_money" | "card" | null,
      paymentDate: "",
      nextPaymentDate: nextMonth.toISOString(),
      assignedAt: new Date().toISOString(),
      notes: body.notes || "",
    };

    await db.insert(familyPharmacists).values(familyPharm);

    return NextResponse.json(familyPharm, { status: 201 });
  } catch (error) {
    console.error("Error creating family pharmacist:", error);
    return NextResponse.json({ error: "Failed to create family pharmacist" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Family pharmacist ID required" }, { status: 400 });
    }

    const existing = await db.select().from(familyPharmacists).where(eq(familyPharmacists.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Family pharmacist not found" }, { status: 404 });
    }

    await db.update(familyPharmacists).set(data).where(eq(familyPharmacists.id, id));

    const rows = await db.select().from(familyPharmacists).where(eq(familyPharmacists.id, id)).limit(1);

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error updating family pharmacist:", error);
    return NextResponse.json({ error: "Failed to update family pharmacist" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Family pharmacist ID required" }, { status: 400 });
    }

    const existing = await db.select().from(familyPharmacists).where(eq(familyPharmacists.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Family pharmacist not found" }, { status: 404 });
    }

    await db.delete(familyPharmacists).where(eq(familyPharmacists.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting family pharmacist:", error);
    return NextResponse.json({ error: "Failed to delete family pharmacist" }, { status: 500 });
  }
}
