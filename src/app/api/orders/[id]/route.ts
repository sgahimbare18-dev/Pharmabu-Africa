import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/orders/[id] - Get a single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    const order = rows[0];

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

// PUT /api/orders/[id] - Update order (pharmacy responds with notes, status changes)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await db
      .update(orders)
      .set({ ...body, updatedAt: new Date().toISOString() })
      .where(eq(orders.id, id));

    const rows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
