"use client";

import Link from "next/link";
import { 
  Users, 
  Award, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Music, 
  Utensils, 
  Flame, 
  ArrowRight, 
  Mail, 
  Phone 
} from "lucide-react";

export default function CommitteePage() {
  const committeeWings = [
    {
      category: "Executive Leadership & Advisory Council",
      icon: "👑",
      members: [
        { name: "Raibatak Banerjee", role: "Convener & Digital Lead", tower: "Tower C (Coral)" },
        { name: "Executive Committee Leads", role: "General Administration", tower: "PBEL Sanskritik Samiti" },
        { name: "Senior Resident Mentors", role: "Pujo Rituals & Advisory", tower: "Advisory Council" },
      ],
    },
    {
      category: "Finance, Treasury & Audit Wing",
      icon: "💰",
      members: [
        { name: "Finance & Accounts Lead", role: "Treasurer & Bank Reconciliation", tower: "Tower B (Sapphire)" },
        { name: "Audit & Donor CRM", role: "Contribution Verification", tower: "Tower D (Topaz)" },
      ],
    },
    {
      category: "Cultural Directorate & Pratibimb Stage",
      icon: "🎭",
      members: [
        { name: "Cultural Committee Lead", role: "Pratibimb Stage Director", tower: "Tower A (Emerald)" },
        { name: "Drama & Natok Production", role: "Theater & Rehearsals", tower: "Tower F (Pearl)" },
        { name: "Music, Bands & Sound", role: "Audio Engineering & Dhaak Beats", tower: "Tower H (Diamond)" },
      ],
    },
    {
      category: "Maha Bhog, Kitchen Seva & Anandamela",
      icon: "🍚",
      members: [
        { name: "Bhog Coordination Lead", role: "Pure Ghee Maha Bhog Feast", tower: "Tower C (Coral)" },
        { name: "Anandamela Food Fiesta", role: "Resident Home Chef Stalls", tower: "Tower E (Ruby)" },
        { name: "Dining Hall Operations", role: "Lunch Pass & Counter Management", tower: "Tower J (Aquamarine)" },
      ],
    },
    {
      category: "Pandal, Pratima & Vedic Rituals",
      icon: "🌺",
      members: [
        { name: "Pujo Samagri & Purohit Seva", role: "Vedic Rites & 108 Deepam", tower: "Tower K (Opal)" },
        { name: "Pandal & Lighting Production", role: "LED Screens, Archway & Stage", tower: "Tower G (Jade)" },
        { name: "Dhaaki Troupe Management", role: "Kolkata Artistes Coordination", tower: "Tower B (Sapphire)" },
      ],
    },
    {
      category: "Crowd Discipline, Senior Seating & Volunteer Leads",
      icon: "🤝",
      members: [
        { name: "Volunteer Operations Lead", role: "Resident Duty Scheduling", tower: "Tower A (Emerald)" },
        { name: "Senior Citizen & First Aid", role: "Accessible Pandal Care", tower: "Tower H (Diamond)" },
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
            <span>PBEL Sanskritik Samiti (PSS) • Organizing Team</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Our <span className="text-gold-gradient">Organizing Committee</span>
          </h1>

          <p className="text-base sm:text-lg text-amber-100/90 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
            Meet the passionate township residents and committee leaders working tirelessly behind the scenes 
            to bring the magic of Durga Pujo to PBEL City, Hyderabad.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/volunteer"
              className="bg-gradient-to-r from-[#D99B26] to-[#B8801C] hover:from-[#B8801C] text-white px-8 py-3 rounded-full font-bold text-sm transition shadow-lg golden-glow flex items-center gap-2"
            >
              <Heart size={16} />
              <span>Join the Volunteer Seva Team</span>
            </Link>
            <Link
              href="/contribute"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3 rounded-full font-semibold text-sm transition"
            >
              <span>Support via E-Seva</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. COMMITTEE WINGS GRID */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="space-y-10">
          {committeeWings.map((wing, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <span className="text-3xl">{wing.icon}</span>
                <div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
                    {wing.category}
                  </h3>
                  <span className="text-xs text-amber-800 font-semibold">
                    Core Organizing Wing • PBEL Sanskritik Samiti
                  </span>
                </div>
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

    </div>
  );
}
