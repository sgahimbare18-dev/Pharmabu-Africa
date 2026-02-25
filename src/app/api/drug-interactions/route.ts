import { NextResponse } from "next/server";
import { checkMultipleDrugInteractions, DrugInteraction } from "@/lib/drugInteractions";

export interface InteractionResult {
  drug1: string;
  drug2: string;
  severity: string;
  effect: string;
  recommendation: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { drugs } = body;

    if (!drugs || !Array.isArray(drugs) || drugs.length < 2) {
      return NextResponse.json(
        { error: "Please provide at least 2 drugs to check" },
        { status: 400 }
      );
    }

    // Validate each drug is a non-empty string
    const validDrugs = drugs.filter((d: unknown) => typeof d === "string" && d.trim().length > 0);
    if (validDrugs.length < 2) {
      return NextResponse.json(
        { error: "Please provide at least 2 valid drug names" },
        { status: 400 }
      );
    }

    const interactions = checkMultipleDrugInteractions(validDrugs);

    const results: InteractionResult[] = interactions.map((item) => ({
      drug1: item.drug1,
      drug2: item.drug2,
      severity: item.interaction.severity,
      effect: item.interaction.effect,
      recommendation: item.interaction.recommendation,
    }));

    // Determine overall safety
    const hasContraindicated = interactions.some(
      (i) => i.interaction.severity === "contraindicated"
    );
    const hasMajor = interactions.some(
      (i) => i.interaction.severity === "major"
    );

    return NextResponse.json({
      safe: interactions.length === 0,
      hasContraindicated,
      hasMajor,
      interactions: results,
      summary:
        interactions.length === 0
          ? "No known interactions found. Always consult your pharmacist."
          : hasContraindicated
          ? "DANGEROUS: These medications should not be combined!"
          : hasMajor
          ? "Warning: Significant interactions detected. Consult a pharmacist."
          : "Moderate interactions found. Consult your pharmacist.",
    });
  } catch (error) {
    console.error("Drug interaction check error:", error);
    return NextResponse.json(
      { error: "Failed to check drug interactions" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return available categories/info
  return NextResponse.json({
    message: "Use POST to check drug interactions",
    example: {
      drugs: ["ibuprofen", "warfarin", "aspirin"],
    },
    categories: [
      "pain_relief",
      "antibiotics",
      "cardiovascular",
      "diabetes",
      "mental_health",
    ],
  });
}
