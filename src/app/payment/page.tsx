"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "patient";
  country: string;
}

interface Order {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  pharmacyId: string;
  pharmacyName: string;
  medicationId: string;
  medicationName: string;
  medicationPrice: number;
  quantity: number;
  totalPrice: number;
  symptoms: string;
  status: string;
  paymentMethod: string;
  deliveryAddress: string;
  createdAt: string;
}

// Currency exchange rates to KES
const EXCHANGE_RATES: Record<string, number> = {
  KES: 1,
  USD: 157.50,
  EUR: 168.75,
  GBP: 198.50,
  BIF: 0.053,
  UGX: 0.042,
  TZS: 0.060,
  RWF: 0.112,
};

const CURRENCIES = [
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "BIF", name: "Burundian Franc", symbol: "FBu" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh" },
  { code: "RWF", name: "Rwandan Franc", symbol: "FRw" },
];

const PAYMENT_METHODS = [
  { 
    id: "mpesa", 
    name: "M-Pesa", 
    icon: "📱",
    countries: ["kenya"],
    description: "Pay instantly via M-Pesa"
  },
  { 
    id: "airtel_money", 
    name: "Airtel Money", 
    icon: "📱",
    countries: ["kenya", "burundi"],
    description: "Pay via Airtel Money"
  },
  { 
    id: "mobile_money_bi", 
    name: "Mobile Money (BI)", 
    icon: "📱",
    countries: ["burundi"],
    description: "Pay via mobile money in Burundi"
  },
  { 
    id: "card", 
    name: "Credit/Debit Card", 
    icon: "💳",
    countries: [],
    description: "Pay with Visa, Mastercard"
  },
  { 
    id: "paypal", 
    name: "PayPal", 
    icon: "🌐",
    countries: [],
    description: "Pay with PayPal"
  },
];

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [session, setSession] = useState<UserSession | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  // Payment form
  const [currency, setCurrency] = useState("KES");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const storedSession = localStorage.getItem("pharmalink_user");
    if (!storedSession) {
      router.push("/signin");
      return;
    }
    const userSession = JSON.parse(storedSession);
    if (userSession.role !== "patient") {
      router.push("/signin");
      return;
    }
    setSession(userSession);

    // Fetch order details
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.patientId === userSession.id) {
            setOrder(data);
          } else {
            setError("Order not found");
          }
        })
        .catch(() => setError("Failed to load order"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId, router]);

  const convertToKES = (amount: number, curr: string) => {
    return amount * (EXCHANGE_RATES[curr] || 1);
  };

  const getExchangeRateDisplay = (curr: string) => {
    if (curr === "KES") return "1 KES = 1 KES";
    return `1 ${curr} = ${EXCHANGE_RATES[curr]} KES`;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !session) return;

    setProcessing(true);
    setError("");

    try {
      // Simulate payment processing
      const amountInKES = convertToKES(order.totalPrice, currency);
      const platformFee = (amountInKES * 8) / 100;
      const pharmacyPayout = amountInKES - platformFee;

      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          amount: order.totalPrice,
          currency,
          paymentMethod,
          patientId: session.id,
          patientName: session.name,
          patientPhone: phoneNumber || session.phone,
          pharmacyId: order.pharmacyId,
          pharmacyName: order.pharmacyName,
          medicationName: order.medicationName,
          quantity: order.quantity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setPaymentMessage(data.message);
        
        // Update order payment method
        await fetch(`/api/orders/${order.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod: `${paymentMethod}_paid`,
            status: "confirmed"
          }),
        });
      } else {
        setError(data.error || "Payment failed");
      }
    } catch (err) {
      setError("Payment processing failed");
    } finally {
      setProcessing(false);
    }
  };

  const filteredPaymentMethods = PAYMENT_METHODS.filter(
    (method) => method.countries.length === 0 || 
    method.countries.includes(session?.country as string) ||
    session?.country === "kenya" || 
    session?.country === "burundi"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/dashboard/patient" className="text-blue-600 hover:underline">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
          <p className="text-gray-700 mb-4">{paymentMessage}</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600">
              <strong>Order ID:</strong> {order.id.slice(0, 8)}...
            </p>
            <p className="text-sm text-gray-600">
              <strong>Amount Paid:</strong> {order.totalPrice} {currency} ({convertToKES(order.totalPrice, currency).toFixed(2)} KES)
            </p>
            <p className="text-sm text-gray-600">
              <strong>Pharmacy:</strong> {order.pharmacyName}
            </p>
          </div>
          <Link
            href="/dashboard/patient"
            className="inline-block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const amountInKES = convertToKES(order.totalPrice, currency);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard/patient" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Payment</h1>
        <p className="text-sm text-gray-600 mb-6">Pay for your medication order</p>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Medication</span>
              <span className="font-medium">{order.medicationName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quantity</span>
              <span className="font-medium">{order.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pharmacy</span>
              <span className="font-medium">{order.pharmacyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Address</span>
              <span className="font-medium">{order.deliveryAddress}</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="text-gray-600">Total</span>
              <span className="text-2xl font-bold text-blue-600">{order.totalPrice} {currency}</span>
            </div>
            {currency !== "KES" && (
              <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
                ≈ {amountInKES.toFixed(2)} KES (at {getExchangeRateDisplay(currency)})
              </div>
            )}
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePayment} className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h2>

          {/* Currency Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Currency</label>
            <div className="grid grid-cols-4 gap-2">
              {CURRENCIES.map((curr) => (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => setCurrency(curr.code)}
                  className={`p-3 rounded-lg border text-center transition ${
                    currency === curr.code
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-bold">{curr.code}</div>
                  <div className="text-xs text-gray-500">{curr.symbol}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Money will be converted to KES and sent to: +254792965970
            </p>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <div className="space-y-2">
              {filteredPaymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full p-4 rounded-lg border flex items-center gap-4 transition ${
                    paymentMethod === method.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Phone Number for Mobile Money */}
          {paymentMethod === "mpesa" || paymentMethod === "airtel_money" || paymentMethod === "mobile_money_bi" ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (for payment)
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+2547XXXXXXXX"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                You will receive an STK push prompt on this number
              </p>
            </div>
          ) : null}

          {/* Card Details */}
          {paymentMethod === "card" && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* PayPal Notice */}
          {paymentMethod === "paypal" && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-700">
                You will be redirected to PayPal to complete your payment of{" "}
                <strong>{order.totalPrice} {currency}</strong>
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!paymentMethod || processing}
            className={`w-full py-4 rounded-lg font-bold text-lg transition ${
              processing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Processing Payment...
              </span>
            ) : (
              `Pay ${order.totalPrice} ${currency}`
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By paying, you agree to our terms. 8% platform fee applies to all transactions.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
