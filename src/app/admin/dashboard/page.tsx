"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: "kenya" | "burundi";
  createdAt: string;
}

interface Pharmacy {
  id: string;
  pharmacyName: string;
  pharmacistName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  pharmacistQualification: string;
  pharmacistUniversity: string;
  pharmacistGraduationYear: string;
  pharmacyRegNumber: string;
  pharmacyRegAuthority: string;
  pharmacyRegExpiry: string;
  country: "kenya" | "burundi";
  city: string;
  address: string;
  operatingHours: string;
  servicesOffered: string;
  licenseDocument: string;
  qualificationDocument: string;
  pharmacyRegDocument: string;
  status: "pending" | "verified" | "rejected";
  createdAt: string;
}

interface Medication {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  name: string;
  genericName: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "out_of_stock";
  requiresPrescription: boolean;
  createdAt: string;
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
  status: "pending" | "consulting" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
}

interface Subscription {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyCity: string;
  monthlyAmount: number;
  deliveryAddress: string;
  status: "active" | "paused" | "cancelled";
  createdAt: string;
}

interface Message {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacistName: string;
  subject: string;
  content: string;
  status: "unread" | "read" | "responded";
  type: "deletion_request" | "general";
  createdAt: string;
}

type ViewType = "pharmacies" | "patients" | "orders" | "subscriptions" | "medications" | "messages" | "access_patients" | "access_pharmacies";
type FilterStatus = "all" | "pending" | "verified" | "rejected";
type OrderStatus = "all" | "pending" | "consulting" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<ViewType>("pharmacies");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [adminName, setAdminName] = useState("Admin");
  
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [orderFilter, setOrderFilter] = useState<OrderStatus>("all");
  const [medCategoryFilter, setMedCategoryFilter] = useState<string>("all");
  
  const [deletingDocs, setDeletingDocs] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("pharmalink_admin");
    if (!stored) {
      router.replace("/admin/login");
      return;
    }
    try {
      const admin = JSON.parse(stored) as { name: string; role: string };
      if (admin.role !== "admin") {
        router.replace("/admin/login");
        return;
      }
      setAdminName(admin.name);
    } catch {
      router.replace("/admin/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [activeView]);

  async function fetchData() {
    setLoading(true);
    const headers = { "x-admin-session": "pharmalink-admin" };
    
    try {
      if (activeView === "pharmacies") {
        const res = await fetch("/api/admin/pharmacies", { headers });
        const data = (await res.json()) as { pharmacies?: Pharmacy[] };
        if (res.ok && data.pharmacies) setPharmacies(data.pharmacies);
      } else if (activeView === "patients") {
        const res = await fetch("/api/admin/users", { headers });
        const data = (await res.json()) as { users?: Patient[] };
        if (res.ok && data.users) setPatients(data.users);
      } else if (activeView === "orders") {
        const res = await fetch("/api/admin/orders", { headers });
        const data = (await res.json()) as { orders?: Order[] };
        if (res.ok && data.orders) setOrders(data.orders);
      } else if (activeView === "subscriptions") {
        const res = await fetch("/api/admin/subscriptions", { headers });
        const data = (await res.json()) as { subscriptions?: Subscription[] };
        if (res.ok && data.subscriptions) setSubscriptions(data.subscriptions);
      } else if (activeView === "medications") {
        const res = await fetch("/api/admin/medications", { headers });
        const data = (await res.json()) as { medications?: Medication[] };
        if (res.ok && data.medications) setMedications(data.medications);
      } else if (activeView === "messages") {
        const res = await fetch("/api/messages", { headers });
        const data = (await res.json()) as { messages?: Message[] };
        if (res.ok && data.messages) setMessages(data.messages);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: "verified" | "rejected") {
    setActionLoading(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/pharmacies/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-session": "pharmalink-admin" },
        body: JSON.stringify({ status }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (res.ok) {
        setMessage({ type: "success", text: data.message ?? "Status updated." });
        setPharmacies((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
        if (selectedPharmacy?.id === id) {
          setSelectedPharmacy((prev) => prev ? { ...prev, status } : null);
        }
      } else {
        setMessage({ type: "error", text: data.error ?? "Failed to update status." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeletePharmacy(id: string) {
    if (!confirm("Are you sure you want to delete this pharmacy? This action cannot be undone.")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/pharmacies/${id}`, {
        method: "DELETE",
        headers: { "x-admin-session": "pharmalink-admin" },
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Pharmacy deleted successfully." });
        setPharmacies((prev) => prev.filter((p) => p.id !== id));
        setSelectedPharmacy(null);
      } else {
        const data = (await res.json()) as { error?: string };
        setMessage({ type: "error", text: data.error ?? "Failed to delete pharmacy." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeletePatient(id: string) {
    if (!confirm("Are you sure you want to delete this patient? This will also cancel all their orders and subscriptions.")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-session": "pharmalink-admin" },
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Patient deleted successfully." });
        setPatients((prev) => prev.filter((p) => p.id !== id));
        setSelectedPatient(null);
      } else {
        const data = (await res.json()) as { error?: string };
        setMessage({ type: "error", text: data.error ?? "Failed to delete patient." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeleteOrder(id: string) {
    if (!confirm("Are you sure you want to delete this order?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-session": "pharmalink-admin" },
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Order deleted successfully." });
        setOrders((prev) => prev.filter((o) => o.id !== id));
        setSelectedOrder(null);
      } else {
        const data = (await res.json()) as { error?: string };
        setMessage({ type: "error", text: data.error ?? "Failed to delete order." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCancelSubscription(id: string) {
    if (!confirm("Are you sure you want to cancel this subscription?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/subscriptions?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-session": "pharmalink-admin" },
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Subscription cancelled successfully." });
        setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "cancelled" } : s)));
        setSelectedSubscription(null);
      } else {
        const data = (await res.json()) as { error?: string };
        setMessage({ type: "error", text: data.error ?? "Failed to cancel subscription." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeleteMedication(id: string) {
    if (!confirm("Are you sure you want to delete this medication?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/medications?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-session": "pharmalink-admin" },
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Medication deleted successfully." });
        setMedications((prev) => prev.filter((m) => m.id !== id));
      } else {
        const data = (await res.json()) as { error?: string };
        setMessage({ type: "error", text: data.error ?? "Failed to delete medication." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeleteDocuments(pharmacyId: string) {
    if (!confirm("Are you sure you want to delete all documents for this pharmacy?")) return;
    setDeletingDocs(true);
    try {
      const res = await fetch(`/api/admin/pharmacies/${pharmacyId}/documents`, {
        method: "DELETE",
        headers: { "x-admin-session": "pharmalink-admin" },
      });
      const data = (await res.json()) as { error?: string };
      if (res.ok) {
        setMessage({ type: "success", text: "Documents deleted successfully." });
        setPharmacies((prev) =>
          prev.map((p) => (p.id === pharmacyId ? { ...p, licenseDocument: "", qualificationDocument: "", pharmacyRegDocument: "" } : p))
        );
        if (selectedPharmacy?.id === pharmacyId) {
          setSelectedPharmacy((prev) => prev ? { ...prev, licenseDocument: "", qualificationDocument: "", pharmacyRegDocument: "" } : null);
        }
        fetchData();
      } else {
        setMessage({ type: "error", text: data.error ?? "Failed to delete documents." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setDeletingDocs(false);
    }
  }

  async function handleMarkMessageRead(messageId: string) {
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-session": "pharmalink-admin" },
        body: JSON.stringify({ status: "read" }),
      });
      if (res.ok) {
        setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, status: "read" } : m)));
      }
    } catch {
      // ignore
    }
  }

  function handleSignOut() {
    localStorage.removeItem("pharmalink_admin");
    router.push("/admin/login");
  }

  function handleViewAsPatient(patient: Patient) {
    // Store admin view session for patient
    const viewSession = {
      id: patient.id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      role: "patient" as const,
      country: patient.country,
      adminView: true,
      adminName: adminName,
    };
    localStorage.setItem("pharmalink_user", JSON.stringify(viewSession));
    router.push("/dashboard/patient");
  }

  function handleViewAsPharmacy(pharmacy: Pharmacy) {
    // Store admin view session for pharmacy
    const viewSession = {
      id: pharmacy.id,
      name: pharmacy.pharmacistName,
      email: pharmacy.email,
      role: "pharmacy" as const,
      pharmacyName: pharmacy.pharmacyName,
      country: pharmacy.country,
      adminView: true,
      adminName: adminName,
    };
    localStorage.setItem("pharmalink_user", JSON.stringify(viewSession));
    router.push("/dashboard/pharmacy");
  }

  // Filter data based on current view
  const filteredPharmacies = pharmacies.filter((p) => filter === "all" || p.status === filter);
  const filteredOrders = orders.filter((o) => orderFilter === "all" || o.status === orderFilter);
  const filteredMedications = medications.filter((m) => medCategoryFilter === "all" || m.category === medCategoryFilter);

  // Get unique categories for medications
  const medCategories = [...new Set(medications.map((m) => m.category))];

  // Stats
  const counts = {
    pharmacies: pharmacies.length,
    pending: pharmacies.filter((p) => p.status === "pending").length,
    verified: pharmacies.filter((p) => p.status === "verified").length,
    rejected: pharmacies.filter((p) => p.status === "rejected").length,
    patients: patients.length,
    orders: orders.length,
    subscriptions: subscriptions.length,
    medications: medications.length,
    unreadMessages: messages.filter((m) => m.status === "unread").length,
  };

  const statusBadge = (status: Pharmacy["status"]): React.ReactNode => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      verified: "bg-emerald-100 text-emerald-800 border border-emerald-200",
      rejected: "bg-red-100 text-red-800 border border-red-200",
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {status === "pending" ? "⏳" : status === "verified" ? "✅" : "❌"} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const orderStatusBadge = (status: Order["status"]) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      consulting: "bg-blue-100 text-blue-800",
      confirmed: "bg-indigo-100 text-indigo-800",
      preparing: "bg-orange-100 text-orange-800",
      ready: "bg-emerald-100 text-emerald-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="font-bold text-gray-900">PharmaLink Africa</span>
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Signed in as <strong>{adminName}</strong>
            </span>
            <button onClick={handleSignOut} className="text-sm text-gray-500 hover:text-red-600 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Access Boards - Quick Access to Patient and Pharmacy Dashboards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Access Patient Board */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👤</span>
                <h2 className="text-lg font-semibold text-gray-900">Access Patient Board</h2>
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {patients.length} patients
              </span>
            </div>
            <div className="p-4 max-h-64 overflow-y-auto">
              {patients.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No registered patients</p>
              ) : (
                <div className="space-y-2">
                  {patients.slice(0, 5).map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{patient.name}</p>
                        <p className="text-xs text-gray-500">{patient.email}</p>
                      </div>
                      <button
                        onClick={() => handleViewAsPatient(patient)}
                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View Board
                      </button>
                    </div>
                  ))}
                  {patients.length > 5 && (
                    <button
                      onClick={() => setActiveView("access_patients")}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-2"
                    >
                      View all {patients.length} patients →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Access Pharmacy Board */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏥</span>
                <h2 className="text-lg font-semibold text-gray-900">Access Pharmacy Board</h2>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {pharmacies.length} pharmacies
              </span>
            </div>
            <div className="p-4 max-h-64 overflow-y-auto">
              {pharmacies.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No registered pharmacies</p>
              ) : (
                <div className="space-y-2">
                  {pharmacies.slice(0, 5).map((pharmacy) => (
                    <div key={pharmacy.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{pharmacy.pharmacyName}</p>
                        <p className="text-xs text-gray-500">{pharmacy.city} • {pharmacy.status}</p>
                      </div>
                      <button
                        onClick={() => handleViewAsPharmacy(pharmacy)}
                        className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700 transition-colors"
                      >
                        View Board
                      </button>
                    </div>
                  ))}
                  {pharmacies.length > 5 && (
                    <button
                      onClick={() => setActiveView("access_pharmacies")}
                      className="w-full text-center text-sm text-emerald-600 hover:text-emerald-800 py-2"
                    >
                      View all {pharmacies.length} pharmacies →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all platform data: pharmacies, patients, orders, medications, and subscriptions.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton active={activeView === "pharmacies"} onClick={() => setActiveView("pharmacies")} count={counts.pharmacies}>
            🏥 Pharmacies
          </TabButton>
          <TabButton active={activeView === "patients"} onClick={() => setActiveView("patients")} count={counts.patients}>
            👤 Patients
          </TabButton>
          <TabButton active={activeView === "orders"} onClick={() => setActiveView("orders")} count={counts.orders}>
            📦 Orders
          </TabButton>
          <TabButton active={activeView === "subscriptions"} onClick={() => setActiveView("subscriptions")} count={counts.subscriptions}>
            🔄 Subscriptions
          </TabButton>
          <TabButton active={activeView === "medications"} onClick={() => setActiveView("medications")} count={counts.medications}>
            💊 Medications
          </TabButton>
          <TabButton active={activeView === "messages"} onClick={() => setActiveView("messages")} count={counts.unreadMessages}>
            💬 Messages
          </TabButton>
        </div>

        {/* Flash message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {message.text}
          </div>
        )}

        {/* PHARMACIES VIEW */}
        {activeView === "pharmacies" && (
          <>
            <div className="flex gap-2 mb-4">
              {(["all", "pending", "verified", "rejected"] as FilterStatus[]).map((s) => (
                <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}>
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)} ({s === "all" ? counts.pharmacies : s === "pending" ? counts.pending : s === "verified" ? counts.verified : counts.rejected})
                </button>
              ))}
            </div>
            <PharmacyTable pharmacies={filteredPharmacies} loading={loading} actionLoading={actionLoading} onView={setSelectedPharmacy} onStatusChange={handleStatusChange} onDelete={handleDeletePharmacy} statusBadge={statusBadge} />
          </>
        )}

        {/* PATIENTS VIEW */}
        {activeView === "patients" && (
          <>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-gray-400">Loading patients…</div>
              ) : patients.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <div className="text-4xl mb-4">👤</div>
                  <h3 className="font-semibold text-gray-900 mb-2">No patients yet</h3>
                  <p className="text-gray-500 text-sm">Patient registrations will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Phone</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Country</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Registered</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {patients.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                          <td className="px-4 py-3 text-gray-600">{p.email}</td>
                          <td className="px-4 py-3 text-gray-600">{p.phone}</td>
                          <td className="px-4 py-3 text-gray-600 capitalize">{p.country}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">
                            {new Date(p.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => setSelectedPatient(p)} className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors">
                              View
                            </button>
                            <button onClick={() => handleDeletePatient(p.id)} disabled={actionLoading === p.id} className="ml-2 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-lg transition-colors">
                              {actionLoading === p.id ? "…" : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ORDERS VIEW */}
        {activeView === "orders" && (
          <>
            <div className="flex gap-2 mb-4 overflow-x-auto">
              <button onClick={() => setOrderFilter("all")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${orderFilter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}>
                All Orders ({counts.orders})
              </button>
              {["pending", "consulting", "confirmed", "preparing", "ready", "delivered", "cancelled"].map((s) => (
                <button key={s} onClick={() => setOrderFilter(s as OrderStatus)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${orderFilter === s ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)} ({orders.filter((o) => o.status === s).length})
                </button>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-gray-400">Loading orders…</div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <div className="text-4xl mb-4">📦</div>
                  <h3 className="font-semibold text-gray-900 mb-2">No orders found</h3>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Order ID</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Patient</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Pharmacy</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Medication</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-gray-500">{o.id.slice(0, 8)}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{o.patientName}</div>
                            <div className="text-xs text-gray-400">{o.patientPhone}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{o.pharmacyName}</td>
                          <td className="px-4 py-3">
                            <div className="text-gray-900">{o.medicationName}</div>
                            <div className="text-xs text-gray-400">x{o.quantity}</div>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">KES {o.totalPrice.toLocaleString()}</td>
                          <td className="px-4 py-3">{orderStatusBadge(o.status)}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">
                            {new Date(o.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => setSelectedOrder(o)} className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors">
                              View
                            </button>
                            <button onClick={() => handleDeleteOrder(o.id)} disabled={actionLoading === o.id} className="ml-2 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-lg transition-colors">
                              {actionLoading === o.id ? "…" : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* SUBSCRIPTIONS VIEW */}
        {activeView === "subscriptions" && (
          <>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-gray-400">Loading subscriptions…</div>
              ) : subscriptions.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <div className="text-4xl mb-4">🔄</div>
                  <h3 className="font-semibold text-gray-900 mb-2">No subscriptions yet</h3>
                  <p className="text-gray-500 text-sm">Monthly pharmacy subscriptions will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Patient</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Pharmacy</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Monthly Amount</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Delivery Address</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Started</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {subscriptions.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{s.patientName}</div>
                            <div className="text-xs text-gray-400">{s.patientPhone}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{s.pharmacyName}</div>
                            <div className="text-xs text-gray-400">{s.pharmacyCity}</div>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">KES {s.monthlyAmount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">{s.deliveryAddress}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${s.status === "active" ? "bg-green-100 text-green-800" : s.status === "paused" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                              {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">
                            {new Date(s.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => setSelectedSubscription(s)} className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors">
                              View
                            </button>
                            {s.status === "active" && (
                              <button onClick={() => handleCancelSubscription(s.id)} disabled={actionLoading === s.id} className="ml-2 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-lg transition-colors">
                                {actionLoading === s.id ? "…" : "Cancel"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* MEDICATIONS VIEW */}
        {activeView === "medications" && (
          <>
            <div className="flex gap-2 mb-4 overflow-x-auto">
              <button onClick={() => setMedCategoryFilter("all")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${medCategoryFilter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}>
                All ({counts.medications})
              </button>
              {medCategories.map((cat) => (
                <button key={cat} onClick={() => setMedCategoryFilter(cat)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${medCategoryFilter === cat ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}>
                  {cat} ({medications.filter((m) => m.category === cat).length})
                </button>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-gray-400">Loading medications…</div>
              ) : filteredMedications.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <div className="text-4xl mb-4">💊</div>
                  <h3 className="font-semibold text-gray-900 mb-2">No medications found</h3>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Pharmacy</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Price</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Stock</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Prescription</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredMedications.map((m) => (
                        <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{m.name}</div>
                            <div className="text-xs text-gray-400">{m.genericName}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {m.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{m.pharmacyName}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">KES {m.price.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={m.stock > 0 ? "text-gray-900" : "text-red-600 font-medium"}>
                              {m.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${m.status === "active" ? "bg-green-100 text-green-800" : m.status === "out_of_stock" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                              {m.status === "out_of_stock" ? "Out of Stock" : m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {m.requiresPrescription ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                Required
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => handleDeleteMedication(m.id)} disabled={actionLoading === m.id} className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-lg transition-colors">
                              {actionLoading === m.id ? "…" : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* MESSAGES VIEW */}
        {activeView === "messages" && (
          <MessagesView messages={messages} loading={loading} selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage} onMarkRead={handleMarkMessageRead} onDeleteDocs={handleDeleteDocuments} />
        )}
      </main>

      {/* Document Viewer Modal */}
      {selectedDocument && <DocumentViewerModal documentUrl={selectedDocument} onClose={() => setSelectedDocument(null)} />}

      {/* Pharmacy Detail Modal */}
      {selectedPharmacy && <PharmacyModal pharmacy={selectedPharmacy} onClose={() => setSelectedPharmacy(null)} onDeleteDocs={handleDeleteDocuments} onStatusChange={handleStatusChange} onDelete={handleDeletePharmacy} actionLoading={actionLoading} deletingDocs={deletingDocs} statusBadge={statusBadge} setSelectedDocument={setSelectedDocument} />}

      {/* Patient Detail Modal */}
      {selectedPatient && <PatientModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} onDelete={handleDeletePatient} actionLoading={actionLoading} />}

      {/* Order Detail Modal */}
      {selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onDelete={handleDeleteOrder} actionLoading={actionLoading} />}

      {/* Subscription Detail Modal */}
      {selectedSubscription && <SubscriptionModal subscription={selectedSubscription} onClose={() => setSelectedSubscription(null)} onCancel={handleCancelSubscription} actionLoading={actionLoading} />}
    </div>
  );
}

// Helper Components
function TabButton({ active, onClick, count, children }: { active: boolean; onClick: () => void; count?: number; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
        active ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
      }`}
    >
      {children}
      {typeof count === "number" && count > 0 && (
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function PharmacyTable({ pharmacies, loading, actionLoading, onView, onStatusChange, onDelete, statusBadge }: {
  pharmacies: Pharmacy[];
  loading: boolean;
  actionLoading: string | null;
  onView: (p: Pharmacy) => void;
  onStatusChange: (id: string, status: "verified" | "rejected") => void;
  onDelete: (id: string) => void;
  statusBadge: (status: Pharmacy["status"]) => React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {loading ? (
        <div className="p-12 text-center text-gray-400">Loading pharmacies…</div>
      ) : pharmacies.length === 0 ? (
        <div className="p-12 text-center text-gray-400">No pharmacies found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Pharmacy</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Pharmacist</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">License #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Location</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Registered</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pharmacies.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{p.pharmacyName}</div>
                    <div className="text-xs text-gray-400">{p.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.pharmacistName}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{p.licenseNumber}</td>
                  <td className="px-4 py-3 text-gray-600">{p.city}, <span className="capitalize">{p.country}</span></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(p.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td className="px-4 py-3">{statusBadge(p.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => onView(p)} className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors">
                        View
                      </button>
                      {p.status === "pending" && (
                        <>
                          <button onClick={() => onStatusChange(p.id, "verified")} disabled={actionLoading === p.id} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-xs font-medium rounded-lg transition-colors">
                            {actionLoading === p.id ? "…" : "Approve"}
                          </button>
                          <button onClick={() => onStatusChange(p.id, "rejected")} disabled={actionLoading === p.id} className="px-3 py-1 bg-red-100 hover:bg-red-200 disabled:bg-red-50 text-red-700 text-xs font-medium rounded-lg transition-colors">
                            {actionLoading === p.id ? "…" : "Reject"}
                          </button>
                        </>
                      )}
                      {p.status === "verified" && (
                        <button onClick={() => onStatusChange(p.id, "rejected")} disabled={actionLoading === p.id} className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-lg transition-colors">
                          Revoke
                        </button>
                      )}
                      {p.status === "rejected" && (
                        <button onClick={() => onStatusChange(p.id, "verified")} disabled={actionLoading === p.id} className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-medium rounded-lg transition-colors">
                          Re-approve
                        </button>
                      )}
                      <button onClick={() => onDelete(p.id)} disabled={actionLoading === p.id} className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-lg transition-colors">
                        {actionLoading === p.id ? "…" : "🗑️"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MessagesView({ messages, loading, selectedMessage, setSelectedMessage, onMarkRead, onDeleteDocs }: {
  messages: Message[];
  loading: boolean;
  selectedMessage: Message | null;
  setSelectedMessage: (m: Message | null) => void;
  onMarkRead: (id: string) => void;
  onDeleteDocs: (pharmacyId: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (!selectedMessage) return;
    setDeleting(true);
    await onDeleteDocs(selectedMessage.pharmacyId);
    setDeleting(false);
    setSelectedMessage(null);
  };

  if (loading) return <div className="p-12 text-center text-gray-400">Loading messages…</div>;
  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <div className="text-4xl mb-4">💬</div>
        <h3 className="font-semibold text-gray-900 mb-2">No messages yet</h3>
        <p className="text-gray-500 text-sm">Messages from pharmacies will appear here</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {messages.map((msg) => (
          <div key={msg.id} className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${msg.status === "unread" ? "bg-blue-50" : ""}`}
            onClick={() => { setSelectedMessage(msg); if (msg.status === "unread") onMarkRead(msg.id); }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {msg.status === "unread" && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
                  <span className="font-medium text-gray-900">{msg.subject}</span>
                  {msg.type === "deletion_request" && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Deletion Request</span>}
                </div>
                <p className="text-sm text-gray-500">From: {msg.pharmacyName} ({msg.pharmacistName})</p>
                <p className="text-sm text-gray-400 mt-1 line-clamp-1">{msg.content}</p>
              </div>
              <div className="text-xs text-gray-400 ml-4">
                {new Date(msg.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) setSelectedMessage(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl my-8">
            <div className="flex items-start justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${selectedMessage.status === "unread" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                  {selectedMessage.status === "unread" ? "New" : "Read"}
                </span>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4">×</button>
            </div>
            <div className="p-6">
              <div className="mb-4"><p className="text-xs text-gray-400 uppercase tracking-wider mb-1">From</p><p className="font-medium text-gray-900">{selectedMessage.pharmacyName}</p><p className="text-sm text-gray-500">{selectedMessage.pharmacistName}</p></div>
              <div className="pt-4 border-t border-gray-200"><p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Message</p><div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</div></div>
              {selectedMessage.type === "deletion_request" && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button onClick={handleDelete} disabled={deleting} className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                    {deleting ? "… Deleting Documents…" : "🗑️ Delete All Documents for This Pharmacy"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PharmacyModal({ pharmacy, onClose, onDeleteDocs, onStatusChange, onDelete, actionLoading, deletingDocs, statusBadge, setSelectedDocument }: {
  pharmacy: Pharmacy;
  onClose: () => void;
  onDeleteDocs: (id: string) => void;
  onStatusChange: (id: string, status: "verified" | "rejected") => void;
  onDelete: (id: string) => void;
  actionLoading: string | null;
  deletingDocs: boolean;
  statusBadge: (status: Pharmacy["status"]) => React.ReactNode;
  setSelectedDocument: (url: string) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div><h2 className="text-xl font-bold text-gray-900">{pharmacy.pharmacyName}</h2><div className="flex items-center gap-2 mt-1">{statusBadge(pharmacy.status)}</div></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4">×</button>
        </div>
        <div className="p-6 space-y-6 text-sm">
          <section><h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">📋 Contact</h3><div className="grid grid-cols-2 gap-3"><div><span className="text-xs text-gray-500">Email</span><p className="text-gray-900">{pharmacy.email}</p></div><div><span className="text-xs text-gray-500">Phone</span><p className="text-gray-900">{pharmacy.phone}</p></div><div><span className="text-xs text-gray-500">City</span><p className="text-gray-900">{pharmacy.city}</p></div><div><span className="text-xs text-gray-500">Country</span><p className="text-gray-900 capitalize">{pharmacy.country}</p></div></div></section>
          <section><h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">🎓 Pharmacist</h3><div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2"><p><span className="text-xs text-gray-500">Name</span><span className="ml-2 font-medium">{pharmacy.pharmacistName}</span></p><p><span className="text-xs text-gray-500">License</span><span className="ml-2 font-mono text-xs">{pharmacy.licenseNumber}</span></p><p><span className="text-xs text-gray-500">Qualification</span><span className="ml-2">{pharmacy.pharmacistQualification}</span></p></div></section>
          <section><h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">🏥 Registration</h3><div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-2"><p><span className="text-xs text-gray-500">Reg Number</span><span className="ml-2 font-mono text-xs">{pharmacy.pharmacyRegNumber}</span></p><p><span className="text-xs text-gray-500">Authority</span><span className="ml-2">{pharmacy.pharmacyRegAuthority}</span></p></div></section>
          {/* Documents Section - Always show this section */}
          <section><h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">📄 Documents</h3>
            {(pharmacy.licenseDocument || pharmacy.qualificationDocument || pharmacy.pharmacyRegDocument) ? (
              <div className="grid gap-2">
                {pharmacy.licenseDocument && <button onClick={() => setSelectedDocument(pharmacy.licenseDocument)} className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors text-left"><span className="text-blue-600">📜</span><div><p className="text-sm font-medium text-gray-900">Pharmacist License</p><p className="text-xs text-gray-500 truncate">{pharmacy.licenseDocument}</p></div></button>}
                {pharmacy.qualificationDocument && <button onClick={() => setSelectedDocument(pharmacy.qualificationDocument)} className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors text-left"><span className="text-blue-600">🎓</span><div><p className="text-sm font-medium text-gray-900">Qualification Certificate</p><p className="text-xs text-gray-500 truncate">{pharmacy.qualificationDocument}</p></div></button>}
                {pharmacy.pharmacyRegDocument && <button onClick={() => setSelectedDocument(pharmacy.pharmacyRegDocument)} className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors text-left"><span className="text-blue-600">🏥</span><div><p className="text-sm font-medium text-gray-900">Pharmacy Registration</p><p className="text-xs text-gray-500 truncate">{pharmacy.pharmacyRegDocument}</p></div></button>}
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                <p className="text-yellow-700 text-sm">⚠️ No documents uploaded</p>
                <p className="text-yellow-600 text-xs mt-1">This pharmacy did not upload credential documents during registration.</p>
              </div>
            )}
          </section>
        </div>
        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex gap-2">
            {(pharmacy.licenseDocument || pharmacy.qualificationDocument || pharmacy.pharmacyRegDocument) && (
              <button onClick={() => onDeleteDocs(pharmacy.id)} disabled={deletingDocs} className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                {deletingDocs ? "…" : "🗑️ Delete Docs"}
              </button>
            )}
            <button onClick={() => onDelete(pharmacy.id)} disabled={actionLoading === pharmacy.id} className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
              {actionLoading === pharmacy.id ? "…" : "🗑️ Delete Pharmacy"}
            </button>
          </div>
          <div className="flex gap-3">
            {pharmacy.status === "pending" && (
              <>
                <button onClick={() => onStatusChange(pharmacy.id, "rejected")} disabled={actionLoading === pharmacy.id} className="px-5 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-xl transition-colors">
                  {actionLoading === pharmacy.id ? "…" : "❌ Reject"}
                </button>
                <button onClick={() => onStatusChange(pharmacy.id, "verified")} disabled={actionLoading === pharmacy.id} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors">
                  {actionLoading === pharmacy.id ? "…" : "✅ Approve"}
                </button>
              </>
            )}
            {pharmacy.status === "verified" && <button onClick={() => onStatusChange(pharmacy.id, "rejected")} disabled={actionLoading === pharmacy.id} className="px-5 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-xl">Revoke</button>}
            {pharmacy.status === "rejected" && <button onClick={() => onStatusChange(pharmacy.id, "verified")} disabled={actionLoading === pharmacy.id} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl">Re-approve</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function PatientModal({ patient, onClose, onDelete, actionLoading }: { patient: Patient; onClose: () => void; onDelete: (id: string) => void; actionLoading: string | null }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8">
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div><h2 className="text-xl font-bold text-gray-900">Patient Details</h2></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <div><p className="text-xs text-gray-500">Name</p><p className="font-medium text-gray-900">{patient.name}</p></div>
          <div><p className="text-xs text-gray-500">Email</p><p className="text-gray-900">{patient.email}</p></div>
          <div><p className="text-xs text-gray-500">Phone</p><p className="text-gray-900">{patient.phone}</p></div>
          <div><p className="text-xs text-gray-500">Country</p><p className="text-gray-900 capitalize">{patient.country}</p></div>
          <div><p className="text-xs text-gray-500">Registered</p><p className="text-gray-900">{new Date(patient.createdAt).toLocaleString()}</p></div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">Close</button>
          <button onClick={() => onDelete(patient.id)} disabled={actionLoading === patient.id} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
            {actionLoading === patient.id ? "…" : "Delete Patient"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderModal({ order, onClose, onDelete, actionLoading }: { order: Order; onClose: () => void; onDelete: (id: string) => void; actionLoading: string | null }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div><h2 className="text-xl font-bold text-gray-900">Order Details</h2><p className="text-xs text-gray-400 mt-1 font-mono">{order.id}</p></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500">Patient</p><p className="font-medium text-gray-900">{order.patientName}</p><p className="text-xs text-gray-400">{order.patientPhone}</p></div>
            <div><p className="text-xs text-gray-500">Pharmacy</p><p className="text-gray-900">{order.pharmacyName}</p></div>
          </div>
          <div><p className="text-xs text-gray-500">Medication</p><p className="text-gray-900">{order.medicationName} x {order.quantity}</p><p className="text-sm font-medium">KES {order.totalPrice.toLocaleString()}</p></div>
          <div><p className="text-xs text-gray-500">Symptoms</p><p className="text-gray-700 bg-gray-50 rounded p-2">{order.symptoms || "—"}</p></div>
          {order.pharmacyNotes && <div><p className="text-xs text-gray-500">Pharmacist Notes</p><p className="text-gray-700 bg-blue-50 rounded p-2">{order.pharmacyNotes}</p></div>}
          <div><p className="text-xs text-gray-500">Delivery Address</p><p className="text-gray-700">{order.deliveryAddress}</p></div>
          <div><p className="text-xs text-gray-500">Status</p><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100">{order.status}</span></div>
        </div>
        <div className="flex justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button onClick={() => onDelete(order.id)} disabled={actionLoading === order.id} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
            {actionLoading === order.id ? "…" : "Delete Order"}
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

function SubscriptionModal({ subscription, onClose, onCancel, actionLoading }: { subscription: Subscription; onClose: () => void; onCancel: (id: string) => void; actionLoading: string | null }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8">
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div><h2 className="text-xl font-bold text-gray-900">Subscription Details</h2></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <div><p className="text-xs text-gray-500">Patient</p><p className="font-medium text-gray-900">{subscription.patientName}</p><p className="text-xs text-gray-400">{subscription.patientPhone}</p></div>
          <div><p className="text-xs text-gray-500">Pharmacy</p><p className="text-gray-900">{subscription.pharmacyName}</p><p className="text-xs text-gray-400">{subscription.pharmacyCity}</p></div>
          <div><p className="text-xs text-gray-500">Monthly Amount</p><p className="text-lg font-bold text-gray-900">KES {subscription.monthlyAmount.toLocaleString()}</p></div>
          <div><p className="text-xs text-gray-500">Delivery Address</p><p className="text-gray-700">{subscription.deliveryAddress}</p></div>
          <div><p className="text-xs text-gray-500">Status</p><span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${subscription.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{subscription.status}</span></div>
          <div><p className="text-xs text-gray-500">Started</p><p className="text-gray-700">{new Date(subscription.createdAt).toLocaleString()}</p></div>
        </div>
        <div className="flex justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          {subscription.status === "active" && (
            <button onClick={() => onCancel(subscription.id)} disabled={actionLoading === subscription.id} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
              {actionLoading === subscription.id ? "…" : "Cancel Subscription"}
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

function DocumentViewerModal({ documentUrl, onClose }: { documentUrl: string; onClose: () => void }) {
  if (!documentUrl) return null;
  const isPdf = documentUrl.toLowerCase().endsWith(".pdf");
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Document Viewer</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-gray-100">
          {isPdf ? <iframe src={documentUrl} className="w-full h-full rounded-lg" title="Document viewer" /> : <img src={documentUrl} alt="Document" className="max-w-full max-h-full object-contain mx-auto rounded-lg" />}
        </div>
      </div>
    </div>
  );
}
