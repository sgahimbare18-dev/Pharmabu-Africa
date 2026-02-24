"use client";

import { useLanguage } from "@/lib/i18n";

export default function TrustBanner() {
  const { t } = useLanguage();
  
  const trustItems = [
    { icon: "🔒", text: t.trustBanner.verified },
    { icon: "📋", text: t.trustBanner.secure },
    { icon: "🏛️", text: t.trustBanner.compliant },
    { icon: "💊", text: t.trustBanner.support },
  ];

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
