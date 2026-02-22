import { NextResponse } from "next/server";
import {
  getSubscriptionsByPatient,
  getSubscriptionsByPharmacy,
  getActiveSubscriptionsByPatient,
  createSubscription,
  updateSubscription,
  cancelSubscription,
} from "@/lib/store";

// GET /api/subscriptions - List subscriptions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const pharmacyId = searchParams.get("pharmacyId");
    const active = searchParams.get("active");

    if (patientId) {
      const subscriptions = active === "true" 
        ? getActiveSubscriptionsByPatient(patientId)
        : getSubscriptionsByPatient(patientId);
      return NextResponse.json(subscriptions);
    }

    if (pharmacyId) {
      return NextResponse.json(getSubscriptionsByPharmacy(pharmacyId));
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

    const subscription = createSubscription({
      patientId,
      patientName: patientName || "",
      patientPhone: patientPhone || "",
      pharmacyId,
      pharmacyName: pharmacyName || "",
      pharmacyCity: pharmacyCity || "",
      subscriptionType: "monthly",
      monthlyAmount: Number(monthlyAmount),
      deliveryAddress,
    });

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

    const subscription = updateSubscription(id, data);
    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
  }
}
