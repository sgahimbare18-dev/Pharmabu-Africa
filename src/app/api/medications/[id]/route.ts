import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { medications } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/medications/[id] - Get a single medication
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await db.select().from(medications).where(eq(medications.id, id)).limit(1);
    const medication = rows[0];

    if (!medication) {
      return NextResponse.json({ error: "Medication not found" }, { status: 404 });
    }

    return NextResponse.json(medication);
  } catch (error) {
    console.error("Error fetching medication:", error);
    return NextResponse.json({ error: "Failed to fetch medication" }, { status: 500 });
  }
}

// PUT /api/medications/[id] - Update a medication
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.select().from(medications).where(eq(medications.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Medication not found" }, { status: 404 });
    }

    await db
      .update(medications)
      .set({ ...body, updatedAt: new Date().toISOString() })
      .where(eq(medications.id, id));

    const rows = await db.select().from(medications).where(eq(medications.id, id)).limit(1);

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error updating medication:", error);
    return NextResponse.json({ error: "Failed to update medication" }, { status: 500 });
  }
}

// DELETE /api/medications/[id] - Delete a medication
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.select().from(medications).where(eq(medications.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Medication not found" }, { status: 404 });
    }

    await db.delete(medications).where(eq(medications.id, id));

    return NextResponse.json({ message: "Medication deleted successfully" });
  } catch (error) {
    console.error("Error deleting medication:", error);
    return NextResponse.json({ error: "Failed to delete medication" }, { status: 500 });
  }
}
