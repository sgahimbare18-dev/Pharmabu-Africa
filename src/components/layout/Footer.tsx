export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PL</span>
              </div>
              <span className="font-bold text-white text-lg">
                PharmaLink <span className="text-emerald-400">Africa</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Africa&apos;s trusted digital pharmacy marketplace. Secure, compliant, and patient-first.
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500">🇰🇪</span>
                <span>Kenya — Pharmacy & Poisons Board</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500">🇧🇮</span>
                <span>Burundi — Ministère de la Santé</span>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              {[
                "Find a Pharmacy",
                "Upload Prescription",
                "Track Delivery",
                "Family Pharmacist",
                "Telepharmacy",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Pharmacists */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">For Pharmacists</h4>
            <ul className="space-y-2 text-sm">
              {[
                "Register Your Pharmacy",
                "Verification Process",
                "Inventory Management",
                "Counseling Records",
                "Delivery Management",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Legal & Compliance</h4>
            <ul className="space-y-2 text-sm">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Data Retention Policy",
                "Audit Trail Policy",
                "Regulatory Compliance",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Compliance badges */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { icon: "🔒", text: "256-bit Encryption" },
              { icon: "📋", text: "HIPAA-Aligned" },
              { icon: "🏛️", text: "PPB Compliant (Kenya)" },
              { icon: "⚖️", text: "MoH Compliant (Burundi)" },
              { icon: "🛡️", text: "Immutable Audit Logs" },
            ].map((badge) => (
              <div
                key={badge.text}
                className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-3 py-1.5 text-xs"
              >
                <span>{badge.icon}</span>
                <span className="text-gray-400">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 PharmaLink Africa. All rights reserved.</p>
          <p className="text-gray-600">
            This platform is a regulated medical system. All actions are logged and legally binding.
          </p>
          <a
            href="/admin/login"
            className="text-gray-700 hover:text-gray-500 transition-colors"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
