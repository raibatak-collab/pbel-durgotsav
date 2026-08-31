/**
 * PBEL City Durgotsav 2026 - Pujo Nirghanto & Pratibimb Cultural Stage Configuration
 * ---------------------------------------------------------------------------------
 * Full 6-Day Schedule (15th - 20th Oct 2026) covering Vedic rituals, Pushpanjali,
 * Maha Bhog feasts, Aarti, and evening cultural headliners.
 * Fully manageable in-place via Executive Admin Control Center with Supabase Cloud Sync.
 */

export interface RitualEvent {
  id?: string;
  time: string;
  event: string;
  type: "ritual" | "bhog" | "aarti" | "cultural";
  description?: string;
}

export interface FlagshipHeadliner {
  title: string;
  time: string;
  duration: string;
  genre: string;
}

export interface CulturalEvening {
  title: string;
  time: string;
  description: string;
  pssHeadliner?: FlagshipHeadliner;
  acts: string[];
  residentSlotsAvailable: number;
}

export interface DaySchedule {
  id: string;
  dayName: string;
  bengaliName: string;
  date: string;
  isoDate: string;
  theme: string;
  rituals: RitualEvent[];
  culturalEvening: CulturalEvening;
}

export const DEFAULT_PUJO_SCHEDULE: DaySchedule[] = [
  {
    id: "panchami",
    dayName: "Maha Panchami",
    bengaliName: "মহাপঞ্চমী",
    date: "15 Oct 2026",
    isoDate: "2026-10-15",
    theme: "Agomoni, Anandamela & Stage Inauguration",
    rituals: [
      { time: "05:30 PM", event: "Pandal Inauguration & Diya Lighting Ceremony", type: "ritual" },
      { time: "06:00 PM", event: "Anandamela Food Stalls (Resident Home Chefs)", type: "bhog" },
      { time: "07:00 PM", event: "Agomoni Songs & Dhaak Welcome Rhythm", type: "cultural" },
    ],
    culturalEvening: {
      title: "Agomoni Musical Night & Anandamela Gala",
      time: "07:00 PM - 09:30 PM",
      description: "Welcoming Maa Durga with heartfelt Agomoni songs, traditional Rabindra Sangeet, and resident food fiesta.",
      acts: ["Agomoni Choral Melodies", "Kids Anandamela Performance", "Opening Classical Dance Recital"],
      residentSlotsAvailable: 10,
    },
  },
  {
    id: "sashti",
    dayName: "Maha Sashti",
    bengaliName: "মহাষষ্ঠী",
    date: "16 Oct 2026",
    isoDate: "2026-10-16",
    theme: "Devi Bodhon & Retro Rock Gala",
    rituals: [
      { time: "08:30 AM", event: "Pratima Sthapana & Kalparambho", type: "ritual" },
      { time: "06:30 PM", event: "Devi Bodhon, Amantran & Adhibas Rituals", type: "ritual" },
      { time: "07:45 PM", event: "Grand Sandhya Aarti with Dhaak Beats", type: "aarti" },
      { time: "08:30 PM", event: "Prasad & Mishti Distribution", type: "bhog" },
    ],
    culturalEvening: {
      title: "Pratibimb Stage: Dance Extravaganza & Retro Rock",
      time: "06:30 PM - 10:30 PM",
      description: "Resident dance showcases followed by the electrifying flagship Retro Rock concert.",
      pssHeadliner: {
        title: "🎸 Retro Rock by Fushmontor",
        time: "08:15 PM Start",
        duration: "1.5 Hours (90 mins)",
        genre: "Live Bengali & Bollywood Retro Rock Fusion",
      },
      acts: ["Resident Opening Dance Medley (06:30 PM)", "Kids Dance & Vocals (07:15 PM)", "⭐ Retro Rock by Fushmontor (08:15 PM)"],
      residentSlotsAvailable: 8,
    },
  },
  {
    id: "saptami",
    dayName: "Maha Saptami",
    bengaliName: "মহাসপ্তমী",
    date: "17 Oct 2026",
    isoDate: "2026-10-17",
    theme: "Nabapatrika Pravesh & Dance Drama",
    rituals: [
      { time: "07:30 AM", event: "Nabapatrika (Kola Bou) Snan & Pravesh", type: "ritual" },
      { time: "10:30 AM", event: "Maha Saptami Pushpanjali (Batch 1 & 2)", type: "ritual" },
      { time: "01:00 PM", event: "Maha Bhog Distribution (Khichuri, Labra, Payesh)", type: "bhog" },
      { time: "07:00 PM", event: "Sandhya Aarti & Deepam Seva", type: "aarti" },
    ],
    culturalEvening: {
      title: "Pratibimb: Dance Drama & Musical Melodies",
      time: "06:30 PM - 10:30 PM",
      description: "Resident band performances followed by the signature PSS Dance Drama production.",
      pssHeadliner: {
        title: "💃 Dance Drama Production by PBEL Sanskritik Samiti",
        time: "07:45 PM Start",
        duration: "1.0 Hour (60 mins)",
        genre: "Thematic Bengali Cultural Dance Drama (Nritya Natya)",
      },
      acts: ["Resident Classical Vocals (06:30 PM)", "⭐ Dance Drama Production by PSS (07:45 PM)", "Township Acoustic Band Set (09:00 PM)"],
      residentSlotsAvailable: 8,
    },
  },
  {
    id: "ashtami",
    dayName: "Maha Ashtami",
    bengaliName: "মহাষ্টমী",
    date: "18 Oct 2026",
    isoDate: "2026-10-18",
    theme: "Sandhi Pujo & Grand Bangla Drama",
    rituals: [
      { time: "09:30 AM", event: "Maha Ashtami Pujo & Special Pushpanjali", type: "ritual" },
      { time: "11:30 AM", event: "Sacred Kumari Puja", type: "ritual" },
      { time: "01:30 PM", event: "Maha Bhog Feast for All Residents", type: "bhog" },
      { time: "04:15 PM", event: "Sandhi Pujo (Offering of 108 Lotuses & 108 Deepam)", type: "ritual" },
      { time: "07:30 PM", event: "Grand Maha Aarti & Dhunuchi Naach showcase", type: "aarti" },
    ],
    culturalEvening: {
      title: "Pratibimb: Grand Bangla Drama & Dhaak Jugalbandi",
      time: "06:30 PM - 11:00 PM",
      description: "The peak evening featuring Dhaak beats and the acclaimed annual PSS Bangla Natok.",
      pssHeadliner: {
        title: "🎭 Grand Bangla Theatrical Drama (Natok) by PSS",
        time: "07:45 PM Start",
        duration: "1.0 Hour (60 mins)",
        genre: "Full-Length Bengali Theatrical Play / Natok",
      },
      acts: ["Township Dhunuchi Dance Face-off (06:45 PM)", "⭐ Grand Bangla Drama by PSS (07:45 PM)", "Dhaak Jugalbandi Battle (09:15 PM)"],
      residentSlotsAvailable: 8,
    },
  },
  {
    id: "nabami",
    dayName: "Maha Nabami",
    bengaliName: "মহানবমী",
    date: "19 Oct 2026",
    isoDate: "2026-10-19",
    theme: "Maha Yajna & Grand Cultural Finale",
    rituals: [
      { time: "09:30 AM", event: "Maha Nabami Pujo & Pushpanjali", type: "ritual" },
      { time: "11:00 AM", event: "Maha Navami Maha Yajna & Havan", type: "ritual" },
      { time: "01:30 PM", event: "Special Navami Maha Bhog Feast", type: "bhog" },
      { time: "07:30 PM", event: "Maha Aarti & Dhunuchi Dance Competition", type: "aarti" },
    ],
    culturalEvening: {
      title: "Pratibimb: Cultural Grand Finale & Awards",
      time: "07:00 PM - 11:00 PM",
      description: "Resident awards ceremony, community talent grand finale, and festive dandiya/dhaak beats.",
      acts: ["Anandamela & Sports Prize Distribution", "Resident Talent Champions Encore", "Festive Garba & Dandiya Beats"],
      residentSlotsAvailable: 12,
    },
  },
  {
    id: "dashami",
    dayName: "Vijaya Dashami",
    bengaliName: "বিজয়াদশমী",
    date: "20 Oct 2026",
    isoDate: "2026-10-20",
    theme: "Sindoor Khela, Visarjan & Subho Bijoya",
    rituals: [
      { time: "09:00 AM", event: "Darpan Visarjan (Mirror Immersion Ceremony)", type: "ritual" },
      { time: "10:30 AM", event: "Devi Baran & Traditional Sindoor Khela", type: "ritual" },
      { time: "04:30 PM", event: "Maa Durga Visarjan Shobha Yatra (Procession)", type: "ritual" },
      { time: "08:00 PM", event: "Shanti Jal Sprinkling & Subho Bijoya Kolakoli", type: "ritual" },
    ],
    culturalEvening: {
      title: "Subho Bijoya Sammilani & Dhunuchi Master Finale",
      time: "06:30 PM - 09:30 PM",
      description: "Traditional blessings, sweet distribution, and celebrating the triumph of good over evil.",
      acts: ["Dhunuchi Master Showcase", "Subho Bijoya Choral Melodies", "Sweet & Mishti Sharing Gathering"],
      residentSlotsAvailable: 6,
    },
  },
];

export const SCHEDULE_STORAGE_KEY = "pbel_pujo_schedule";

/**
 * Converts formatted time strings like "08:30 AM", "01:00 PM" into total minutes from midnight for accurate chronological sorting.
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 9999;
  const clean = timeStr.trim().toUpperCase();
  const match = clean.match(/(\d+):(\d+)\s*(AM|PM)?/);
  if (!match) return 9999;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3] || (clean.includes("PM") ? "PM" : "AM");

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Sorts ritual events strictly in chronological order by time.
 */
export function sortRitualsByTime(rituals: RitualEvent[]): RitualEvent[] {
  return [...rituals].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
}

/**
 * Normalizes full 6-day DaySchedule ensuring each day has chronologically sorted rituals.
 */
export function normalizeSchedule(schedule: DaySchedule[]): DaySchedule[] {
  return schedule.map((day) => ({
    ...day,
    rituals: sortRitualsByTime(day.rituals || []),
  }));
}

/**
 * Retrieves the current schedule configuration from localStorage with default fallback.
 */
export function getStoredSchedule(): DaySchedule[] {
  if (typeof window === "undefined") return normalizeSchedule(DEFAULT_PUJO_SCHEDULE);
  try {
    const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!raw) return normalizeSchedule(DEFAULT_PUJO_SCHEDULE);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? normalizeSchedule(parsed) : normalizeSchedule(DEFAULT_PUJO_SCHEDULE);
  } catch {
    return normalizeSchedule(DEFAULT_PUJO_SCHEDULE);
  }
}

/**
 * Async fetch from Supabase Cloud with fallback to local/default.
 */
export async function fetchStoredSchedule(): Promise<DaySchedule[]> {
  try {
    const { fetchCloudConfig } = await import("@/utils/cloudConfig");
    const cloudSchedule = await fetchCloudConfig<DaySchedule[]>("schedule_days", []);
    if (Array.isArray(cloudSchedule) && cloudSchedule.length > 0) {
      const normalized = normalizeSchedule(cloudSchedule);
      if (typeof window !== "undefined") {
        localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(normalized));
        window.dispatchEvent(new Event("pbel_schedule_updated"));
      }
      return normalized;
    }
  } catch (e) {
    console.error("Failed fetching schedule from cloud:", e);
  }
  return getStoredSchedule();
}

/**
 * Saves updated schedule configuration into localStorage and syncs to Supabase Cloud.
 */
export async function saveStoredSchedule(schedule: DaySchedule[]): Promise<void> {
  const normalized = normalizeSchedule(schedule);
  if (typeof window !== "undefined") {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new Event("pbel_schedule_updated"));
  }

  // Cloud Sync to Supabase
  try {
    const { saveCloudConfig } = await import("@/utils/cloudConfig");
    await saveCloudConfig("schedule_days", normalized);
  } catch (err) {
    console.error("Cloud schedule save failed:", err);
  }
}
