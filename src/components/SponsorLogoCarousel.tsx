"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Sparkles, ChevronRight, Crown, Award, Music2, Store, HeartHandshake } from "lucide-react";
import { fetchCloudConfig } from "@/utils/cloudConfig";
import { getSponsorTierRank } from "@/config/sponsors";

export interface SponsorItem {
  id: string;
  name: string;
  tier: string;
  amount?: number;
  logo_url?: string;
  website?: string;
  is_active?: boolean;
}

const DEFAULT_SPONSORS: SponsorItem[] = [];

export function SponsorLogoCarousel({ sponsors: initialSponsors }: { sponsors?: SponsorItem[] | null }) {
  const [sponsors, setSponsors] = useState<SponsorItem[]>(() => {
    if (initialSponsors && initialSponsors.length > 0) return initialSponsors;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("pbel_sponsors_list");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (_) {}
    }
    return DEFAULT_SPONSORS;
  });
  const [imageError, setImageError] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadCloudSponsors = async () => {
      try {
        const cloud = await fetchCloudConfig<SponsorItem[]>("sponsors", []);
        if (cloud && Array.isArray(cloud) && cloud.length > 0) {
          setSponsors(cloud);
          localStorage.setItem("pbel_sponsors_list", JSON.stringify(cloud));
        }
      } catch (_) {}
    };
    loadCloudSponsors();

    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem("pbel_sponsors_list");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) setSponsors(parsed);
        }
      } catch (_) {}
    };

    window.addEventListener("pbel_sponsors_updated", handleUpdate);
    return () => window.removeEventListener("pbel_sponsors_updated", handleUpdate);
  }, []);

  const activeSponsors = sponsors.filter((s) => s.is_active !== false);

  // Group sponsors strictly by the 5 requested prominence tiers
  const platinumSponsors = activeSponsors.filter((s) => getSponsorTierRank(s.tier) === "platinum");
  const goldSponsors = activeSponsors.filter((s) => getSponsorTierRank(s.tier) === "gold");
  const silverSponsors = activeSponsors.filter((s) => getSponsorTierRank(s.tier) === "silver");
  const bronzeSponsors = activeSponsors.filter((s) => getSponsorTierRank(s.tier) === "bronze");
  const supportedBySponsors = activeSponsors.filter((s) => getSponsorTierRank(s.tier) === "supported_by");

  const handleImageError = (id: string) => {
    setImageError((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  // Helper to render brand logo or styled name fallback
  const renderBrandLogo = (sponsor: SponsorItem, maxHClass: string) => {
    const hasError = imageError.has(sponsor.id);
    if (sponsor.logo_url && !hasError) {
      return (
        <img
          src={sponsor.logo_url}
          alt={sponsor.name}
          className={`${maxHClass} max-w-[90%] object-contain filter group-hover:scale-105 transition-transform duration-300 drop-shadow-xs`}
          onError={() => handleImageError(sponsor.id)}
        />
      );
    }
    return (
      <div className="flex flex-col items-center justify-center text-center p-2">
        <span className="text-2xl mb-1">🏢</span>
        <span className="font-heading text-sm font-bold text-gray-800 line-clamp-2">{sponsor.name}</span>
      </div>
    );
  };

  // If completely empty, render partnership invitation cards
  if (activeSponsors.length === 0) {
    return (
      <div className="w-full space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gradient-to-b from-amber-100/50 to-amber-50/20 border-2 border-dashed border-amber-300 rounded-2xl p-5 flex flex-col items-center justify-center text-center min-h-[140px]">
            <span className="text-3xl mb-1">👑</span>
            <span className="font-bold text-sm text-gray-900">Title / Platinum</span>
            <span className="text-[11px] text-amber-800 font-semibold mt-1">Available for 2026</span>
          </div>
          <div className="bg-amber-50/40 border-2 border-dashed border-amber-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center min-h-[140px]">
            <span className="text-3xl mb-1">🥇</span>
            <span className="font-bold text-sm text-gray-900">Associate Partner</span>
            <span className="text-[11px] text-amber-700 font-semibold mt-1">Available for 2026</span>
          </div>
          <div className="bg-slate-50/60 border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center min-h-[140px]">
            <span className="text-3xl mb-1">🎭</span>
            <span className="font-bold text-sm text-gray-900">Cultural Stage</span>
            <span className="text-[11px] text-slate-700 font-semibold mt-1">Available for 2026</span>
          </div>
          <div className="bg-orange-50/40 border-2 border-dashed border-orange-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center min-h-[140px]">
            <span className="text-3xl mb-1">🎪</span>
            <span className="font-bold text-sm text-gray-900">Stall &amp; Banner</span>
            <span className="text-[11px] text-orange-800 font-semibold mt-1">Available for 2026</span>
          </div>
        </div>

        {/* Pitch Ribbon Callout */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-2xl p-3.5 border border-amber-300/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-xs text-amber-950 font-medium">
            <Sparkles size={16} className="text-primary shrink-0" />
            <span>
              <strong>Showcase your brand:</strong> Reach 1,500+ residential families &amp; 5,000+ devotees with prime logo placement &amp; archway presence.
            </span>
          </div>
          <Link
            href="/sponsors"
            className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1 shrink-0"
          >
            <span>Explore Sponsor Tiers</span>
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">

      {/* 1. TIER 1: PLATINUM SPONSOR (HIGHEST PROMINENCE) */}
      {platinumSponsors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D4AF37] text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
              <Crown size={12} className="text-yellow-100" />
              <span>Platinum</span>
            </span>
          </div>

          <div className={`grid ${platinumSponsors.length === 1 ? "grid-cols-1 max-w-2xl mx-auto" : "grid-cols-1 sm:grid-cols-2"} gap-4`}>
            {platinumSponsors.map((sponsor) => {
              const card = (
                <div
                  key={sponsor.id}
                  className="bg-gradient-to-b from-[#FFFDF5] via-white to-[#FFF9EA] rounded-3xl p-6 transition-all flex flex-col items-center justify-between text-center relative overflow-hidden group hover:scale-[1.01]"
                  style={{
                    border: "2.5px solid #D4AF37",
                    boxShadow: "0 0 28px rgba(212, 175, 55, 0.45), 0 8px 32px rgba(245, 158, 11, 0.22)",
                  }}
                >
                  {/* Luxury Corner Floating Badge */}
                  <div className="absolute top-3.5 right-3.5 px-3 py-1 bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D4AF37] text-white text-[10px] sm:text-[11px] font-extrabold rounded-full shadow-md tracking-wider uppercase flex items-center gap-1 z-10">
                    <Crown size={12} />
                    <span>Platinum</span>
                  </div>

                  {/* Large Logo Canvas - Dedicated 85% visual dominance with gold accent border & radiant inner glow */}
                  <div
                    className="w-full h-32 sm:h-36 flex items-center justify-center p-3 bg-white/95 rounded-2xl group-hover:bg-amber-50/40 transition-colors mt-2"
                    style={{
                      border: "2px solid rgba(212, 175, 55, 0.5)",
                      boxShadow: "inset 0 0 16px rgba(245, 158, 11, 0.12)",
                    }}
                  >
                    {renderBrandLogo(sponsor, "max-h-28 sm:max-h-32")}
                  </div>

                  {/* Clean Sponsor Name & Optional Link */}
                  <div className="mt-3.5 w-full">
                    <h4 className="font-heading text-base sm:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors flex items-center justify-center gap-1.5">
                      <span>{sponsor.name}</span>
                      {sponsor.website && <ExternalLink size={13} className="text-amber-600 shrink-0" />}
                    </h4>
                  </div>
                </div>
              );

              if (sponsor.website) {
                return (
                  <a key={sponsor.id} href={sponsor.website} target="_blank" rel="noreferrer" className="block" title={`Visit ${sponsor.name}`}>
                    {card}
                  </a>
                );
              }
              return card;
            })}
          </div>
        </div>
      )}

      {/* 2. TIER 2: ASSOCIATE PARTNERS (GOLD) - HIGH PROMINENCE */}
      {goldSponsors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-950 border border-yellow-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Award size={12} className="text-yellow-700" />
              <span>Associate Partners (Gold)</span>
            </span>
            <span className="text-[11px] text-gray-500 hidden sm:inline">Official Festival Patrons</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {goldSponsors.map((sponsor) => {
              const card = (
                <div
                  key={sponsor.id}
                  className="bg-white rounded-2xl p-5 border-2 border-yellow-300/90 shadow-sm hover:shadow-lg hover:border-yellow-400 transition-all flex flex-col items-center justify-between text-center relative overflow-hidden group"
                >
                  {/* Top-right Floating Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-yellow-50 text-yellow-900 border border-yellow-300 text-[10px] font-bold rounded-full z-10">
                    Associate Partner
                  </div>

                  {/* Logo Canvas - Expanded height so logo dominates */}
                  <div className="w-full h-24 sm:h-28 flex items-center justify-center p-3 bg-yellow-50/30 rounded-xl border border-yellow-100 group-hover:bg-yellow-50/60 transition-colors mt-2">
                    {renderBrandLogo(sponsor, "max-h-20 sm:max-h-24")}
                  </div>

                  {/* Clean 1-line label */}
                  <div className="mt-3 w-full">
                    <h4 className="font-heading text-sm sm:text-base font-bold text-gray-900 group-hover:text-primary transition-colors flex items-center justify-center gap-1">
                      <span>{sponsor.name}</span>
                      {sponsor.website && <ExternalLink size={12} className="text-yellow-700 shrink-0" />}
                    </h4>
                  </div>
                </div>
              );

              if (sponsor.website) {
                return (
                  <a key={sponsor.id} href={sponsor.website} target="_blank" rel="noreferrer" className="block" title={`Visit ${sponsor.name}`}>
                    {card}
                  </a>
                );
              }
              return card;
            })}
          </div>
        </div>
      )}

      {/* 3. TIER 3: CULTURAL STAGE PARTNERS (SILVER) - MEDIUM PROMINENCE */}
      {silverSponsors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Music2 size={12} className="text-slate-600" />
              <span>Cultural Stage Partners (Silver)</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5">
            {silverSponsors.map((sponsor) => {
              const card = (
                <div
                  key={sponsor.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all flex flex-col items-center justify-between text-center relative overflow-hidden group"
                >
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-slate-50 text-slate-700 border border-slate-200 text-[9px] font-bold rounded-full">
                    Cultural Stage
                  </div>

                  <div className="w-full h-20 sm:h-22 flex items-center justify-center p-2.5 bg-slate-50/50 rounded-xl border border-slate-100 group-hover:bg-slate-100/60 transition-colors mt-2">
                    {renderBrandLogo(sponsor, "max-h-16 sm:max-h-18")}
                  </div>

                  <div className="mt-2 w-full">
                    <h4 className="font-heading text-xs sm:text-sm font-bold text-gray-900 group-hover:text-primary transition-colors truncate">
                      {sponsor.name}
                    </h4>
                  </div>
                </div>
              );

              if (sponsor.website) {
                return (
                  <a key={sponsor.id} href={sponsor.website} target="_blank" rel="noreferrer" className="block" title={`Visit ${sponsor.name}`}>
                    {card}
                  </a>
                );
              }
              return card;
            })}
          </div>
        </div>
      )}

      {/* 4. TIER 4: STALL & BANNER COMBO (BRONZE) - COMPACT COMBO */}
      {bronzeSponsors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-950 border border-orange-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Store size={12} className="text-orange-700" />
              <span>Stall &amp; Banner Partners (Bronze)</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {bronzeSponsors.map((sponsor) => {
              const card = (
                <div
                  key={sponsor.id}
                  className="bg-white rounded-xl p-3.5 border border-orange-200 hover:border-orange-300 hover:shadow-xs transition-all flex flex-col items-center justify-between text-center relative overflow-hidden group"
                >
                  <div className="w-full h-16 sm:h-18 flex items-center justify-center p-2 bg-orange-50/30 rounded-lg border border-orange-100">
                    {renderBrandLogo(sponsor, "max-h-14 sm:max-h-16")}
                  </div>
                  <h4 className="font-heading text-xs font-bold text-gray-800 mt-2 truncate w-full">
                    {sponsor.name}
                  </h4>
                </div>
              );

              if (sponsor.website) {
                return (
                  <a key={sponsor.id} href={sponsor.website} target="_blank" rel="noreferrer" className="block" title={`Visit ${sponsor.name}`}>
                    {card}
                  </a>
                );
              }
              return card;
            })}
          </div>
        </div>
      )}

      {/* 5. TIER 5: SUPPORTED BY - SLEEK LOGO-DOMINANT STRIP */}
      {supportedBySponsors.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
              <HeartHandshake size={13} className="text-gray-600" />
              <span>Supported by</span>
            </span>
          </div>

          {/* Clean Horizontal Brand Strip: 90% Logo Dominance without bulky text boxes */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 p-3 bg-gray-50/70 rounded-2xl border border-gray-200">
            {supportedBySponsors.map((sponsor) => {
              const pill = (
                <div
                  key={sponsor.id}
                  className="h-16 sm:h-20 min-w-[140px] sm:min-w-[170px] px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all flex items-center justify-center group relative cursor-pointer"
                  title={`${sponsor.name} - Supported by`}
                >
                  {/* Dedicated 90% Logo Display */}
                  {renderBrandLogo(sponsor, "max-h-12 sm:max-h-14")}

                  {sponsor.website && (
                    <ExternalLink size={10} className="absolute top-1.5 right-1.5 text-gray-400 group-hover:text-primary transition-colors" />
                  )}
                </div>
              );

              if (sponsor.website) {
                return (
                  <a key={sponsor.id} href={sponsor.website} target="_blank" rel="noreferrer" className="block">
                    {pill}
                  </a>
                );
              }
              return pill;
            })}
          </div>
        </div>
      )}

      {/* Pitch Ribbon Callout */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-2xl p-3.5 border border-amber-300/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2 text-xs text-amber-950 font-medium">
          <Sparkles size={16} className="text-primary shrink-0" />
          <span>
            <strong>Showcase your brand:</strong> Reach 1,500+ residential families &amp; 5,000+ devotees with official logo placement &amp; archway stall presence.
          </span>
        </div>
        <Link
          href="/sponsors"
          className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1 shrink-0"
        >
          <span>Explore Sponsor Tiers</span>
          <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  );
}
