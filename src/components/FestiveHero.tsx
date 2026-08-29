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
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: false });

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

  // Countdown timer to Maha Sashti Bodhon (16 Oct 2026, 08:30 AM IST)
  useEffect(() => {
    const target = new Date("2026-10-16T08:30:00+05:30").getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds, isPassed: false });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
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
    <section className="w-full relative overflow-hidden py-6 md:py-12 px-3 sm:px-6 lg:px-8 border-b border-amber-500/20 text-white min-h-[440px] md:min-h-[500px] flex items-center justify-center box-border">
      {/* Dynamic Background Image with Smooth Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-100"
        style={{ backgroundImage: `url('${activeWallpaper.url}')` }}
      />
      <div className={`absolute inset-0 ${activeWallpaper.overlayOpacity} backdrop-blur-[1px]`} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#3A030C] via-transparent to-black/50" />

      {/* Decorative Glow Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/25 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto text-center relative z-10 space-y-3 sm:space-y-4 min-w-0 px-1 sm:px-4 box-border">
        
        {/* Bengali Devotional Invocation & Top Samiti Badge */}
        <div className="space-y-1.5 max-w-full">
          <div className="text-amber-300 font-semibold text-[11px] sm:text-xs tracking-normal sm:tracking-wide leading-relaxed px-2 break-words drop-shadow-md">
            ।। শ্রী শ্রী দুর্গোৎসবে সার্বজনীন সাদর আমন্ত্রণ ।। • শুভ শারদীয়া
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-amber-400/40 text-amber-300 text-[10px] sm:text-xs font-semibold tracking-wide backdrop-blur-md shadow-lg max-w-full">
            {branding.pssLogoUrl ? (
              <img
                src={branding.pssLogoUrl}
                alt="PSS Logo"
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover border border-amber-400 shrink-0"
              />
            ) : (
              <Sparkles size={13} className="text-amber-400 animate-pulse shrink-0" />
            )}
            <span className="truncate">{branding.samitiName || "PBEL Sanskritik Samiti (PSS)"} Presents</span>
          </div>
        </div>

        {/* Main Typography */}
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-lg break-words px-1 max-w-full">
          PBEL City <span className="text-gold-gradient">Durgotsav 2026</span>
        </h1>

        <p className="text-xs sm:text-base md:text-lg text-amber-100/90 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-md px-2 break-words">
          {branding.tagline ||
            "Welcome to the 6-day grand celebration of devotion, heritage, cultural stage acts, and community unity in Hyderabad."}
        </p>

        {/* Live Countdown Clock Widget to Maha Sashti Bodhon */}
        {!timeLeft.isPassed && (
          <div className="inline-flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 bg-black/60 border border-amber-400/40 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2.5 backdrop-blur-md shadow-xl max-w-full">
            <div className="text-center sm:text-left">
              <div className="text-[10px] uppercase font-bold tracking-wider text-amber-300 flex items-center justify-center sm:justify-start gap-1">
                <Sparkles size={11} className="text-amber-400 shrink-0" /> Countdown to Bodhon
              </div>
              <div className="text-[10px] sm:text-[11px] text-gray-300">Maha Sashti • 16 Oct</div>
            </div>
            <div className="hidden sm:block h-7 w-px bg-amber-400/30" />
            <div className="flex items-center gap-1 sm:gap-1.5 text-center">
              <div className="bg-amber-950/80 border border-amber-500/30 rounded-lg px-2 py-0.5 min-w-[30px] sm:min-w-[32px]">
                <span className="font-bold text-amber-200 text-xs sm:text-sm">{timeLeft.days}</span>
                <span className="block text-[7px] sm:text-[8px] text-amber-300/80 uppercase">Days</span>
              </div>
              <span className="text-amber-400 font-bold text-xs">:</span>
              <div className="bg-amber-950/80 border border-amber-500/30 rounded-lg px-2 py-0.5 min-w-[30px] sm:min-w-[32px]">
                <span className="font-bold text-amber-200 text-xs sm:text-sm">{String(timeLeft.hours).padStart(2, "0")}</span>
                <span className="block text-[7px] sm:text-[8px] text-amber-300/80 uppercase">Hrs</span>
              </div>
              <span className="text-amber-400 font-bold text-xs">:</span>
              <div className="bg-amber-950/80 border border-amber-500/30 rounded-lg px-2 py-0.5 min-w-[30px] sm:min-w-[32px]">
                <span className="font-bold text-amber-200 text-xs sm:text-sm">{String(timeLeft.minutes).padStart(2, "0")}</span>
                <span className="block text-[7px] sm:text-[8px] text-amber-300/80 uppercase">Min</span>
              </div>
              <span className="text-amber-400 font-bold text-xs">:</span>
              <div className="bg-amber-950/80 border border-amber-500/30 rounded-lg px-2 py-0.5 min-w-[30px] sm:min-w-[32px]">
                <span className="font-bold text-amber-200 text-xs sm:text-sm">{String(timeLeft.seconds).padStart(2, "0")}</span>
                <span className="block text-[7px] sm:text-[8px] text-amber-300/80 uppercase">Sec</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Date & Venue Cards */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm max-w-full px-2">
          <div className="w-full sm:w-auto bg-black/50 backdrop-blur-md border border-amber-400/30 px-3 py-1 rounded-2xl text-amber-200 flex items-center justify-center gap-1.5 shadow-sm text-[11px] sm:text-xs">
            <CalendarDays size={13} className="text-amber-400 shrink-0" />
            <span>
              <strong>Dates:</strong> 15th to 20th Oct 2026
            </span>
          </div>
          <div className="w-full sm:w-auto bg-black/50 backdrop-blur-md border border-amber-400/30 px-3 py-1 rounded-2xl text-amber-200 flex items-center justify-center gap-1.5 shadow-sm text-[11px] sm:text-xs">
            <MapPin size={13} className="text-amber-400 shrink-0" />
            <span>
              <strong>Venue:</strong> PBEL City Arena, Hyderabad
            </span>
          </div>
        </div>

        {/* Primary Action CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto w-full pt-0.5">
          <Link
            href="/contribute?tab=general"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#D99B26] to-[#B8801C] hover:from-[#B8801C] hover:to-[#966714] text-white px-4 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 golden-glow text-center"
          >
            <HeartHandshake size={16} className="shrink-0" />
            <span>General Contribution</span>
          </Link>
          <Link
            href="/contribute?tab=catalog"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#B8801C] to-[#8A5E0F] hover:from-[#966714] hover:to-[#734A05] border border-amber-300/60 text-white px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-center"
          >
            <Sparkles size={16} className="text-amber-200 shrink-0" />
            <span>Sponsor Seva Package</span>
          </Link>
          <Link
            href="/programs#register-performance"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B1024] to-[#680A1A] hover:from-[#A5132B] hover:to-[#8B1024] border border-amber-400/40 text-amber-100 hover:text-white px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center"
          >
            <Drama size={16} className="text-amber-300 shrink-0" />
            <span>Cultural Acts (Pratibimb)</span>
          </Link>
          <Link
            href="/programs"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#4A0812] to-[#2E050B] hover:from-[#6A0C1A] hover:to-[#4A0812] border border-amber-400/50 text-amber-200 hover:text-white px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-md text-center"
          >
            <CalendarDays size={16} className="text-amber-400 shrink-0" />
            <span>Pujo Schedule</span>
            <ArrowRight size={14} className="text-amber-300 shrink-0" />
          </Link>
        </div>

        {/* Streamlined Secondary Nav Pills: Touch-friendly horizontal scroll on mobile, Lucide icons only */}
        <div className="w-full max-w-full overflow-x-auto no-scrollbar pt-2 px-1">
          <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 w-max sm:w-auto mx-auto pb-1">
            <Link
              href="/programs#register-performance"
              className="inline-flex items-center gap-1.5 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-200 hover:text-white px-3 py-1.5 rounded-full text-xs font-semibold transition backdrop-blur-md shrink-0 whitespace-nowrap"
            >
              <Drama size={12} className="text-amber-300 shrink-0" />
              <span>Stage Acts</span>
            </Link>
            <Link
              href="/anandamela"
              className="inline-flex items-center gap-1.5 bg-black/40 hover:bg-black/60 border border-white/25 text-amber-100 hover:text-white px-3 py-1.5 rounded-full text-xs font-semibold transition backdrop-blur-md shrink-0 whitespace-nowrap"
            >
              <Utensils size={12} className="text-amber-300 shrink-0" />
              <span>Anandamela</span>
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center gap-1.5 bg-black/40 hover:bg-black/60 border border-white/25 text-amber-100 hover:text-white px-3 py-1.5 rounded-full text-xs font-semibold transition backdrop-blur-md shrink-0 whitespace-nowrap"
            >
              <Compass size={12} className="text-amber-300 shrink-0" />
              <span>Pandal Guide</span>
            </Link>
            <Link
              href="/committee"
              className="inline-flex items-center gap-1.5 bg-black/40 hover:bg-black/60 border border-white/25 text-amber-100 hover:text-white px-3 py-1.5 rounded-full text-xs font-semibold transition backdrop-blur-md shrink-0 whitespace-nowrap"
            >
              <Users size={12} className="text-amber-300 shrink-0" />
              <span>Committee</span>
            </Link>
            <Link
              href="/sponsors"
              className="inline-flex items-center gap-1.5 bg-black/40 hover:bg-black/60 border border-white/25 text-amber-100 hover:text-white px-3 py-1.5 rounded-full text-xs font-semibold transition backdrop-blur-md shrink-0 whitespace-nowrap"
            >
              <Award size={12} className="text-amber-300 shrink-0" />
              <span>Sponsors</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
