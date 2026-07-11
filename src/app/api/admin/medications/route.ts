import { NextResponse } from "next/server";
import { db } from "@/db";
import { medications } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/admin/medications - List all medications
// PUT /api/admin/medications - Update a medication
// DELETE /api/admin/medications - Delete a medication

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Check admin session
    const adminSession = request.headers.get("x-admin-session");
    if (adminSession !== "pharmalink-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (id) {
      const medRows = await db.select().from(medications).where(eq(medications.id, id)).limit(1);
      const medication = medRows[0];
      if (!medication) {
        return NextResponse.json({ error: "Medication not found" }, { status: 404 });
      }
      return NextResponse.json({ medication });
    }

    const allMedications = await db.select().from(medications);
    return NextResponse.json({ medications: allMedications });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Check admin session
    const adminSession = request.headers.get("x-admin-session");
    if (adminSession !== "pharmalink-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Medication ID required" }, { status: 400 });
    }

    const existing = await db.select().from(medications).where(eq(medications.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Medication not found" }, { status: 404 });
    }

    const body = await request.json();
    await db
      .update(medications)
      .set({ ...body, updatedAt: new Date().toISOString() })
      .where(eq(medications.id, id));

    const medRows = await db.select().from(medications).where(eq(medications.id, id)).limit(1);

    return NextResponse.json({ medication: medRows[0], message: "Medication updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Check admin session
    const adminSession = request.headers.get("x-admin-session");
    if (adminSession !== "pharmalink-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Medication ID required" }, { status: 400 });
    }

    const existing = await db.select().from(medications).where(eq(medications.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Medication not found" }, { status: 404 });
    }

    await db.delete(medications).where(eq(medications.id, id));

    return NextResponse.json({ message: "Medication deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
