"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPharmacyPage() {
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
        setError(data.error || "Failed to upload file");
        return;
      }

      setUploadedFiles((prev) => ({
        ...prev,
        [fieldName]: { url: data.url, filename: data.filename },
      }));
    } catch {
      setError("Failed to upload file. Please try again.");
    } finally {
      setUploading((prev) => ({ ...prev, [fieldName]: false }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
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
        setError(data.error || "Registration failed.");
      } else {
        setSuccess(data.message);
        setTimeout(() => router.push("/signin"), 5000);
      }
    } catch {
      setError("Network error. Please try again.");
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
              <span className="text-white font-bold">PL</span>
            </div>
            <span className="font-bold text-white text-xl">
              PharmaLink <span className="text-emerald-400">Africa</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-1">Register Your Pharmacy</h1>
          <p className="text-emerald-300/70 text-sm">
            Already registered?{" "}
            <Link href="/signin" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Verification notice */}
        <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl px-4 py-3 mb-6 flex gap-3">
          <span className="text-amber-400 text-lg flex-shrink-0">⚠️</span>
          <p className="text-amber-200/80 text-sm leading-relaxed">
            Your pharmacy will be manually verified by our team before activation. Please ensure all
            details match your official registration documents. Our admin will review your credentials
            and registration certificates.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── Section 1: Basic Information ── */}
            <div className={sectionHeadingClass}>
              <span className="w-5 h-5 bg-emerald-500/30 rounded-full flex items-center justify-center text-emerald-300 text-xs">1</span>
              Basic Information
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Pharmacy Name *</label>
                <input
                  type="text"
                  name="pharmacyName"
                  value={form.pharmacyName}
                  onChange={handleChange}
                  placeholder="MedPlus Pharmacy"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Lead Pharmacist Full Name *</label>
                <input
                  type="text"
                  name="pharmacistName"
                  value={form.pharmacistName}
                  onChange={handleChange}
                  placeholder="Dr. John Mwangi"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="pharmacy@example.com"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+254 700 000 000"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* ── Section 2: Pharmacist Credentials ── */}
            <div className={sectionHeadingClass}>
              <span className="w-5 h-5 bg-emerald-500/30 rounded-full flex items-center justify-center text-emerald-300 text-xs">2</span>
              Pharmacist Professional Credentials
            </div>

            <div>
              <label className={labelClass}>Pharmacist License / Registration Number *</label>
              <input
                type="text"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                placeholder="PPB/2024/XXXXX (Kenya) or ARCOS/XXXX (Burundi)"
                required
                className={inputClass}
              />
              <p className="text-emerald-300/50 text-xs mt-1">
                Your official license number issued by the Pharmacy & Poisons Board (Kenya) or ARCOS (Burundi).
              </p>
            </div>

            <div>
              <label className={labelClass}>Highest Pharmacist Qualification *</label>
              <input
                type="text"
                name="pharmacistQualification"
                value={form.pharmacistQualification}
                onChange={handleChange}
                placeholder="e.g. Bachelor of Pharmacy (B.Pharm), Doctor of Pharmacy (Pharm.D)"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Upload Pharmacist License Document *</label>
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
                    <span className="text-emerald-300">Uploading...</span>
                  ) : uploadedFiles.licenseDocument ? (
                    <span className="text-emerald-400">✅ {uploadedFiles.licenseDocument.filename}</span>
                  ) : (
                    <span className="text-emerald-300/70">
                      📎 Click to upload license document (PDF, JPG, PNG, DOC)
                    </span>
                  )}
                </label>
              </div>
              <p className="text-emerald-300/50 text-xs mt-1">Upload a clear copy of your pharmacist license/registration certificate.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>University / Institution *</label>
                <input
                  type="text"
                  name="pharmacistUniversity"
                  value={form.pharmacistUniversity}
                  onChange={handleChange}
                  placeholder="University of Nairobi"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Year of Graduation *</label>
                <input
                  type="text"
                  name="pharmacistGraduationYear"
                  value={form.pharmacistGraduationYear}
                  onChange={handleChange}
                  placeholder="e.g. 2018"
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
              Pharmacy Business Registration
            </div>

            <div>
              <label className={labelClass}>Pharmacy Registration Number *</label>
              <input
                type="text"
                name="pharmacyRegNumber"
                value={form.pharmacyRegNumber}
                onChange={handleChange}
                placeholder="e.g. PPB/PHARM/2024/XXXXX"
                required
                className={inputClass}
              />
              <p className="text-emerald-300/50 text-xs mt-1">
                The official registration number of your pharmacy premises as issued by the regulatory authority.
              </p>
            </div>

            <div>
              <label className={labelClass}>Upload Qualification Certificate *</label>
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
                    <span className="text-emerald-300">Uploading...</span>
                  ) : uploadedFiles.qualificationDocument ? (
                    <span className="text-emerald-400">✅ {uploadedFiles.qualificationDocument.filename}</span>
                  ) : (
                    <span className="text-emerald-300/70">
                      📎 Click to upload qualification certificate (PDF, JPG, PNG, DOC)
                    </span>
                  )}
                </label>
              </div>
              <p className="text-emerald-300/50 text-xs mt-1">Upload your highest pharmacy qualification certificate (degree, diploma).</p>
            </div>

            <div>
              <label className={labelClass}>Upload Pharmacy Registration Certificate *</label>
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
                    <span className="text-emerald-300">Uploading...</span>
                  ) : uploadedFiles.pharmacyRegDocument ? (
                    <span className="text-emerald-400">✅ {uploadedFiles.pharmacyRegDocument.filename}</span>
                  ) : (
                    <span className="text-emerald-300/70">
                      📎 Click to upload pharmacy registration certificate (PDF, JPG, PNG, DOC)
                    </span>
                  )}
                </label>
              </div>
              <p className="text-emerald-300/50 text-xs mt-1">Upload the pharmacy premises registration/operating license certificate.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Issuing Regulatory Authority *</label>
                <input
                  type="text"
                  name="pharmacyRegAuthority"
                  value={form.pharmacyRegAuthority}
                  onChange={handleChange}
                  placeholder="Kenya Pharmacy & Poisons Board"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Registration Expiry Date *</label>
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
              Location
            </div>

            <div>
              <label className={labelClass}>Country *</label>
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
                <label className={labelClass}>City *</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Nairobi"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Physical Address *</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="123 Kenyatta Avenue, Westlands"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* ── Section 5: Operations ── */}
            <div className={sectionHeadingClass}>
              <span className="w-5 h-5 bg-emerald-500/30 rounded-full flex items-center justify-center text-emerald-300 text-xs">5</span>
              Operations (Optional)
            </div>

            <div>
              <label className={labelClass}>Operating Hours</label>
              <input
                type="text"
                name="operatingHours"
                value={form.operatingHours}
                onChange={handleChange}
                placeholder="Mon–Fri 8am–8pm, Sat 9am–5pm, Sun Closed"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Services Offered</label>
              <input
                type="text"
                name="servicesOffered"
                value={form.servicesOffered}
                onChange={handleChange}
                placeholder="Dispensing, Telepharmacy, Home Delivery, Prescription Counseling"
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
                <label className={labelClass}>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
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
              {loading ? "Submitting registration…" : "Submit Pharmacy Registration"}
            </button>
          </form>

          {/* Patient link */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-emerald-300/60 text-sm">
              Looking for medicines as a patient?{" "}
              <Link
                href="/register"
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Create a patient account →
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
