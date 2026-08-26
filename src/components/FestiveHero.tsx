"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  CalendarDays,
  MapPin,
  HeartHandshake,
  ArrowRight,
  Users,
  Award,
  Utensils,
  Compass,
  Drama
} from "lucide-react";
import {
  getStoredBranding,
  AESTHETIC_WALLPAPERS,
  SamitiBrandingConfig,
  DEFAULT_BRANDING
} from "@/config/branding";

export function FestiveHero() {
  const [branding, setBranding] = useState<SamitiBrandingConfig>(DEFAULT_BRANDING);

  useEffect(() => {
    try {
      setBranding(getStoredBranding());

      const handleUpdate = () => {
        setBranding(getStoredBranding());
      };
      window.addEventListener("pbel_branding_updated", handleUpdate);
      return () => {
        window.removeEventListener("pbel_branding_updated", handleUpdate);
      };
    } catch {
      // fallback
    }
  }, []);

  const activeWallpaper =
    branding.customWallpaperUrl
      ? {
          url: branding.customWallpaperUrl,
          overlayOpacity: "bg-black/60",
        }
      : AESTHETIC_WALLPAPERS.find((w) => w.id === branding.activeHeroWallpaperId) ||
        AESTHETIC_WALLPAPERS[0];

  return (
    <section className="w-full relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20 text-white min-h-[580px] flex items-center justify-center">
      {/* Dynamic Background Image with Smooth Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-100"
        style={{ backgroundImage: `url('${activeWallpaper.url}')` }}
      />
      <div className={`absolute inset-0 ${activeWallpaper.overlayOpacity} backdrop-blur-[1px]`} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#3A030C] via-transparent to-black/50" />

      {/* Decorative Glow Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
        
        {/* Top Samiti Badge with Custom Logo or Divine Icon */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/40 border border-amber-400/40 text-amber-300 text-xs md:text-sm font-semibold tracking-wide backdrop-blur-md shadow-lg">
          {branding.pssLogoUrl ? (
            <img
              src={branding.pssLogoUrl}
              alt="PSS Logo"
              className="w-5 h-5 rounded-full object-cover border border-amber-400"
            />
          ) : (
            <Sparkles size={15} className="text-amber-400 animate-pulse" />
          )}
          <span>{branding.samitiName || "PBEL Sanskritik Samiti (PSS)"} Presents</span>
        </div>

        {/* Main Typography */}
        <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight drop-shadow-lg">
          PBEL City <span className="text-gold-gradient">Durgotsav 2026</span>
        </h1>

        <p className="text-base sm:text-xl text-amber-100/95 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-md">
          {branding.tagline ||
            "Welcome to the 6-day grand celebration of devotion, heritage, cultural stage acts, and community unity in Hyderabad."}
        </p>

        {/* Quick Date & Venue Cards */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm pt-2">
          <div className="bg-black/50 backdrop-blur-md border border-amber-400/30 px-4 py-2 rounded-2xl text-amber-200 flex items-center gap-2 shadow-sm">
            <CalendarDays size={16} className="text-amber-400" />
            <span>
              <strong>Dates:</strong> 15th to 20th Oct 2026 (Panchami to Dashami)
            </span>
          </div>
          <div className="bg-black/50 backdrop-blur-md border border-amber-400/30 px-4 py-2 rounded-2xl text-amber-200 flex items-center gap-2 shadow-sm">
            <MapPin size={16} className="text-amber-400" />
            <span>
              <strong>Venue:</strong> PBEL City Community Arena, Hyderabad
            </span>
          </div>
        </div>

        {/* Primary Action CTAs: Separated General Contribution and Seva Package Sponsor Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto pt-2">
          <Link
            href="/contribute?tab=general"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#D99B26] to-[#B8801C] hover:from-[#B8801C] hover:to-[#966714] text-white px-6 py-3.5 rounded-full font-bold text-sm transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 golden-glow"
          >
            <HeartHandshake size={18} />
            <span>General Contribution (Any Amount)</span>
          </Link>
          <Link
            href="/contribute?tab=catalog"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#B8801C] to-[#8A5E0F] hover:from-[#966714] hover:to-[#734A05] border border-amber-300/60 text-white px-6 py-3.5 rounded-full font-bold text-sm transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            <Sparkles size={17} className="text-amber-200" />
            <span>Sponsor Seva Package</span>
          </Link>
          <Link
            href="/programs#pratibimb-registration"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B1024] to-[#680A1A] hover:from-[#A5132B] hover:to-[#8B1024] border border-amber-400/40 text-amber-100 hover:text-white px-5 py-3.5 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Drama size={18} className="text-amber-300" />
            <span>Cultural Acts (Pratibimb)</span>
          </Link>
          <Link
            href="/programs"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black/40 hover:bg-black/60 border border-white/30 text-white px-5 py-3.5 rounded-full font-semibold text-sm transition-all backdrop-blur-md"
          >
            <span>Pujo Schedule</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Dynamic Feature Nav Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <Link
            href="/programs#pratibimb-registration"
            className="inline-flex items-center gap-1.5 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-200 hover:text-white px-4 py-1.5 rounded-full text-xs font-semibold transition backdrop-blur-md"
          >
            <Drama size={13} className="text-amber-300" />
            <span>🎭 5-Day Pratibimb Stage Acts</span>
          </Link>
          <Link
            href="/anandamela"
            className="inline-flex items-center gap-1.5 bg-black/40 hover:bg-black/60 border border-white/25 text-amber-100 hover:text-white px-4 py-1.5 rounded-full text-xs font-semibold transition backdrop-blur-md"
          >
            <Utensils size={13} className="text-amber-300" />
            <span>🍲 Anandamela Food Fiesta</span>
          </Link>
          <Link
            href="/guide"
            className="inline-flex items-center gap-1.5 bg-black/40 hover:bg-black/60 border border-white/25 text-amber-100 hover:text-white px-4 py-1.5 rounded-full text-xs font-semibold transition backdrop-blur-md"
          >
            <Compass size={13} className="text-amber-300" />
            <span>🗺️ Pandal Map &amp; Guide</span>
          </Link>
          <Link
            href="/committee"
            className="inline-flex items-center gap-1.5 bg-black/40 hover:bg-black/60 border border-white/25 text-amber-100 hover:text-white px-4 py-1.5 rounded-full text-xs font-semibold transition backdrop-blur-md"
          >
            <Users size={13} className="text-amber-300" />
            <span>👥 Organizing Committee</span>
          </Link>
          <Link
            href="/sponsors"
            className="inline-flex items-center gap-1.5 bg-black/40 hover:bg-black/60 border border-white/25 text-amber-100 hover:text-white px-4 py-1.5 rounded-full text-xs font-semibold transition backdrop-blur-md"
          >
            <Award size={13} className="text-amber-300" />
            <span>🏢 Corporate Deck</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
