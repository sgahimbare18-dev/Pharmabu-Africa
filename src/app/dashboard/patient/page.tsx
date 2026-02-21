"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: "patient";
  country: string;
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

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    } else if (user.role !== "patient") {
      router.push("/dashboard/pharmacy");
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-2xl font-bold mb-1">Hello, {user.name}! 👋</h1>
          <p className="text-emerald-100/80">
            Your PharmaLink Africa patient dashboard. Manage your prescriptions, find pharmacies, and
            connect with pharmacists.
          </p>
        </div>

        {/* Coming soon cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: "📋",
              title: "My Prescriptions",
              description: "Upload and manage your prescriptions securely.",
              badge: "Coming Soon",
            },
            {
              icon: "🏥",
              title: "Find a Pharmacy",
              description: "Search verified pharmacies near you.",
              badge: "Coming Soon",
            },
            {
              icon: "💬",
              title: "Telepharmacy Chat",
              description: "Chat with your assigned pharmacist.",
              badge: "Coming Soon",
            },
            {
              icon: "🚚",
              title: "My Orders",
              description: "Track your medicine deliveries in real time.",
              badge: "Coming Soon",
            },
            {
              icon: "👨‍👩‍👧",
              title: "Family Pharmacist",
              description: "Subscribe to a dedicated pharmacist for your family.",
              badge: "Coming Soon",
            },
            {
              icon: "💳",
              title: "Payments",
              description: "M-Pesa and mobile money payment history.",
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
              <span className="text-gray-500">Country</span>
              <p className="font-medium text-gray-900 mt-0.5 capitalize">{user.country}</p>
            </div>
            <div>
              <span className="text-gray-500">Account Type</span>
              <p className="font-medium text-emerald-600 mt-0.5 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
