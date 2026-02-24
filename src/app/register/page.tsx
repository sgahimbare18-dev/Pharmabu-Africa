"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "kenya" as "kenya" | "burundi",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError(t.patientRegister.passwordsDoNotMatch);
      return;
    }
    if (form.password.length < 8) {
      setError(t.patientRegister.passwordTooShort);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          country: form.country,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t.patientRegister.registrationFailed);
      } else {
        setSuccess(t.patientRegister.accountCreated);
        setTimeout(() => router.push("/signin"), 2000);
      }
    } catch {
      setError(t.patientRegister.networkError);
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
          <h1 className="text-2xl font-bold text-white mt-6 mb-1">{t.patientRegister.title}</h1>
          <p className="text-emerald-300/70 text-sm">
            {t.patientRegister.alreadyHaveAccount}{" "}
            <Link href="/signin" className="text-emerald-400 hover:text-emerald-300 font-medium">
              {t.patientRegister.signIn}
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-1.5">
                {t.patientRegister.fullNameLabel}
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t.patientRegister.fullNamePlaceholder}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-emerald-300/40 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-1.5">
                {t.patientRegister.emailLabel}
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t.patientRegister.emailPlaceholder}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-emerald-300/40 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-1.5">
                {t.patientRegister.phoneLabel}
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder={t.patientRegister.phonePlaceholder}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-emerald-300/40 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-1.5">
                {t.patientRegister.countryLabel}
              </label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                className="w-full bg-emerald-900 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
              >
                <option value="kenya">🇰🇪 {t.patientRegister.kenya}</option>
                <option value="burundi">🇧🇮 {t.patientRegister.burundi}</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-1.5">
                {t.patientRegister.passwordLabel}
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={t.patientRegister.passwordPlaceholder}
                required
                minLength={8}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-emerald-300/40 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-1.5">
                {t.patientRegister.confirmPasswordLabel}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder={t.patientRegister.confirmPasswordPlaceholder}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-emerald-300/40 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
              />
            </div>

            {/* Error / Success */}
            {error && (
              <div className="bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 text-red-300 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-xl px-4 py-3 text-emerald-300 text-sm">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-700 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/50"
            >
              {loading ? t.patientRegister.creatingAccount : t.patientRegister.createAccountButton}
            </button>
          </form>

          {/* Pharmacy link */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-emerald-300/60 text-sm">
              {t.patientRegister.areYouPharmacist}{" "}
              <Link
                href="/register/pharmacy"
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                {t.patientRegister.registerPharmacyLink}
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
