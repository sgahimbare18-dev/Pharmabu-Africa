// Drug Interaction Database for PharmabuLink Africa
// Contains known dangerous drug interactions with severity levels

export type InteractionSeverity = "minor" | "moderate" | "major" | "contraindicated";

export interface DrugInteraction {
  drug1: string[];
  drug2: string[];
  severity: InteractionSeverity;
  effect: string;
  recommendation: string;
}

// Common drug aliases for matching
const drugAliases: Record<string, string[]> = {
  // Pain relievers
  ibuprofen: ["ibuprofen", "advil", "motrin", "nurofen", "brufen"],
  aspirin: ["aspirin", "bayer", "ecotrin", "bufferin"],
  acetaminophen: ["acetaminophen", "paracetamol", "tylenol", "panadol", "alvedon"],
  naproxen: ["naproxen", "aleve", "naprosyn"],
  diclofenac: ["diclofenac", "cataflam", "voltaren"],
  
  // Antibiotics
  amoxicillin: ["amoxicillin", "amoxil", "trimox"],
  ciprofloxacin: ["ciprofloxacin", "cipro", "ciproxr"],
  erythromycin: ["erythromycin", "ery-tab", "erythrocin"],
  metronidazole: ["metronidazole", "flagyl"],
  fluconazole: ["fluconazole", "diflucan"],
  
  // Cardiovascular
  warfarin: ["warfarin", "coumadin", "jantoven"],
  lisinopril: ["lisinopril", "prinivil", "zestril"],
  amlodipine: ["amlodipine", "norvasc"],
  metoprolol: ["metoprolol", "lopressor", "toprol-xl"],
  digoxin: ["digoxin", "lanoxin"],
  simvastatin: ["simvastatin", "zocor"],
  atorvastatin: ["atorvastatin", "lipitor"],
  
  // Diabetes
  metformin: ["metformin", "glucophage", "fortamet"],
  insulin: ["insulin", "humalog", "novolog", "lantus"],
  glipizide: ["glipizide", "glucotrol"],
  
  // Mental Health
  fluoxetine: ["fluoxetine", "prozac"],
  sertraline: ["sertraline", "zoloft"],
  amitriptyline: ["amitriptyline", "elavil"],
  diazepam: ["diazepam", "valium"],
  alprazolam: ["alprazolam", "xanax"],
  chlorpromazine: ["chlorpromazine", "thorazine"],
  
  // Blood Pressure
  hydrochlorothiazide: ["hydrochlorothiazide", "hctz", "microzide"],
  furosemide: ["furosemide", "lasix"],
  
  // NSAIDs
  celecoxib: ["celecoxib", "celebrex"],
  
  // Corticosteroids
  prednisone: ["prednisone", "deltasone"],
  dexamethasone: ["dexamethasone", "decadron"],
  
  // Opioids
  morphine: ["morphine", "ms contin"],
  codeine: ["codeine", "codeine phosphate"],
  tramadol: ["tramadol", "ultram"],
  oxycodone: ["oxycodone", "oxycontin", "percodan"],
  
  // Anticoagulants
  heparin: ["heparin"],
  clopidogrel: ["clopidogrel", "plavix"],
  
  // Proton Pump Inhibitors
  omeprazole: ["omeprazole", "prilosec"],
  pantoprazole: ["pantoprazole", "protonix"],
  
  // Antiretrovirals
  ritonavir: ["ritonavir", "norvir"],
  
  // Muscle relaxants
  cyclobenzaprine: ["cyclobenzaprine", "flexeril"],
};

// Known drug interactions database
export const drugInteractions: DrugInteraction[] = [
  // MAJOR - Life threatening
  {
    drug1: ["warfarin"],
    drug2: ["aspirin", "ibuprofen", "naproxen"],
    severity: "major",
    effect: "Significantly increases risk of bleeding",
    recommendation: "Avoid combination. Consult pharmacist immediately.",
  },
  {
    drug1: ["ciprofloxacin"],
    drug2: ["tizanidine"],
    severity: "contraindicated",
    effect: "Dangerous drop in blood pressure",
    recommendation: "DO NOT combine. Life threatening.",
  },
  {
    drug1: ["simvastatin"],
    drug2: ["erythromycin", "clarithromycin"],
    severity: "contraindicated",
    effect: "Risk of severe muscle damage (rhabdomyolysis)",
    recommendation: "DO NOT combine. Use alternative statin.",
  },
  {
    drug1: ["methotrexate"],
    drug2: ["ibuprofen", "naproxen"],
    severity: "major",
    effect: "Toxic buildup of methotrexate",
    recommendation: "Avoid NSAIDs while on methotrexate.",
  },
  {
    drug1: ["digoxin"],
    drug2: ["amiodarone"],
    severity: "major",
    effect: "Toxic levels of digoxin",
    recommendation: "Reduce digoxin dose by 50% if unavoidable.",
  },
  {
    drug1: ["ritonavir"],
    drug2: ["simvastatin"],
    severity: "contraindicated",
    effect: "Severe muscle toxicity",
    recommendation: "DO NOT combine.",
  },
  
  // MODERATE - Significant interactions
  {
    drug1: ["lisinopril"],
    drug2: ["potassium"],
    severity: "moderate",
    effect: "Dangerously high potassium levels",
    recommendation: "Monitor potassium levels regularly.",
  },
  {
    drug1: ["metformin"],
    drug2: ["alcohol"],
    severity: "moderate",
    effect: "Risk of lactic acidosis",
    recommendation: "Limit alcohol intake.",
  },
  {
    drug1: ["fluoxetine"],
    drug2: ["tramadol"],
    severity: "major",
    effect: "Serotonin syndrome - potentially fatal",
    recommendation: "Avoid combination. Use alternative pain relief.",
  },
  {
    drug1: ["sertraline"],
    drug2: ["tramadol"],
    severity: "major",
    effect: "Serotonin syndrome risk",
    recommendation: "Avoid combination.",
  },
  {
    drug1: ["amitriptyline"],
    drug2: ["fluoxetine"],
    severity: "moderate",
    effect: "Increased antidepressant effects",
    recommendation: "Monitor closely. May need dose adjustment.",
  },
  {
    drug1: ["ciprofloxacin"],
    drug2: ["theophylline"],
    severity: "major",
    effect: "Dangerously high theophylline levels",
    recommendation: "Avoid combination.",
  },
  {
    drug1: ["omeprazole"],
    drug2: ["clopidogrel"],
    severity: "moderate",
    effect: "Reduced antiplatelet effect",
    recommendation: "Use alternative PPI or H2 blocker.",
  },
  {
    drug1: ["amlodipine"],
    drug2: ["simvastatin"],
    severity: "moderate",
    effect: "Increased statin levels",
    recommendation: "Limit simvastatin to 20mg daily.",
  },
  {
    drug1: ["ketoconazole"],
    drug2: ["simvastatin"],
    severity: "contraindicated",
    effect: "Muscle damage risk",
    recommendation: "DO NOT combine.",
  },
  {
    drug1: ["prednisone"],
    drug2: ["ibuprofen"],
    severity: "moderate",
    effect: "Increased risk of stomach bleeding",
    recommendation: "Take with food. Consider stomach protection.",
  },
  {
    drug1: ["furosemide"],
    drug2: ["gentamicin"],
    severity: "major",
    effect: "Hearing and kidney damage",
    recommendation: "Avoid combination if possible.",
  },
  
  // MINOR - Minor interactions
  {
    drug1: ["acetaminophen"],
    drug2: ["alcohol"],
    severity: "moderate",
    effect: "Increased liver damage risk",
    recommendation: "Limit alcohol with regular acetaminophen use.",
  },
  {
    drug1: ["amoxicillin"],
    drug2: ["oral contraceptives"],
    severity: "minor",
    effect: "Possible reduced contraceptive effectiveness",
    recommendation: "Use additional contraception during treatment.",
  },
  {
    drug1: ["ciprofloxacin"],
    drug2: ["antacids"],
    severity: "minor",
    effect: "Reduced antibiotic absorption",
    recommendation: "Take 2 hours before or 6 hours after antacids.",
  },
  {
    drug1: ["iron"],
    drug2: ["ciprofloxacin"],
    severity: "minor",
    effect: "Reduced antibiotic absorption",
    recommendation: "Separate doses by 2-6 hours.",
  },
  {
    drug1: ["lithium"],
    drug2: ["ibuprofen"],
    severity: "major",
    effect: "Lithium toxicity",
    recommendation: "Avoid NSAIDs. Use acetaminophen instead.",
  },
];

// Normalize drug name for matching
function normalizeDrugName(name: string): string {
  const lower = name.toLowerCase().trim();
  // Check aliases first
  for (const [canonical, aliases] of Object.entries(drugAliases)) {
    if (aliases.some(alias => lower.includes(alias) || alias.includes(lower))) {
      return canonical;
    }
  }
  return lower;
}

// Check if two drugs have interactions
export function checkDrugInteraction(drug1: string, drug2: string): DrugInteraction | null {
  const norm1 = normalizeDrugName(drug1);
  const norm2 = normalizeDrugName(drug2);
  
  for (const interaction of drugInteractions) {
    const matches1 = interaction.drug1.some(d => 
      norm1.includes(d) || d.includes(norm1)
    );
    const matches2 = interaction.drug2.some(d => 
      norm2.includes(d) || d.includes(norm2)
    );
    
    // Check both directions
    if ((matches1 && matches2) || 
        (interaction.drug2.some(d => norm1.includes(d) || d.includes(norm1)) &&
         interaction.drug1.some(d => norm2.includes(d) || d.includes(norm2)))) {
      return interaction;
    }
  }
  
  return null;
}

// Check multiple drugs for all interactions
export function checkMultipleDrugInteractions(drugs: string[]): Array<{ drug1: string; drug2: string; interaction: DrugInteraction }> {
  const interactions: Array<{ drug1: string; drug2: string; interaction: DrugInteraction }> = [];
  
  for (let i = 0; i < drugs.length; i++) {
    for (let j = i + 1; j < drugs.length; j++) {
      const interaction = checkDrugInteraction(drugs[i], drugs[j]);
      if (interaction) {
        interactions.push({
          drug1: drugs[i],
          drug2: drugs[j],
          interaction,
        });
      }
    }
  }
  
  return interactions;
}

// Get severity color for UI
export function getSeverityColor(severity: InteractionSeverity): string {
  switch (severity) {
    case "contraindicated":
      return "bg-red-600";
    case "major":
      return "bg-red-500";
    case "moderate":
      return "bg-yellow-500";
    case "minor":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
}

// Get severity label
export function getSeverityLabel(severity: InteractionSeverity): string {
  switch (severity) {
    case "contraindicated":
      return "DANGEROUS - DO NOT COMBINE";
    case "major":
      return "Major Interaction";
    case "moderate":
      return "Moderate Interaction";
    case "minor":
      return "Minor Interaction";
    default:
      return "Unknown";
  }
}
