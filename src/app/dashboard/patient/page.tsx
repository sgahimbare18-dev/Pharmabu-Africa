"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "patient";
  country: string;
}

interface Medication {
  id: string;
  pharmacyId: string;
  name: string;
  whatItCures: string;
  price: number;
  category: string;
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
  pharmacyNotes: string;
  status: string;
  paymentMethod: string;
  deliveryAddress: string;
  createdAt: string;
}

function getStoredUser(): UserSession | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("pharmalink_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as UserSession;
  } catch {
    return null;
  }
}

async function fetchOrders(patientId: string): Promise<Order[]> {
  try {
    const res = await fetch(`/api/orders?patientId=${patientId}`);
    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export default function PatientDashboard() {
  const router = useRouter();
  const [user] = useState<UserSession | null>(getStoredUser);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [orderForm, setOrderForm] = useState({
    quantity: "1",
    symptoms: "",
    deliveryAddress: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    } else if (user.role !== "patient") {
      router.push("/dashboard/pharmacy");
    }
  }, [user, router]);

  // Handle stored medication from marketplace
  useEffect(() => {
    if (user) {
      fetchOrders(user.id).then(setOrders);
      
      // Check if user came from medication marketplace
      const storedMed = localStorage.getItem("selected_medication");
      if (storedMed) {
        try {
          const med = JSON.parse(storedMed) as Medication;
          // Use requestAnimationFrame to defer the state update
          requestAnimationFrame(() => {
            setSelectedMedication(med);
            setShowOrderModal(true);
            localStorage.removeItem("selected_medication");
          });
        } catch (e) {
          console.error("Error parsing medication:", e);
        }
      }
    }
  }, [user]);

  async function handleSubmitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !selectedMedication) return;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: user.id,
          patientName: user.name,
          patientPhone: user.phone,
          pharmacyId: selectedMedication.pharmacyId,
          pharmacyName: "Pharmacy",
          medicationId: selectedMedication.id,
          medicationName: selectedMedication.name,
          medicationPrice: selectedMedication.price,
          quantity: Number(orderForm.quantity),
          symptoms: orderForm.symptoms,
          deliveryAddress: orderForm.deliveryAddress,
        }),
      });

      if (res.ok) {
        setShowOrderModal(false);
        setSelectedMedication(null);
        setOrderForm({ quantity: "1", symptoms: "", deliveryAddress: "" });
        fetchOrders(user.id).then(setOrders);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }

  function handleSignOut() {
    localStorage.removeItem("pharmalink_user");
    router.push("/");
  }

  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "consulting");
  const activeOrders = orders.filter(o => !["delivered", "cancelled"].includes(o.status));

  if (!user) {
    return (
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
        <div className="text-emerald-400 text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PL</span>
            </div>
            <span className="font-bold text-gray-900">
              PharmaLink <span className="text-emerald-600">Africa</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/medications"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Browse Medications
            </Link>
            <span className="text-gray-600 text-sm hidden sm:block">
              Welcome, <strong>{user.name}</strong>
            </span>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-2xl font-bold mb-1">Hello, {user.name}! 👋</h1>
          <p className="text-emerald-100/80">
            Browse medications, chat with pharmacists, and order medicines for delivery.
          </p>
          <Link
            href="/medications"
            className="inline-block mt-4 bg-white text-emerald-700 px-4 py-2 rounded-lg font-medium hover:bg-emerald-50"
          >
            💊 Browse Medications
          </Link>
        </div>

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Orders</h2>
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.medicationName}</h3>
                      <p className="text-sm text-gray-500">Pharmacy: {order.pharmacyName}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {order.quantity} · KES {order.totalPrice.toLocaleString()} · Pay on Delivery
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      order.status === "consulting" ? "bg-blue-100 text-blue-700" :
                      order.status === "confirmed" ? "bg-green-100 text-green-700" :
                      order.status === "preparing" ? "bg-purple-100 text-purple-700" :
                      order.status === "ready" ? "bg-emerald-100 text-emerald-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm"><span className="font-medium">Your symptoms:</span> {order.symptoms}</p>
                    {order.pharmacyNotes && (
                      <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded">
                        <p className="text-sm"><span className="font-medium text-emerald-700">Pharmacist&apos;s advice:</span></p>
                        <p className="text-sm text-gray-700">{order.pharmacyNotes}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <span>📍 {order.deliveryAddress}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/medications"
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">💊</div>
            <h3 className="font-semibold text-gray-900">Browse Medications</h3>
            <p className="text-gray-500 text-sm mt-1">Find medications from verified pharmacies</p>
          </Link>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-semibold text-gray-900">My Orders</h3>
            <p className="text-gray-500 text-sm mt-1">
              {orders.length > 0 ? `${orders.length} order${orders.length !== 1 ? "s" : ""}` : "No orders yet"}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold text-gray-900">Consultations</h3>
            <p className="text-gray-500 text-sm mt-1">
              {pendingOrders.length > 0 ? `${pendingOrders.length} pending` : "No active consultations"}
            </p>
          </div>
        </div>

        {/* Order History */}
        {orders.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Order History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Medication</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Pharmacy</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Qty</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Total</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.id} className="border-b border-gray-100">
                      <td className="py-3 px-2">{order.medicationName}</td>
                      <td className="py-3 px-2">{order.pharmacyName}</td>
                      <td className="py-3 px-2">{order.quantity}</td>
                      <td className="py-3 px-2">KES {order.totalPrice.toLocaleString()}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          order.status === "delivered" ? "bg-green-100 text-green-700" :
                          order.status === "cancelled" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Account info */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Account Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Name</span>
              <p className="font-medium text-gray-900 mt-0.5">{user.name}</p>
            </div>
            <div>
              <span className="text-gray-500">Email</span>
              <p className="font-medium text-gray-900 mt-0.5">{user.email}</p>
            </div>
            <div>
              <span className="text-gray-500">Phone</span>
              <p className="font-medium text-gray-900 mt-0.5">{user.phone || "Not provided"}</p>
            </div>
            <div>
              <span className="text-gray-500">Country</span>
              <p className="font-medium text-gray-900 mt-0.5 capitalize">{user.country}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Order Modal */}
      {showOrderModal && selectedMedication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Request Medication</h2>
              <button
                onClick={() => {
                  setShowOrderModal(false);
                  setSelectedMedication(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg mb-4">
              <p className="font-semibold text-gray-900">{selectedMedication.name}</p>
              <p className="text-sm text-gray-600">{selectedMedication.whatItCures}</p>
              <p className="text-lg font-bold text-emerald-600 mt-2">
                KES {selectedMedication.price.toLocaleString()}
              </p>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={orderForm.quantity}
                  onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Describe your symptoms * <span className="text-gray-400 font-normal">(The pharmacist will review this)</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={orderForm.symptoms}
                  onChange={(e) => setOrderForm({ ...orderForm, symptoms: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g. I have had a headache for 2 days, slight fever..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                <input
                  type="text"
                  required
                  value={orderForm.deliveryAddress}
                  onChange={(e) => setOrderForm({ ...orderForm, deliveryAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Full delivery address"
                />
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Payment:</strong> Pay on delivery (Cash/M-Pesa when received)
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowOrderModal(false);
                    setSelectedMedication(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
