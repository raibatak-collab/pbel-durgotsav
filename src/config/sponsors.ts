import { fetchCloudConfig, saveCloudConfig } from "@/utils/cloudConfig";

export interface SponsorshipTier {
  id: string;
  title: string;
  amount: string;
  numericAmount?: number;
  tag: string;
  isHighlight: boolean;
  deliverables: string[];
  orderIndex?: number;
}

export const DEFAULT_SPONSORSHIP_TIERS: SponsorshipTier[] = [
  {
    id: "platinum",
    title: "Title / Platinum Partner",
    amount: "₹1,00,000",
    numericAmount: 100000,
    tag: "Maximum Brand Dominance",
    isHighlight: true,
    deliverables: [
      "Exclusive Prime Stage LED Backdrop Branding",
      "Grand Pandal Entrance Archway Branding",
      "Prime Anandamela Stall Space (Panchami Evening)",
      "Daily Emcee Live Announcements during Pratibimb",
      "Prominent Logo on Homepage & Digital Carousel",
      "Full Page Color Ad in Pujo Souvenir Brochure",
    ],
  },
  {
    id: "gold",
    title: "Gold Partner",
    amount: "₹50,000",
    numericAmount: 50000,
    tag: "High Visibility",
    isHighlight: false,
    deliverables: [
      "Stage Side Panels & Pandal Entry Branding",
      "Dedicated Food / Promotional Stall Space",
      "Daily Emcee Verbal Brand Mention",
      "Logo on Official Website & Carousel",
      "Half Page Color Ad in Pujo Souvenir Brochure",
      "WhatsApp Broadcast Inclusion to 1,500+ Families",
    ],
  },
  {
    id: "cultural",
    title: "Cultural Stage Partner",
    amount: "₹40,000",
    numericAmount: 40000,
    tag: "Pratibimb Stage Sponsor",
    isHighlight: false,
    deliverables: [
      "Stage Backdrop Branding during 5 Evening Shows",
      "Logo during Fushmontor, Dance Drama & Natok",
      "Emcee Stage Acknowledgements",
      "Promotional Standees in Auditoria / Seating Area",
      "Logo on Cultural Schedule & Website",
    ],
  },
  {
    id: "food_bhog",
    title: "Food & Bhog Partner",
    amount: "₹35,000",
    numericAmount: 35000,
    tag: "Direct Family Goodwill",
    isHighlight: false,
    deliverables: [
      "Exclusive Branding at Daily Bhog Counters (1,500+ daily meals)",
      "Anandamela Food Stall Space (Panchami Evening)",
      "Logo on Bhog Token Cards & Website",
      "Banner Placement in Dining & Cafeteria Hall",
    ],
  },
  {
    id: "silver",
    title: "Silver Partner",
    amount: "₹25,000",
    numericAmount: 25000,
    tag: "Township Reach",
    isHighlight: false,
    deliverables: [
      "Pandal Perimeter Standee & Banner Placement",
      "Logo Listing on Official Website",
      "Quarter Page Ad in Souvenir Brochure",
      "Township WhatsApp Group Inclusion",
    ],
  },
];

const STORAGE_KEY = "pbel_sponsorship_tiers";
const CLOUD_KEY = "sponsorship_tiers";

export function getStoredSponsorshipTiers(): SponsorshipTier[] {
  if (typeof window === "undefined") return DEFAULT_SPONSORSHIP_TIERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SPONSORSHIP_TIERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SPONSORSHIP_TIERS;
  } catch (_) {
    return DEFAULT_SPONSORSHIP_TIERS;
  }
}

export async function fetchStoredSponsorshipTiers(): Promise<SponsorshipTier[]> {
  try {
    const cloud = await fetchCloudConfig<SponsorshipTier[]>(CLOUD_KEY, DEFAULT_SPONSORSHIP_TIERS);
    if (cloud && Array.isArray(cloud) && cloud.length > 0) {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloud));
      }
      return cloud;
    }
    return getStoredSponsorshipTiers();
  } catch (err) {
    console.error("Error fetching sponsorship tiers from cloud:", err);
    return getStoredSponsorshipTiers();
  }
}

export async function saveStoredSponsorshipTiers(tiers: SponsorshipTier[]): Promise<boolean> {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tiers));
    window.dispatchEvent(new Event("pbel_sponsorship_tiers_updated"));
  }
  return await saveCloudConfig(CLOUD_KEY, tiers);
}
