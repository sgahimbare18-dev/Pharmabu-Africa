import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/admin/orders - List all orders
// PUT /api/admin/orders - Update an order
// DELETE /api/admin/orders - Delete an order

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
      const orderRows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
      const order = orderRows[0];
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json({ order });
    }

    const allOrders = await db.select().from(orders);
    return NextResponse.json({ orders: allOrders });
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
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const existing = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const body = await request.json();
    await db
      .update(orders)
      .set({ ...body, updatedAt: new Date().toISOString() })
      .where(eq(orders.id, id));

    const orderRows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);

    return NextResponse.json({ order: orderRows[0], message: "Order updated successfully" });
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
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const existing = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await db.delete(orders).where(eq(orders.id, id));

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
