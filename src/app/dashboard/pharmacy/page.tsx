"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PharmacySession {
  id: string;
  name: string;
  email: string;
  role: "pharmacy";
  pharmacyName: string;
  country: string;
  adminView?: boolean;
  adminName?: string;
}

interface Medication {
  id: string;
  pharmacyId: string;
  name: string;
  genericName: string;
  description: string;
  whatItCures: string;
  dosage: string;
  usageInstructions: string;
  sideEffects: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  requiresPrescription: boolean;
  status: string;
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
  updatedAt: string;
}

function getStoredUser(): PharmacySession | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("pharmalink_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as PharmacySession;
  } catch {
    return null;
  }
}

async function fetchMedications(pharmacyId: string): Promise<Medication[]> {
  try {
    const res = await fetch(`/api/medications?pharmacyId=${pharmacyId}`);
    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (error) {
    console.error("Error fetching medications:", error);
    return [];
  }
}

async function fetchOrders(pharmacyId: string): Promise<Order[]> {
  try {
    const res = await fetch(`/api/orders?pharmacyId=${pharmacyId}`);
    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export default function PharmacyDashboard() {
  const router = useRouter();
  const [user] = useState<PharmacySession | null>(getStoredUser);
  const [activeTab, setActiveTab] = useState<"medications" | "consultations" | "messages" | "family-doctor" | "staff" | "patients" | "delivery">("medications");
  const [medications, setMedications] = useState<Medication[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [familyDoctorServices, setFamilyDoctorServices] = useState<any[]>([]);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [patientRecords, setPatientRecords] = useState<any[]>([]);
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [showFamilyDoctorModal, setShowFamilyDoctorModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showPatientRecordModal, setShowPatientRecordModal] = useState(false);
  const [familyDoctorForm, setFamilyDoctorForm] = useState({
    description: "",
    monthlyFee: "5000",
    servicesIncluded: "",
  });
  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "assistant",
    qualification: "",
    licenseNumber: "",
  });
  const [patientRecordForm, setPatientRecordForm] = useState({
    patientName: "",
    patientSex: "male",
    patientAge: "",
    patientLocation: "",
    reasonForVisit: "",
    symptoms: "",
    diagnosis: "",
    medicationGiven: "",
    medicationDosage: "",
    reasonForMedication: "",
    pharmacistNotes: "",
    followUpDate: "",
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pharmacyNotes, setPharmacyNotes] = useState("");
  
  // Message state
  const [messages, setMessages] = useState<{id: string; subject: string; content: string; status: string; type: string; createdAt: string}[]>([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Form state for adding medication
  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    description: "",
    whatItCures: "",
    dosage: "",
    usageInstructions: "",
    sideEffects: "",
    price: "",
    stock: "",
    category: "General",
    requiresPrescription: false,
    imageUrl: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    } else if (!user.adminView && user.role !== "pharmacy") {
      router.push("/dashboard/patient");
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      fetchMedications(user.id).then(setMedications);
      fetchOrders(user.id).then(setOrders);
      // Fetch messages
      fetch(`/api/messages?pharmacyId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.messages) setMessages(data.messages);
        })
        .catch(console.error);
    }
  }, [user]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !messageSubject.trim() || !messageContent.trim()) return;
    
    setSendingMessage(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pharmacyId: user.id,
          pharmacyName: user.pharmacyName,
          pharmacistName: user.name,
          subject: messageSubject,
          content: messageContent,
          type: messageSubject.toLowerCase().includes("delete") ? "deletion_request" : "general"
        })
      });
      
      if (res.ok) {
        alert("Message sent to admin successfully!");
        setShowMessageModal(false);
        setMessageSubject("");
        setMessageContent("");
        // Refresh messages
        fetch(`/api/messages?pharmacyId=${user.id}`)
          .then(res => res.json())
          .then(data => {
            if (data.messages) setMessages(data.messages);
          });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch {
      alert("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  }

  async function handleAddMedication(e: React.FormEvent) {
    e.preventDefault();
    try {
      let imageUrl = "";
      
      // Upload image first if selected
      if (selectedImage) {
        setUploadingImage(true);
        const imageFormData = new FormData();
        imageFormData.append("file", selectedImage);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        });
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url || "";
        }
        setUploadingImage(false);
      }
      
      const res = await fetch("/api/medications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pharmacyId: user?.id,
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          imageUrl,
        }),
      });
      
      if (res.ok) {
        setShowAddMedication(false);
        setFormData({
          name: "",
          genericName: "",
          description: "",
          whatItCures: "",
          dosage: "",
          usageInstructions: "",
          sideEffects: "",
          price: "",
          stock: "",
          category: "General",
          requiresPrescription: false,
          imageUrl: "",
        });
        setSelectedImage(null);
        setImagePreview(null);
        fetchMedications(user!.id).then(setMedications);
      }
    } catch (error) {
      console.error("Error adding medication:", error);
    }
  }

  async function handleDeleteMedication(id: string) {
    if (!confirm("Are you sure you want to delete this medication?")) return;
    try {
      const res = await fetch(`/api/medications/${id}`, { method: "DELETE" });
      if (res.ok && user) {
        fetchMedications(user.id).then(setMedications);
      }
    } catch (error) {
      console.error("Error deleting medication:", error);
    }
  }

  async function handleUpdateOrderStatus(orderId: string, status: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, pharmacyNotes }),
      });
      
      if (res.ok && user) {
        setSelectedOrder(null);
        setPharmacyNotes("");
        fetchOrders(user.id).then(setOrders);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  }

  function handleSignOut() {
    if (user?.adminView) {
      // If admin viewing as pharmacy, return to admin dashboard
      localStorage.removeItem("pharmalink_user");
      router.push("/admin/dashboard");
    } else {
      localStorage.removeItem("pharmalink_user");
      router.push("/");
    }
  }

  const pendingConsultations = orders.filter(o => o.status === "pending" || o.status === "consulting");

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
            <span className="text-gray-600 text-sm hidden sm:block">
              <strong>{user.pharmacyName}</strong>
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

      {/* Admin View Banner */}
      {user?.adminView && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800 text-sm">
              <span className="font-medium">👁️ Admin View:</span>
              <span>You are viewing this pharmacy board as <strong>{user.adminName}</strong></span>
            </div>
            <Link href="/admin/dashboard" className="text-sm text-amber-700 hover:text-amber-900 font-medium">
              ← Return to Admin Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🏥</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">{user.pharmacyName}</h1>
              <p className="text-emerald-100/80">
                Pharmacist: {user.name} · {user.country === "kenya" ? "🇰🇪 Kenya" : "🇧🇮 Burundi"}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-emerald-600/50 border border-emerald-400/30 rounded-full px-3 py-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-200 text-xs font-medium">Verified Pharmacy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("medications")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "medications"
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            💊 My Medications ({medications.length})
          </button>
          <button
            onClick={() => setActiveTab("consultations")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "consultations"
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            💬 Consultations ({pendingConsultations.length})
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "messages"
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            📨 Messages ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab("family-doctor")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "family-doctor"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            🏥 Family Doctor
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "staff"
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            👥 Staff
          </button>
          <button
            onClick={() => setActiveTab("patients")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "patients"
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            📋 Patients
          </button>
          <button
            onClick={() => setActiveTab("delivery")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "delivery"
                ? "bg-yellow-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            🚚 Delivery
          </button>
        </div>

        {/* Medications Tab */}
        {activeTab === "medications" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Manage Medications</h2>
              <button
                onClick={() => setShowAddMedication(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                + Add Medication
              </button>
            </div>

            {medications.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="text-4xl mb-4">💊</div>
                <h3 className="font-semibold text-gray-900 mb-2">No medications yet</h3>
                <p className="text-gray-500 text-sm mb-4">Add medications to your pharmacy inventory</p>
                <button
                  onClick={() => setShowAddMedication(true)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  + Add Your First Medication
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {medications.map((med) => (
                  <div key={med.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    {med.imageUrl ? (
                      <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                        <img
                          src={med.imageUrl}
                          alt={med.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <span className="text-4xl">💊</span>
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{med.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        med.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        {med.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{med.category}</p>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{med.whatItCures}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-emerald-600">KES {med.price.toLocaleString()}</span>
                      <span className="text-gray-500">Stock: {med.stock}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteMedication(med.id)}
                      className="mt-3 text-xs text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Consultations Tab */}
        {activeTab === "consultations" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Patient Consultations & Orders</h2>
            
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="font-semibold text-gray-900 mb-2">No consultations yet</h3>
                <p className="text-gray-500 text-sm">Patients will appear here when they request medications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.medicationName}</h3>
                        <p className="text-sm text-gray-500">Patient: {order.patientName}</p>
                        <p className="text-sm text-gray-500">Qty: {order.quantity} · Total: KES {order.totalPrice.toLocaleString()}</p>
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
                      <p className="text-sm"><span className="font-medium">Symptoms:</span> {order.symptoms}</p>
                      {order.pharmacyNotes && (
                        <p className="text-sm mt-2"><span className="font-medium">Your notes:</span> {order.pharmacyNotes}</p>
                      )}
                    </div>
                    <div className="mt-3 flex gap-2">
                      {order.status === "pending" && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setActiveTab("consultations");
                          }}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700"
                        >
                          Start Consultation
                        </button>
                      )}
                      {order.status === "consulting" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "confirmed")}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700"
                        >
                          Confirm Order
                        </button>
                      )}
                      {order.status === "confirmed" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "preparing")}
                          className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-purple-700"
                        >
                          Mark Preparing
                        </button>
                      )}
                      {order.status === "preparing" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "ready")}
                          className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-emerald-700"
                        >
                          Mark Ready for Delivery
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Messages to Admin</h2>
              <button
                onClick={() => setShowMessageModal(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                + New Message
              </button>
            </div>

            {messages.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="text-4xl mb-4">📨</div>
                <h3 className="font-semibold text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-500 text-sm mb-4">Send a message to admin if you need to request document deletion or have other inquiries</p>
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  + Send First Message
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{msg.subject}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{msg.content}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        msg.status === "unread" ? "bg-blue-100 text-blue-700" :
                        msg.status === "read" ? "bg-gray-100 text-gray-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(msg.createdAt).toLocaleString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Medication Modal */}
        {showAddMedication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Medication</h2>
                <button
                  onClick={() => setShowAddMedication(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleAddMedication} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g. Panadol"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
                    <input
                      type="text"
                      value={formData.genericName}
                      onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g. Paracetamol"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What It Cures/Treats *</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.whatItCures}
                    onChange={(e) => setFormData({ ...formData, whatItCures: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g. Headaches, fever, body aches"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="General description of the medication"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                    <input
                      type="text"
                      value={formData.dosage}
                      onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g. 500mg tablets"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="General">General</option>
                      <option value="Pain Relief">Pain Relief</option>
                      <option value="Antibiotics">Antibiotics</option>
                      <option value="Vitamins">Vitamins</option>
                      <option value="Diabetes">Diabetes</option>
                      <option value="Blood Pressure">Blood Pressure</option>
                      <option value="Allergies">Allergies</option>
                      <option value="Digestive">Digestive</option>
                      <option value="Skin Care">Skin Care</option>
                      <option value="Eye Care">Eye Care</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drug Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-emerald-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedImage(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                      className="hidden"
                      id="drug-image"
                    />
                    <label htmlFor="drug-image" className="cursor-pointer">
                      {imagePreview ? (
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Drug preview"
                            className="max-h-32 mx-auto rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedImage(null);
                              setImagePreview(null);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="py-2">
                          <div className="text-3xl mb-2">📷</div>
                          <p className="text-sm text-gray-500">Click to upload drug image</p>
                          <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g. 150"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g. 100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usage Instructions</label>
                  <input
                    type="text"
                    value={formData.usageInstructions}
                    onChange={(e) => setFormData({ ...formData, usageInstructions: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g. Take 1 tablet every 6 hours"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Side Effects</label>
                  <input
                    type="text"
                    value={formData.sideEffects}
                    onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g. May cause drowsiness"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requiresPrescription"
                    checked={formData.requiresPrescription}
                    onChange={(e) => setFormData({ ...formData, requiresPrescription: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="requiresPrescription" className="text-sm text-gray-700">
                    Requires Prescription
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddMedication(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Add Medication
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Consultation Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Consultation</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Medication Requested</p>
                  <p className="font-semibold">{selectedOrder.medicationName}</p>
                  <p className="text-sm">Qty: {selectedOrder.quantity} · KES {selectedOrder.totalPrice.toLocaleString()}</p>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 mb-1">Patient&apos;s Symptoms</p>
                  <p className="text-gray-700">{selectedOrder.symptoms}</p>
                  <p className="text-sm text-gray-500 mt-2">Patient: {selectedOrder.patientName}</p>
                  <p className="text-sm text-gray-500">Phone: {selectedOrder.patientPhone}</p>
                  <p className="text-sm text-gray-500">Address: {selectedOrder.deliveryAddress}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Consultation Notes / Advice
                  </label>
                  <textarea
                    rows={4}
                    value={pharmacyNotes}
                    onChange={(e) => setPharmacyNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter your professional advice, dosage instructions, warnings..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleUpdateOrderStatus(selectedOrder.id, "consulting");
                      setSelectedOrder(null);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save & Continue Consulting
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, "confirmed")}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Confirm Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Show Message Modal */}
        {showMessageModal && (
          <MessageModalComponent
            onClose={() => setShowMessageModal(false)}
            onSend={handleSendMessage}
            subject={messageSubject}
            setSubject={setMessageSubject}
            content={messageContent}
            setContent={setMessageContent}
            sending={sendingMessage}
          />
        )}
      </main>
    </div>
  );
}

// Message Modal Component
function MessageModalComponent({ 
  onClose, 
  onSend, 
  subject, 
  setSubject, 
  content, 
  setContent, 
  sending 
}: { 
  onClose: () => void; 
  onSend: (e: React.FormEvent) => void; 
  subject: string; 
  setSubject: (v: string) => void; 
  content: string; 
  setContent: (v: string) => void; 
  sending: boolean; 
}) {
  const isDeletionRequest = subject.toLowerCase().includes("delete");
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Send Message to Admin</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        
        <form onSubmit={onSend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g. Request to delete my documents"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Explain your request to admin..."
            />
          </div>
          
          {isDeletionRequest && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              ℹ️ Your request to delete documents will be reviewed by admin. Once approved, your uploaded documents will be permanently removed from the system.
            </div>
          )}
          
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending || !subject.trim() || !content.trim()}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
