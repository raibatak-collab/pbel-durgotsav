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

export const PBEL_TOWER_NAMES: string[] = PBEL_TOWERS.map((t) => t.fullName);

export const TOWERS_STORAGE_KEY = "pbel_custom_towers";

/**
 * Retrieves the current towers configuration from localStorage with default fallback.
 */
export function getStoredTowers(): TowerDefinition[] {
  if (typeof window === "undefined") return PBEL_TOWERS;
  try {
    const raw = localStorage.getItem(TOWERS_STORAGE_KEY);
    if (!raw) return PBEL_TOWERS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return PBEL_TOWERS;
    return parsed.map((t: any) => ({
      ...t,
      regex: t.regex ? new RegExp(t.regex.source || t.regex, "i") : new RegExp(`${t.id}|${t.name}|${t.tower}`, "i"),
    }));
  } catch {
    return PBEL_TOWERS;
  }
}

/**
 * Saves updated towers configuration into localStorage and dispatches a live update event.
 */
export function saveStoredTowers(towers: TowerDefinition[]): void {
  if (typeof window === "undefined") return;
  // Convert RegExp to string for serialization
  const serializable = towers.map((t) => ({
    ...t,
    regex: t.regex ? t.regex.source : "",
  }));
  localStorage.setItem(TOWERS_STORAGE_KEY, JSON.stringify(serializable));
  window.dispatchEvent(new Event("pbel_towers_updated"));
}
