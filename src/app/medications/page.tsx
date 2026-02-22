"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Medication {
  id: string;
  pharmacyId: string;
  name: string;
  genericName: string;
  description: string;
  whatItCures: string;
  dosage: string;
  usageInstructions: string;
  sideEffects: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  requiresPrescription: boolean;
  status: string;
}

const categories = [
  "All",
  "General",
  "Pain Relief",
  "Antibiotics",
  "Vitamins",
  "Diabetes",
  "Blood Pressure",
  "Allergies",
  "Digestive",
  "Skin Care",
  "Eye Care",
];

async function fetchMedications(): Promise<Medication[]> {
  try {
    const res = await fetch("/api/medications");
    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (error) {
    console.error("Error fetching medications:", error);
    return [];
  }
}

export default function MedicationsPage() {
  const router = useRouter();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [, setFilteredMedications] = useState<Medication[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedications().then((data) => {
      setMedications(data);
      setLoading(false);
    });
  }, []);

  const filteredMedications = useMemo(() => {
    let filtered = medications;
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        m =>
          m.name.toLowerCase().includes(query) ||
          m.genericName.toLowerCase().includes(query) ||
          m.whatItCures.toLowerCase().includes(query) ||
          m.category.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [medications, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PL</span>
            </div>
            <span className="font-bold text-gray-900">
              PharmaLink <span className="text-emerald-600">Africa</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/patient"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              My Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">💊 Medication Marketplace</h1>
          <p className="text-emerald-100">
            Browse medications from verified pharmacies. Chat with a pharmacist and order for delivery.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search medications, conditions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredMedications.length} medication{filteredMedications.length !== 1 ? "s" : ""}
        </p>

        {/* Medications Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading medications...</div>
          </div>
        ) : filteredMedications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-semibold text-gray-900 mb-2">No medications found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMedications.map((med) => (
              <div
                key={med.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedMedication(med)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    {med.category}
                  </span>
                  {med.requiresPrescription && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      Rx Required
                    </span>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{med.name}</h3>
                {med.genericName && (
                  <p className="text-xs text-gray-500 mb-2">{med.genericName}</p>
                )}
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{med.whatItCures}</p>
                
                {med.dosage && (
                  <p className="text-xs text-gray-500 mb-2">{med.dosage}</p>
                )}
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="font-bold text-emerald-600">KES {med.price.toLocaleString()}</span>
                  <span className={`text-xs ${med.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                    {med.stock > 0 ? `In Stock (${med.stock})` : "Out of Stock"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Medication Detail Modal */}
      {selectedMedication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      {selectedMedication.category}
                    </span>
                    {selectedMedication.requiresPrescription && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        Prescription Required
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedMedication.name}</h2>
                  {selectedMedication.genericName && (
                    <p className="text-gray-500">{selectedMedication.genericName}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedMedication(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm font-medium text-emerald-800 mb-1">What It Treats</p>
                  <p className="text-gray-700">{selectedMedication.whatItCures}</p>
                </div>

                {selectedMedication.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                    <p className="text-gray-600">{selectedMedication.description}</p>
                  </div>
                )}

                {selectedMedication.dosage && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Dosage</p>
                    <p className="text-gray-600">{selectedMedication.dosage}</p>
                  </div>
                )}

                {selectedMedication.usageInstructions && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">How to Use</p>
                    <p className="text-gray-600">{selectedMedication.usageInstructions}</p>
                  </div>
                )}

                {selectedMedication.sideEffects && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Possible Side Effects</p>
                    <p className="text-gray-600">{selectedMedication.sideEffects}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      KES {selectedMedication.price.toLocaleString()}
                    </p>
                  </div>
                  <div className={`text-sm ${selectedMedication.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                    {selectedMedication.stock > 0 ? `${selectedMedication.stock} in stock` : "Out of stock"}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedMedication(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Store selected medication and redirect to patient dashboard to complete order
                    localStorage.setItem("selected_medication", JSON.stringify(selectedMedication));
                    router.push("/dashboard/patient");
                  }}
                  disabled={selectedMedication.stock <= 0}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Request This Medication
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
