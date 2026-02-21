"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PharmacyRow {
  id: string;
  pharmacyName: string;
  pharmacistName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  country: string;
  city: string;
  address: string;
  status: "pending" | "verified" | "rejected";
  createdAt: string;
}

type FilterStatus = "all" | "pending" | "verified" | "rejected";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [pharmacies, setPharmacies] = useState<PharmacyRow[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("pending");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [adminName, setAdminName] = useState("Admin");

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

    fetchPharmacies();
  }, [router]);

  async function fetchPharmacies() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pharmacies", {
        headers: { "x-admin-session": "pharmalink-admin" },
      });
      const data = (await res.json()) as { pharmacies?: PharmacyRow[]; error?: string };
      if (res.ok && data.pharmacies) {
        setPharmacies(data.pharmacies);
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
        headers: {
          "Content-Type": "application/json",
          "x-admin-session": "pharmalink-admin",
        },
        body: JSON.stringify({ status }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (res.ok) {
        setMessage({ type: "success", text: data.message ?? "Status updated." });
        // Update local state
        setPharmacies((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status } : p))
        );
      } else {
        setMessage({ type: "error", text: data.error ?? "Failed to update status." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setActionLoading(null);
    }
  }

  function handleSignOut() {
    localStorage.removeItem("pharmalink_admin");
    router.push("/admin/login");
  }

  const filtered = pharmacies.filter((p) => filter === "all" || p.status === filter);
  const counts = {
    all: pharmacies.length,
    pending: pharmacies.filter((p) => p.status === "pending").length,
    verified: pharmacies.filter((p) => p.status === "verified").length,
    rejected: pharmacies.filter((p) => p.status === "rejected").length,
  };

  const statusBadge = (status: PharmacyRow["status"]) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      verified: "bg-emerald-100 text-emerald-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
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
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pharmacy Registrations</h1>
          <p className="text-gray-500 text-sm mt-1">
            Review and approve or reject pharmacy registration requests.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {(["all", "pending", "verified", "rejected"] as FilterStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`p-4 rounded-xl border text-left transition-all ${
                filter === s
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="text-2xl font-bold text-gray-900">{counts[s]}</div>
              <div className="text-sm text-gray-500 capitalize">{s}</div>
            </button>
          ))}
        </div>

        {/* Flash message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading pharmacies…</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No {filter === "all" ? "" : filter} pharmacies found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Pharmacy</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Pharmacist</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">License #</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Location</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Contact</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Registered</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{p.pharmacyName}</td>
                      <td className="px-4 py-3 text-gray-600">{p.pharmacistName}</td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">{p.licenseNumber}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {p.city},{" "}
                        <span className="capitalize">{p.country}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <div>{p.email}</div>
                        <div className="text-xs text-gray-400">{p.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(p.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">{statusBadge(p.status)}</td>
                      <td className="px-4 py-3">
                        {p.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusChange(p.id, "verified")}
                              disabled={actionLoading === p.id}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              {actionLoading === p.id ? "…" : "Approve"}
                            </button>
                            <button
                              onClick={() => handleStatusChange(p.id, "rejected")}
                              disabled={actionLoading === p.id}
                              className="px-3 py-1 bg-red-100 hover:bg-red-200 disabled:bg-red-50 text-red-700 text-xs font-medium rounded-lg transition-colors"
                            >
                              {actionLoading === p.id ? "…" : "Reject"}
                            </button>
                          </div>
                        ) : p.status === "verified" ? (
                          <button
                            onClick={() => handleStatusChange(p.id, "rejected")}
                            disabled={actionLoading === p.id}
                            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-lg transition-colors"
                          >
                            Revoke
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(p.id, "verified")}
                            disabled={actionLoading === p.id}
                            className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-medium rounded-lg transition-colors"
                          >
                            Re-approve
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

        <div className="mt-4 text-xs text-gray-400 text-right">
          <button onClick={fetchPharmacies} className="hover:text-gray-600 transition-colors">
            ↻ Refresh list
          </button>
        </div>
      </main>
    </div>
  );
}
