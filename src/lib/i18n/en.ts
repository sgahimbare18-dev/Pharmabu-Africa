// English translations
export const en = {
  // Navigation
  nav: {
    features: "Features",
    howItWorks: "How It Works",
    compliance: "Compliance",
    forPharmacies: "For Pharmacies",
    signIn: "Sign In",
    getStarted: "Get Started",
  },
  
  // Hero Section
  hero: {
    title: "Your Health, Our Priority",
    subtitle: "Access trusted pharmacies, upload prescriptions, and get medications delivered to your door. Connect with licensed pharmacists for expert advice.",
    cta1: "Get Started",
    cta2: "Learn More",
    card1Title: "Upload Prescription",
    card1Desc: "Snap & upload your prescription for quick verification",
    card2Title: "Fast Delivery",
    card2Desc: "Get medications delivered within hours",
    card3Title: "Expert Counsel",
    card3Desc: "Chat with licensed pharmacists anytime",
  },
  
  // Trust Banner
  trustBanner: {
    verified: "Verified Pharmacies",
    secure: "Secure & Private",
    compliant: "Legally Compliant",
    support: "24/7 Support",
  },
  
  // Features Section
  features: {
    badge: "Platform Features",
    title: "Built for Healthcare Compliance",
    subtitle: "Every feature is designed with legal compliance, patient safety, and pharmacist accountability at its core.",
    items: [
      {
        title: "Secure Prescription Management",
        description: "Upload prescriptions that are permanently stored and legally immutable. No deletion allowed — only status changes with full audit trail.",
        highlights: ["Cannot be deleted", "5–10 year retention", "Timestamped & logged"],
      },
      {
        title: "Mandatory Counseling Records",
        description: "Pharmacists must complete a structured counseling form before dispensing. System blocks dispensing without completed counseling.",
        highlights: ["Dosage & side effects", "Drug interaction check", "Digital signature required"],
      },
      {
        title: "Private Encrypted Chat",
        description: "Secure one-on-one communication between patient and pharmacist. Messages are encrypted, immutable, and permanently stored.",
        highlights: ["End-to-end encrypted", "No cross-pharmacy access", "Supports image & prescription refs"],
      },
      {
        title: "Pharmacist Verification",
        description: "Every pharmacist is manually verified by admin before activation. License, national ID, and pharmacy registration required.",
        highlights: ["License number verified", "Admin approval required", "Aligned with PPB & MoH"],
      },
      {
        title: "Full Audit Trail System",
        description: "Every action is logged with user ID, IP address, device info, and timestamp. Audit logs are non-editable and non-deletable.",
        highlights: ["Every action logged", "IP & device tracking", "Non-deletable records"],
      },
      {
        title: "Delivery Tracking",
        description: "Real-time delivery tracking with OTP confirmation and signature on delivery. Cold-chain flag for temperature-sensitive medications.",
        highlights: ["OTP confirmation", "Cold-chain support", "Real-time status updates"],
      },
    ],
  },
  
  // How It Works Section
  howItWorks: {
    badge: "How It Works",
    title: "Simple, Secure, Compliant",
    subtitle: "Whether you're a patient or a pharmacist, PharmabuLink Africa guides you through every step with full legal compliance.",
    patient: {
      title: "For Patients",
      subtitle: "Get your medication safely delivered",
      steps: [
        { title: "Register & Verify", description: "Create your account with basic details. Your identity is protected under our privacy policy." },
        { title: "Upload Prescription", description: "Upload your prescription image or PDF. It's permanently stored and legally protected." },
        { title: "Choose a Pharmacy", description: "Browse verified pharmacies near you. Chat privately with the pharmacist." },
        { title: "Receive Counseling", description: "Your pharmacist provides mandatory counseling before dispensing your medication." },
        { title: "Track Delivery", description: "Track your order in real-time. Confirm receipt with OTP code on delivery." },
      ],
    },
    pharmacist: {
      title: "For Pharmacists",
      subtitle: "Operate with full regulatory compliance",
      steps: [
        { title: "Submit Credentials", description: "Upload your license number, national ID, and pharmacy registration certificate." },
        { title: "Admin Verification", description: "Our team manually verifies your credentials against regulatory databases." },
        { title: "Upload Inventory", description: "Add your drug inventory with pricing, availability, and controlled drug flags." },
        { title: "Review Prescriptions", description: "Review patient prescriptions, approve or reject orders with documented reasons." },
        { title: "Complete Counseling", description: "Fill the mandatory counseling form and digitally sign before dispensing." },
      ],
    },
  },
  
  // Compliance Section
  compliance: {
    badge: "Legal Compliance",
    title: "This Is Not a Normal E-Commerce App",
    subtitle: "PharmabuLink Africa is a regulated medical system, a legal evidence storage system, and a healthcare compliance tool. Security and audit trail are more important than UI design.",
    warningTitle: "Failure in Compliance = Legal Shutdown",
    warningDesc: "All compliance features are non-negotiable and enforced at the system level. No user — including administrators — can bypass these controls. Every violation attempt is logged and flagged.",
    items: [
      { title: "Prescriptions Cannot Be Deleted", description: "Once uploaded, prescriptions are permanently stored. No patient, pharmacist, or admin can delete them — only status changes are permitted.", status: "Critical" },
      { title: "Mandatory Counseling Before Dispensing", description: "The system blocks dispensing until the pharmacist completes the structured counseling form with digital signature.", status: "Enforced" },
      { title: "Controlled Drug Monitoring", description: "Controlled substances require valid prescriptions, extra pharmacist confirmation, and are flagged for admin visibility. Antibiotics require prescription review.", status: "Monitored" },
      { title: "Immutable Audit Logs", description: "Every action is recorded with user ID, IP address, device info, and timestamp. Audit logs cannot be edited or deleted by anyone.", status: "Always On" },
      { title: "Regulatory Alignment", description: "Aligned with Kenya's Pharmacy and Poisons Board and Burundi's Ministère de la Santé Publique. Pharmacist verification follows national standards.", status: "Compliant" },
      { title: "Data Retention Policy", description: "All prescription records, counseling notes, and audit logs are retained for a minimum of 5–10 years as required by healthcare regulations.", status: "5–10 Years" },
    ],
    flowTitle: "Prescription Status Flow",
    flowLabels: {
      pending: "Pending",
      approved: "Approved",
      dispensed: "Dispensed",
      rejected: "Rejected",
      expired: "Expired",
      flagged: "Flagged",
    },
    flowNote: "All status changes are timestamped, logged, and permanently stored. No prescription can ever be deleted.",
  },
  
  // For Pharmacies Section
  forPharmacies: {
    badge: "For Pharmacies",
    title: "Grow Your Pharmacy Business Digitally",
    subtitle: "Join Africa's most trusted pharmacy network. Reach more patients, operate with full compliance, and build recurring revenue through telepharmacy services.",
    cta: "Register Your Pharmacy →",
    verificationTitle: "Verification Requirements",
    verificationItems: [
      "Valid pharmacist license number",
      "National ID / Passport",
      "Pharmacy registration certificate",
      "Admin manual verification",
      "Regulatory database cross-check",
    ],
    benefits: [
      { title: "Expand Your Reach", description: "Connect with patients across your city and beyond. Manage online orders alongside walk-in customers." },
      { title: "Stay Legally Protected", description: "Every dispensing action is documented. Counseling records and digital signatures protect you legally." },
      { title: "Family Pharmacist Revenue", description: "Earn recurring monthly income through the Family Pharmacist subscription model." },
      { title: "Inventory Management", description: "Manage your drug inventory, set availability, flag controlled substances, and track stock levels." },
      { title: "Mobile-First Platform", description: "Manage your pharmacy from anywhere with our mobile app. Approve orders, chat with patients, track deliveries." },
      { title: "Dedicated Support", description: "Our team helps you through the verification process and provides ongoing compliance guidance." },
    ],
    familyPharmacist: {
      title: "Family Pharmacist Module",
      description: "Patients can subscribe to a dedicated pharmacist for monthly medication management. Earn recurring revenue while providing personalized care.",
      items: [
        { label: "Medication Reminders" },
        { label: "Chronic Disease Monitoring" },
        { label: "Dedicated Chat" },
        { label: "Drug Review Service" },
      ],
    },
  },
  
  // CTA Section
  cta: {
    title: "Ready to Transform Healthcare in Africa?",
    subtitle: "Join PharmabuLink Africa — where patient safety, pharmacist accountability, and regulatory compliance come first.",
    cta1: "Find a Pharmacy Near You",
    cta2: "Register Your Pharmacy",
    availableKenya: "Available in Kenya",
    availableBurundi: "Available in Burundi",
    paymentMethod: "M-Pesa & Mobile Money",
  },
  
  // Footer
  footer: {
    description: "Africa's trusted digital pharmacy marketplace. Secure, compliant, and patient-first.",
    platform: "Platform",
    platformLinks: [
      "Find a Pharmacy",
      "Upload Prescription",
      "Track Delivery",
      "Family Pharmacist",
      "Telepharmacy",
    ],
    forPharmacists: "For Pharmacists",
    forPharmacistsLinks: [
      "Register Your Pharmacy",
      "Verification Process",
      "Inventory Management",
      "Counseling Records",
      "Delivery Management",
    ],
    legal: "Legal & Compliance",
    legalLinks: [
      "Privacy Policy",
      "Terms of Service",
      "Data Retention Policy",
      "Audit Trail Policy",
      "Regulatory Compliance",
    ],
    badges: [
      { text: "256-bit Encryption" },
      { text: "HIPAA-Aligned" },
      { text: "PPB Compliant (Kenya)" },
      { text: "MoH Compliant (Burundi)" },
      { text: "Immutable Audit Logs" },
    ],
    kenya: "Kenya — Pharmacy & Poisons Board",
    burundi: "Burundi — Ministère de la Santé",
    copyright: "© 2026 PharmabuLink Africa. All rights reserved.",
    disclaimer: "This platform is a regulated medical system. All actions are logged and legally binding.",
    admin: "Admin",
  },
  
  // Language
  language: {
    select: "Language",
    en: "English",
    fr: "Français",
  },
};
