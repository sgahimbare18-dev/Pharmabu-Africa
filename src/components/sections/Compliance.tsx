"use client";

import { useLanguage } from "@/lib/i18n";

const icons = ["🚫", "📝", "🔍", "📊", "🏛️", "🔐"];

const statusColors: Record<string, string> = {
  red: "bg-red-100 text-red-700 border-red-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  teal: "bg-teal-100 text-teal-700 border-teal-200",
};

const statusColorKeys = ["red", "amber", "blue", "emerald", "purple", "teal"];

export default function Compliance() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-red-600 text-sm font-medium">{t.compliance.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t.compliance.title}
          </h2>
          <p className="text-gray-500 text-lg max-w-3xl mx-auto">
            {t.compliance.subtitle}
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
            <h3 className="font-bold text-red-800 mb-1">{t.compliance.warningTitle}</h3>
            <p className="text-red-700 text-sm leading-relaxed">
              {t.compliance.warningDesc}
            </p>
          </div>
        </div>

        {/* Compliance grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.compliance.items.map((item: any, index: number) => (
            <div key={item.title} className="border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{icons[index]}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[statusColorKeys[index]]}`}>
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
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">{t.compliance.flowTitle}</h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: t.compliance.flowLabels.pending, color: "bg-gray-200 text-gray-700" },
              { label: "→", color: "text-gray-400 bg-transparent" },
              { label: t.compliance.flowLabels.approved, color: "bg-blue-100 text-blue-700" },
              { label: "→", color: "text-gray-400 bg-transparent" },
              { label: t.compliance.flowLabels.dispensed, color: "bg-emerald-100 text-emerald-700" },
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
                { label: t.compliance.flowLabels.rejected, color: "bg-red-100 text-red-700" },
                { label: t.compliance.flowLabels.expired, color: "bg-orange-100 text-orange-700" },
                { label: t.compliance.flowLabels.flagged, color: "bg-yellow-100 text-yellow-700" },
              ].map((item) => (
                <span key={item.label} className={`px-4 py-2 rounded-full text-sm font-medium ${item.color}`}>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            {t.compliance.flowNote}
          </p>
        </div>
      </div>
    </section>
  );
}
