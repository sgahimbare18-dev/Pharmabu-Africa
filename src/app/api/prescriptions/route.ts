import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { prescriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const patientId = searchParams.get("patientId");
    const pharmacyId = searchParams.get("pharmacyId");

    if (id) {
      const rows = await db.select().from(prescriptions).where(eq(prescriptions.id, id)).limit(1);
      const prescription = rows[0];
      if (!prescription) {
        return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
      }
      return NextResponse.json(prescription);
    }

    if (patientId) {
      const rows = await db.select().from(prescriptions).where(eq(prescriptions.patientId, patientId));
      return NextResponse.json(rows);
    }

    if (pharmacyId) {
      const rows = await db.select().from(prescriptions).where(eq(prescriptions.pharmacyId, pharmacyId));
      return NextResponse.json(rows);
    }

    // Return all prescriptions (admin only)
    const rows = await db.select().from(prescriptions);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const now = new Date().toISOString();
    const prescription = {
      id: crypto.randomUUID(),
      patientId: body.patientId,
      patientName: body.patientName,
      pharmacyId: body.pharmacyId || "",
      pharmacyName: body.pharmacyName || "",
      medicationName: body.medicationName,
      dosage: body.dosage,
      quantity: body.quantity,
      instructions: body.instructions,
      prescriberName: body.prescriberName,
      prescriberLicense: body.prescriberLicense,
      documentUrl: body.documentUrl || "",
      status: "pending" as const,
      notes: body.notes || "",
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(prescriptions).values(prescription);

    return NextResponse.json(prescription, { status: 201 });
  } catch (error) {
    console.error("Error creating prescription:", error);
    return NextResponse.json({ error: "Failed to create prescription" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Prescription ID required" }, { status: 400 });
    }

    const existing = await db.select().from(prescriptions).where(eq(prescriptions.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }

    await db
      .update(prescriptions)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(prescriptions.id, id));

    const rows = await db.select().from(prescriptions).where(eq(prescriptions.id, id)).limit(1);

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error updating prescription:", error);
    return NextResponse.json({ error: "Failed to update prescription" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Prescription ID required" }, { status: 400 });
    }

    const existing = await db.select().from(prescriptions).where(eq(prescriptions.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }

    await db.delete(prescriptions).where(eq(prescriptions.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting prescription:", error);
    return NextResponse.json({ error: "Failed to delete prescription" }, { status: 500 });
  }
}
