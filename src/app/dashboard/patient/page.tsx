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

interface Subscription {
  id: string;
  patientId: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyCity: string;
  subscriptionType: string;
  monthlyAmount: number;
  deliveryAddress: string;
  status: string;
  createdAt: string;
}

interface Pharmacy {
  id: string;
  pharmacyName: string;
  city: string;
  status: string;
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

async function fetchSubscriptions(patientId: string): Promise<Subscription[]> {
  try {
    const res = await fetch(`/api/subscriptions?patientId=${patientId}`);
    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return [];
  }
}

async function fetchPharmacies(): Promise<Pharmacy[]> {
  try {
    const res = await fetch("/api/admin/pharmacies");
    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (error) {
    console.error("Error fetching pharmacies:", error);
    return [];
  }
}

export default function PatientDashboard() {
  const router = useRouter();
  const [user] = useState<UserSession | null>(getStoredUser);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [orderForm, setOrderForm] = useState({
    quantity: "1",
    symptoms: "",
    deliveryAddress: "",
  });
  const [subscriptionForm, setSubscriptionForm] = useState({
    pharmacyId: "",
    monthlyAmount: "",
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
      fetchSubscriptions(user.id).then(setSubscriptions);
      fetchPharmacies().then(setPharmacies);
      
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

  async function handleSubmitSubscription(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !subscriptionForm.pharmacyId) return;

    const selectedPharmacy = pharmacies.find(p => p.id === subscriptionForm.pharmacyId);
    
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: user.id,
          patientName: user.name,
          patientPhone: user.phone,
          pharmacyId: subscriptionForm.pharmacyId,
          pharmacyName: selectedPharmacy?.pharmacyName || "",
          pharmacyCity: selectedPharmacy?.city || "",
          monthlyAmount: Number(subscriptionForm.monthlyAmount),
          deliveryAddress: subscriptionForm.deliveryAddress,
        }),
      });

      if (res.ok) {
        setShowSubscriptionModal(false);
        setSubscriptionForm({ pharmacyId: "", monthlyAmount: "", deliveryAddress: "" });
        fetchSubscriptions(user.id).then(setSubscriptions);
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
    }
  }

  async function handleCancelSubscription(subscriptionId: string) {
    if (!user) return;
    
    try {
      const res = await fetch("/api/subscriptions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: subscriptionId,
          status: "cancelled",
        }),
      });

      if (res.ok) {
        fetchSubscriptions(user.id).then(setSubscriptions);
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="bg-white rounded-xl border-2 border-emerald-200 p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="font-semibold text-gray-900">Monthly Subscription</h3>
            <p className="text-gray-500 text-sm mt-1">
              {subscriptions.length > 0 ? `${subscriptions.filter(s => s.status === "active").length} active` : "Subscribe to a pharmacy"}
            </p>
          </button>
        </div>

        {/* Active Subscriptions */}
        {subscriptions.filter(s => s.status === "active").length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">🏥 My Pharmacy Subscriptions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscriptions.filter(s => s.status === "active").map((sub) => (
                <div key={sub.id} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-emerald-800 text-lg">{sub.pharmacyName}</h3>
                      <p className="text-sm text-emerald-600">📍 {sub.pharmacyCity}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium">
                      {sub.subscriptionType}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Monthly Amount:</span>
                      <span className="font-bold text-emerald-700">KES {sub.monthlyAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Delivery:</span>
                      <span className="text-sm text-gray-700">{sub.deliveryAddress}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleCancelSubscription(sub.id)}
                    className="w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    Cancel Subscription
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">🏥 Monthly Pharmacy Subscription</h2>
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg mb-4 border border-emerald-200">
              <p className="text-sm text-emerald-700">
                Subscribe to a pharmacy for monthly medication deliveries. Pay a fixed amount each month and get your medications delivered regularly.
              </p>
            </div>

            <form onSubmit={handleSubmitSubscription} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Pharmacy *</label>
                <select
                  required
                  value={subscriptionForm.pharmacyId}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, pharmacyId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Choose a pharmacy...</option>
                  {pharmacies.filter(p => p.status === "approved").map((pharmacy) => (
                    <option key={pharmacy.id} value={pharmacy.id}>
                      {pharmacy.pharmacyName} - {pharmacy.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Amount (KES) *</label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="500"
                  value={subscriptionForm.monthlyAmount}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, monthlyAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g. 5000"
                />
                <p className="text-xs text-gray-500 mt-1">The amount you&apos;ll pay each month for your medications</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                <input
                  type="text"
                  required
                  value={subscriptionForm.deliveryAddress}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, deliveryAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Full delivery address"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>How it works:</strong> The pharmacy will prepare your monthly medications and deliver them to your address. Payment is made on delivery.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubscriptionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
