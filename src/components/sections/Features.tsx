"use client";

import { useLanguage } from "@/lib/i18n";

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", badge: "bg-emerald-100 text-emerald-700" },
  blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", badge: "bg-blue-100 text-blue-700" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", badge: "bg-purple-100 text-purple-700" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", badge: "bg-amber-100 text-amber-700" },
  red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100", badge: "bg-red-100 text-red-700" },
  teal: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-100", badge: "bg-teal-100 text-teal-700" },
};

const iconMap = [
  (
    <svg key="1" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  (
    <svg key="2" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  (
    <svg key="3" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
    </svg>
  ),
  (
    <svg key="4" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  (
    <svg key="5" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  (
    <svg key="6" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
];

const colorKeys = ["emerald", "blue", "purple", "amber", "red", "teal"];

export default function Features() {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-4">
            <span className="text-emerald-600 text-sm font-medium">{t.features.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t.features.title}
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.features.items.map((feature: any, index: number) => {
            const colorKey = colorKeys[index];
            const colors = colorMap[colorKey];
            return (
              <div
                key={feature.title}
                className={`rounded-2xl border ${colors.border} p-6 hover:shadow-lg transition-shadow`}
              >
                <div className={`w-12 h-12 ${colors.bg} ${colors.text} rounded-xl flex items-center justify-center mb-4`}>
                  {iconMap[index]}
                </div>
                <h3 className="text-gray-900 font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{feature.description}</p>
                <div className="flex flex-wrap gap-2">
                  {feature.highlights.map((h: string) => (
                    <span key={h} className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors.badge}`}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
