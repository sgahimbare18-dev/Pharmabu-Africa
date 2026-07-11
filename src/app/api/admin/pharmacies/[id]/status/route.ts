import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pharmacies } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session via header
    const adminSession = req.headers.get("x-admin-session");
    if (adminSession !== "pharmalink-admin") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body as { status: "verified" | "rejected" };

    if (!status || !["verified", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be 'verified' or 'rejected'." },
        { status: 400 }
      );
    }

    const existing = await db.select().from(pharmacies).where(eq(pharmacies.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Pharmacy not found." }, { status: 404 });
    }

    await db.update(pharmacies).set({ status }).where(eq(pharmacies.id, id));

    const updatedRows = await db.select().from(pharmacies).where(eq(pharmacies.id, id)).limit(1);

    return NextResponse.json({
      message: `Pharmacy ${status === "verified" ? "approved" : "rejected"} successfully.`,
      pharmacy: updatedRows[0],
    });
  } catch (err) {
    console.error("Update pharmacy status error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
