"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage, Language } from "@/lib/i18n";

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en");
    setLangMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PA</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">
              PharmaBu <span className="text-emerald-600">Africa</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors">
              {t.nav.features}
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors">
              {t.nav.howItWorks}
            </a>
            <a href="#compliance" className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors">
              {t.nav.compliance}
            </a>
            <a href="#for-pharmacies" className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors">
              {t.nav.forPharmacies}
            </a>
          </div>

          {/* CTA Buttons + Language Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span>{language === "en" ? "EN" : "FR"}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  <button
                    onClick={toggleLanguage}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                  >
                    {language === "en" ? "Français" : "English"}
                  </button>
                </div>
              )}
            </div>

            <Link
              href="/signin"
              className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors px-3 py-2"
            >
              {t.nav.signIn}
            </Link>
            <Link
              href="/register"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {t.nav.getStarted}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              {/* Mobile Language Switcher */}
              <button
                onClick={() => setLanguage(language === "en" ? "fr" : "en")}
                className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 text-sm font-medium py-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                {language === "en" ? "Français" : "English"}
              </button>
              
              <a href="#features" className="text-gray-600 hover:text-emerald-600 text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
                {t.nav.features}
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-emerald-600 text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
                {t.nav.howItWorks}
              </a>
              <a href="#compliance" className="text-gray-600 hover:text-emerald-600 text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
                {t.nav.compliance}
              </a>
              <a href="#for-pharmacies" className="text-gray-600 hover:text-emerald-600 text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
                {t.nav.forPharmacies}
              </a>
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <Link
                  href="/signin"
                  className="text-sm font-medium text-gray-700 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {t.nav.signIn}
                </Link>
                <Link
                  href="/register"
                  className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  {t.nav.getStarted}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
