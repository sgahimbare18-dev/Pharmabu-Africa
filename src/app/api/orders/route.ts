import { NextRequest, NextResponse } from "next/server";
import { getOrdersByPatient, getOrdersByPharmacy, createOrder, Order } from "@/lib/store";

// GET /api/orders - Get orders (filtered by patientId or pharmacyId query param)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const pharmacyId = searchParams.get("pharmacyId");
    
    let orders: Order[];
    
    if (patientId) {
      orders = getOrdersByPatient(patientId);
    } else if (pharmacyId) {
      orders = getOrdersByPharmacy(pharmacyId);
    } else {
      return NextResponse.json(
        { error: "Either patientId or pharmacyId is required" },
        { status: 400 }
      );
    }
    
    // Sort by most recent first
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json(orders);
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

    const order = createOrder({
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
      deliveryAddress,
      paymentMethod: "pay_on_delivery",
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
