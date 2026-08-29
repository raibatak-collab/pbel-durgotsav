/**
 * PBEL City Durgotsav 2026 - Central Branding & Aesthetic Asset Config
 * Self-Service First: All logos, hero backdrops, and PDF links can be overridden directly from Admin.
 */

export interface AestheticWallpaper {
  id: string;
  title: string;
  tagline: string;
  url: string;
  previewUrl: string;
  overlayOpacity: string; // e.g. "bg-black/40"
}

export const AESTHETIC_WALLPAPERS: AestheticWallpaper[] = [
  {
    id: "traditional-ekchala",
    title: "Maa Durga Ekchala Pratima",
    tagline: "Divine Traditional Ekchala with Golden Sholar Saaj & Trinetra",
    url: "/images/wallpapers/durga_ekchala.svg",
    previewUrl: "/images/wallpapers/durga_ekchala.svg",
    overlayOpacity: "bg-black/50",
  },
  {
    id: "sandhi-deepam-aarti",
    title: "108 Sandhi Deepam & Dhunuchi Aarti",
    tagline: "Golden Glow of 108 Sacred Diyas & Burning Dhunuchi",
    url: "/images/wallpapers/durga_sandhi_deepam.svg",
    previewUrl: "/images/wallpapers/durga_sandhi_deepam.svg",
    overlayOpacity: "bg-black/45",
  },
  {
    id: "kumartuli-clay-art",
    title: "Kumartuli Pure Clay Heritage",
    tagline: "Artisans Sculpting the Divine Mother in Ganga Clay",
    url: "/images/wallpapers/durga_kumartuli.svg",
    previewUrl: "/images/wallpapers/durga_kumartuli.svg",
    overlayOpacity: "bg-black/45",
  },
  {
    id: "festive-marigold-crimson",
    title: "Festive Crimson & Marigold Sanctum",
    tagline: "Traditional Pandal Red Velvet & Fresh Marigold Garland",
    url: "/images/wallpapers/durga_festive_mandala.svg",
    previewUrl: "/images/wallpapers/durga_festive_mandala.svg",
    overlayOpacity: "bg-black/50",
  },
];

export interface SamitiBrandingConfig {
  samitiName: string;
  festivalName: string;
  tagline: string;
  pssLogoUrl: string;
  durgotsavLogoUrl: string;
  activeHeroWallpaperId: string;
  customWallpaperUrl?: string;
  sponsorshipDeckPdfUrl: string;
  sponsorshipDeckFileName: string;
}

export const DEFAULT_BRANDING: SamitiBrandingConfig = {
  samitiName: "PBEL Sanskritik Samiti",
  festivalName: "PBEL City Durgotsav 2026",
  tagline: "Joy Maa Durga • 15th to 20th October (Panchami to Dashami)",
  pssLogoUrl: "", // Admin can upload or provide URL
  durgotsavLogoUrl: "", // Admin can upload or provide URL
  activeHeroWallpaperId: "traditional-ekchala",
  customWallpaperUrl: "",
  sponsorshipDeckPdfUrl: "/docs/PBEL_Durgotsav_2026_Sponsorship_Deck.pdf",
  sponsorshipDeckFileName: "PBEL_Durgotsav_2026_Sponsorship_Deck.pdf",
};

export const BRANDING_STORAGE_KEY = "pbel_branding_config";

/**
 * Retrieves the current branding configuration from localStorage with default fallback.
 */
export function getStoredBranding(): SamitiBrandingConfig {
  if (typeof window === "undefined") return DEFAULT_BRANDING;
  try {
    const raw = localStorage.getItem(BRANDING_STORAGE_KEY);
    if (!raw) return DEFAULT_BRANDING;
    return { ...DEFAULT_BRANDING, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_BRANDING;
  }
}

/**
 * Async fetch from Supabase Cloud with fallback to local/default.
 */
export async function fetchStoredBranding(): Promise<SamitiBrandingConfig> {
  try {
    const { fetchCloudConfig } = await import("@/utils/cloudConfig");
    const cloudBranding = await fetchCloudConfig<SamitiBrandingConfig | null>("branding", null);
    if (cloudBranding && typeof cloudBranding === "object") {
      const merged = { ...DEFAULT_BRANDING, ...cloudBranding };
      if (typeof window !== "undefined") {
        localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(new Event("pbel_branding_updated"));
      }
      return merged;
    }
  } catch (e) {
    console.error("Failed fetching branding from cloud:", e);
  }
  return getStoredBranding();
}

/**
 * Saves updated branding configuration into localStorage and syncs to Supabase Cloud.
 */
export function saveStoredBranding(config: SamitiBrandingConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new Event("pbel_branding_updated"));

  // Background Cloud Sync to Supabase
  import("@/utils/cloudConfig").then(({ saveCloudConfig }) => {
    saveCloudConfig("branding", config).catch((err) => console.error("Cloud branding save failed:", err));
  });
}

