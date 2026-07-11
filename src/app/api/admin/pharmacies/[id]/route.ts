import { NextResponse } from "next/server";
import { db } from "@/db";
import { pharmacies } from "@/db/schema";
import { eq } from "drizzle-orm";

// DELETE /api/admin/pharmacies/[id] - Delete a pharmacy

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin session
    const adminSession = request.headers.get("x-admin-session");
    if (adminSession !== "pharmalink-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Pharmacy ID required" }, { status: 400 });
    }

    const existing = await db.select().from(pharmacies).where(eq(pharmacies.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Pharmacy not found" }, { status: 404 });
    }

    await db.delete(pharmacies).where(eq(pharmacies.id, id));

    return NextResponse.json({ message: "Pharmacy deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
