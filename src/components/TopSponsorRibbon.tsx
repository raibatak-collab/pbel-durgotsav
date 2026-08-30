"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ExternalLink, Award, ArrowRight, Building2 } from "lucide-react";
import { fetchCloudConfig } from "@/utils/cloudConfig";
import { supabase } from "@/utils/supabase/client";

export interface TopSponsorItem {
  id: string;
  name: string;
  tier: string;
  logo_url?: string;
  website?: string;
  is_active?: boolean;
}

export function TopSponsorRibbon({ initialSponsors }: { initialSponsors?: TopSponsorItem[] | null }) {
  const [sponsors, setSponsors] = useState<TopSponsorItem[]>(() => {
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
    return [];
  });

  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    let isMounted = true;

    async function loadSponsors() {
      try {
        // 1. Try fetching from cloud config
        const cloud = await fetchCloudConfig<TopSponsorItem[]>("sponsors", []);
        if (cloud && Array.isArray(cloud) && cloud.length > 0) {
          if (isMounted) {
            setSponsors(cloud);
            localStorage.setItem("pbel_sponsors_list", JSON.stringify(cloud));
          }
          return;
        }

        // 2. Fallback to Supabase direct table query
        const { data: dbSponsors } = await supabase
          .from("sponsors")
          .select("id, name, tier, logo_url, website, is_active")
          .eq("is_active", true);

        if (dbSponsors && dbSponsors.length > 0 && isMounted) {
          setSponsors(dbSponsors);
          localStorage.setItem("pbel_sponsors_list", JSON.stringify(dbSponsors));
        }
      } catch (err) {
        console.error("TopSponsorRibbon loading error:", err);
      }
    }

    loadSponsors();

    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem("pbel_sponsors_list");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0 && isMounted) {
            setSponsors(parsed);
          }
        }
      } catch (_) {}
    };

    window.addEventListener("pbel_sponsors_updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("pbel_sponsors_updated", handleUpdate);
    };
  }, []);

  const activeSponsors = sponsors.filter((s) => s.is_active !== false);

  const getTierBadgeColor = (tier: string) => {
    const t = (tier || "").toLowerCase();
    if (t.includes("platinum") || t.includes("title")) return "bg-amber-400 text-amber-950 border-amber-300 font-extrabold";
    if (t.includes("gold")) return "bg-yellow-300 text-yellow-950 border-yellow-200 font-bold";
    if (t.includes("silver")) return "bg-gray-200 text-gray-900 border-gray-300 font-semibold";
    if (t.includes("food") || t.includes("bhog")) return "bg-orange-300 text-orange-950 border-orange-200 font-bold";
    if (t.includes("stage") || t.includes("cultural")) return "bg-purple-300 text-purple-950 border-purple-200 font-bold";
    return "bg-amber-200 text-amber-950 border-amber-300 font-medium";
  };

  // GRACEFUL FALLBACK A: If no sponsors are signed up yet, show an elegant partnership teaser pill
  if (activeSponsors.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto pt-1.5 px-2 box-border">
        <Link
          href="/sponsors"
          className="group w-full block bg-black/40 hover:bg-black/60 border border-amber-400/40 hover:border-amber-300/80 rounded-2xl p-2.5 sm:px-4 sm:py-2.5 backdrop-blur-md shadow-lg transition-all text-center box-border"
        >
          <div className="flex items-center justify-between gap-2 text-left">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-7 h-7 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-xs shrink-0">
                ⭐
              </span>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs font-bold text-amber-200 group-hover:text-amber-100 truncate flex items-center gap-1.5">
                  <span>Official 2026 Brand &amp; Corporate Partnerships Open</span>
                </div>
                <div className="text-[10px] text-amber-100/70 truncate hidden sm:block">
                  Title • Gold • Maha Bhog • Cultural Stage • Food Stalls (1,500+ Resident Reach)
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 group-hover:text-white shrink-0 bg-amber-500/20 px-2.5 py-1 rounded-xl border border-amber-400/30">
              <span>Inquire</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // ACTIVE SPONSORS VIEW: Premium Glassmorphism Ribbon with Touch-Friendly Mobile Track
  return (
    <div className="w-full max-w-3xl mx-auto pt-2 px-1 sm:px-2 box-border">
      <div className="bg-black/50 border border-amber-400/40 rounded-3xl p-3 sm:p-3.5 backdrop-blur-md shadow-2xl space-y-2 box-border">
        
        {/* Ribbon Header with Quick Deck Link */}
        <div className="flex items-center justify-between gap-2 px-1 pb-1 border-b border-amber-400/20">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300">
            <Sparkles size={12} className="text-amber-400 shrink-0" />
            <span>Proud Festival Patrons &amp; Corporate Partners</span>
          </div>
          <Link
            href="/sponsors"
            className="text-[10px] sm:text-[11px] text-amber-200 hover:text-white font-bold flex items-center gap-1 shrink-0 transition"
          >
            <span>Partner With Us</span>
            <ArrowRight size={11} />
          </Link>
        </div>

        {/* Responsive Horizontal Scroll Container (Smooth touch-scroll on phones, no layout breaking) */}
        <div className="w-full overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-2.5 sm:gap-3 w-max sm:w-auto sm:justify-center mx-auto px-1">
            {activeSponsors.map((sponsor) => {
              const hasLogo = sponsor.logo_url && !imageErrors.has(sponsor.id);
              const cardContent = (
                <div className="flex items-center gap-2 bg-white/95 hover:bg-white text-gray-900 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl border border-amber-300/80 shadow-md hover:shadow-xl transition-all max-w-[200px] sm:max-w-[240px] shrink-0 group">
                  
                  {/* Logo or Monogram Fallback */}
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-50 border border-gray-200 p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                    {hasLogo ? (
                      <img
                        src={sponsor.logo_url}
                        alt={sponsor.name}
                        className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
                        onError={() => {
                          setImageErrors((prev) => {
                            const next = new Set(prev);
                            next.add(sponsor.id);
                            return next;
                          });
                        }}
                      />
                    ) : (
                      <Building2 size={15} className="text-primary" />
                    )}
                  </div>

                  {/* Sponsor Name & Tier Pill */}
                  <div className="min-w-0 text-left">
                    <div className="font-heading font-bold text-[11px] sm:text-xs text-gray-900 truncate leading-tight">
                      {sponsor.name}
                    </div>
                    <span
                      className={`inline-block text-[9px] px-1.5 py-0.2 rounded-md border mt-0.5 truncate max-w-full ${getTierBadgeColor(
                        sponsor.tier
                      )}`}
                    >
                      {sponsor.tier || "Corporate Partner"}
                    </span>
                  </div>

                  {sponsor.website && (
                    <ExternalLink size={11} className="text-gray-400 group-hover:text-primary shrink-0 ml-auto hidden sm:block" />
                  )}
                </div>
              );

              if (sponsor.website) {
                return (
                  <a
                    key={sponsor.id}
                    href={sponsor.website}
                    target="_blank"
                    rel="noreferrer"
                    className="block shrink-0"
                    title={`Visit ${sponsor.name}`}
                  >
                    {cardContent}
                  </a>
                );
              }

              return (
                <Link key={sponsor.id} href="/sponsors" className="block shrink-0" title={`View ${sponsor.name} in Sponsor Directory`}>
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
