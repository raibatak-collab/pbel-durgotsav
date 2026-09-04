/**
 * PBEL City Durgotsav 2026 - Official Photo & Video Gallery Configuration
 */

export interface GalleryPhoto {
  id: string;
  title: string;
  year: string;
  category: string;
  emoji: string;
  imageUrl?: string;
  image_url?: string;
  bgGradient?: string;
}

export interface GalleryVideo {
  id: string;
  title: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  category: string;
  year: string;
  description?: string;
  dateAdded?: string;
}

export const DEFAULT_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "1",
    title: "Maa Durga Pratima Darshan",
    year: "2025",
    category: "Traditional Ekchala Idol",
    emoji: "🌺",
    bgGradient: "from-[#850E1F]/85 via-[#610815]/90 to-[#2A0208]/95",
  },
  {
    id: "2",
    title: "Sandhi Pujo 108 Deepam & Dhaak",
    year: "2025",
    category: "Maha Ashtami Aarti",
    emoji: "🪔",
    bgGradient: "from-[#D99B26]/85 via-[#B8801C]/90 to-[#6E4907]/95",
  },
  {
    id: "3",
    title: "Pratibimb Cultural Stage Gala",
    year: "2025",
    category: "Dance & Drama Natok",
    emoji: "🎭",
    bgGradient: "from-[#850E1F]/85 via-[#4A000E]/90 to-[#1F0005]/95",
  },
  {
    id: "4",
    title: "Sindoor Khela & Dhunuchi Naach",
    year: "2025",
    category: "Vijaya Dashami Farewell",
    emoji: "🔴",
    bgGradient: "from-[#B81932]/85 via-[#850E1F]/90 to-[#3B0009]/95",
  },
  {
    id: "5",
    title: "Anandamela Food Fiesta",
    year: "2024",
    category: "Home Chef Delicacies",
    emoji: "🍲",
    bgGradient: "from-[#D99B26]/80 via-[#966714]/90 to-[#472E04]/95",
  },
  {
    id: "6",
    title: "Maha Bhog Community Feast",
    year: "2024",
    category: "1,500+ Resident Seva",
    emoji: "🍚",
    bgGradient: "from-[#850E1F]/85 via-[#5C0512]/90 to-[#290208]/95",
  },
];

export const DEFAULT_GALLERY_VIDEOS: GalleryVideo[] = [];

/**
 * Robust YouTube video ID parser supporting all standard formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - Direct 11-character video ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const clean = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
  
  const match = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match ? match[1] : null;
}

export const GALLERY_PHOTOS_STORAGE_KEY = "pbel_custom_gallery";
export const GALLERY_VIDEOS_STORAGE_KEY = "pbel_custom_gallery_videos";

export function getStoredGalleryVideos(): GalleryVideo[] {
  if (typeof window === "undefined") return DEFAULT_GALLERY_VIDEOS;
  try {
    const raw = localStorage.getItem(GALLERY_VIDEOS_STORAGE_KEY);
    if (!raw) return DEFAULT_GALLERY_VIDEOS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_GALLERY_VIDEOS;
  } catch {
    return DEFAULT_GALLERY_VIDEOS;
  }
}

export function saveStoredGalleryVideos(videos: GalleryVideo[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GALLERY_VIDEOS_STORAGE_KEY, JSON.stringify(videos));
    window.dispatchEvent(new Event("pbel_gallery_videos_updated"));
  } catch (e) {
    console.error("Failed to save gallery videos locally:", e);
  }
}

export async function fetchStoredGalleryVideos(): Promise<GalleryVideo[]> {
  try {
    const { fetchCloudConfig } = await import("@/utils/cloudConfig");
    const cloudVideos = await fetchCloudConfig<GalleryVideo[]>("gallery_videos", []);
    if (Array.isArray(cloudVideos) && cloudVideos.length > 0) {
      if (typeof window !== "undefined") {
        localStorage.setItem(GALLERY_VIDEOS_STORAGE_KEY, JSON.stringify(cloudVideos));
        window.dispatchEvent(new Event("pbel_gallery_videos_updated"));
      }
      return cloudVideos;
    }
  } catch (e) {
    console.error("Failed to fetch gallery videos from cloud:", e);
  }
  return getStoredGalleryVideos();
}
