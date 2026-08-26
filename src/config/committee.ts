/**
 * PBEL City Durgotsav 2026 - Organizing Committee & Core Wings Configuration
 * Self-Service First: Admin can edit the committee name, wing titles, taglines, and member leads directly from the console.
 */

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  tower: string;
  phone?: string;
}

export interface CommitteeWing {
  id: string;
  category: string;
  icon: string;
  tagline: string;
  members: CommitteeMember[];
}

export const DEFAULT_COMMITTEE_WINGS: CommitteeWing[] = [
  {
    id: "wing-exec",
    category: "Executive Leadership & Advisory Council",
    icon: "👑",
    tagline: "Overall governance, society alignment & festival coordination",
    members: [
      { id: "m-1", name: "Raibatak Banerjee", role: "Convener & Digital Lead", tower: "PBEL Sanskritik Samiti" },
      { id: "m-2", name: "Executive Committee Leads", role: "General Administration & Operations", tower: "PBEL Sanskritik Samiti" },
      { id: "m-3", name: "Senior Resident Mentors", role: "Vedic Rituals & Advisory Council", tower: "PBEL City Community" },
    ],
  },
  {
    id: "wing-finance",
    category: "Finance, Treasury & Audit Wing",
    icon: "💰",
    tagline: "Zero-fee bank reconciliation, verified contribution CRM & donor receipts",
    members: [
      { id: "m-4", name: "Finance & Accounts Lead", role: "Treasurer & Bank Accounts Lead", tower: "PBEL Sanskritik Samiti" },
      { id: "m-5", name: "Audit & Donor CRM Team", role: "Contribution Verification & Transparency", tower: "PBEL Sanskritik Samiti" },
    ],
  },
  {
    id: "wing-cultural",
    category: "Cultural Directorate & Pratibimb Stage",
    icon: "🎭",
    tagline: "Resident stage acts, rehearsals, drama, music bands & sound production",
    members: [
      { id: "m-6", name: "Cultural Committee Lead", role: "Pratibimb Stage Director", tower: "PBEL Sanskritik Samiti" },
      { id: "m-7", name: "Drama & Theater Wing", role: "Natok Production & Rehearsals", tower: "PBEL Sanskritik Samiti" },
      { id: "m-8", name: "Music, Dhaak & Sound Ops", role: "Audio Engineering & Dhaaki Troupe", tower: "PBEL Sanskritik Samiti" },
    ],
  },
  {
    id: "wing-bhog",
    category: "Maha Bhog, Kitchen Seva & Anandamela",
    icon: "🍚",
    tagline: "Pure ghee bhog preparation, dining passes & resident food stalls",
    members: [
      { id: "m-9", name: "Bhog Coordination Lead", role: "Maha Bhog Kitchen & Quality Control", tower: "PBEL Sanskritik Samiti" },
      { id: "m-10", name: "Anandamela Food Fiesta", role: "Home Chef Stalls & Culinary Fiesta", tower: "PBEL Sanskritik Samiti" },
      { id: "m-11", name: "Dining Hall & Operations", role: "Token Desk & Dining Hall Coordination", tower: "PBEL Sanskritik Samiti" },
    ],
  },
  {
    id: "wing-rituals",
    category: "Pandal, Pratima & Vedic Rituals",
    icon: "🌺",
    tagline: "Vedic rites, sacred samagri, 108 deepam, lighting & archway production",
    members: [
      { id: "m-12", name: "Pujo Samagri & Purohit Seva", role: "Vedic Rites & Havan Coordination", tower: "PBEL Sanskritik Samiti" },
      { id: "m-13", name: "Pandal & Lighting Production", role: "Pandal Architecture, LED Stage & Lighting", tower: "PBEL Sanskritik Samiti" },
      { id: "m-14", name: "Dhaaki Troupe Management", role: "Traditional Artistes Care & Logistics", tower: "PBEL Sanskritik Samiti" },
    ],
  },
  {
    id: "wing-crowd",
    category: "Crowd Discipline, Senior Seating & Volunteer Leads",
    icon: "🤝",
    tagline: "Resident crowd management, accessible senior citizen care & safety",
    members: [
      { id: "m-15", name: "Volunteer Operations Lead", role: "Resident Volunteer Scheduling", tower: "PBEL Sanskritik Samiti" },
      { id: "m-16", name: "Senior Citizen & First Aid", role: "Accessible Pandal Care & Medical Desk", tower: "PBEL Sanskritik Samiti" },
    ],
  },
];

export const COMMITTEE_STORAGE_KEY = "pbel_committee_wings";

/**
 * Retrieves the current organizing committee wings configuration from localStorage with default fallback.
 */
export function getStoredCommittee(): CommitteeWing[] {
  if (typeof window === "undefined") return DEFAULT_COMMITTEE_WINGS;
  try {
    const raw = localStorage.getItem(COMMITTEE_STORAGE_KEY);
    if (!raw) return DEFAULT_COMMITTEE_WINGS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_COMMITTEE_WINGS;
  } catch {
    return DEFAULT_COMMITTEE_WINGS;
  }
}

/**
 * Saves updated organizing committee wings configuration into localStorage and dispatches a live update event.
 */
export function saveStoredCommittee(wings: CommitteeWing[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(COMMITTEE_STORAGE_KEY, JSON.stringify(wings));
  window.dispatchEvent(new Event("pbel_committee_updated"));
}
