"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function SignInPage() {
  const { t } = useLanguage();
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
        setError(data.error || t.signIn.signInFailed);
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
      setError(t.signIn.networkError);
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
              <span className="text-white font-bold">PA</span>
            </div>
            <span className="font-bold text-white text-xl">
              PharmaBu <span className="text-emerald-400">Africa</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-1">{t.signIn.title}</h1>
          <p className="text-emerald-300/70 text-sm">
            {t.signIn.dontHaveAccount}{" "}
            <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
              {t.signIn.createOne}
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-1.5">
                {t.signIn.emailLabel}
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t.signIn.emailPlaceholder}
                required
                autoComplete="email"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-emerald-300/40 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-1.5">
                {t.signIn.passwordLabel}
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={t.signIn.passwordPlaceholder}
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
              {loading ? t.signIn.signingIn : t.signIn.signInButton}
            </button>
          </form>

          {/* Register links */}
          <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-center">
            <p className="text-emerald-300/60 text-sm">
              {t.signIn.newPatient}{" "}
              <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
                {t.signIn.createPatientAccount}
              </Link>
            </p>
            <p className="text-emerald-300/60 text-sm">
              {t.signIn.pharmacyOwner}{" "}
              <Link
                href="/register/pharmacy"
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                {t.signIn.registerPharmacy}
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-emerald-400/60 hover:text-emerald-400 text-sm transition-colors">
            ← {t.signIn.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
