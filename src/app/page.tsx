import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import TrustBanner from "@/components/sections/TrustBanner";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Compliance from "@/components/sections/Compliance";
import ForPharmacies from "@/components/sections/ForPharmacies";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <TrustBanner />
      <Features />
      <HowItWorks />
      <Compliance />
      <ForPharmacies />
      <CTA />
      <Footer />
    </main>
  );
}
