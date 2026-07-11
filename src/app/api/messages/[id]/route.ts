import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const adminSession = request.headers.get("x-admin-session");

    if (adminSession !== "pharmalink-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const existing = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    await db.update(messages).set({ status }).where(eq(messages.id, id));

    const rows = await db.select().from(messages).where(eq(messages.id, id)).limit(1);

    return NextResponse.json({ message: rows[0], success: "Message updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rows = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
    const message = rows[0];

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch message" }, { status: 500 });
  }
}
