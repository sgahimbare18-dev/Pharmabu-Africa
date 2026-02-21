const benefits = [
  {
    icon: "📈",
    title: "Expand Your Reach",
    description: "Connect with patients across your city and beyond. Manage online orders alongside walk-in customers.",
  },
  {
    icon: "⚖️",
    title: "Stay Legally Protected",
    description: "Every dispensing action is documented. Counseling records and digital signatures protect you legally.",
  },
  {
    icon: "💰",
    title: "Family Pharmacist Revenue",
    description: "Earn recurring monthly income through the Family Pharmacist subscription model.",
  },
  {
    icon: "🔧",
    title: "Inventory Management",
    description: "Manage your drug inventory, set availability, flag controlled substances, and track stock levels.",
  },
  {
    icon: "📱",
    title: "Mobile-First Platform",
    description: "Manage your pharmacy from anywhere with our mobile app. Approve orders, chat with patients, track deliveries.",
  },
  {
    icon: "🤝",
    title: "Dedicated Support",
    description: "Our team helps you through the verification process and provides ongoing compliance guidance.",
  },
];

export default function ForPharmacies() {
  return (
    <section id="for-pharmacies" className="py-24 bg-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-800/50 border border-emerald-600/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-emerald-300 text-sm font-medium">For Pharmacies</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Grow Your Pharmacy Business{" "}
              <span className="text-emerald-400">Digitally</span>
            </h2>
            <p className="text-emerald-100/70 text-lg leading-relaxed mb-8">
              Join Africa&apos;s most trusted pharmacy network. Reach more patients, operate with full compliance, and build recurring revenue through telepharmacy services.
            </p>

            {/* Verification steps */}
            <div className="bg-emerald-900/50 border border-emerald-700/50 rounded-2xl p-6 mb-8">
              <h3 className="text-white font-semibold mb-4">Verification Requirements</h3>
              <div className="space-y-3">
                {[
                  "Valid pharmacist license number",
                  "National ID / Passport",
                  "Pharmacy registration certificate",
                  "Admin manual verification",
                  "Regulatory database cross-check",
                ].map((req) => (
                  <div key={req} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-emerald-200/80 text-sm">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/50">
              Register Your Pharmacy →
            </button>
          </div>

          {/* Right: Benefits grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-emerald-900/40 border border-emerald-700/30 rounded-xl p-5 hover:bg-emerald-900/60 transition-colors"
              >
                <span className="text-2xl mb-3 block">{benefit.icon}</span>
                <h3 className="text-white font-semibold text-sm mb-2">{benefit.title}</h3>
                <p className="text-emerald-300/60 text-xs leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Family Pharmacist highlight */}
        <div className="mt-16 bg-gradient-to-r from-emerald-800/50 to-teal-800/50 border border-emerald-600/30 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-3xl mb-3">👨‍👩‍👧</div>
              <h3 className="text-2xl font-bold text-white mb-3">Family Pharmacist Module</h3>
              <p className="text-emerald-200/70 leading-relaxed">
                Patients can subscribe to a dedicated pharmacist for monthly medication management. Earn recurring revenue while providing personalized care.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "⏰", label: "Medication Reminders" },
                { icon: "📊", label: "Chronic Disease Monitoring" },
                { icon: "💬", label: "Dedicated Chat" },
                { icon: "🔄", label: "Drug Review Service" },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 rounded-xl p-4 text-center">
                  <span className="text-2xl block mb-2">{item.icon}</span>
                  <span className="text-emerald-200 text-xs font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
