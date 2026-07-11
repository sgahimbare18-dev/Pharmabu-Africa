import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { payments } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { ADMIN_PHONE } from "@/lib/auth";

// ─── Payment constants & helpers ─────────────────────────────────────────────

const PLATFORM_FEE_PERCENT = 8; // 8% platform fee

// Currency exchange rates to KES (simulated - in production use a real API)
const EXCHANGE_RATES: Record<string, number> = {
  KES: 1,        // Kenyan Shilling
  USD: 157.50,   // US Dollar to KES
  EUR: 168.75,   // Euro to KES
  GBP: 198.50,   // British Pound to KES
  BIF: 0.053,    // Burundian Franc to KES
  UGX: 0.042,    // Ugandan Shilling to KES
  TZS: 0.060,    // Tanzanian Shilling to KES
  RWF: 0.112,    // Rwandan Franc to KES
};

type SupportedCurrency = keyof typeof EXCHANGE_RATES;
type PaymentMethod = "mpesa" | "airtel_money" | "mobile_money_bi" | "card" | "paypal";

function convertToKES(amount: number, currency: SupportedCurrency): number {
  return amount * EXCHANGE_RATES[currency];
}

// GET /api/payments - List all payments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get("patientId");
    const pharmacyId = searchParams.get("pharmacyId");
    const orderId = searchParams.get("orderId");
    const status = searchParams.get("status");
    const pendingPayouts = searchParams.get("pendingPayouts");

    // Get specific payment by order
    if (orderId) {
      const rows = await db.select().from(payments).where(eq(payments.orderId, orderId)).limit(1);
      const payment = rows[0];
      if (!payment) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
      }
      return NextResponse.json(payment);
    }

    // Get specific payment by ID
    const idParam = searchParams.get("id");
    if (idParam) {
      const rows = await db.select().from(payments).where(eq(payments.id, idParam)).limit(1);
      const payment = rows[0];
      if (!payment) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
      }
      return NextResponse.json(payment);
    }

    // Get pending payouts for admin
    if (pendingPayouts === "true") {
      const rows = await db
        .select()
        .from(payments)
        .where(and(eq(payments.status, "completed"), eq(payments.payoutStatus, "pending")));
      return NextResponse.json(rows);
    }

    // Filter by patient
    if (patientId) {
      const rows = await db.select().from(payments).where(eq(payments.patientId, patientId));
      return NextResponse.json(rows);
    }

    // Filter by pharmacy
    if (pharmacyId) {
      const rows = await db.select().from(payments).where(eq(payments.pharmacyId, pharmacyId));
      return NextResponse.json(rows);
    }

    // Filter by status
    if (status) {
      const rows = await db
        .select()
        .from(payments)
        .where(eq(payments.status, status as "pending" | "completed" | "failed" | "refunded"));
      return NextResponse.json(rows);
    }

    // Get all completed payments
    const rows = await db.select().from(payments).where(eq(payments.status, "completed"));
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

// POST /api/payments - Process a payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      amount,
      currency,
      paymentMethod,
      patientId,
      patientName,
      patientPhone,
      pharmacyId,
      pharmacyName,
      medicationName,
      quantity,
    } = body;

    // Validate required fields
    if (!orderId || !amount || !currency || !paymentMethod || !patientId || !pharmacyId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate currency
    if (!EXCHANGE_RATES[currency as SupportedCurrency]) {
      return NextResponse.json(
        { error: "Unsupported currency" },
        { status: 400 }
      );
    }

    // Validate payment method
    const validMethods: PaymentMethod[] = ["mpesa", "airtel_money", "mobile_money_bi", "card", "paypal"];
    if (!validMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    // Process the payment
    const cur = currency as SupportedCurrency;
    const resolvedPatientName = patientName || "Patient";
    const resolvedQuantity = quantity || 1;
    const amountInKES = convertToKES(amount, cur);
    const platformFee = (amountInKES * PLATFORM_FEE_PERCENT) / 100;
    const pharmacyPayout = amountInKES - platformFee;
    const paymentReference = `PL${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const now = new Date().toISOString();

    const payment = {
      id: crypto.randomUUID(),
      orderId,
      patientId,
      patientName: resolvedPatientName,
      patientPhone,
      pharmacyId,
      pharmacyName,
      medicationName,
      quantity: resolvedQuantity,
      originalAmount: amount,
      originalCurrency: cur as "KES" | "USD" | "EUR" | "GBP" | "BIF" | "UGX" | "TZS" | "RWF",
      exchangeRate: EXCHANGE_RATES[cur],
      amountInKES,
      platformFee,
      pharmacyPayout,
      adminPhone: ADMIN_PHONE,
      paymentMethod: paymentMethod as PaymentMethod,
      paymentReference,
      status: "completed" as const,
      paymentMessage: `Payment received! You paid ${amount} ${currency} (${amountInKES.toFixed(2)} KES) for ${medicationName}. Your medication will be prepared by ${pharmacyName}. Thank you for using PharmabuLink Africa!`,
      payoutStatus: "pending" as const,
      payoutReference: "",
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(payments).values(payment);

    return NextResponse.json({
      success: true,
      payment,
      message: payment.paymentMessage,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}

// PUT /api/payments - Update payment status or payout
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, payoutStatus, payoutReference } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID required" },
        { status: 400 }
      );
    }

    const rows = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
    const payment = rows[0];
    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // Update payout status (admin sends money to pharmacy)
    if (payoutStatus) {
      if (!payoutReference) {
        return NextResponse.json(
          { error: "Payout reference required" },
          { status: 400 }
        );
      }

      await db
        .update(payments)
        .set({ payoutStatus, payoutReference, updatedAt: new Date().toISOString() })
        .where(eq(payments.id, paymentId));

      const updatedRows = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
      return NextResponse.json({
        success: true,
        payment: updatedRows[0],
      });
    }

    return NextResponse.json(
      { error: "Invalid update parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}
