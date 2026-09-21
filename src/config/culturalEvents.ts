/**
 * PBEL City Durgotsav 2026 - Cultural Competitions & Event Registrations
 * -----------------------------------------------------------------------
 * Covers:
 * 1. Flash Mob (Open resident dance)
 * 2. Mini Kumartuli (10 teams max, 3 members each)
 * 3. Sit and Draw "Indradhanush" (120 total entries across 3 age groups)
 * 4. Junior Discovery Quiz (6 teams max, 5 members each, Grade 4-10)
 * 5. Dhunuchi Jugalbandi (10 Groups max, Duet Dhunuchi Dance, Saree & Dhoti/Kurta compulsory)
 *
 * Cloud persisted and dynamically toggleable via Admin Control Center.
 */

import { fetchCloudConfig, saveCloudConfig } from "@/utils/cloudConfig";

export type CulturalEventId =
  | "flash_mob"
  | "mini_kumartuli"
  | "sit_and_draw"
  | "junior_quiz"
  | "duet_dhunuchi";

export type EventStatus = "open" | "coming_soon" | "closed";

export interface CulturalEventConfig {
  id: CulturalEventId;
  title: string;
  subtitle: string;
  day: string;
  time: string;
  location: string;
  maxLimit: number;
  teamSize: number; // 1 = individual, > 1 = team
  minTeamSize?: number;
  gradeEligibility?: string;
  categories?: { id: string; name: string; gradeRange: string }[];
  dressCode?: string;
  rules: string[];
  isOpen: boolean;
  isVisible: boolean;
  status: EventStatus;
}

export interface TeamMember {
  name: string;
  age?: number | string;
  grade?: string;
}

export interface CulturalRegistrationEntry {
  id: string;
  eventId: CulturalEventId;
  eventTitle: string;
  registeredAt: string;
  contactName: string; // Captain / Parent / Primary participant
  phone: string;
  tower: string;
  flat: string;
  teamName?: string;
  category?: string; // For Sit and Draw (Group 1, 2, 3)
  grade?: string; // For Quiz / Sit and Draw
  ageGroup?: string; // For Flash Mob
  members?: TeamMember[];
  dressCodeConfirmed?: boolean; // For Dhunuchi Jugalbandi
  notes?: string;
  status?: "confirmed" | "waitlist" | "cancelled";
}

export const DEFAULT_CULTURAL_EVENTS: CulturalEventConfig[] = [
  {
    id: "sit_and_draw",
    title: 'Sit & Draw Competition "Indradhanush"',
    subtitle: "Flagship Inter-Tower Children & Youth Art Contest",
    day: "Maha Panchami • 15 Oct 2026 (Thu)",
    time: "10:00 AM - 12:15 PM",
    location: "PSS Community Hall & Activity Arena",
    maxLimit: 120,
    teamSize: 1,
    gradeEligibility: "Nursery up to Grade 10",
    categories: [
      { id: "group_1", name: "Group 1", gradeRange: "Up to Grade 1 (Nursery - 1st)" },
      { id: "group_2", name: "Group 2", gradeRange: "Grade 2 - Grade 5" },
      { id: "group_3", name: "Group 3", gradeRange: "Grade 6 - Grade 10" },
    ],
    rules: [
      "Total capacity is capped at 120 entries across all groups.",
      "Drawing sheets will be provided by PSS. Please bring your own drawing board, pencils, and colors (crayons/pastels/watercolors).",
      "Themes will be announced at 10:00 AM sharp at the venue.",
    ],
    isOpen: true,
    isVisible: true,
    status: "open",
  },
  {
    id: "junior_quiz",
    title: "Junior Discovery Quiz",
    subtitle: "The Ultimate Inter-Tower Battle of Wits & Knowledge",
    day: "Maha Saptami • 17 Oct 2026 (Sat)",
    time: "10:30 AM - 12:30 PM",
    location: "Main Pandal Cultural Stage / Arena",
    maxLimit: 6,
    teamSize: 5,
    gradeEligibility: "Grade 4 to Grade 10",
    rules: [
      "Strictly capped at 6 teams on a first-come, first-registered basis.",
      "Each team must consist of exactly 5 members studying in Grades 4 to 10.",
      "Rounds cover Indian Culture, Bengali Heritage, Science, Literature, and Current Affairs.",
    ],
    isOpen: true,
    isVisible: true,
    status: "open",
  },
  {
    id: "mini_kumartuli",
    title: "Mini Kumartuli - Kids Clay Idol Sculpting",
    subtitle: "Hands-on Clay Crafting & Traditional Idol Making Workshop",
    day: "Maha Navami • 19 Oct 2026 (Mon)",
    time: "11:00 AM - 12:00 PM",
    location: "PSS Creative Craft Workshop Pavillion",
    maxLimit: 10,
    teamSize: 3,
    gradeEligibility: "Children & Teens (Ages 6 - 16)",
    rules: [
      "Capped at 10 teams maximum.",
      "Each team must comprise exactly 3 participants.",
      "Eco-friendly Ganga clay, wooden support bases, and basic sculpting sticks will be provided by PSS.",
    ],
    isOpen: true,
    isVisible: true,
    status: "open",
  },
  {
    id: "duet_dhunuchi",
    title: "Dhunuchi Jugalbandi (Duet Dhunuchi Competition)",
    subtitle: "A Grand Synchronized Devotional Dance Face-off in Traditional Attire",
    day: "Maha Navami • 19 Oct 2026 (Mon)",
    time: "07:00 PM - 07:15 PM",
    location: "Main Stage Arena & Pandal Courtyard",
    maxLimit: 10,
    teamSize: 2,
    dressCode: "Saree and Dhoti/Pyjama Kurta compulsory",
    rules: [
      "Strictly 10 Groups (Pairs / Duos) max.",
      "Both participants in each group must perform synchronized rhythmic Dhunuchi dance to traditional Dhaak beats.",
      "Dress code is strictly COMPULSORY: Traditional Saree and Dhoti / Pyjama Kurta.",
    ],
    isOpen: true,
    isVisible: true,
    status: "open",
  },
  {
    id: "flash_mob",
    title: "Durga Pujo Flash Mob",
    subtitle: "High-Energy Festive Surprise Dance for Township Residents",
    day: "Pre-Pujo & Anandamela Gala",
    time: "Rehearsals: Weekend Evenings • Showcase: Anandamela",
    location: "PBEL City Central Arena",
    maxLimit: 60,
    teamSize: 1,
    gradeEligibility: "Open to Kids, Teens & Adults",
    rules: [
      "Open participation for all energetic PBEL City residents.",
      "Choreography will be taught during evening rehearsals at the amphitheater.",
      "Costume coordination will be shared with the registered group on WhatsApp.",
    ],
    isOpen: true,
    isVisible: true,
    status: "open",
  },
];

export const CULTURAL_EVENTS_CONFIG_KEY = "cultural_events";
export const CULTURAL_REGISTRATIONS_KEY = "cultural_event_registrations";
export const CULTURAL_EVENTS_STORAGE_KEY = "pbel_cultural_events_config";
export const CULTURAL_REGISTRATIONS_STORAGE_KEY = "pbel_cultural_event_registrations";

/**
 * Returns locally cached or default cultural events configuration.
 */
export function getStoredCulturalEvents(): CulturalEventConfig[] {
  if (typeof window === "undefined") return DEFAULT_CULTURAL_EVENTS;
  try {
    const cached = localStorage.getItem(CULTURAL_EVENTS_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with defaults to ensure all 5 events are present
        return DEFAULT_CULTURAL_EVENTS.map((def) => {
          const matched = parsed.find((p) => p.id === def.id);
          return matched ? { ...def, ...matched } : def;
        });
      }
    }
  } catch (_) {}
  return DEFAULT_CULTURAL_EVENTS;
}

/**
 * Fetches dynamic cultural events configuration from cloud.
 */
export async function fetchStoredCulturalEvents(): Promise<CulturalEventConfig[]> {
  try {
    const cloud = await fetchCloudConfig<CulturalEventConfig[]>(
      CULTURAL_EVENTS_CONFIG_KEY,
      DEFAULT_CULTURAL_EVENTS
    );
    if (Array.isArray(cloud) && cloud.length > 0) {
      const merged = DEFAULT_CULTURAL_EVENTS.map((def) => {
        const matched = cloud.find((c) => c.id === def.id);
        return matched ? { ...def, ...matched } : def;
      });
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(CULTURAL_EVENTS_STORAGE_KEY, JSON.stringify(merged));
        } catch (_) {}
      }
      return merged;
    }
  } catch (err) {
    console.error("Error fetching cultural events config:", err);
  }
  return getStoredCulturalEvents();
}

/**
 * Saves cultural events configuration to cloud and triggers local update event.
 */
export async function saveStoredCulturalEvents(events: CulturalEventConfig[]): Promise<boolean> {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CULTURAL_EVENTS_STORAGE_KEY, JSON.stringify(events));
      window.dispatchEvent(new Event("pbel_cultural_events_updated"));
    } catch (_) {}
  }
  return await saveCloudConfig(CULTURAL_EVENTS_CONFIG_KEY, events);
}

/**
 * Returns locally cached cultural registrations.
 */
export function getStoredCulturalRegistrations(): CulturalRegistrationEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const cached = localStorage.getItem(CULTURAL_REGISTRATIONS_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) {}
  return [];
}

/**
 * Fetches all registered cultural participants from cloud.
 */
export async function fetchStoredCulturalRegistrations(): Promise<CulturalRegistrationEntry[]> {
  try {
    const cloud = await fetchCloudConfig<CulturalRegistrationEntry[]>(
      CULTURAL_REGISTRATIONS_KEY,
      []
    );
    if (Array.isArray(cloud)) {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(CULTURAL_REGISTRATIONS_STORAGE_KEY, JSON.stringify(cloud));
        } catch (_) {}
      }
      return cloud;
    }
  } catch (err) {
    console.error("Error fetching cultural registrations:", err);
  }
  return getStoredCulturalRegistrations();
}

/**
 * Adds a new registration entry, checks capacity, and persists to cloud.
 */
export async function submitCulturalRegistration(
  entry: Omit<CulturalRegistrationEntry, "id" | "registeredAt">
): Promise<{ success: boolean; message?: string; registration?: CulturalRegistrationEntry }> {
  try {
    // 1. Fetch live events config and existing entries
    const [events, currentRegistrations] = await Promise.all([
      fetchStoredCulturalEvents(),
      fetchStoredCulturalRegistrations(),
    ]);

    const targetEvent = events.find((e) => e.id === entry.eventId);
    if (!targetEvent) {
      return { success: false, message: "Event not found or invalid." };
    }

    if (!targetEvent.isOpen || targetEvent.status === "closed") {
      return { success: false, message: `Registrations for ${targetEvent.title} are currently closed.` };
    }

    // 2. Check capacity
    const activeEntriesForEvent = currentRegistrations.filter(
      (r) => r.eventId === entry.eventId && r.status !== "cancelled"
    );

    if (activeEntriesForEvent.length >= targetEvent.maxLimit) {
      return {
        success: false,
        message: `Registrations are full! All ${targetEvent.maxLimit} slots have been reserved for ${targetEvent.title}.`,
      };
    }

    // 3. Build new entry
    const newEntry: CulturalRegistrationEntry = {
      ...entry,
      id: "cult-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      registeredAt: new Date().toISOString(),
      status: "confirmed",
    };

    const updatedRegistrations = [newEntry, ...currentRegistrations];

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          CULTURAL_REGISTRATIONS_STORAGE_KEY,
          JSON.stringify(updatedRegistrations)
        );
        window.dispatchEvent(new Event("pbel_cultural_registrations_updated"));
      } catch (_) {}
    }

    const saved = await saveCloudConfig(CULTURAL_REGISTRATIONS_KEY, updatedRegistrations);
    if (!saved) {
      console.warn("Could not immediately sync registration to cloud; cached locally.");
    }

    return { success: true, registration: newEntry };
  } catch (err) {
    console.error("Error submitting cultural registration:", err);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}
