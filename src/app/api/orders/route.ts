import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// GET /api/orders - Get orders (filtered by patientId or pharmacyId query param)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const pharmacyId = searchParams.get("pharmacyId");

    let result;

    if (patientId) {
      result = await db
        .select()
        .from(orders)
        .where(eq(orders.patientId, patientId))
        .orderBy(desc(orders.createdAt));
    } else if (pharmacyId) {
      result = await db
        .select()
        .from(orders)
        .where(eq(orders.pharmacyId, pharmacyId))
        .orderBy(desc(orders.createdAt));
    } else {
      return NextResponse.json(
        { error: "Either patientId or pharmacyId is required" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST /api/orders - Create a new order/consultation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      patientId,
      patientName,
      patientPhone,
      pharmacyId,
      pharmacyName,
      medicationId,
      medicationName,
      medicationPrice,
      quantity,
      symptoms,
      deliveryAddress
    } = body;

    // Validation
    if (!patientId || !patientName || !pharmacyId || !medicationId || !medicationName || medicationPrice === undefined || !quantity || !symptoms || !deliveryAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const totalPrice = Number(medicationPrice) * Number(quantity);
    const now = new Date().toISOString();

    const order = {
      id: crypto.randomUUID(),
      patientId,
      patientName,
      patientPhone: patientPhone || "",
      pharmacyId,
      pharmacyName,
      medicationId,
      medicationName,
      medicationPrice: Number(medicationPrice),
      quantity: Number(quantity),
      totalPrice,
      symptoms,
      pharmacyNotes: "",
      status: "pending" as const,
      paymentMethod: "pay_on_delivery" as const,
      deliveryAddress,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(orders).values(order);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
