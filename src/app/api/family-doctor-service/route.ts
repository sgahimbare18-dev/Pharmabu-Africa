import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { familyDoctorServices } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const pharmacyId = searchParams.get("pharmacyId");
    const available = searchParams.get("available");

    if (id) {
      const rows = await db.select().from(familyDoctorServices).where(eq(familyDoctorServices.id, id)).limit(1);
      const service = rows[0];
      if (!service) {
        return NextResponse.json({ error: "Family doctor service not found" }, { status: 404 });
      }
      return NextResponse.json(service);
    }

    if (pharmacyId) {
      const rows = await db
        .select()
        .from(familyDoctorServices)
        .where(eq(familyDoctorServices.pharmacyId, pharmacyId));
      return NextResponse.json(rows);
    }

    if (available === "true") {
      const rows = await db
        .select()
        .from(familyDoctorServices)
        .where(eq(familyDoctorServices.isAvailable, true));
      return NextResponse.json(rows);
    }

    // Return all family doctor services (admin only)
    const rows = await db.select().from(familyDoctorServices);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching family doctor services:", error);
    return NextResponse.json({ error: "Failed to fetch family doctor services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const now = new Date().toISOString();
    const service = {
      id: crypto.randomUUID(),
      pharmacyId: body.pharmacyId,
      pharmacyName: body.pharmacyName,
      pharmacistName: body.pharmacistName,
      description: body.description || "",
      monthlyFee: body.monthlyFee || 0,
      servicesIncluded: body.servicesIncluded || "",
      isAvailable: true,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(familyDoctorServices).values(service);

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Error creating family doctor service:", error);
    return NextResponse.json({ error: "Failed to create family doctor service" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Service ID required" }, { status: 400 });
    }

    const existing = await db.select().from(familyDoctorServices).where(eq(familyDoctorServices.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Family doctor service not found" }, { status: 404 });
    }

    await db
      .update(familyDoctorServices)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(familyDoctorServices.id, id));

    const rows = await db.select().from(familyDoctorServices).where(eq(familyDoctorServices.id, id)).limit(1);

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error updating family doctor service:", error);
    return NextResponse.json({ error: "Failed to update family doctor service" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Service ID required" }, { status: 400 });
    }

    const existing = await db.select().from(familyDoctorServices).where(eq(familyDoctorServices.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Family doctor service not found" }, { status: 404 });
    }

    await db.delete(familyDoctorServices).where(eq(familyDoctorServices.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting family doctor service:", error);
    return NextResponse.json({ error: "Failed to delete family doctor service" }, { status: 500 });
  }
}
