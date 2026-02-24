"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function RegisterPharmacyPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [form, setForm] = useState({
    // Basic info
    pharmacyName: "",
    pharmacistName: "",
    email: "",
    phone: "",
    // Pharmacist credentials
    licenseNumber: "",
    pharmacistQualification: "",
    pharmacistUniversity: "",
    pharmacistGraduationYear: "",
    // Pharmacy registration
    pharmacyRegNumber: "",
    pharmacyRegAuthority: "",
    pharmacyRegExpiry: "",
    // Location
    country: "kenya" as "kenya" | "burundi",
    city: "",
    address: "",
    // Operations
    operatingHours: "",
    servicesOffered: "",
    // Auth
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { url: string; filename: string }>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, fieldName: string) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading((prev) => ({ ...prev, [fieldName]: true }));
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.pharmacyRegister.uploadError);
        return;
      }

      setUploadedFiles((prev) => ({
        ...prev,
        [fieldName]: { url: data.url, filename: data.filename },
      }));
    } catch {
      setError(t.pharmacyRegister.uploadError);
    } finally {
      setUploading((prev) => ({ ...prev, [fieldName]: false }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError(t.pharmacyRegister.passwordsDoNotMatch);
      return;
    }
    if (form.password.length < 8) {
      setError(t.pharmacyRegister.passwordTooShort);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register-pharmacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pharmacyName: form.pharmacyName,
          pharmacistName: form.pharmacistName,
          email: form.email,
          phone: form.phone,
          licenseNumber: form.licenseNumber,
          pharmacistQualification: form.pharmacistQualification,
          pharmacistUniversity: form.pharmacistUniversity,
          pharmacistGraduationYear: form.pharmacistGraduationYear,
          pharmacyRegNumber: form.pharmacyRegNumber,
          pharmacyRegAuthority: form.pharmacyRegAuthority,
          pharmacyRegExpiry: form.pharmacyRegExpiry,
          country: form.country,
          city: form.city,
          address: form.address,
          operatingHours: form.operatingHours,
          servicesOffered: form.servicesOffered,
          password: form.password,
          // File upload URLs
          licenseDocument: uploadedFiles.licenseDocument?.url || "",
          qualificationDocument: uploadedFiles.qualificationDocument?.url || "",
          pharmacyRegDocument: uploadedFiles.pharmacyRegDocument?.url || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t.pharmacyRegister.registrationFailed);
      } else {
        setSuccess(data.message || t.pharmacyRegister.registrationSuccess);
        setTimeout(() => router.push("/signin"), 5000);
      }
    } catch {
      setError(t.pharmacyRegister.networkError);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-emerald-300/40 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition";
  const labelClass = "block text-emerald-200 text-sm font-medium mb-1.5";
  const sectionHeadingClass =
    "text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4 mt-2 flex items-center gap-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
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
          <h1 className="text-2xl font-bold text-white mt-6 mb-1">{t.pharmacyRegister.title}</h1>
          <p className="text-emerald-300/70 text-sm">
            {t.pharmacyRegister.alreadyRegistered}{" "}
            <Link href="/signin" className="text-emerald-400 hover:text-emerald-300 font-medium">
              {t.pharmacyRegister.signIn}
            </Link>
          </p>
        </div>

        {/* Verification notice */}
        <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl px-4 py-3 mb-6 flex gap-3">
          <span className="text-amber-400 text-lg flex-shrink-0">⚠️</span>
          <p className="text-amber-200/80 text-sm leading-relaxed">
            {t.pharmacyRegister.verificationNotice}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── Section 1: Basic Information ── */}
            <div className={sectionHeadingClass}>
              <span className="w-5 h-5 bg-emerald-500/30 rounded-full flex items-center justify-center text-emerald-300 text-xs">1</span>
              {t.pharmacyRegister.basicInfo}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>{t.pharmacyRegister.pharmacyName} *</label>
                <input
                  type="text"
                  name="pharmacyName"
                  value={form.pharmacyName}
                  onChange={handleChange}
                  placeholder={t.pharmacyRegister.pharmacyNamePlaceholder}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t.pharmacyRegister.leadPharmacistName} *</label>
                <input
                  type="text"
                  name="pharmacistName"
                  value={form.pharmacistName}
                  onChange={handleChange}
                  placeholder={t.pharmacyRegister.leadPharmacistNamePlaceholder}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>{t.pharmacyRegister.emailAddress} *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t.pharmacyRegister.emailAddressPlaceholder}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t.pharmacyRegister.phoneNumber} *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={t.pharmacyRegister.phoneNumberPlaceholder}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* ── Section 2: Pharmacist Credentials ── */}
            <div className={sectionHeadingClass}>
              <span className="w-5 h-5 bg-emerald-500/30 rounded-full flex items-center justify-center text-emerald-300 text-xs">2</span>
              {t.pharmacyRegister.pharmacistCredentials}
            </div>

            <div>
              <label className={labelClass}>{t.pharmacyRegister.licenseNumber} *</label>
              <input
                type="text"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                placeholder={t.pharmacyRegister.licenseNumberPlaceholder}
                required
                className={inputClass}
              />
              <p className="text-emerald-300/50 text-xs mt-1">
                {t.pharmacyRegister.licenseNumberHelp}
              </p>
            </div>

            <div>
              <label className={labelClass}>{t.pharmacyRegister.qualification} *</label>
              <input
                type="text"
                name="pharmacistQualification"
                value={form.pharmacistQualification}
                onChange={handleChange}
                placeholder={t.pharmacyRegister.qualificationPlaceholder}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>{t.pharmacyRegister.uploadLicense} *</label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-emerald-400/50 transition">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, "licenseDocument")}
                  className="hidden"
                  id="licenseDocument"
                  required
                />
                <label htmlFor="licenseDocument" className="cursor-pointer">
                  {uploading.licenseDocument ? (
                    <span className="text-emerald-300">{t.pharmacyRegister.uploading}</span>
                  ) : uploadedFiles.licenseDocument ? (
                    <span className="text-emerald-400">✅ {uploadedFiles.licenseDocument.filename}</span>
                  ) : (
                    <span className="text-emerald-300/70">
                      {t.pharmacyRegister.uploadPrompt}
                    </span>
                  )}
                </label>
              </div>
              <p className="text-emerald-300/50 text-xs mt-1">{t.pharmacyRegister.uploadLicenseHelp}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>{t.pharmacyRegister.university} *</label>
                <input
                  type="text"
                  name="pharmacistUniversity"
                  value={form.pharmacistUniversity}
                  onChange={handleChange}
                  placeholder={t.pharmacyRegister.universityPlaceholder}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t.pharmacyRegister.graduationYear} *</label>
                <input
                  type="text"
                  name="pharmacistGraduationYear"
                  value={form.pharmacistGraduationYear}
                  onChange={handleChange}
                  placeholder={t.pharmacyRegister.graduationYearPlaceholder}
                  required
                  pattern="\d{4}"
                  maxLength={4}
                  className={inputClass}
                />
              </div>
            </div>

            {/* ── Section 3: Pharmacy Registration ── */}
            <div className={sectionHeadingClass}>
              <span className="w-5 h-5 bg-emerald-500/30 rounded-full flex items-center justify-center text-emerald-300 text-xs">3</span>
              {t.pharmacyRegister.pharmacyRegistration}
            </div>

            <div>
              <label className={labelClass}>{t.pharmacyRegister.pharmacyRegNumber} *</label>
              <input
                type="text"
                name="pharmacyRegNumber"
                value={form.pharmacyRegNumber}
                onChange={handleChange}
                placeholder={t.pharmacyRegister.pharmacyRegNumberPlaceholder}
                required
                className={inputClass}
              />
              <p className="text-emerald-300/50 text-xs mt-1">
                {t.pharmacyRegister.pharmacyRegNumberHelp}
              </p>
            </div>

            <div>
              <label className={labelClass}>{t.pharmacyRegister.uploadQualification} *</label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-emerald-400/50 transition">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, "qualificationDocument")}
                  className="hidden"
                  id="qualificationDocument"
                  required
                />
                <label htmlFor="qualificationDocument" className="cursor-pointer">
                  {uploading.qualificationDocument ? (
                    <span className="text-emerald-300">{t.pharmacyRegister.uploading}</span>
                  ) : uploadedFiles.qualificationDocument ? (
                    <span className="text-emerald-400">✅ {uploadedFiles.qualificationDocument.filename}</span>
                  ) : (
                    <span className="text-emerald-300/70">
                      📎 Click to upload qualification certificate (PDF, JPG, PNG, DOC)
                    </span>
                  )}
                </label>
              </div>
              <p className="text-emerald-300/50 text-xs mt-1">{t.pharmacyRegister.uploadQualificationHelp}</p>
            </div>

            <div>
              <label className={labelClass}>{t.pharmacyRegister.uploadPharmacyReg} *</label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-emerald-400/50 transition">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, "pharmacyRegDocument")}
                  className="hidden"
                  id="pharmacyRegDocument"
                  required
                />
                <label htmlFor="pharmacyRegDocument" className="cursor-pointer">
                  {uploading.pharmacyRegDocument ? (
                    <span className="text-emerald-300">{t.pharmacyRegister.uploading}</span>
                  ) : uploadedFiles.pharmacyRegDocument ? (
                    <span className="text-emerald-400">✅ {uploadedFiles.pharmacyRegDocument.filename}</span>
                  ) : (
                    <span className="text-emerald-300/70">
                      📎 Click to upload pharmacy registration certificate (PDF, JPG, PNG, DOC)
                    </span>
                  )}
                </label>
              </div>
              <p className="text-emerald-300/50 text-xs mt-1">{t.pharmacyRegister.uploadPharmacyRegHelp}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>{t.pharmacyRegister.regulatoryAuthority} *</label>
                <input
                  type="text"
                  name="pharmacyRegAuthority"
                  value={form.pharmacyRegAuthority}
                  onChange={handleChange}
                  placeholder={t.pharmacyRegister.regulatoryAuthorityPlaceholder}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t.pharmacyRegister.expiryDate} *</label>
                <input
                  type="date"
                  name="pharmacyRegExpiry"
                  value={form.pharmacyRegExpiry}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* ── Section 4: Location ── */}
            <div className={sectionHeadingClass}>
              <span className="w-5 h-5 bg-emerald-500/30 rounded-full flex items-center justify-center text-emerald-300 text-xs">4</span>
              {t.pharmacyRegister.location}
            </div>

            <div>
              <label className={labelClass}>{t.pharmacyRegister.country} *</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                className="w-full bg-emerald-900 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
              >
                <option value="kenya">🇰🇪 Kenya</option>
                <option value="burundi">🇧🇮 Burundi</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>{t.pharmacyRegister.city} *</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder={t.pharmacyRegister.cityPlaceholder}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t.pharmacyRegister.address} *</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder={t.pharmacyRegister.addressPlaceholder}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* ── Section 5: Operations ── */}
            <div className={sectionHeadingClass}>
              <span className="w-5 h-5 bg-emerald-500/30 rounded-full flex items-center justify-center text-emerald-300 text-xs">5</span>
              {t.pharmacyRegister.operations}
            </div>

            <div>
              <label className={labelClass}>{t.pharmacyRegister.operatingHours}</label>
              <input
                type="text"
                name="operatingHours"
                value={form.operatingHours}
                onChange={handleChange}
                placeholder={t.pharmacyRegister.operatingHoursPlaceholder}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>{t.pharmacyRegister.servicesOffered}</label>
              <input
                type="text"
                name="servicesOffered"
                value={form.servicesOffered}
                onChange={handleChange}
                placeholder={t.pharmacyRegister.servicesOfferedPlaceholder}
                className={inputClass}
              />
            </div>

            {/* ── Section 6: Account Security ── */}
            <div className={sectionHeadingClass}>
              <span className="w-5 h-5 bg-emerald-500/30 rounded-full flex items-center justify-center text-emerald-300 text-xs">6</span>
              Account Security
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>{t.pharmacyRegister.password} *</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={t.pharmacyRegister.passwordPlaceholder}
                  required
                  minLength={8}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t.pharmacyRegister.confirmPassword} *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder={t.pharmacyRegister.confirmPasswordPlaceholder}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Error / Success */}
            {error && (
              <div className="bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 text-red-300 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-xl px-4 py-3 text-emerald-300 text-sm">
                ✅ {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-700 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/50"
            >
              {loading ? t.pharmacyRegister.registering : t.pharmacyRegister.registerButton}
            </button>
          </form>

          {/* Patient link */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-emerald-300/60 text-sm">
              {t.patientRegister.areYouPharmacist}{" "}
              <Link
                href="/register"
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
