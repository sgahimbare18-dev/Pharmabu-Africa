"use client";

import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PA</span>
              </div>
              <span className="font-bold text-white text-lg">
                PharmaBu <span className="text-emerald-400">Africa</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              {t.footer.description}
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500">🇰🇪</span>
                <span>{t.footer.kenya}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500">🇧🇮</span>
                <span>{t.footer.burundi}</span>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{t.footer.platform}</h4>
            <ul className="space-y-2 text-sm">
              {t.footer.platformLinks.map((item: string, index: number) => (
                <li key={index}>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Pharmacists */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{t.footer.forPharmacists}</h4>
            <ul className="space-y-2 text-sm">
              {t.footer.forPharmacistsLinks.map((item: string, index: number) => (
                <li key={index}>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{t.footer.legal}</h4>
            <ul className="space-y-2 text-sm">
              {t.footer.legalLinks.map((item: string, index: number) => (
                <li key={index}>
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
            {t.footer.badges.map((badge: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-3 py-1.5 text-xs"
              >
                <span>{badge.text.includes("256") ? "🔒" : badge.text.includes("HIPAA") ? "📋" : badge.text.includes("PPB") ? "🏛️" : badge.text.includes("MoH") ? "⚖️" : "🛡️"}</span>
                <span className="text-gray-400">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>{t.footer.copyright}</p>
          <p className="text-gray-600">
            {t.footer.disclaimer}
          </p>
          <a
            href="/admin/login"
            className="text-gray-700 hover:text-gray-500 transition-colors"
          >
            {t.footer.admin}
          </a>
        </div>
      </div>
    </footer>
  );
}
