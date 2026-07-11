import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { and, eq } from "drizzle-orm";

// GET /api/subscriptions - List subscriptions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const pharmacyId = searchParams.get("pharmacyId");
    const active = searchParams.get("active");

    if (patientId) {
      const rows =
        active === "true"
          ? await db
              .select()
              .from(subscriptions)
              .where(and(eq(subscriptions.patientId, patientId), eq(subscriptions.status, "active")))
          : await db.select().from(subscriptions).where(eq(subscriptions.patientId, patientId));
      return NextResponse.json(rows);
    }

    if (pharmacyId) {
      const rows = await db.select().from(subscriptions).where(eq(subscriptions.pharmacyId, pharmacyId));
      return NextResponse.json(rows);
    }

    return NextResponse.json({ error: "Missing patientId or pharmacyId" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}

// POST /api/subscriptions - Create subscription
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      patientId,
      patientName,
      patientPhone,
      pharmacyId,
      pharmacyName,
      pharmacyCity,
      monthlyAmount,
      deliveryAddress,
    } = body;

    if (!patientId || !pharmacyId || !monthlyAmount || !deliveryAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const subscription = {
      id: crypto.randomUUID(),
      patientId,
      patientName: patientName || "",
      patientPhone: patientPhone || "",
      pharmacyId,
      pharmacyName: pharmacyName || "",
      pharmacyCity: pharmacyCity || "",
      subscriptionType: "monthly" as const,
      monthlyAmount: Number(monthlyAmount),
      deliveryAddress,
      status: "active" as const,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(subscriptions).values(subscription);

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}

// PUT /api/subscriptions - Update subscription
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing subscription ID" }, { status: 400 });
    }

    const existing = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    await db
      .update(subscriptions)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(subscriptions.id, id));

    const rows = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
  }
}
