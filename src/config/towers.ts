/**
 * PBEL City Towers Configuration
 * ----------------------------------------------------
 * You can customize the tower names, codes, and display labels here.
 * Any changes made in this file will automatically update across:
 * - Tower Participation & Devotional Solidarity Module
 * - Contribution & E-Seva Form
 * - Admin PSS Member Management & CSV Importer
 * - Daily Bhog Lunch Pass Tokens
 */

export interface TowerDefinition {
  id: string;          // Single letter code or short code (e.g. "A", "B", "C")
  tower: string;       // Primary Tower Title (e.g. "Tower A", "Tower B")
  name: string;        // Building / Wing Name (e.g. "Emerald", "Sapphire")
  fullName: string;    // Combined display string (e.g. "Tower A (Emerald)")
  regex: RegExp;       // Pattern used to match flat numbers entered by residents
}

export const PBEL_TOWERS: TowerDefinition[] = [
  {
    id: "A",
    tower: "Tower A",
    name: "Emerald",
    fullName: "Tower A (Emerald)",
    regex: /tower\s*a|emerald|\ba[\s-]*\d/i,
  },
  {
    id: "B",
    tower: "Tower B",
    name: "Sapphire",
    fullName: "Tower B (Sapphire)",
    regex: /tower\s*b|sapphire|\bb[\s-]*\d/i,
  },
  {
    id: "C",
    tower: "Tower C",
    name: "Coral",
    fullName: "Tower C (Coral)",
    regex: /tower\s*c|coral|\bc[\s-]*\d/i,
  },
  {
    id: "D",
    tower: "Tower D",
    name: "Topaz",
    fullName: "Tower D (Topaz)",
    regex: /tower\s*d|topaz|\bd[\s-]*\d/i,
  },
  {
    id: "E",
    tower: "Tower E",
    name: "Ruby",
    fullName: "Tower E (Ruby)",
    regex: /tower\s*e|ruby|\be[\s-]*\d/i,
  },
  {
    id: "F",
    tower: "Tower F",
    name: "Pearl",
    fullName: "Tower F (Pearl)",
    regex: /tower\s*f|pearl|\bf[\s-]*\d/i,
  },
  {
    id: "G",
    tower: "Tower G",
    name: "Jade",
    fullName: "Tower G (Jade)",
    regex: /tower\s*g|jade|\bg[\s-]*\d/i,
  },
  {
    id: "H",
    tower: "Tower H",
    name: "Diamond",
    fullName: "Tower H (Diamond)",
    regex: /tower\s*h|diamond|\bh[\s-]*\d/i,
  },
  {
    id: "J",
    tower: "Tower J",
    name: "Aquamarine",
    fullName: "Tower J (Aquamarine)",
    regex: /tower\s*j|aquamarine|\bj[\s-]*\d/i,
  },
  {
    id: "K",
    tower: "Tower K",
    name: "Opal",
    fullName: "Tower K (Opal)",
    regex: /tower\s*k|opal|\bk[\s-]*\d/i,
  },
];

/**
 * Match a raw flat number string (e.g. "Emerald 402", "Tower B-1104", "C 603")
 * to its canonical TowerDefinition.
 */
export function matchTower(input: string): TowerDefinition | null {
  if (!input) return null;
  const clean = input.trim();
  for (const t of PBEL_TOWERS) {
    if (t.regex.test(clean) || clean.toLowerCase().includes(t.name.toLowerCase())) {
      return t;
    }
  }
  return null;
}

/**
 * Helper to get an array of all full tower names for select dropdowns
 */
export const PBEL_TOWER_NAMES: string[] = PBEL_TOWERS.map((t) => t.fullName);
