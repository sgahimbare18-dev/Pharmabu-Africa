import { NextResponse } from "next/server";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/admin/subscriptions - List all subscriptions
// PUT /api/admin/subscriptions - Update a subscription
// DELETE /api/admin/subscriptions - Cancel a subscription

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
      const subRows = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);
      const subscription = subRows[0];
      if (!subscription) {
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
      }
      return NextResponse.json({ subscription });
    }

    const allSubscriptions = await db.select().from(subscriptions);
    return NextResponse.json({ subscriptions: allSubscriptions });
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
      return NextResponse.json({ error: "Subscription ID required" }, { status: 400 });
    }

    const existing = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    const body = await request.json();
    await db
      .update(subscriptions)
      .set({ ...body, updatedAt: new Date().toISOString() })
      .where(eq(subscriptions.id, id));

    const subRows = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);

    return NextResponse.json({ subscription: subRows[0], message: "Subscription updated successfully" });
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
      return NextResponse.json({ error: "Subscription ID required" }, { status: 400 });
    }

    const existing = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    await db
      .update(subscriptions)
      .set({ status: "cancelled", updatedAt: new Date().toISOString() })
      .where(eq(subscriptions.id, id));

    return NextResponse.json({ message: "Subscription cancelled successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
