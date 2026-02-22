"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "patient";
  country: string;
  adminView?: boolean;
  adminName?: string;
}

interface PatientProfile {
  id: string;
  userId: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  address: string;
  city: string;
  country: string;
  occupation: string;
  educationLevel: string;
  profilePicture: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalNotes: string;
  allergies: string;
}

interface Pharmacy {
  id: string;
  pharmacyName: string;
  city: string;
  status: string;
  address: string;
  phone: string;
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

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  pharmacyId: string;
  pharmacyName: string;
  medicationName: string;
  dosage: string;
  quantity: number;
  instructions: string;
  prescriberName: string;
  prescriberLicense: string;
  documentUrl: string;
  status: string;
  notes: string;
  createdAt: string;
}

interface FamilyPharmacist {
  id: string;
  patientId: string;
  patientName: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacistName: string;
  status: string;
  monthlyFee: number;
  paymentStatus: string;
  paymentMethod: string;
  paymentDate: string;
  nextPaymentDate: string;
  assignedAt: string;
  notes: string;
}

interface ProfileUpdateRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  requestedFields: Record<string, any>;
  status: string;
  adminNotes: string;
  createdAt: string;
}

interface FamilyDoctorService {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacistName: string;
  description: string;
  monthlyFee: number;
  servicesIncluded: string;
  isAvailable: boolean;
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

export default function PatientDashboard() {
  const router = useRouter();
  const [user] = useState<UserSession | null>(getStoredUser);
  const [activeTab, setActiveTab] = useState<"home" | "find-pharmacy" | "prescriptions" | "delivery" | "family-pharmacist" | "telepharmacy" | "profile">("home");
  
  // Data states
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [familyPharmacist, setFamilyPharmacist] = useState<FamilyPharmacist | null>(null);
  const [profileUpdateRequests, setProfileUpdateRequests] = useState<ProfileUpdateRequest[]>([]);
  const [familyDoctorServices, setFamilyDoctorServices] = useState<FamilyDoctorService[]>([]);
  
  // Modals
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFindPharmacyModal, setShowFindPharmacyModal] = useState(false);
  const [showTelepharmacyModal, setShowTelepharmacyModal] = useState(false);
  
  // Form states
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
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
  const [prescriptionForm, setPrescriptionForm] = useState({
    medicationName: "",
    dosage: "",
    quantity: "",
    instructions: "",
    prescriberName: "",
    prescriberLicense: "",
  });
  const [profileForm, setProfileForm] = useState({
    dateOfBirth: "",
    age: "",
    gender: "other",
    address: "",
    city: "",
    occupation: "",
    educationLevel: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalNotes: "",
    allergies: "",
  });
  const [telepharmacyForm, setTelepharmacyForm] = useState({
    pharmacyId: "",
    reason: "",
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingPrescription, setUploadingPrescription] = useState(false);

  // Fetch user profile
  useEffect(() => {
    if (user) {
      fetch(`/api/patient-profile?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error && data.id) {
            setProfile(data);
            setProfileForm({
              dateOfBirth: data.dateOfBirth || "",
              age: data.age?.toString() || "",
              gender: data.gender || "other",
              address: data.address || "",
              city: data.city || "",
              occupation: data.occupation || "",
              educationLevel: data.educationLevel || "",
              emergencyContactName: data.emergencyContactName || "",
              emergencyContactPhone: data.emergencyContactPhone || "",
              medicalNotes: data.medicalNotes || "",
              allergies: data.allergies || "",
            });
          }
        })
        .catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    } else if (!user.adminView && user.role !== "patient") {
      router.push("/dashboard/pharmacy");
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchSubscriptions();
      fetchPharmacies();
      fetchPrescriptions();
      fetchFamilyPharmacist();
      fetchProfileUpdateRequests();
      fetchFamilyDoctorServices();
      
      // Check if user came from medication marketplace
      const storedMed = localStorage.getItem("selected_medication");
      if (storedMed) {
        try {
          const med = JSON.parse(storedMed);
          requestAnimationFrame(() => {
            localStorage.removeItem("selected_medication");
          });
        } catch (e) {
          console.error("Error parsing medication:", e);
        }
      }
    }
  }, [user]);

  async function fetchOrders() {
    try {
      const res = await fetch(`/api/orders?patientId=${user?.id}`);
      if (res.ok) setOrders(await res.json());
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  async function fetchSubscriptions() {
    try {
      const res = await fetch(`/api/subscriptions?patientId=${user?.id}`);
      if (res.ok) setSubscriptions(await res.json());
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  }

  async function fetchPharmacies() {
    try {
      const res = await fetch("/api/admin/pharmacies");
      if (res.ok) {
        const data = await res.json();
        setPharmacies(data.filter((p: Pharmacy) => p.status === "verified"));
      }
    } catch (error) {
      console.error("Error fetching pharmacies:", error);
    }
  }

  async function fetchPrescriptions() {
    try {
      const res = await fetch(`/api/prescriptions?patientId=${user?.id}`);
      if (res.ok) setPrescriptions(await res.json());
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  }

  async function fetchFamilyPharmacist() {
    try {
      const res = await fetch(`/api/family-pharmacist?patientId=${user?.id}&active=true`);
      if (res.ok) {
        const data = await res.json();
        if (data) setFamilyPharmacist(data);
      }
    } catch (error) {
      console.error("Error fetching family pharmacist:", error);
    }
  }

  async function fetchProfileUpdateRequests() {
    try {
      const res = await fetch(`/api/profile-update-request?userId=${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setProfileUpdateRequests(data);
      }
    } catch (error) {
      console.error("Error fetching profile update requests:", error);
    }
  }

  async function fetchFamilyDoctorServices() {
    try {
      const res = await fetch("/api/family-doctor-service?available=true");
      if (res.ok) {
        const data = await res.json();
        setFamilyDoctorServices(data);
      }
    } catch (error) {
      console.error("Error fetching family doctor services:", error);
    }
  }

  async function handleSubmitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !selectedPharmacy) return;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: user.id,
          patientName: user.name,
          patientPhone: user.phone,
          pharmacyId: selectedPharmacy.id,
          pharmacyName: selectedPharmacy.pharmacyName,
          medicationId: "",
          medicationName: "Consultation",
          medicationPrice: 0,
          quantity: 1,
          symptoms: orderForm.symptoms,
          deliveryAddress: orderForm.deliveryAddress,
        }),
      });

      if (res.ok) {
        setShowOrderModal(false);
        setSelectedPharmacy(null);
        setOrderForm({ quantity: "1", symptoms: "", deliveryAddress: "" });
        fetchOrders();
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }

  async function handleSubmitSubscription(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !subscriptionForm.pharmacyId) return;

    const selected = pharmacies.find(p => p.id === subscriptionForm.pharmacyId);
    
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: user.id,
          patientName: user.name,
          patientPhone: user.phone,
          pharmacyId: subscriptionForm.pharmacyId,
          pharmacyName: selected?.pharmacyName || "",
          pharmacyCity: selected?.city || "",
          monthlyAmount: Number(subscriptionForm.monthlyAmount),
          deliveryAddress: subscriptionForm.deliveryAddress,
        }),
      });

      if (res.ok) {
        setShowSubscriptionModal(false);
        setSubscriptionForm({ pharmacyId: "", monthlyAmount: "", deliveryAddress: "" });
        fetchSubscriptions();
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
    }
  }

  async function handleUploadPrescription(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setUploadingPrescription(true);
    try {
      let documentUrl = "";
      
      // Upload file first if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          documentUrl = uploadData.url || "";
        }
      }

      // Determine which pharmacy to send to
      let pharmacyId = prescriptionForm.medicationName; // Using this as pharmacy selection for now
      let pharmacyName = "";
      
      if (familyPharmacist) {
        pharmacyId = familyPharmacist.pharmacyId;
        pharmacyName = familyPharmacist.pharmacyName;
      } else if (selectedPharmacy) {
        pharmacyId = selectedPharmacy.id;
        pharmacyName = selectedPharmacy.pharmacyName;
      }

      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: user.id,
          patientName: user.name,
          pharmacyId,
          pharmacyName,
          medicationName: prescriptionForm.medicationName,
          dosage: prescriptionForm.dosage,
          quantity: Number(prescriptionForm.quantity),
          instructions: prescriptionForm.instructions,
          prescriberName: prescriptionForm.prescriberName,
          prescriberLicense: prescriptionForm.prescriberLicense,
          documentUrl,
        }),
      });

      if (res.ok) {
        setShowPrescriptionModal(false);
        setPrescriptionForm({
          medicationName: "",
          dosage: "",
          quantity: "",
          instructions: "",
          prescriberName: "",
          prescriberLicense: "",
        });
        setSelectedFile(null);
        fetchPrescriptions();
        alert("Prescription uploaded successfully! The pharmacy will review it.");
      }
    } catch (error) {
      console.error("Error uploading prescription:", error);
    } finally {
      setUploadingPrescription(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    try {
      // First, submit a profile update request for admin approval
      const requestRes = await fetch("/api/profile-update-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          requestedFields: profileForm,
        }),
      });

      if (requestRes.ok) {
        setShowProfileModal(false);
        alert("Profile update request submitted! An admin will review and approve your changes.");
        // Fetch any existing requests
        fetchProfileUpdateRequests();
      } else {
        alert("Failed to submit profile update request. Please try again.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  }

  async function handleStartTelepharmacy(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !telepharmacyForm.pharmacyId) return;

    try {
      const selected = pharmacies.find(p => p.id === telepharmacyForm.pharmacyId);
      
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: user.id,
          patientName: user.name,
          patientPhone: user.phone,
          pharmacyId: telepharmacyForm.pharmacyId,
          pharmacyName: selected?.pharmacyName || "",
          medicationId: "",
          medicationName: "Telepharmacy Consultation",
          medicationPrice: 0,
          quantity: 1,
          symptoms: telepharmacyForm.reason,
          deliveryAddress: "Telepharmacy - No delivery needed",
        }),
      });

      if (res.ok) {
        setShowTelepharmacyModal(false);
        setTelepharmacyForm({ pharmacyId: "", reason: "" });
        alert("Telepharmacy consultation request sent! A pharmacist will contact you shortly.");
        fetchOrders();
      }
    } catch (error) {
      console.error("Error starting telepharmacy:", error);
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
        fetchSubscriptions();
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
    }
  }

  function handleSignOut() {
    if (user?.adminView) {
      localStorage.removeItem("pharmalink_user");
      router.push("/admin/dashboard");
    } else {
      localStorage.removeItem("pharmalink_user");
      router.push("/");
    }
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
            <button
              onClick={() => setActiveTab("profile")}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600"
            >
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 font-medium">👤</span>
              </div>
              <span className="hidden sm:inline">{user.name}</span>
            </button>
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
              <span>You are viewing this patient board as <strong>{user.adminName}</strong></span>
            </div>
            <Link href="/admin/dashboard" className="text-sm text-amber-700 hover:text-amber-900 font-medium">
              ← Return to Admin Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab("home")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "home" ? "bg-emerald-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            🏠 Home
          </button>
          <button
            onClick={() => setActiveTab("find-pharmacy")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "find-pharmacy" ? "bg-emerald-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            🔍 Find Pharmacy
          </button>
          <button
            onClick={() => setActiveTab("prescriptions")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "prescriptions" ? "bg-emerald-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            📄 Prescriptions ({prescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab("delivery")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "delivery" ? "bg-emerald-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            🚚 Track Delivery ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("family-pharmacist")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "family-pharmacist" ? "bg-emerald-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            👨‍⚕️ Family Pharmacist
          </button>
          <button
            onClick={() => setActiveTab("telepharmacy")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "telepharmacy" ? "bg-emerald-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            📹 Telepharmacy
          </button>
        </div>

        {/* HOME TAB */}
        {activeTab === "home" && (
          <div>
            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white mb-8">
              <h1 className="text-2xl font-bold mb-1">Hello, {user.name}! 👋</h1>
              <p className="text-emerald-100/80">
                Your health is our priority. Find a pharmacy, upload prescriptions, or consult with a pharmacist.
              </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <button
                onClick={() => setActiveTab("find-pharmacy")}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
              >
                <div className="text-3xl mb-3">🏥</div>
                <h3 className="font-semibold text-gray-900">Find a Pharmacy</h3>
                <p className="text-gray-500 text-sm mt-1">Browse verified pharmacies near you</p>
              </button>

              <button
                onClick={() => setShowPrescriptionModal(true)}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
              >
                <div className="text-3xl mb-3">📤</div>
                <h3 className="font-semibold text-gray-900">Upload Prescription</h3>
                <p className="text-gray-500 text-sm mt-1">Upload your prescription for review</p>
              </button>

              <button
                onClick={() => setActiveTab("delivery")}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
              >
                <div className="text-3xl mb-3">🚚</div>
                <h3 className="font-semibold text-gray-900">Track Delivery</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {activeOrders.length > 0 ? `${activeOrders.length} active delivery` : "No active deliveries"}
                </p>
              </button>

              <button
                onClick={() => setActiveTab("family-pharmacist")}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
              >
                <div className="text-3xl mb-3">👨‍⚕️</div>
                <h3 className="font-semibold text-gray-900">Family Pharmacist</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {familyPharmacist ? `Assigned to ${familyPharmacist.pharmacyName}` : "Assign your regular pharmacist"}
                </p>
              </button>

              <button
                onClick={() => setActiveTab("telepharmacy")}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
              >
                <div className="text-3xl mb-3">📹</div>
                <h3 className="font-semibold text-gray-900">Telepharmacy</h3>
                <p className="text-gray-500 text-sm mt-1">Consult with a pharmacist via video call</p>
              </button>

              <button
                onClick={() => setActiveTab("prescriptions")}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
              >
                <div className="text-3xl mb-3">📋</div>
                <h3 className="font-semibold text-gray-900">My Prescriptions</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {prescriptions.length > 0 ? `${prescriptions.length} prescription${prescriptions.length !== 1 ? "s" : ""}` : "No prescriptions yet"}
                </p>
              </button>
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
                      {order.pharmacyNotes && (
                        <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded">
                          <p className="text-sm"><span className="font-medium text-emerald-700">Pharmacist:</span> {order.pharmacyNotes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Subscriptions */}
            {subscriptions.filter(s => s.status === "active").length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">🏥 My Pharmacy Subscriptions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subscriptions.filter(s => s.status === "active").map((sub) => (
                    <div key={sub.id} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 p-5">
                      <h3 className="font-bold text-emerald-800 text-lg">{sub.pharmacyName}</h3>
                      <p className="text-sm text-emerald-600">📍 {sub.pharmacyCity}</p>
                      <p className="font-bold text-emerald-700 mt-2">KES {sub.monthlyAmount.toLocaleString()}/month</p>
                      <button
                        onClick={() => handleCancelSubscription(sub.id)}
                        className="mt-3 w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FIND PHARMACY TAB */}
        {activeTab === "find-pharmacy" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Find a Pharmacy</h2>
            
            {pharmacies.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="text-4xl mb-4">🏥</div>
                <h3 className="font-semibold text-gray-900 mb-2">No verified pharmacies available</h3>
                <p className="text-gray-500 text-sm">Check back later for pharmacies in your area</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pharmacies.map((pharmacy) => (
                  <div key={pharmacy.id} className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 text-lg">{pharmacy.pharmacyName}</h3>
                    <p className="text-gray-500 text-sm mt-1">📍 {pharmacy.city}</p>
                    <p className="text-gray-500 text-sm">📧 {pharmacy.address}</p>
                    
                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setSelectedPharmacy(pharmacy);
                          setShowOrderModal(true);
                        }}
                        className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
                      >
                        💊 Request Medication
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPharmacy(pharmacy);
                          setShowSubscriptionModal(true);
                        }}
                        className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700"
                      >
                        📅 Subscribe Monthly
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PRESCRIPTIONS TAB */}
        {activeTab === "prescriptions" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Prescriptions</h2>
              <button
                onClick={() => setShowPrescriptionModal(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
              >
                + Upload Prescription
              </button>
            </div>

            {prescriptions.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="text-4xl mb-4">📄</div>
                <h3 className="font-semibold text-gray-900 mb-2">No prescriptions yet</h3>
                <p className="text-gray-500 text-sm mb-4">Upload your prescriptions to get them filled</p>
                <button
                  onClick={() => setShowPrescriptionModal(true)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
                >
                  Upload Your First Prescription
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{prescription.medicationName}</h3>
                        <p className="text-sm text-gray-500">Dosage: {prescription.dosage} | Qty: {prescription.quantity}</p>
                        <p className="text-sm text-gray-500">Prescriber: {prescription.prescriberName}</p>
                        <p className="text-sm text-gray-500">Pharmacy: {prescription.pharmacyName || "Pending assignment"}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        prescription.status === "verified" ? "bg-green-100 text-green-700" :
                        prescription.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        prescription.status === "rejected" ? "bg-red-100 text-red-700" :
                        "bg-emerald-100 text-emerald-700"
                      }`}>
                        {prescription.status}
                      </span>
                    </div>
                    {prescription.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">{prescription.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DELIVERY TRACKING TAB */}
        {activeTab === "delivery" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Track Delivery</h2>

            {orders.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 text-sm">Your delivery tracking will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{order.medicationName}</h3>
                        <p className="text-gray-500">Pharmacy: {order.pharmacyName}</p>
                        <p className="text-gray-500">Order #{order.id.slice(0, 8)}</p>
                      </div>
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        order.status === "consulting" ? "bg-blue-100 text-blue-700" :
                        order.status === "confirmed" ? "bg-green-100 text-green-700" :
                        order.status === "preparing" ? "bg-purple-100 text-purple-700" :
                        order.status === "ready" ? "bg-emerald-100 text-emerald-700" :
                        order.status === "delivered" ? "bg-emerald-200 text-emerald-800" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Progress Tracker */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>Order Placed</span>
                        <span>Confirmed</span>
                        <span>Preparing</span>
                        <span>Ready</span>
                        <span>Delivered</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full transition-all ${
                          order.status === "delivered" ? "w-full bg-emerald-500" :
                          order.status === "ready" ? "w-4/5 bg-emerald-400" :
                          order.status === "preparing" ? "w-3/5 bg-purple-400" :
                          order.status === "confirmed" ? "w-2/5 bg-green-400" :
                          order.status === "consulting" ? "w-1/5 bg-blue-400" :
                          "w-1/5 bg-yellow-400"
                        }`} />
                      </div>
                    </div>

                    {order.pharmacyNotes && (
                      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="text-sm font-medium text-emerald-700">Pharmacist&apos;s Notes:</p>
                        <p className="text-sm text-gray-700">{order.pharmacyNotes}</p>
                      </div>
                    )}

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm"><span className="font-medium">Delivery Address:</span> {order.deliveryAddress}</p>
                      <p className="text-sm"><span className="font-medium">Total:</span> KES {order.totalPrice.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAMILY PHARMACIST TAB */}
        {activeTab === "family-pharmacist" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Family Pharmacist</h2>

            {familyPharmacist ? (
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-3xl">👨‍⚕️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{familyPharmacist.pharmacyName}</h3>
                    <p className="text-emerald-100">Pharmacist: {familyPharmacist.pharmacistName}</p>
                    <p className="text-emerald-100 text-sm">Assigned: {new Date(familyPharmacist.assignedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {/* Payment Status */}
                <div className="mt-4 p-3 bg-white/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>Monthly Fee:</span>
                    <span className="font-bold">KES {familyPharmacist.monthlyFee || 0}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span>Payment Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      familyPharmacist.paymentStatus === 'paid' ? 'bg-green-500' : 
                      familyPharmacist.paymentStatus === 'pending' ? 'bg-yellow-500' :
                      familyPharmacist.paymentStatus === 'overdue' ? 'bg-red-500' : 'bg-gray-500'
                    }`}>
                      {familyPharmacist.paymentStatus === 'paid' ? '✅ Paid' : 
                       familyPharmacist.paymentStatus === 'pending' ? '⏳ Pending Payment' :
                       familyPharmacist.paymentStatus === 'overdue' ? '⚠️ Overdue' : 'Not Active'}
                    </span>
                  </div>
                  {familyPharmacist.nextPaymentDate && (
                    <div className="mt-2 text-sm text-emerald-100">
                      Next payment: {new Date(familyPharmacist.nextPaymentDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {familyPharmacist.status === 'pending_payment' && (
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        alert("Payment feature coming soon! You will be able to pay via M-Pesa or Mobile Money.");
                      }}
                      className="w-full bg-yellow-500 text-black px-4 py-3 rounded-lg font-medium hover:bg-yellow-400"
                    >
                      💰 Pay Now to Activate
                    </button>
                  </div>
                )}

                {familyPharmacist.notes && (
                  <div className="mt-4 p-3 bg-white/10 rounded-lg">
                    <p className="text-sm">{familyPharmacist.notes}</p>
                  </div>
                )}
                <button
                  onClick={() => {
                    if (confirm("Remove your family pharmacist?")) {
                      fetch(`/api/family-pharmacist?id=${familyPharmacist.id}`, { method: "DELETE" })
                        .then(() => {
                          setFamilyPharmacist(null);
                          fetchFamilyPharmacist();
                        });
                    }
                  }}
                  className="mt-4 px-4 py-2 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30"
                >
                  Remove Assignment
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-6">
                <div className="text-4xl mb-4">👨‍⚕️</div>
                <h3 className="font-semibold text-gray-900 mb-2">Assign a Family Pharmacist</h3>
                <p className="text-gray-500 text-sm mb-4">Get personalized care from one pharmacy that knows your health history</p>
              </div>
            )}

            <h3 className="font-semibold text-gray-900 mb-4">Available Family Pharmacists (with Monthly Subscription)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pharmacies.map((pharmacy) => (
                <div key={pharmacy.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900">{pharmacy.pharmacyName}</h4>
                  <p className="text-sm text-gray-500">📍 {pharmacy.city}</p>
                  {familyPharmacist?.pharmacyId !== pharmacy.id && (
                    <div className="mt-3">
                      <p className="text-emerald-600 font-semibold">Monthly Fee: KES 500</p>
                      <button
                        onClick={async () => {
                          const res = await fetch("/api/family-pharmacist", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              patientId: user.id,
                              patientName: user.name,
                              pharmacyId: pharmacy.id,
                              pharmacyName: pharmacy.pharmacyName,
                              pharmacistName: "Pharmacist",
                              monthlyFee: 500,
                            }),
                          });
                          if (res.ok) {
                            alert("Family pharmacist assigned! Please complete payment to activate.");
                            fetchFamilyPharmacist();
                          }
                        }}
                        className="mt-2 w-full bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
                      >
                        Hire for KES 500/month
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Family Doctor Services Section */}
            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 mb-4">🏥 Family Doctor Services</h3>
              <p className="text-gray-500 text-sm mb-4">Pharmacies offering dedicated family doctor services with monthly packages</p>
              {familyDoctorServices.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <p className="text-gray-500">No family doctor services available yet. Check back later!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {familyDoctorServices.map((service) => (
                    <div key={service.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{service.pharmacyName}</h4>
                          <p className="text-sm text-gray-500">👨‍⚕️ {service.pharmacistName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-blue-600">KES {service.monthlyFee}</p>
                          <p className="text-xs text-gray-500">/month</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                      <div className="mt-3 p-2 bg-white/50 rounded-lg">
                        <p className="text-xs text-gray-600"><strong>Includes:</strong> {service.servicesIncluded}</p>
                      </div>
                      <button
                        onClick={async () => {
                          const res = await fetch("/api/family-pharmacist", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              patientId: user.id,
                              patientName: user.name,
                              pharmacyId: service.pharmacyId,
                              pharmacyName: service.pharmacyName,
                              pharmacistName: service.pharmacistName,
                              monthlyFee: service.monthlyFee,
                            }),
                          });
                          if (res.ok) {
                            alert("Family doctor service hired! Please complete payment to activate.");
                            fetchFamilyPharmacist();
                          }
                        }}
                        className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        Hire Family Doctor
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TELEPHARMACY TAB */}
        {activeTab === "telepharmacy" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Telepharmacy Consultation</h2>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">📹</div>
                <h3 className="font-semibold text-gray-900 text-lg">Video Consultation with a Pharmacist</h3>
                <p className="text-gray-500 mt-2">Get professional advice from the comfort of your home</p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-emerald-800 mb-3">How it works:</h4>
                <ol className="list-decimal list-inside text-sm text-emerald-700 space-y-2">
                  <li>Select a pharmacy for your consultation</li>
                  <li>Describe your symptoms or health concern</li>
                  <li>A pharmacist will review and contact you</li>
                  <li>Receive personalized advice and prescriptions if needed</li>
                </ol>
              </div>

              <button
                onClick={() => setShowTelepharmacyModal(true)}
                className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700"
              >
                Start Consultation
              </button>
            </div>

            {/* Past Consultations */}
            <h3 className="font-semibold text-gray-900 mb-4">Past Consultations</h3>
            {orders.filter(o => o.medicationName.includes("Consultation")).length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <p className="text-gray-500">No past consultations</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.filter(o => o.medicationName.includes("Consultation")).map((order) => (
                  <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{order.pharmacyName}</h4>
                        <p className="text-sm text-gray-500">Concern: {order.symptoms}</p>
                        <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "delivered" || order.status === "confirmed" ? "bg-green-100 text-green-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.status === "delivered" || order.status === "confirmed" ? "Completed" : "In Progress"}
                      </span>
                    </div>
                    {order.pharmacyNotes && (
                      <div className="mt-3 p-3 bg-emerald-50 rounded-lg">
                        <p className="text-sm"><span className="font-medium text-emerald-700">Pharmacist Response:</span></p>
                        <p className="text-sm text-gray-700">{order.pharmacyNotes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">My Profile</h2>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">👤</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                  <p className="text-gray-500">{user.email}</p>
                  <p className="text-gray-500">{user.phone}</p>
                </div>
              </div>

              <button
                onClick={() => setShowProfileModal(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
              >
                Edit Profile
              </button>
            </div>

            {/* Profile Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Additional Information</h3>
              
              {profile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Age</p>
                    <p className="font-medium">{profile.age || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Gender</p>
                    <p className="font-medium">{profile.gender || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium">{profile.address || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">City</p>
                    <p className="font-medium">{profile.city || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Occupation</p>
                    <p className="font-medium">{profile.occupation || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Education Level</p>
                    <p className="font-medium">{profile.educationLevel || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Emergency Contact</p>
                    <p className="font-medium">{profile.emergencyContactName || "Not set"} - {profile.emergencyContactPhone || ""}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Allergies</p>
                    <p className="font-medium">{profile.allergies || "None recorded"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No additional profile information. Click &quot;Edit Profile&quot; to add details.</p>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ORDER MODAL */}
      {showOrderModal && selectedPharmacy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Medication</h3>
            <p className="text-sm text-gray-500 mb-4">Pharmacy: {selectedPharmacy.pharmacyName}</p>
            <form onSubmit={handleSubmitOrder}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Describe your symptoms or reason</label>
                  <textarea
                    value={orderForm.symptoms}
                    onChange={(e) => setOrderForm({ ...orderForm, symptoms: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                  <input
                    type="text"
                    value={orderForm.deliveryAddress}
                    onChange={(e) => setOrderForm({ ...orderForm, deliveryAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowOrderModal(false); setSelectedPharmacy(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBSCRIPTION MODAL */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Subscription</h3>
            <form onSubmit={handleSubmitSubscription}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Pharmacy</label>
                  <select
                    value={subscriptionForm.pharmacyId}
                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, pharmacyId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a pharmacy...</option>
                    {pharmacies.map((p) => (
                      <option key={p.id} value={p.id}>{p.pharmacyName} - {p.city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Amount (KES)</label>
                  <input
                    type="number"
                    value={subscriptionForm.monthlyAmount}
                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, monthlyAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="5000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                  <input
                    type="text"
                    value={subscriptionForm.deliveryAddress}
                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, deliveryAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowSubscriptionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRESCRIPTION MODAL */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Prescription</h3>
            <form onSubmit={handleUploadPrescription}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
                  <input
                    type="text"
                    value={prescriptionForm.medicationName}
                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medicationName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                    <input
                      type="text"
                      value={prescriptionForm.dosage}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="e.g. 500mg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={prescriptionForm.quantity}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prescriber Name</label>
                  <input
                    type="text"
                    value={prescriptionForm.prescriberName}
                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, prescriberName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prescriber License Number</label>
                  <input
                    type="text"
                    value={prescriptionForm.prescriberLicense}
                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, prescriberLicense: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                  <textarea
                    value={prescriptionForm.instructions}
                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Prescription Document (optional)</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DOC up to 10MB</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowPrescriptionModal(false); setSelectedFile(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingPrescription}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  {uploadingPrescription ? "Uploading..." : "Upload Prescription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h3>
            <form onSubmit={handleSaveProfile}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={profileForm.age}
                      onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={profileForm.gender}
                      onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    value={profileForm.occupation}
                    onChange={(e) => setProfileForm({ ...profileForm, occupation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Farmer, Teacher, Business"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                  <select
                    value={profileForm.educationLevel}
                    onChange={(e) => setProfileForm({ ...profileForm, educationLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select...</option>
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="certificate">Certificate</option>
                    <option value="diploma">Diploma</option>
                    <option value="bachelors">Bachelor&apos;s Degree</option>
                    <option value="masters">Master&apos;s Degree</option>
                    <option value="phd">PhD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={profileForm.emergencyContactName}
                    onChange={(e) => setProfileForm({ ...profileForm, emergencyContactName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                  <input
                    type="text"
                    value={profileForm.emergencyContactPhone}
                    onChange={(e) => setProfileForm({ ...profileForm, emergencyContactPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                  <textarea
                    value={profileForm.allergies}
                    onChange={(e) => setProfileForm({ ...profileForm, allergies: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    rows={2}
                    placeholder="List any known allergies"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TELEPHARMACY MODAL */}
      {showTelepharmacyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Start Telepharmacy Consultation</h3>
            <form onSubmit={handleStartTelepharmacy}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Pharmacy</label>
                  <select
                    value={telepharmacyForm.pharmacyId}
                    onChange={(e) => setTelepharmacyForm({ ...telepharmacyForm, pharmacyId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a pharmacy...</option>
                    {pharmacies.map((p) => (
                      <option key={p.id} value={p.id}>{p.pharmacyName} - {p.city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Describe your health concern</label>
                  <textarea
                    value={telepharmacyForm.reason}
                    onChange={(e) => setTelepharmacyForm({ ...telepharmacyForm, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows={4}
                    placeholder="Describe your symptoms or what you'd like to consult about..."
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowTelepharmacyModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Start Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
