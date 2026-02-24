"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

const benefitIcons = ["📈", "⚖️", "💰", "🔧", "📱", "🤝"];
const familyPharmacistIcons = ["⏰", "📊", "💬", "🔄"];

export default function ForPharmacies() {
  const { t } = useLanguage();

  return (
    <section id="for-pharmacies" className="py-24 bg-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-800/50 border border-emerald-600/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-emerald-300 text-sm font-medium">{t.forPharmacies.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              {t.forPharmacies.title}
            </h2>
            <p className="text-emerald-100/70 text-lg leading-relaxed mb-8">
              {t.forPharmacies.subtitle}
            </p>

            {/* Verification steps */}
            <div className="bg-emerald-900/50 border border-emerald-700/50 rounded-2xl p-6 mb-8">
              <h3 className="text-white font-semibold mb-4">{t.forPharmacies.verificationTitle}</h3>
              <div className="space-y-3">
                {t.forPharmacies.verificationItems.map((req: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
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

            <Link
              href="/register/pharmacy"
              className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/50"
            >
              {t.forPharmacies.cta}
            </Link>
          </div>

          {/* Right: Benefits grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {t.forPharmacies.benefits.map((benefit: any, index: number) => (
              <div
                key={benefit.title}
                className="bg-emerald-900/40 border border-emerald-700/30 rounded-xl p-5 hover:bg-emerald-900/60 transition-colors"
              >
                <span className="text-2xl mb-3 block">{benefitIcons[index]}</span>
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
              <h3 className="text-2xl font-bold text-white mb-3">{t.forPharmacies.familyPharmacist.title}</h3>
              <p className="text-emerald-200/70 leading-relaxed">
                {t.forPharmacies.familyPharmacist.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {t.forPharmacies.familyPharmacist.items.map((item: any, index: number) => (
                <div key={item.label} className="bg-white/10 rounded-xl p-4 text-center">
                  <span className="text-2xl block mb-2">{familyPharmacistIcons[index]}</span>
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
