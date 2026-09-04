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
      { id: "m-1", name: "Kalyan Ghosh", role: "President", tower: "PBEL Sanskritik Samiti" },
      { id: "m-2", name: "Indranil Pal", role: "General Secretary", tower: "PBEL Sanskritik Samiti" },
      { id: "m-3", name: "Archita Das", role: "Joint General Secretary", tower: "PBEL City Community" },
    ],
  },
  {
    id: "wing-finance",
    category: "Finance, Treasury & Audit Wing",
    icon: "💰",
    tagline: "Zero-fee bank reconciliation, verified contribution CRM & donor receipts",
    members: [
      { id: "m-4", name: "Snehasis Bose", role: "Treasurer & Bank Accounts Lead", tower: "PBEL Sanskritik Samiti" },
      { id: "m-5", name: "Sharmili", role: "Joint Treasurer", tower: "PBEL Sanskritik Samiti" },
      { id: "m-1788531842301", name: "Partho Pratim Mukherjee", role: "Sponsorship Lead", tower: "PBEL Sanskritik Samiti" },
      { id: "m-1788532006435", name: "Debashish", role: "Executive member", tower: "PBEL Sanskritik Samiti" },
    ],
  },
  {
    id: "wing-cultural",
    category: "Cultural Directorate & Pratibimb Stage",
    icon: "🎭",
    tagline: "Resident stage acts, rehearsals, drama, music bands & sound production",
    members: [
      { id: "m-6", name: "Raibatak Chatterjee", role: "Cultural Committee Lead", tower: "PBEL Sanskritik Samiti" },
      { id: "m-7", name: "Santanu Chatterjee", role: "Natok Production & Rehearsals", tower: "PBEL Sanskritik Samiti" },
      { id: "m-8", name: "Music, & Sound Ops", role: "Saptarshi Pathak", tower: "PBEL Sanskritik Samiti" },
      { id: "m-1788531826894", name: "Alokparna Bhattacharya", role: "Dance Drama Production", tower: "PBEL Sanskritik Samiti" },
    ],
  },
  {
    id: "wing-bhog",
    category: "Maha Bhog, Kitchen Seva & Anandamela",
    icon: "🍚",
    tagline: "Pure ghee bhog preparation, dining passes & resident food stalls",
    members: [
      { id: "m-9", name: "Kalyan Ghosh", role: "Maha Bhog Kitchen & Quality Control", tower: "PBEL Sanskritik Samiti" },
      { id: "m-11", name: "Dining Hall & Operations", role: "Token Desk & Dining Hall Coordination", tower: "PBEL Sanskritik Samiti" },
    ],
  },
  {
    id: "wing-rituals",
    category: "Pandal, Pratima & Vedic Rituals",
    icon: "🌺",
    tagline: "Vedic rites, sacred samagri, 108 deepam, lighting & archway production",
    members: [
      { id: "m-12", name: "Amitabh Bose", role: "Pujo Lead", tower: "PBEL Sanskritik Samiti" },
      { id: "m-13", name: "Sharmiili", role: "Pandal & Decoration", tower: "PBEL Sanskritik Samiti" },
    ],
  },
  {
    id: "wing-crowd",
    category: "Operations and Logistics",
    icon: "🤝",
    tagline: "Festival execution, infrastructure & logistics coordination",
    members: [
      { id: "m-15", name: "Roopan", role: "Operations Lead", tower: "PBEL Sanskritik Samiti" },
      { id: "m-16", name: "Dibyendu Chatterjee", role: "Executive member", tower: "PBEL Sanskritik Samiti" },
    ],
  },
  {
    id: "wing-1788532031282",
    category: "Communications",
    icon: "📢",
    tagline: "Resident outreach, broadcast notices & digital communication",
    members: [
      { id: "m-1788532048476", name: "Kathakali Roy", role: "Communications Lead", tower: "PBEL Sanskritik Samiti" },
      { id: "m-1788532068201", name: "Anamika", role: "Joint Communication Lead", tower: "PBEL Sanskritik Samiti" },
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
 * Async fetch from Supabase Cloud with fallback to local/default.
 */
export async function fetchStoredCommittee(): Promise<CommitteeWing[]> {
  try {
    const { fetchCloudConfig } = await import("@/utils/cloudConfig");
    const cloudCommittee = await fetchCloudConfig<CommitteeWing[]>("committee", []);
    if (Array.isArray(cloudCommittee) && cloudCommittee.length > 0) {
      if (typeof window !== "undefined") {
        localStorage.setItem(COMMITTEE_STORAGE_KEY, JSON.stringify(cloudCommittee));
        window.dispatchEvent(new Event("pbel_committee_updated"));
      }
      return cloudCommittee;
    }
  } catch (e) {
    console.error("Failed fetching committee from cloud:", e);
  }
  return getStoredCommittee();
}

/**
 * Saves updated organizing committee wings configuration into localStorage and syncs to Supabase Cloud.
 */
export function saveStoredCommittee(wings: CommitteeWing[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(COMMITTEE_STORAGE_KEY, JSON.stringify(wings));
  window.dispatchEvent(new Event("pbel_committee_updated"));

  // Background Cloud Sync to Supabase
  import("@/utils/cloudConfig").then(({ saveCloudConfig }) => {
    saveCloudConfig("committee", wings).catch((err) => console.error("Cloud committee save failed:", err));
  });
}

