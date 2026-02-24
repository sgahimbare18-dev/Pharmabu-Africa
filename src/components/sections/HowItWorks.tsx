"use client";

import { useLanguage } from "@/lib/i18n";

const patientIcons = ["👤", "📄", "🏥", "💬", "🚚"];
const pharmacistIcons = ["📋", "✅", "💊", "🔍", "✍️"];

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-4">
            <span className="text-emerald-600 text-sm font-medium">{t.howItWorks.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t.howItWorks.title}
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Patient Flow */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">👤</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{t.howItWorks.patient.title}</h3>
                <p className="text-gray-500 text-sm">{t.howItWorks.patient.subtitle}</p>
              </div>
            </div>

            <div className="space-y-4">
              {t.howItWorks.patient.steps.map((step: any, index: number) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    {index < t.howItWorks.patient.steps.length - 1 && (
                      <div className="w-0.5 h-full bg-emerald-200 mt-2 min-h-[2rem]" />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{patientIcons[index]}</span>
                      <h4 className="font-semibold text-gray-900">{step.title}</h4>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pharmacist Flow */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">💊</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{t.howItWorks.pharmacist.title}</h3>
                <p className="text-gray-500 text-sm">{t.howItWorks.pharmacist.subtitle}</p>
              </div>
            </div>

            <div className="space-y-4">
              {t.howItWorks.pharmacist.steps.map((step: any, index: number) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    {index < t.howItWorks.pharmacist.steps.length - 1 && (
                      <div className="w-0.5 h-full bg-blue-200 mt-2 min-h-[2rem]" />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{pharmacistIcons[index]}</span>
                      <h4 className="font-semibold text-gray-900">{step.title}</h4>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
