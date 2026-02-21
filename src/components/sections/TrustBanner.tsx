const trustItems = [
  { icon: "🔒", text: "End-to-End Encrypted" },
  { icon: "📋", text: "Full Audit Trail" },
  { icon: "🏛️", text: "Regulatory Compliant" },
  { icon: "💊", text: "Verified Pharmacists Only" },
  { icon: "🛡️", text: "Immutable Prescription Records" },
  { icon: "⚖️", text: "Legal Evidence Storage" },
];

export default function TrustBanner() {
  return (
    <section className="bg-gray-50 border-y border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {trustItems.map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-gray-600">
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium whitespace-nowrap">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
