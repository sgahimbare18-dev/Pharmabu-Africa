const patientSteps = [
  {
    step: "01",
    title: "Register & Verify",
    description: "Create your account with basic details. Your identity is protected under our privacy policy.",
    icon: "👤",
  },
  {
    step: "02",
    title: "Upload Prescription",
    description: "Upload your prescription image or PDF. It's permanently stored and legally protected.",
    icon: "📄",
  },
  {
    step: "03",
    title: "Choose a Pharmacy",
    description: "Browse verified pharmacies near you. Chat privately with the pharmacist.",
    icon: "🏥",
  },
  {
    step: "04",
    title: "Receive Counseling",
    description: "Your pharmacist provides mandatory counseling before dispensing your medication.",
    icon: "💬",
  },
  {
    step: "05",
    title: "Track Delivery",
    description: "Track your order in real-time. Confirm receipt with OTP code on delivery.",
    icon: "🚚",
  },
];

const pharmacistSteps = [
  {
    step: "01",
    title: "Submit Credentials",
    description: "Upload your license number, national ID, and pharmacy registration certificate.",
    icon: "📋",
  },
  {
    step: "02",
    title: "Admin Verification",
    description: "Our team manually verifies your credentials against regulatory databases.",
    icon: "✅",
  },
  {
    step: "03",
    title: "Upload Inventory",
    description: "Add your drug inventory with pricing, availability, and controlled drug flags.",
    icon: "💊",
  },
  {
    step: "04",
    title: "Review Prescriptions",
    description: "Review patient prescriptions, approve or reject orders with documented reasons.",
    icon: "🔍",
  },
  {
    step: "05",
    title: "Complete Counseling",
    description: "Fill the mandatory counseling form and digitally sign before dispensing.",
    icon: "✍️",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-4">
            <span className="text-emerald-600 text-sm font-medium">How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, Secure, Compliant
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Whether you&apos;re a patient or a pharmacist, PharmaLink Africa guides you through every step with full legal compliance.
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
                <h3 className="text-xl font-bold text-gray-900">For Patients</h3>
                <p className="text-gray-500 text-sm">Get your medication safely delivered</p>
              </div>
            </div>

            <div className="space-y-4">
              {patientSteps.map((step, index) => (
                <div key={step.step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {step.step}
                    </div>
                    {index < patientSteps.length - 1 && (
                      <div className="w-0.5 h-full bg-emerald-200 mt-2 min-h-[2rem]" />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{step.icon}</span>
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
                <h3 className="text-xl font-bold text-gray-900">For Pharmacists</h3>
                <p className="text-gray-500 text-sm">Operate with full regulatory compliance</p>
              </div>
            </div>

            <div className="space-y-4">
              {pharmacistSteps.map((step, index) => (
                <div key={step.step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {step.step}
                    </div>
                    {index < pharmacistSteps.length - 1 && (
                      <div className="w-0.5 h-full bg-blue-200 mt-2 min-h-[2rem]" />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{step.icon}</span>
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
