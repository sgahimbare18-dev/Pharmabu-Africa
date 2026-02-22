const complianceItems = [
  {
    icon: "🚫",
    title: "Prescriptions Cannot Be Deleted",
    description:
      "Once uploaded, prescriptions are permanently stored. No patient, pharmacist, or admin can delete them — only status changes are permitted.",
    status: "Critical",
    statusColor: "red",
  },
  {
    icon: "📝",
    title: "Mandatory Counseling Before Dispensing",
    description:
      "The system blocks dispensing until the pharmacist completes the structured counseling form with digital signature.",
    status: "Enforced",
    statusColor: "amber",
  },
  {
    icon: "🔍",
    title: "Controlled Drug Monitoring",
    description:
      "Controlled substances require valid prescriptions, extra pharmacist confirmation, and are flagged for admin visibility. Antibiotics require prescription review.",
    status: "Monitored",
    statusColor: "blue",
  },
  {
    icon: "📊",
    title: "Immutable Audit Logs",
    description:
      "Every action is recorded with user ID, IP address, device info, and timestamp. Audit logs cannot be edited or deleted by anyone.",
    status: "Always On",
    statusColor: "emerald",
  },
  {
    icon: "🏛️",
    title: "Regulatory Alignment",
    description:
      "Aligned with Kenya's Pharmacy and Poisons Board and Burundi's Ministère de la Santé Publique. Pharmacist verification follows national standards.",
    status: "Compliant",
    statusColor: "purple",
  },
  {
    icon: "🔐",
    title: "Data Retention Policy",
    description:
      "All prescription records, counseling notes, and audit logs are retained for a minimum of 5–10 years as required by healthcare regulations.",
    status: "5–10 Years",
    statusColor: "teal",
  },
];

const statusColors: Record<string, string> = {
  red: "bg-red-100 text-red-700 border-red-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  teal: "bg-teal-100 text-teal-700 border-teal-200",
};

export default function Compliance() {
  return (
    <section id="compliance" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-red-600 text-sm font-medium">Legal Compliance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            This Is Not a Normal E-Commerce App
          </h2>
          <p className="text-gray-500 text-lg max-w-3xl mx-auto">
            PharmabuLink Africa is a regulated medical system, a legal evidence storage system, and a healthcare compliance tool.{" "}
            <strong className="text-gray-700">Security and audit trail are more important than UI design.</strong>
          </p>
        </div>

        {/* Warning banner */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-12 flex items-start gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-red-800 mb-1">Failure in Compliance = Legal Shutdown</h3>
            <p className="text-red-700 text-sm leading-relaxed">
              All compliance features are non-negotiable and enforced at the system level. No user — including administrators — can bypass these controls. Every violation attempt is logged and flagged.
            </p>
          </div>
        </div>

        {/* Compliance grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complianceItems.map((item) => (
            <div key={item.title} className="border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{item.icon}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[item.statusColor]}`}>
                  {item.status}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Prescription status flow */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Prescription Status Flow</h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: "Pending", color: "bg-gray-200 text-gray-700" },
              { label: "→", color: "text-gray-400 bg-transparent" },
              { label: "Approved", color: "bg-blue-100 text-blue-700" },
              { label: "→", color: "text-gray-400 bg-transparent" },
              { label: "Dispensed", color: "bg-emerald-100 text-emerald-700" },
            ].map((item, i) => (
              <span
                key={i}
                className={`px-4 py-2 rounded-full text-sm font-medium ${item.color}`}
              >
                {item.label}
              </span>
            ))}
            <div className="w-full flex flex-wrap items-center justify-center gap-3 mt-2">
              {[
                { label: "Rejected", color: "bg-red-100 text-red-700" },
                { label: "Expired", color: "bg-orange-100 text-orange-700" },
                { label: "Flagged", color: "bg-yellow-100 text-yellow-700" },
              ].map((item) => (
                <span key={item.label} className={`px-4 py-2 rounded-full text-sm font-medium ${item.color}`}>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            All status changes are timestamped, logged, and permanently stored. No prescription can ever be deleted.
          </p>
        </div>
      </div>
    </section>
  );
}
