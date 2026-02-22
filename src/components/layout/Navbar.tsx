"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
              PharmaLink <span className="text-emerald-600">Africa</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors">
              How It Works
            </a>
            <a href="#compliance" className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors">
              Compliance
            </a>
            <a href="#for-pharmacies" className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors">
              For Pharmacies
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/signin"
              className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
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
              <a href="#features" className="text-gray-600 hover:text-emerald-600 text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-emerald-600 text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
                How It Works
              </a>
              <a href="#compliance" className="text-gray-600 hover:text-emerald-600 text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
                Compliance
              </a>
              <a href="#for-pharmacies" className="text-gray-600 hover:text-emerald-600 text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
                For Pharmacies
              </a>
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <Link
                  href="/signin"
                  className="text-sm font-medium text-gray-700 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
