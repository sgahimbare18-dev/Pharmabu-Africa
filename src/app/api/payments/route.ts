import { NextRequest, NextResponse } from "next/server";
import {
  getPayments,
  getPaymentById,
  getPaymentsByPatient,
  getPaymentsByPharmacy,
  getCompletedPayments,
  getPendingPayouts,
  processPayment,
  updatePayoutStatus,
  convertToKES,
  EXCHANGE_RATES,
  type SupportedCurrency,
  type PaymentMethod,
  type PaymentStatus,
} from "@/lib/store";

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
      const payment = getPayments().find((p) => p.orderId === orderId);
      if (!payment) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
      }
      return NextResponse.json(payment);
    }

    // Get specific payment by ID
    if (searchParams.get("id")) {
      const payment = getPaymentById(searchParams.get("id")!);
      if (!payment) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
      }
      return NextResponse.json(payment);
    }

    // Get pending payouts for admin
    if (pendingPayouts === "true") {
      return NextResponse.json(getPendingPayouts());
    }

    // Filter by patient
    if (patientId) {
      return NextResponse.json(getPaymentsByPatient(patientId));
    }

    // Filter by pharmacy
    if (pharmacyId) {
      return NextResponse.json(getPaymentsByPharmacy(pharmacyId));
    }

    // Filter by status
    if (status) {
      const payments = getPayments().filter((p) => p.status === status);
      return NextResponse.json(payments);
    }

    // Get all completed payments
    return NextResponse.json(getCompletedPayments());
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
    const payment = processPayment(
      orderId,
      amount,
      currency as SupportedCurrency,
      paymentMethod,
      { id: patientId, name: patientName || "Patient", phone: patientPhone },
      { id: pharmacyId, name: pharmacyName },
      { name: medicationName, quantity: quantity || 1 }
    );

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

    const payment = getPaymentById(paymentId);
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

      const updatedPayment = updatePayoutStatus(paymentId, payoutStatus, payoutReference);
      return NextResponse.json({
        success: true,
        payment: updatedPayment,
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
