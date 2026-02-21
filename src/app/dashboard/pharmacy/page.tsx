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

export default function PharmacyDashboard() {
  const router = useRouter();
  const [user] = useState<PharmacySession | null>(getStoredUser);

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    } else if (user.role !== "pharmacy") {
      router.push("/dashboard/patient");
    }
  }, [user, router]);

  function handleSignOut() {
    localStorage.removeItem("pharmalink_user");
    router.push("/");
  }

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

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {/* Coming soon cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: "📋",
              title: "Prescription Queue",
              description: "Review and approve incoming prescription orders.",
              badge: "Coming Soon",
            },
            {
              icon: "💊",
              title: "Inventory Management",
              description: "Manage drug stock, availability, and controlled substances.",
              badge: "Coming Soon",
            },
            {
              icon: "💬",
              title: "Patient Chat",
              description: "Communicate with patients for counseling and queries.",
              badge: "Coming Soon",
            },
            {
              icon: "🚚",
              title: "Delivery Management",
              description: "Assign and track medicine deliveries.",
              badge: "Coming Soon",
            },
            {
              icon: "👨‍👩‍👧",
              title: "Family Pharmacist",
              description: "Manage your subscribed family patients.",
              badge: "Coming Soon",
            },
            {
              icon: "📊",
              title: "Analytics & Reports",
              description: "View dispensing records, audit logs, and revenue.",
              badge: "Coming Soon",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">{card.title}</h3>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex-shrink-0">
                  {card.badge}
                </span>
              </div>
              <p className="text-gray-500 text-sm">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Account info */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Pharmacy Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Pharmacy Name</span>
              <p className="font-medium text-gray-900 mt-0.5">{user.pharmacyName}</p>
            </div>
            <div>
              <span className="text-gray-500">Lead Pharmacist</span>
              <p className="font-medium text-gray-900 mt-0.5">{user.name}</p>
            </div>
            <div>
              <span className="text-gray-500">Email</span>
              <p className="font-medium text-gray-900 mt-0.5">{user.email}</p>
            </div>
            <div>
              <span className="text-gray-500">Country</span>
              <p className="font-medium text-gray-900 mt-0.5 capitalize">{user.country}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
