"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";

interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "patient";
  country: string;
}

interface InteractionResult {
  drug1: string;
  drug2: string;
  severity: string;
  effect: string;
  recommendation: string;
}

interface DrugSafetyCheckerProps {
  user: UserSession | null;
}

export function DrugSafetyChecker({ user }: DrugSafetyCheckerProps) {
  const { t } = useLanguage();
  const [drugs, setDrugs] = useState<string[]>([]);
  const [newDrug, setNewDrug] = useState("");
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState<{
    safe: boolean;
    hasContraindicated: boolean;
    hasMajor: boolean;
    interactions: InteractionResult[];
    summary: string;
  } | null>(null);

  const addDrug = () => {
    if (newDrug.trim() && !drugs.includes(newDrug.trim())) {
      setDrugs([...drugs, newDrug.trim()]);
      setNewDrug("");
      setResults(null);
    }
  };

  const removeDrug = (drug: string) => {
    setDrugs(drugs.filter((d) => d !== drug));
    setResults(null);
  };

  const clearAll = () => {
    setDrugs([]);
    setNewDrug("");
    setResults(null);
  };

  const checkInteractions = async () => {
    if (drugs.length < 2) return;

    setChecking(true);
    try {
      const res = await fetch("/api/drug-interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drugs }),
      });

      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Error checking interactions:", error);
    } finally {
      setChecking(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "contraindicated":
        return "bg-red-600 text-white";
      case "major":
        return "bg-red-500 text-white";
      case "moderate":
        return "bg-yellow-500 text-white";
      case "minor":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "contraindicated":
        return "DANGEROUS";
      case "major":
        return "Major";
      case "moderate":
        return "Moderate";
      case "minor":
        return "Minor";
      default:
        return severity;
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center gap-4">
          <div className="text-5xl">💊</div>
          <div>
            <h1 className="text-2xl font-bold">{t.patientDashboard.drugSafetyTitle}</h1>
            <p className="text-red-100 mt-1">{t.patientDashboard.drugSafetySubtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Drug Input Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Your Medications</h2>

          {/* Add drug input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newDrug}
              onChange={(e) => setNewDrug(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addDrug()}
              placeholder={t.patientDashboard.drugSafetyPlaceholder}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              onClick={addDrug}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700"
            >
              {t.patientDashboard.drugSafetyAddDrug}
            </button>
          </div>

          {/* Drug list */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Medications ({drugs.length})
            </h3>
            {drugs.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">No medications added yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {drugs.map((drug, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm"
                  >
                    {drug}
                    <button
                      onClick={() => removeDrug(drug)}
                      className="hover:text-red-900 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={checkInteractions}
              disabled={drugs.length < 2 || checking}
              className={`flex-1 px-4 py-3 rounded-lg font-medium ${
                drugs.length < 2 || checking
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {checking ? "Checking..." : t.patientDashboard.drugSafetyCheck}
            </button>
            <button
              onClick={clearAll}
              disabled={drugs.length === 0}
              className={`px-4 py-3 rounded-lg font-medium ${
                drugs.length === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {t.patientDashboard.drugSafetyClear}
            </button>
          </div>

          {/* Common medications hint */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium mb-2">Try these common medications:</p>
            <div className="flex flex-wrap gap-2">
              {["Ibuprofen", "Warfarin", "Aspirin", "Metformin", "Lisinopril", "Amoxicillin"].map((drug) => (
                <button
                  key={drug}
                  onClick={() => {
                    if (!drugs.includes(drug)) {
                      setDrugs([...drugs, drug]);
                      setResults(null);
                    }
                  }}
                  className="text-xs bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-100"
                >
                  + {drug}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Results</h2>

          {!results && drugs.length < 2 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-4">🔍</div>
              <p>Add at least 2 medications to check for interactions</p>
            </div>
          )}

          {!results && drugs.length >= 2 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-4">⏳</div>
              <p>Click &quot;Check Interactions&quot; to analyze your medications</p>
            </div>
          )}

          {results && (
            <div>
              {/* Summary Banner */}
              <div
                className={`rounded-xl p-4 mb-6 ${
                  results.safe
                    ? "bg-green-100 border border-green-300"
                    : results.hasContraindicated || results.hasMajor
                    ? "bg-red-100 border border-red-300"
                    : "bg-yellow-100 border border-yellow-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {results.safe ? "✅" : results.hasContraindicated ? "⛔" : "⚠️"}
                  </span>
                  <p
                    className={`font-semibold ${
                      results.safe
                        ? "text-green-800"
                        : results.hasContraindicated || results.hasMajor
                        ? "text-red-800"
                        : "text-yellow-800"
                    }`}
                  >
                    {results.summary}
                  </p>
                </div>
              </div>

              {/* Interactions List */}
              {results.interactions.length > 0 && (
                <div className="space-y-4">
                  {results.interactions.map((interaction, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {interaction.drug1}
                          </span>
                          <span className="text-gray-400">+</span>
                          <span className="font-medium text-gray-900">
                            {interaction.drug2}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(
                            interaction.severity
                          )}`}
                        >
                          {getSeverityLabel(interaction.severity)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">
                        <span className="font-medium">Effect:</span> {interaction.effect}
                      </p>
                      <p className="text-gray-600 text-sm bg-gray-50 p-2 rounded">
                        <span className="font-medium">Recommendation:</span>{" "}
                        {interaction.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {results.safe && results.interactions.length === 0 && (
                <div className="text-center py-8 text-green-600">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="font-medium">No known interactions found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Always consult your pharmacist before taking medications together
                  </p>
                </div>
              )}

              {/* Disclaimer */}
              <div className="mt-6 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-500">
                  ⚠️ This is a preliminary check only. Always consult your pharmacist
                  or doctor before taking medications. This tool does not replace
                  professional medical advice.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
