"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Award, ExternalLink, Sparkles, Building2, ChevronRight } from "lucide-react";
import { fetchCloudConfig } from "@/utils/cloudConfig";

export interface SponsorItem {
  id: string;
  name: string;
  tier: string;
  amount?: number;
  logo_url?: string;
  website?: string;
  is_active?: boolean;
}

const DEFAULT_SPONSORS: SponsorItem[] = [
  {
    id: "sp-1",
    name: "ICICI Bank",
    tier: "Platinum Banking Partner",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/ICICI_Bank_Logo.svg/512px-ICICI_Bank_Logo.svg.png",
    website: "https://www.icicibank.com",
    is_active: true,
  },
  {
    id: "sp-2",
    name: "Ratnadeep Supermarket",
    tier: "Food & Bhog Partner",
    logo_url: "https://www.ratnadeep.com/assets/images/logo.png",
    website: "https://www.ratnadeep.com",
    is_active: true,
  },
  {
    id: "sp-3",
    name: "Karachi Bakery",
    tier: "Sweet & Prasad Partner",
    logo_url: "https://www.karachibakery.com/assets/images/logo.png",
    website: "https://www.karachibakery.com",
    is_active: true,
  },
  {
    id: "sp-4",
    name: "Apollo Pharmacy",
    tier: "Healthcare & Safety Partner",
    logo_url: "https://www.apollopharmacy.in/assets/images/logo.svg",
    website: "https://www.apollopharmacy.in",
    is_active: true,
  },
];

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

  const getTierColor = (tier: string) => {
    const t = (tier || "").toLowerCase();
    if (t.includes("platinum")) return "bg-amber-100 text-amber-900 border-amber-300";
    if (t.includes("gold")) return "bg-yellow-100 text-yellow-900 border-yellow-300";
    if (t.includes("silver")) return "bg-gray-100 text-gray-800 border-gray-300";
    if (t.includes("food") || t.includes("bhog")) return "bg-orange-100 text-orange-900 border-orange-300";
    if (t.includes("stage") || t.includes("cultural")) return "bg-purple-100 text-purple-900 border-purple-300";
    return "bg-amber-50 text-amber-800 border-amber-200";
  };

  return (
    <div className="w-full space-y-6">
      {/* Brand Logos Grid with Logo Previews */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {activeSponsors.length > 0 ? (
          activeSponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between items-center text-center group relative overflow-hidden"
            >
              {/* Logo / Brand Crest */}
              <div className="w-full h-24 flex items-center justify-center p-2 mb-3 bg-gray-50/70 rounded-xl border border-gray-100 group-hover:bg-amber-50/30 transition-colors">
                {sponsor.logo_url ? (
                  <img
                    src={sponsor.logo_url}
                    alt={sponsor.name}
                    className="max-h-16 max-w-[85%] object-contain filter group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLElement).style.display = "none";
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent && !parent.querySelector(".fallback-brand-crest")) {
                        const div = document.createElement("div");
                        div.className = "fallback-brand-crest flex flex-col items-center justify-center font-bold text-gray-800 text-sm";
                        div.innerHTML = `<span class="text-xl">🏢</span><span>${sponsor.name}</span>`;
                        parent.appendChild(div);
                      }
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl mb-0.5">🏛️</span>
                    <span className="font-heading text-sm font-bold text-gray-800">{sponsor.name}</span>
                  </div>
                )}
              </div>

              {/* Sponsor Name & Tier */}
              <div className="w-full space-y-1">
                <h4 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {sponsor.name}
                </h4>
                <span
                  className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getTierColor(
                    sponsor.tier
                  )}`}
                >
                  {sponsor.tier || "Associate Partner"}
                </span>
              </div>

              {/* Website Link if present */}
              {sponsor.website && (
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 text-[11px] font-semibold text-primary hover:text-primary-hover flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <span>Visit Partner</span>
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          ))
        ) : (
          /* Available Partner Tier Placeholders */
          <>
            <div className="bg-amber-50/40 border-2 border-dashed border-amber-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center min-h-[140px]">
              <span className="text-2xl mb-1">⭐</span>
              <span className="font-bold text-sm text-gray-800">Platinum Partner</span>
              <span className="text-[11px] text-amber-700 font-semibold mt-1">Available for 2026</span>
            </div>
            <div className="bg-amber-50/40 border-2 border-dashed border-amber-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center min-h-[140px]">
              <span className="text-2xl mb-1">🥇</span>
              <span className="font-bold text-sm text-gray-800">Gold Partner</span>
              <span className="text-[11px] text-amber-700 font-semibold mt-1">Available for 2026</span>
            </div>
            <div className="bg-amber-50/40 border-2 border-dashed border-amber-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center min-h-[140px]">
              <span className="text-2xl mb-1">🍚</span>
              <span className="font-bold text-sm text-gray-800">Maha Bhog Partner</span>
              <span className="text-[11px] text-amber-700 font-semibold mt-1">Available for 2026</span>
            </div>
            <div className="bg-amber-50/40 border-2 border-dashed border-amber-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center min-h-[140px]">
              <span className="text-2xl mb-1">🎭</span>
              <span className="font-bold text-sm text-gray-800">Cultural Stage Partner</span>
              <span className="text-[11px] text-amber-700 font-semibold mt-1">Available for 2026</span>
            </div>
          </>
        )}
      </div>

      {/* Pitch Ribbon Callout */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-2xl p-3.5 border border-amber-300/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2 text-xs text-amber-950 font-medium">
          <Sparkles size={16} className="text-primary shrink-0" />
          <span>
            <strong>Showcase your brand:</strong> Reach 1,500+ residential families &amp; 5,000+ devotees with website logo placement &amp; archway stall presence.
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
