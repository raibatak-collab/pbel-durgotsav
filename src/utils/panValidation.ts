/**
 * Indian Income Tax Department PAN Structure Validation
 * Format: 5 Letters, 4 Digits, 1 Letter (10 alphanumeric characters)
 *
 * 4th Character represents the Legal Entity Status of the PAN Holder:
 * - 'P' -> Individual (Person) - Devotees
 * - 'C' -> Company / Corporate Sponsor
 * - 'H' -> Hindu Undivided Family (HUF)
 * - 'F' -> Partnership Firm / LLP
 * - 'A' -> Association of Persons (AOP)
 * - 'T' -> Trust
 * - 'B' -> Body of Individuals (BOI)
 * - 'L' -> Local Authority
 * - 'J' -> Artificial Juridical Person
 * - 'G' -> Government Agency
 */

export const PAN_REGEX = /^[A-Z]{3}[CPHFATBLJG][A-Z][0-9]{4}[A-Z]$/;

export const VALID_PAN_4TH_CHARS = ["P", "C", "H", "F", "A", "T", "B", "L", "J", "G"] as const;

export const ENTITY_TYPE_LABELS: Record<string, string> = {
  P: "Individual Devotee",
  C: "Company / Corporate",
  H: "Hindu Undivided Family (HUF)",
  F: "Partnership Firm / LLP",
  A: "Association of Persons",
  T: "Trust",
  B: "Body of Individuals",
  L: "Local Authority",
  J: "Artificial Juridical Person",
  G: "Government Agency",
};

export interface PanValidationResult {
  isValid: boolean;
  cleanPan: string;
  errorMessage?: string;
  entityType?: string;
}

export function validateIndianPan(pan: string): PanValidationResult {
  const clean = (pan || "").trim().toUpperCase();

  if (!clean) {
    return {
      isValid: false,
      cleanPan: "",
      errorMessage: "Please enter your 10-character PAN number.",
    };
  }

  if (clean.length !== 10) {
    return {
      isValid: false,
      cleanPan: clean,
      errorMessage: `PAN must be exactly 10 characters (currently ${clean.length}).`,
    };
  }

  const fourthChar = clean.charAt(3);
  if (!VALID_PAN_4TH_CHARS.includes(fourthChar as any)) {
    return {
      isValid: false,
      cleanPan: clean,
      errorMessage: `Invalid 4th character '${fourthChar}'. For individuals, the 4th character is 'P' (e.g. ABCP...); for company/HUF, it is 'C' or 'H'.`,
    };
  }

  if (!PAN_REGEX.test(clean)) {
    return {
      isValid: false,
      cleanPan: clean,
      errorMessage: "Invalid PAN format. Must be 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F).",
    };
  }

  return {
    isValid: true,
    cleanPan: clean,
    entityType: ENTITY_TYPE_LABELS[fourthChar] || "Individual",
  };
}
