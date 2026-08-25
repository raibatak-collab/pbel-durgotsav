"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X, Sparkles, Image as ImageIcon } from "lucide-react";

export interface GalleryPhoto {
  id: string;
  title: string;
  year: string;
  category: string;
  emoji: string;
  imageUrl?: string;
  bgGradient: string;
}

const defaultPhotos: GalleryPhoto[] = [
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

export function GalleryCarousel({ customPhotos }: { customPhotos?: any[] }) {
  const photos = customPhotos && customPhotos.length > 0 ? customPhotos : defaultPhotos;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [photos.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <div className="w-full">
      {/* Featured Main Carousel View */}
      <div className="relative w-full h-80 sm:h-96 md:h-[420px] rounded-3xl overflow-hidden border border-amber-900/15 shadow-2xl mb-4 group">
        
        {photos.map((photo, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={photo.id || index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex flex-col justify-between p-6 sm:p-10 ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              } bg-gradient-to-tr ${photo.bgGradient || "from-[#850E1F] to-[#290208]"} text-white`}
            >
              {/* If actual image URL / uploaded photo exists, render full image background */}
              {photo.imageUrl ? (
                <div className="absolute inset-0 z-0">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
                </div>
              ) : (
                /* Background Decorative Pattern */
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              )}
              
              {/* Top Tag & Year */}
              <div className="flex items-center justify-between z-10">
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  {photo.category || "Pujo Memory"}
                </span>
                <span className="bg-black/30 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                  {photo.year || "2025"}
                </span>
              </div>

              {/* Center Content / Visual */}
              <div className="my-auto text-center z-10">
                {!photo.imageUrl && (
                  <span className="text-6xl sm:text-7xl drop-shadow-lg block mb-4 animate-bounce">
                    {photo.emoji || "🌺"}
                  </span>
                )}
                <h3 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">
                  {photo.title}
                </h3>
                <p className="text-amber-200 text-xs sm:text-sm font-medium">
                  PBEL City Durgotsav Celebrations
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between z-10 pt-4 border-t border-white/10">
                <span className="text-xs text-amber-200/80">
                  Slide {currentIndex + 1} of {photos.length}
                </span>
                <button
                  onClick={() => setLightboxPhoto(photo)}
                  className="bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-md transition flex items-center gap-1.5 border border-white/20"
                >
                  <Maximize2 size={13} />
                  <span>View Full Photo</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Carousel Arrow Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition opacity-80 group-hover:opacity-100 shadow-lg"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition opacity-80 group-hover:opacity-100 shadow-lg"
          aria-label="Next Slide"
        >
          <ChevronRight size={22} />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex ? "w-7 bg-amber-400" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>

      {/* Thumbnail Grid for Quick Selection */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
        {photos.map((photo, idx) => (
          <button
            key={photo.id || idx}
            onClick={() => setCurrentIndex(idx)}
            className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
              idx === currentIndex
                ? "bg-amber-100/80 border-primary ring-2 ring-primary/30 shadow-md scale-105"
                : "bg-white border-gray-200 hover:border-amber-300 hover:bg-amber-50/40"
            }`}
          >
            <span className="text-xl mb-1">{photo.emoji || "🌺"}</span>
            <span className="text-[11px] font-bold text-gray-900 truncate block">
              {photo.title}
            </span>
            <span className="text-[10px] text-amber-800 font-semibold">{photo.year}</span>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#850E1F] to-[#290208] text-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-amber-400/40 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition border border-white/20"
            >
              <X size={20} />
            </button>

            {lightboxPhoto.imageUrl ? (
              <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-4 border border-amber-400/30">
                <img
                  src={lightboxPhoto.imageUrl}
                  alt={lightboxPhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="text-6xl mb-4 text-center">{lightboxPhoto.emoji}</div>
            )}

            <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase inline-block mb-2">
              {lightboxPhoto.category} • {lightboxPhoto.year}
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold mb-2">{lightboxPhoto.title}</h3>
            <p className="text-amber-100/90 text-xs sm:text-sm leading-relaxed mb-6">
              A cherished memory from PBEL City Durgotsav. The vibrant rituals, devotional music, and community joy captured for posterity.
            </p>
            <button
              onClick={() => setLightboxPhoto(null)}
              className="w-full bg-gradient-to-r from-[#D99B26] to-[#B8801C] text-white font-bold py-3 rounded-full text-xs sm:text-sm transition shadow-lg"
            >
              Close Photo Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
