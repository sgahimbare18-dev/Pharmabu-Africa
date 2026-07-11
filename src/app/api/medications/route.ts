import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { medications } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";

// GET /api/medications - List all active medications (public for patients)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pharmacyId = searchParams.get("pharmacyId");

    let result;

    if (pharmacyId) {
      // Get medications for a specific pharmacy
      result = await db.select().from(medications).where(eq(medications.pharmacyId, pharmacyId));
    } else {
      // Get all active medications for patient marketplace
      result = await db
        .select()
        .from(medications)
        .where(and(eq(medications.status, "active"), gt(medications.stock, 0)));
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching medications:", error);
    return NextResponse.json({ error: "Failed to fetch medications" }, { status: 500 });
  }
}

// POST /api/medications - Create a new medication (pharmacy only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pharmacyId, name, genericName, description, whatItCures, dosage, usageInstructions, sideEffects, price, stock, category, imageUrl, requiresPrescription } = body;

    // Validation
    if (!pharmacyId || !name || !whatItCures || price === undefined || !stock || !category) {
      return NextResponse.json(
        { error: "Missing required fields: pharmacyId, name, whatItCures, price, stock, category" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const medication = {
      id: crypto.randomUUID(),
      pharmacyId,
      name,
      genericName: genericName || "",
      description: description || "",
      whatItCures,
      dosage: dosage || "",
      usageInstructions: usageInstructions || "",
      sideEffects: sideEffects || "",
      price: Number(price),
      stock: Number(stock),
      category,
      imageUrl: imageUrl || "",
      requiresPrescription: requiresPrescription || false,
      status: "active" as const,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(medications).values(medication);

    return NextResponse.json(medication, { status: 201 });
  } catch (error) {
    console.error("Error creating medication:", error);
    return NextResponse.json({ error: "Failed to create medication" }, { status: 500 });
  }
}
