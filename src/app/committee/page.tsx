"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  Award, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Calendar, 
  ArrowRight, 
  HeartHandshake 
} from "lucide-react";
import { 
  getStoredCommittee, 
  DEFAULT_COMMITTEE_WINGS, 
  CommitteeWing 
} from "@/config/committee";
import { 
  getStoredBranding, 
  DEFAULT_BRANDING, 
  SamitiBrandingConfig 
} from "@/config/branding";

export default function CommitteePage() {
  const [committeeWings, setCommitteeWings] = useState<CommitteeWing[]>(DEFAULT_COMMITTEE_WINGS);
  const [branding, setBranding] = useState<SamitiBrandingConfig>(DEFAULT_BRANDING);

  useEffect(() => {
    try {
      setCommitteeWings(getStoredCommittee());
      setBranding(getStoredBranding());

      const handleCommitteeUpdate = () => {
        setCommitteeWings(getStoredCommittee());
      };
      const handleBrandingUpdate = () => {
        setBranding(getStoredBranding());
      };

      window.addEventListener("pbel_committee_updated", handleCommitteeUpdate);
      window.addEventListener("pbel_branding_updated", handleBrandingUpdate);

      return () => {
        window.removeEventListener("pbel_committee_updated", handleCommitteeUpdate);
        window.removeEventListener("pbel_branding_updated", handleBrandingUpdate);
      };
    } catch (_) {}
  }, []);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#FCFBF8] pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="w-full bg-festive-hero text-white relative overflow-hidden py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20 text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs md:text-sm font-semibold tracking-wide mb-6">
            {branding.pssLogoUrl ? (
              <img
                src={branding.pssLogoUrl}
                alt="PSS Logo"
                className="w-4 h-4 rounded-full object-cover border border-amber-400"
              />
            ) : (
              <Users size={15} className="text-amber-400" />
            )}
            <span>{branding.samitiName || "PBEL Sanskritik Samiti (PSS)"} • 2026 Core Wings</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Our <span className="text-gold-gradient">Organizing Committee</span>
          </h1>

          <p className="text-base sm:text-lg text-amber-100/90 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
            Meet the dedicated resident organizers and volunteer leads working behind the scenes 
            to bring the 6-day grand celebration of devotion, culture, and community harmony to PBEL City, Hyderabad.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/volunteer"
              className="bg-gradient-to-r from-[#D99B26] to-[#B8801C] hover:from-[#B8801C] text-white px-8 py-3 rounded-full font-bold text-sm transition shadow-lg golden-glow flex items-center gap-2"
            >
              <HeartHandshake size={16} />
              <span>Join Volunteer Seva</span>
            </Link>
            <Link
              href="/contribute"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3 rounded-full font-semibold text-sm transition backdrop-blur-md flex items-center gap-2"
            >
              <span>Contribute Seva</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CORE WINGS & LEADERSHIP DIRECTORY */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            PBEL Sanskritik Samiti (PSS) Wings
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Organized across dedicated execution wings to ensure seamless rituals, safety, cultural stage acts, and community dining.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {committeeWings.map((wing) => (
            <div 
              key={wing.id || wing.category}
              className="bg-white rounded-3xl border border-amber-400/20 p-6 shadow-sm hover:shadow-md transition-all hover:border-amber-400/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shrink-0">
                    {wing.icon}
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-gray-900 leading-tight">
                      {wing.category}
                    </h3>
                    <span className="text-[11px] text-amber-800 font-medium line-clamp-1">
                      {wing.tagline}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-gray-100 mt-4">
                  {wing.members.map((member) => (
                    <div key={member.id || member.name} className="py-2.5 first:pt-0 last:pb-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="text-xs font-bold text-gray-900">
                          {member.name}
                        </h4>
                        <span className="text-[10px] text-gray-500 font-mono shrink-0">
                          {member.tower}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-900 font-medium">
                        {member.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span className="flex items-center gap-1 font-semibold text-primary">
                  <ShieldCheck size={13} /> Official Committee Wing
                </span>
                <span>{wing.members.length} Leads</span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 3. PHILOSOPHY & TRANSPARENCY BANNER */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4">
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-400/30 rounded-3xl p-8 text-center space-y-4">
          <Sparkles className="mx-auto text-amber-600" size={28} />
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
            Dedicated to Devotion, Transparency &amp; Community Harmony
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            PBEL Sanskritik Samiti operates on 100% voluntary seva principles. All verified contributions 
            are directly reconciled with zero gateway fees, ensuring complete financial transparency and 
            uniting over 1,500 families in festive joy.
          </p>
          <div className="pt-2">
            <Link
              href="/contribute"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-7 py-3 rounded-full text-xs font-bold transition shadow-sm golden-glow"
            >
              <span>Join as a Pujo Contributor / Sponsor</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
