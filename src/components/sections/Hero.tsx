export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 flex items-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-300 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-800/50 border border-emerald-600/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-300 text-sm font-medium">
                Regulated · Compliant · Secure
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Africa&apos;s Trusted{" "}
              <span className="text-emerald-400">Digital Pharmacy</span>{" "}
              Platform
            </h1>

            <p className="text-emerald-100/80 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl">
              Connecting patients with verified pharmacies across Kenya and
              Burundi. Secure prescription management, telepharmacy
              consultations, and doorstep delivery — all legally compliant.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-10">
              {[
                { value: "100%", label: "Verified Pharmacists" },
                { value: "5–10yr", label: "Prescription Retention" },
                { value: "24/7", label: "Audit Trail" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-emerald-400">
                    {stat.value}
                  </div>
                  <div className="text-emerald-200/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/50 hover:shadow-emerald-500/30 hover:-translate-y-0.5">
                Find a Pharmacy
              </button>
              <button className="border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 hover:text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:bg-emerald-800/30">
                Register Your Pharmacy
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-emerald-300/60">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Pharmacy & Poisons Board (Kenya)
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Ministère de la Santé (Burundi)
              </div>
            </div>
          </div>

          {/* Right: Visual card */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Main card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Prescription Uploaded</div>
                    <div className="text-emerald-300/70 text-xs">Securely stored · Cannot be deleted</div>
                  </div>
                  <div className="ml-auto">
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded-full border border-emerald-500/30">
                      Pending Review
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Patient", value: "J. Kamau", icon: "👤" },
                    { label: "Drug", value: "Amoxicillin 500mg", icon: "💊" },
                    { label: "Pharmacy", value: "MedPlus Nairobi", icon: "🏥" },
                    { label: "Uploaded", value: "Feb 21, 2026 · 10:32 AM", icon: "🕐" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                      <span className="text-emerald-300/60 text-xs">{item.icon} {item.label}</span>
                      <span className="text-white text-xs font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-emerald-300/60">
                    <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Encrypted · Audit logged · Immutable record
                  </div>
                </div>
              </div>

              {/* Floating counseling card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl border border-gray-100 w-56">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <span className="text-gray-800 text-xs font-semibold">Counseling Required</span>
                </div>
                <p className="text-gray-500 text-xs">Pharmacist must complete counseling form before dispensing</p>
              </div>

              {/* Floating delivery card */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-xl border border-gray-100 w-52">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🚚</span>
                  <span className="text-gray-800 text-xs font-semibold">Out for Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full w-3/4" />
                  </div>
                  <span className="text-gray-500 text-xs">75%</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">OTP confirmation on delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 20C480 40 240 80 0 40L0 80Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
