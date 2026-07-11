import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { patientRecords } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const pharmacyId = searchParams.get("pharmacyId");
    const patientId = searchParams.get("patientId");

    if (id) {
      const rows = await db.select().from(patientRecords).where(eq(patientRecords.id, id)).limit(1);
      const record = rows[0];
      if (!record) {
        return NextResponse.json({ error: "Patient record not found" }, { status: 404 });
      }
      return NextResponse.json(record);
    }

    if (pharmacyId) {
      const rows = await db.select().from(patientRecords).where(eq(patientRecords.pharmacyId, pharmacyId));
      return NextResponse.json(rows);
    }

    if (patientId) {
      const rows = await db.select().from(patientRecords).where(eq(patientRecords.patientId, patientId));
      return NextResponse.json(rows);
    }

    // Return all records (admin only)
    const rows = await db.select().from(patientRecords);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching patient records:", error);
    return NextResponse.json({ error: "Failed to fetch patient records" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const now = new Date().toISOString();
    const record = {
      id: crypto.randomUUID(),
      pharmacyId: body.pharmacyId,
      patientId: body.patientId,
      patientName: body.patientName,
      patientSex: body.patientSex as "male" | "female" | "other",
      patientAge: body.patientAge,
      patientLocation: body.patientLocation,
      visitDate: body.visitDate || new Date().toISOString().split("T")[0],
      reasonForVisit: body.reasonForVisit,
      symptoms: body.symptoms,
      diagnosis: body.diagnosis,
      medicationGiven: body.medicationGiven,
      medicationDosage: body.medicationDosage,
      reasonForMedication: body.reasonForMedication,
      pharmacistNotes: body.pharmacistNotes || "",
      followUpDate: body.followUpDate || "",
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(patientRecords).values(record);

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Error creating patient record:", error);
    return NextResponse.json({ error: "Failed to create patient record" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Patient record ID required" }, { status: 400 });
    }

    const existing = await db.select().from(patientRecords).where(eq(patientRecords.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Patient record not found" }, { status: 404 });
    }

    await db
      .update(patientRecords)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(patientRecords.id, id));

    const rows = await db.select().from(patientRecords).where(eq(patientRecords.id, id)).limit(1);

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error updating patient record:", error);
    return NextResponse.json({ error: "Failed to update patient record" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Patient record ID required" }, { status: 400 });
    }

    const existing = await db.select().from(patientRecords).where(eq(patientRecords.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Patient record not found" }, { status: 404 });
    }

    await db.delete(patientRecords).where(eq(patientRecords.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting patient record:", error);
    return NextResponse.json({ error: "Failed to delete patient record" }, { status: 500 });
  }
}
