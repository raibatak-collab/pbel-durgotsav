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
    url: "https://images.unsplash.com/photo-1601614275039-4d693582be6c?auto=format&fit=crop&w=1920&q=85",
    previewUrl: "https://images.unsplash.com/photo-1601614275039-4d693582be6c?auto=format&fit=crop&w=400&q=75",
    overlayOpacity: "bg-black/60",
  },
  {
    id: "sandhi-deepam-aarti",
    title: "108 Sandhi Deepam & Dhunuchi Aarti",
    tagline: "Golden Glow of 108 Sacred Diyas & Burning Dhunuchi",
    url: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1920&q=85",
    previewUrl: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=400&q=75",
    overlayOpacity: "bg-black/65",
  },
  {
    id: "kumartuli-clay-art",
    title: "Kumartuli Pure Clay Heritage",
    tagline: "Artisans Sculpting the Divine Mother in Ganga Clay",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=85",
    previewUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=75",
    overlayOpacity: "bg-black/55",
  },
  {
    id: "festive-marigold-crimson",
    title: "Festive Crimson & Marigold Sanctum",
    tagline: "Traditional Pandal Red Velvet & Fresh Marigold Garland",
    url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1920&q=85",
    previewUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=75",
    overlayOpacity: "bg-black/60",
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
  sponsorshipDeckPdfUrl: "/PBEL_City_Durgotsav_2026_Sponsorship_Deck.pdf",
  sponsorshipDeckFileName: "PBEL_City_Durgotsav_2026_Sponsorship_Deck.pdf",
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
 * Saves updated branding configuration into localStorage and dispatches a live update event.
 */
export function saveStoredBranding(config: SamitiBrandingConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new Event("pbel_branding_updated"));
}
