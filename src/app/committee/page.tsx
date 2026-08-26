"use client";

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

export default function CommitteePage() {
  const committeeWings = [
    {
      category: "Executive Leadership & Advisory Council",
      icon: "👑",
      tagline: "Overall governance, society alignment & festival coordination",
      members: [
        { name: "Raibatak Banerjee", role: "Convener & Digital Lead", tower: "PBEL Sanskritik Samiti" },
        { name: "Executive Committee Leads", role: "General Administration & Operations", tower: "PBEL Sanskritik Samiti" },
        { name: "Senior Resident Mentors", role: "Vedic Rituals & Advisory Council", tower: "PBEL City Community" },
      ],
    },
    {
      category: "Finance, Treasury & Audit Wing",
      icon: "💰",
      tagline: "Zero-fee bank reconciliation, verified contribution CRM & donor receipts",
      members: [
        { name: "Finance & Accounts Lead", role: "Treasurer & Bank Accounts Lead", tower: "PBEL Sanskritik Samiti" },
        { name: "Audit & Donor CRM Team", role: "Contribution Verification & Transparency", tower: "PBEL Sanskritik Samiti" },
      ],
    },
    {
      category: "Cultural Directorate & Pratibimb Stage",
      icon: "🎭",
      tagline: "Resident stage acts, rehearsals, drama, music bands & sound production",
      members: [
        { name: "Cultural Committee Lead", role: "Pratibimb Stage Director", tower: "PBEL Sanskritik Samiti" },
        { name: "Drama & Theater Wing", role: "Natok Production & Rehearsals", tower: "PBEL Sanskritik Samiti" },
        { name: "Music, Dhaak & Sound Ops", role: "Audio Engineering & Dhaaki Troupe", tower: "PBEL Sanskritik Samiti" },
      ],
    },
    {
      category: "Maha Bhog, Kitchen Seva & Anandamela",
      icon: "🍚",
      tagline: "Pure ghee bhog preparation, dining passes & resident food stalls",
      members: [
        { name: "Bhog Coordination Lead", role: "Maha Bhog Kitchen & Quality Control", tower: "PBEL Sanskritik Samiti" },
        { name: "Anandamela Food Fiesta", role: "Home Chef Stalls & Culinary Fiesta", tower: "PBEL Sanskritik Samiti" },
        { name: "Dining Hall & Operations", role: "Token Desk & Dining Hall Coordination", tower: "PBEL Sanskritik Samiti" },
      ],
    },
    {
      category: "Pandal, Pratima & Vedic Rituals",
      icon: "🌺",
      tagline: "Vedic rites, sacred samagri, 108 deepam, lighting & archway production",
      members: [
        { name: "Pujo Samagri & Purohit Seva", role: "Vedic Rites & Havan Coordination", tower: "PBEL Sanskritik Samiti" },
        { name: "Pandal & Lighting Production", role: "Pandal Architecture, LED Stage & Lighting", tower: "PBEL Sanskritik Samiti" },
        { name: "Dhaaki Troupe Management", role: "Traditional Artistes Care & Logistics", tower: "PBEL Sanskritik Samiti" },
      ],
    },
    {
      category: "Crowd Discipline, Senior Seating & Volunteer Leads",
      icon: "🤝",
      tagline: "Resident crowd management, accessible senior citizen care & safety",
      members: [
        { name: "Volunteer Operations Lead", role: "Resident Volunteer Scheduling", tower: "PBEL Sanskritik Samiti" },
        { name: "Senior Citizen & First Aid", role: "Accessible Pandal Care & Medical Desk", tower: "PBEL Sanskritik Samiti" },
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#FCFBF8] pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="w-full bg-festive-hero text-white relative overflow-hidden py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20 text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs md:text-sm font-semibold tracking-wide mb-6">
            <Users size={15} className="text-amber-400" />
            <span>PBEL Sanskritik Samiti (PSS) • 2026 Core Wings</span>
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
              <span>Join Volunteer Seva Team</span>
            </Link>
            <Link
              href="/programs"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3 rounded-full font-semibold text-sm transition"
            >
              <span>View Pujo Schedule</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CORE ORGANIZING WINGS GRID */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-100/80 px-3 py-1 rounded-full">
            6 Pillars of Durgotsav 2026
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            Organizing Wings &amp; Department Leads
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Every aspect of the festival is managed with transparency and devotion by fellow township residents.
          </p>
        </div>

        <div className="space-y-8">
          {committeeWings.map((wing, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-xs hover:border-amber-300 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{wing.icon}</span>
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
                      {wing.category}
                    </h3>
                    <span className="text-xs text-amber-800 font-medium">
                      {wing.tagline}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full shrink-0">
                  PBEL Sanskritik Samiti
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wing.members.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-amber-300 hover:bg-amber-50/40 transition flex items-center gap-3.5"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-[#5C0512] text-amber-300 font-bold flex items-center justify-center font-heading text-lg shrink-0 shadow-xs">
                      {m.name.substring(0, 1)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{m.name}</h4>
                      <div className="text-xs text-primary font-medium">{m.role}</div>
                      <span className="text-[10px] text-gray-500">{m.tower}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. VOLUNTEER CTA CALLOUT */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        <div className="bg-gradient-to-br from-[#5E0A16] to-[#3B040C] text-white rounded-3xl p-8 sm:p-10 text-center shadow-xl relative overflow-hidden">
          <h3 className="font-heading text-2xl sm:text-3xl font-bold mb-2">
            Want to Serve as an Organizing Volunteer?
          </h3>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-xl mx-auto mb-6">
            Join the resident volunteer squad across Maha Bhog distribution, Pratibimb cultural stage operations, 
            senior citizen assistance, and crowd management.
          </p>
          <Link
            href="/volunteer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D99B26] to-[#B8801C] hover:from-[#B8801C] text-white px-8 py-3 rounded-full font-bold text-xs sm:text-sm transition shadow-lg golden-glow"
          >
            <span>Register for Volunteer Seva Shifts</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

    </div>
  );
}
