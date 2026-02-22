import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-12 shadow-2xl shadow-emerald-200 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="text-5xl mb-4">🌍</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Healthcare in Africa?
            </h2>
            <p className="text-emerald-100/80 text-lg mb-8 max-w-2xl mx-auto">
              Join PharmabuLink Africa — where patient safety, pharmacist accountability, and regulatory compliance come first.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg"
              >
                Find a Pharmacy Near You
              </Link>
              <Link
                href="/register/pharmacy"
                className="border-2 border-white/40 hover:border-white text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:bg-white/10"
              >
                Register Your Pharmacy
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-emerald-200/70 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Available in Kenya
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Available in Burundi
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                M-Pesa & Mobile Money
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
