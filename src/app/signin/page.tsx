"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign in failed.");
      } else {
        // Store user info in localStorage (simple session)
        localStorage.setItem("pharmalink_user", JSON.stringify(data.user));
        // Redirect based on role
        if (data.user.role === "pharmacy") {
          router.push("/dashboard/pharmacy");
        } else {
          router.push("/dashboard/patient");
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">PL</span>
            </div>
            <span className="font-bold text-white text-xl">
              PharmaLink <span className="text-emerald-400">Africa</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-1">Welcome back</h1>
          <p className="text-emerald-300/70 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Create one
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-emerald-300/40 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Your password"
                required
                autoComplete="current-password"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-emerald-300/40 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-700 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/50"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Register links */}
          <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-center">
            <p className="text-emerald-300/60 text-sm">
              New patient?{" "}
              <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
                Create a patient account
              </Link>
            </p>
            <p className="text-emerald-300/60 text-sm">
              Pharmacy owner?{" "}
              <Link
                href="/register/pharmacy"
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Register your pharmacy
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-emerald-400/60 hover:text-emerald-400 text-sm transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
