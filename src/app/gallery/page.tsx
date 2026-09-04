"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  Play, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2, 
  Calendar, 
  Filter, 
  HeartHandshake, 
  Music, 
  Share2 
} from "lucide-react";
import { 
  GalleryPhoto, 
  GalleryVideo, 
  DEFAULT_GALLERY_PHOTOS, 
  extractYouTubeVideoId, 
  getStoredGalleryVideos, 
  fetchStoredGalleryVideos 
} from "@/config/gallery";
import { getStoredBranding, fetchStoredBranding, DEFAULT_BRANDING, SamitiBrandingConfig } from "@/config/branding";
import { fetchCloudConfig } from "@/utils/cloudConfig";

const PHOTO_CATEGORIES = [
  "All Moments",
  "Traditional Ekchala Idol",
  "Maha Ashtami Aarti",
  "Dance & Drama Natok",
  "Vijaya Dashami Farewell",
  "Home Chef Delicacies",
  "1,500+ Resident Seva",
];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [photos, setPhotos] = useState<GalleryPhoto[]>(DEFAULT_GALLERY_PHOTOS);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [branding, setBranding] = useState<SamitiBrandingConfig>(DEFAULT_BRANDING);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Moments");
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Load photos, videos and branding
  useEffect(() => {
    try {
      // 1. Branding
      setBranding(getStoredBranding());
      fetchStoredBranding().then((b) => {
        if (b) setBranding(b);
      });

      // 2. Photos (local + cloud)
      const savedPhotos = localStorage.getItem("pbel_custom_gallery");
      if (savedPhotos) {
        try {
          const parsed = JSON.parse(savedPhotos);
          if (Array.isArray(parsed) && parsed.length > 0) setPhotos(parsed);
        } catch (_) {}
      }

      fetchCloudConfig<GalleryPhoto[]>("gallery", []).then((cloudPhotos) => {
        if (cloudPhotos && Array.isArray(cloudPhotos) && cloudPhotos.length > 0) {
          setPhotos(cloudPhotos);
          localStorage.setItem("pbel_custom_gallery", JSON.stringify(cloudPhotos));
        }
      });

      // 3. Videos (local + cloud)
      setVideos(getStoredGalleryVideos());
      fetchStoredGalleryVideos().then((cloudVideos) => {
        if (cloudVideos && Array.isArray(cloudVideos) && cloudVideos.length > 0) {
          setVideos(cloudVideos);
        }
      });

      const handlePhotosUpdate = () => {
        const saved = localStorage.getItem("pbel_custom_gallery");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) setPhotos(parsed);
          } catch (_) {}
        }
      };

      const handleVideosUpdate = () => {
        setVideos(getStoredGalleryVideos());
      };

      window.addEventListener("pbel_gallery_updated", handlePhotosUpdate);
      window.addEventListener("pbel_gallery_videos_updated", handleVideosUpdate);

      return () => {
        window.removeEventListener("pbel_gallery_updated", handlePhotosUpdate);
        window.removeEventListener("pbel_gallery_videos_updated", handleVideosUpdate);
      };
    } catch (_) {}
  }, []);

  // Filter photos
  const filteredPhotos = photos.filter((photo) => {
    if (selectedCategory === "All Moments") return true;
    return photo.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const youtubeUrl = branding.youtubeChannelUrl || "https://www.youtube.com/@pbelsanskritiksamiti-offic3003";
  const instagramUrl = branding.instagramUrl || "https://www.instagram.com/pbelsanskritiksamiti";
  const facebookUrl = branding.facebookUrl || "https://www.facebook.com/pbelsanskritiksamiti";

  return (
    <main className="min-h-screen bg-[#FCFBF7] text-gray-900 pb-20">
      
      {/* 1. FESTIVE HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#5E0A16] via-[#850E1F] to-[#45030C] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-amber-400/30">
            <Sparkles size={14} className="text-amber-400" />
            <span>॥ স্মৃতি ও আনন্দ ॥ • Glimpses &amp; Memories</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Photo &amp; Video Showcase
          </h1>

          <p className="max-w-2xl mx-auto text-amber-100/90 text-sm sm:text-base leading-relaxed mb-8">
            Relive the sacred idol darshan, 108 deepam Sandhi Aarti, vibrant Pratibimb stage plays, 
            Dhunuchi dance competitions, and joyous community celebrations at PBEL City Durgotsav.
          </p>

          {/* Social Channels Strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
            {/* YouTube Official Channel Button */}
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg transition-all hover:scale-105"
            >
              <div className="w-5 h-5 bg-white text-red-600 rounded-full flex items-center justify-center">
                <Play size={10} className="fill-red-600 translate-x-0.5" />
              </div>
              <span>Official YouTube Channel</span>
              <ExternalLink size={13} className="opacity-75" />
            </a>

            {/* Instagram Link */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-md transition-all hover:scale-105"
            >
              <span>Instagram</span>
              <ExternalLink size={12} className="opacity-75" />
            </a>

            {/* Facebook Link */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-md transition-all hover:scale-105"
            >
              <span>Facebook</span>
              <ExternalLink size={12} className="opacity-75" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. TAB SWITCHER (Photos vs Videos) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-amber-100/70 border border-amber-300/80 shadow-inner">
            <button
              onClick={() => setActiveTab("photos")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === "photos"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              <ImageIcon size={16} />
              <span>Photo Gallery ({photos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === "videos"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              <Video size={16} />
              <span>Video Showcase ({videos.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. TAB CONTENT: PHOTOS */}
      {activeTab === "photos" && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-4 animate-fadeIn">
          
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            <Filter size={14} className="text-amber-700 shrink-0 ml-1 mr-1" />
            {PHOTO_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-amber-900 text-amber-100 shadow-xs"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-amber-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, idx) => {
              const photoUrl = photo.imageUrl || photo.image_url;
              return (
                <div
                  key={photo.id || idx}
                  onClick={() => setLightboxPhoto(photo)}
                  className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-amber-900/10 transition-all duration-300 cursor-pointer bg-white flex flex-col justify-end min-h-[280px]"
                >
                  {/* Photo or Gradient Placeholder */}
                  {photoUrl ? (
                    <div className="absolute inset-0">
                      <img
                        src={photoUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    </div>
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-tr ${photo.bgGradient || "from-[#850E1F] to-[#290208]"} p-6 flex items-center justify-center`}>
                      <span className="text-6xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        {photo.emoji || "🌺"}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>
                  )}

                  {/* Top Badge (Year & Category) */}
                  <div className="relative z-10 p-5 flex items-center justify-between text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      {photo.category}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-400/90 text-gray-950 px-2 py-0.5 rounded-full">
                      {photo.year || "2025"}
                    </span>
                  </div>

                  {/* Bottom Title & Action */}
                  <div className="relative z-10 p-5 pt-0 text-white">
                    <h3 className="font-heading text-lg font-bold leading-snug drop-shadow-md group-hover:text-amber-300 transition-colors">
                      {photo.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-amber-200/80">
                      <span>Click to enlarge darshan</span>
                      <Maximize2 size={13} className="group-hover:scale-125 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPhotos.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
              <ImageIcon size={40} className="mx-auto text-gray-400 mb-3" />
              <h4 className="font-heading text-base font-bold text-gray-800">No photos in this category</h4>
              <p className="text-xs text-gray-500 mt-1">Try selecting 'All Moments' to explore full gallery.</p>
            </div>
          )}

        </section>
      )}

      {/* 4. TAB CONTENT: VIDEOS */}
      {activeTab === "videos" && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-4 animate-fadeIn">
          
          {/* YouTube Channel Hero Card */}
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-700 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-xs uppercase">
                <Play size={12} className="fill-white" />
                <span>Live Streams &amp; Cultural Acts</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold">
                Subscribe to PBEL Sanskritik Samiti Channel
              </h2>
              <p className="text-xs sm:text-sm text-red-100 max-w-xl">
                Watch full recordings of Pratibimb stage dramas, musical evenings, Pushpanjali aarti broadcasts, 
                and Sindoor Khela celebrations directly on YouTube.
              </p>
            </div>

            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-white hover:bg-amber-50 text-red-700 font-extrabold text-sm px-6 py-3.5 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2"
            >
              <Play size={16} className="fill-red-700" />
              <span>Watch on YouTube ↗</span>
            </a>
          </div>

          {/* Videos Grid */}
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((vid) => {
                const videoId = vid.youtubeVideoId || extractYouTubeVideoId(vid.youtubeUrl);
                const isPlaying = playingVideoId === vid.id;

                return (
                  <div
                    key={vid.id}
                    className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Video Player or Thumbnail */}
                      <div className="relative aspect-video bg-black overflow-hidden group">
                        {isPlaying && videoId ? (
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
                            title={vid.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        ) : (
                          <div
                            onClick={() => setPlayingVideoId(vid.id)}
                            className="relative w-full h-full cursor-pointer flex items-center justify-center"
                          >
                            {videoId ? (
                              <img
                                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                alt={vid.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-tr from-gray-900 to-red-950 flex items-center justify-center">
                                <Video size={40} className="text-gray-500" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                            
                            {/* Play Button Overlay */}
                            <div className="absolute w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-red-600 transition-all">
                              <Play size={22} className="fill-white translate-x-0.5" />
                            </div>

                            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                              YouTube
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Video Info */}
                      <div className="p-5">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                            {vid.category || "Pujo Video"}
                          </span>
                          <span className="text-[10px] font-semibold text-gray-400">
                            {vid.year || "2025"}
                          </span>
                        </div>

                        <h3 className="font-heading text-base font-bold text-gray-900 line-clamp-2 mb-2">
                          {vid.title}
                        </h3>

                        {vid.description && (
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {vid.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <a
                        href={vid.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 hover:underline"
                      >
                        <span>Open in YouTube</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Friendly Empty State */
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Video size={28} />
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
                Pujo Videos Being Curated!
              </h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto mb-6">
                Our cultural &amp; communications team is compiling highlights from Pratibimb acts, Dhunuchi naach, and Aarti. 
                In the meantime, check out all recordings directly on our official YouTube channel.
              </p>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-3 rounded-full transition shadow-md"
              >
                <Play size={13} className="fill-white" />
                <span>Visit YouTube Channel ↗</span>
              </a>
            </div>
          )}

        </section>
      )}

      {/* 5. LIGHTBOX MODAL */}
      {lightboxPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition"
            aria-label="Close Lightbox"
          >
            <X size={24} />
          </button>

          <div 
            className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxPhoto.imageUrl || lightboxPhoto.image_url ? (
              <img
                src={lightboxPhoto.imageUrl || lightboxPhoto.image_url}
                alt={lightboxPhoto.title}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            ) : (
              <div className={`w-full max-w-md h-80 rounded-3xl bg-gradient-to-tr ${lightboxPhoto.bgGradient || "from-[#850E1F] to-[#290208]"} flex items-center justify-center p-8`}>
                <span className="text-8xl drop-shadow-2xl">{lightboxPhoto.emoji || "🌺"}</span>
              </div>
            )}

            <div className="mt-4 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {lightboxPhoto.category} • {lightboxPhoto.year || "2025"}
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold mt-1">
                {lightboxPhoto.title}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* 6. CALL TO ACTION: CULTURAL REGISTRATION & CONTRIBUTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 text-center space-y-3">
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
            Have Photos or Videos from Pujo to Share?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
            PBEL City residents can tag our official channels or share clips with the Cultural &amp; Communications team.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/programs#register-performance"
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-5 py-2.5 rounded-full transition shadow-sm flex items-center gap-1.5"
            >
              <Music size={14} />
              <span>Pratibimb Stage Acts</span>
            </Link>
            <Link
              href="/contribute"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-2.5 rounded-full transition shadow-sm flex items-center gap-1.5"
            >
              <HeartHandshake size={14} />
              <span>Offer Pujo Seva</span>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
