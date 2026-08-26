"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  Award, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Utensils, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  Download,
  Calendar,
  Clock
} from "lucide-react";

interface PssMember {
  id: string;
  name: string;
  tower: string;
  flatNumber: string;
  phone?: string;
  headcount: number;
  status: "Active" | "Renewal";
  joinedYear?: string;
}

const defaultSeedMembers: PssMember[] = [
  { id: "M-1", name: "Raibatak Banerjee", tower: "Tower C (Coral)", flatNumber: "402", headcount: 4, status: "Active", joinedYear: "2026" },
  { id: "M-2", name: "Anirban Mukherjee", tower: "Tower B (Sapphire)", flatNumber: "1104", headcount: 4, status: "Active", joinedYear: "2026" },
  { id: "M-3", name: "Sourav Ganguly & Family", tower: "Tower A (Emerald)", flatNumber: "802", headcount: 5, status: "Active", joinedYear: "2026" },
  { id: "M-4", name: "Debashis & Sharmila Roy", tower: "Tower F (Pearl)", flatNumber: "1401", headcount: 4, status: "Active", joinedYear: "2026" },
  { id: "M-5", name: "Kalyan & Rupa Sengupta", tower: "Tower D (Topaz)", flatNumber: "603", headcount: 3, status: "Active", joinedYear: "2026" },
  { id: "M-6", name: "Tanmoy & Poulomi Bhattacharya", tower: "Tower E (Ruby)", flatNumber: "904", headcount: 4, status: "Active", joinedYear: "2026" },
  { id: "M-7", name: "Abhijit & Sudeshna Das", tower: "Tower H (Diamond)", flatNumber: "1203", headcount: 6, status: "Active", joinedYear: "2026" },
  { id: "M-8", name: "Amitava & Joyeeta Sen", tower: "Tower G (Jade)", flatNumber: "501", headcount: 4, status: "Active", joinedYear: "2026" },
  { id: "M-9", name: "Prosenjit & Ananya Dutta", tower: "Tower J (Aquamarine)", flatNumber: "702", headcount: 3, status: "Active", joinedYear: "2026" },
  { id: "M-10", name: "Subhasish & Piyali Ghosh", tower: "Tower K (Opal)", flatNumber: "1004", headcount: 5, status: "Active", joinedYear: "2026" },
];

export default function CommitteePage() {
  const [activeTab, setActiveTab] = useState<"committee" | "members">("members");
  const [membersList, setMembersList] = useState<PssMember[]>(defaultSeedMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTowerFilter, setSelectedTowerFilter] = useState("ALL");
  const [selectedPassModal, setSelectedPassModal] = useState<any | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pbel_pss_members");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMembersList(parsed);
        }
      }
    } catch (_) {}
  }, []);

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

  const filteredMembers = membersList.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = 
      !q || 
      m.name.toLowerCase().includes(q) || 
      m.flatNumber.toLowerCase().includes(q) || 
      m.tower.toLowerCase().includes(q);

    const matchesTower = 
      selectedTowerFilter === "ALL" || 
      m.tower.toLowerCase().includes(selectedTowerFilter.toLowerCase());

    return matchesQuery && matchesTower;
  });

  const handleClaimPass = (member: PssMember, dayName: string = "All 4 Pujo Days") => {
    const cappedHeadcount = Math.min(Math.max(Number(member.headcount) || 4, 1), 6);
    const cleanFlat = member.flatNumber.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const towerLetter = member.tower.split(" ")[1] || "C";
    const passId = `PSS-BHOG-2026-T${towerLetter}-${cleanFlat}`;

    const pass = {
      passId,
      name: member.name,
      tower: member.tower,
      flatNumber: member.flatNumber,
      phone: member.phone || "PBEL Resident",
      passCount: cappedHeadcount,
      days: dayName === "All 4 Pujo Days" ? ["saptami", "ashtami", "nabami", "dashami"] : [dayName.toLowerCase().replace(/[^a-z]/g, "")],
      dayLabel: dayName,
      issuedAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Save into local bhog passes registry
    try {
      const existing = JSON.parse(localStorage.getItem("pbel_bhog_passes") || "[]");
      const filtered = existing.filter((p: any) => p.passId !== passId);
      filtered.unshift(pass);
      localStorage.setItem("pbel_bhog_passes", JSON.stringify(filtered));
    } catch (_) {}

    setSelectedPassModal(pass);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#FCFBF8] pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="w-full bg-festive-hero text-white relative overflow-hidden py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20 text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs md:text-sm font-semibold tracking-wide mb-6">
            <Users size={15} className="text-amber-400" />
            <span>PBEL Sanskritik Samiti (PSS) Directory</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            PSS Members & <span className="text-gold-gradient">Organizing Committee</span>
          </h1>

          <p className="text-base sm:text-lg text-amber-100/90 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
            Honoring our <strong>Patron Member Families (₹7,500 Yearly Membership)</strong> and the dedicated organizing wings 
            who unite our township in Maa Durga's celebration.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/bhog-pass"
              className="bg-gradient-to-r from-[#D99B26] to-[#B8801C] hover:from-[#B8801C] text-white px-8 py-3 rounded-full font-bold text-sm transition shadow-lg golden-glow flex items-center gap-2"
            >
              <Utensils size={16} />
              <span>Claim Daily Bhog Pass (Max 6)</span>
            </Link>
            <Link
              href="/volunteer"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3 rounded-full font-semibold text-sm transition"
            >
              <span>Join Volunteer Seva</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. DUAL TAB SWITCHER */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="bg-white p-2 rounded-2xl border border-amber-300/80 shadow-md flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("members")}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === "members"
                ? "bg-primary text-white shadow-md golden-glow"
                : "bg-gray-50 text-gray-700 hover:bg-amber-50"
            }`}
          >
            <Users size={16} />
            <span>1. PSS Annual Members Roster ({membersList.length} Families)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("committee")}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === "committee"
                ? "bg-primary text-white shadow-md golden-glow"
                : "bg-gray-50 text-gray-700 hover:bg-amber-50"
            }`}
          >
            <Award size={16} />
            <span>2. Core Organizing Wings & Leads (6 Departments)</span>
          </button>
        </div>
      </div>

      {/* 3. TAB CONTENT 1: PSS MEMBERS DIRECTORY & LUNCH PASS BUTTONS */}
      {activeTab === "members" && (
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          
          {/* Search & Tower Filter Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member name or flat..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-gray-500 font-semibold shrink-0">Tower:</span>
              {["ALL", "Tower A", "Tower B", "Tower C", "Tower D", "Tower E", "Tower F", "Tower G", "Tower H", "Tower J", "Tower K"].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTowerFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
                    selectedTowerFilter === t
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Members Table with Day-Wise Lunch Pass Buttons */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-heading text-base font-bold text-gray-900">
                  PSS Registered Patron Member Families ({filteredMembers.length})
                </h3>
                <span className="text-xs text-gray-500">
                  Click the day-wise buttons to generate official lunch passes (capped at max 6 members per family).
                </span>
              </div>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full border border-amber-300">
                ₹7,500 Annual Member Seva
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                    <th className="p-3.5">Family Head & Flat</th>
                    <th className="p-3.5">Membership Status</th>
                    <th className="p-3.5">Family Headcount</th>
                    <th className="p-3.5 text-center">Day-Wise Lunch Pass Generation (Capped at 6)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-amber-50/40 transition">
                      <td className="p-3.5">
                        <span className="font-bold text-gray-900 block text-sm">{m.name}</span>
                        <span className="text-gray-500 text-xs">{m.tower} • Flat {m.flatNumber}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-800 border border-green-200 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                          <CheckCircle2 size={12} className="text-green-600" />
                          <span>₹7,500 Active</span>
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-gray-900 font-heading text-sm">
                          {Math.min(m.headcount || 4, 6)} Members
                        </span>
                        <span className="text-[10px] text-gray-400 block">(Max 6 capped)</span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          {["Saptami", "Ashtami", "Nabami", "Dashami"].map((day) => (
                            <button
                              key={day}
                              onClick={() => handleClaimPass(m, day)}
                              className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold px-2.5 py-1 rounded-lg text-[11px] transition border border-amber-300 shadow-2xs"
                              title={`Generate ${day} Lunch Pass for ${Math.min(m.headcount || 4, 6)} members`}
                            >
                              🍛 {day}
                            </button>
                          ))}
                          <button
                            onClick={() => handleClaimPass(m, "All 4 Pujo Days")}
                            className="bg-primary hover:bg-primary-hover text-white font-bold px-3 py-1 rounded-lg text-[11px] transition shadow-2xs"
                            title="Generate All Days Pass"
                          >
                            🎫 All Days
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </section>
      )}

      {/* 4. TAB CONTENT 2: CORE ORGANIZING WINGS */}
      {activeTab === "committee" && (
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
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
      )}

      {/* 5. DIGITAL PASS POPUP MODAL */}
      {selectedPassModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-amber-400 shadow-2xl relative text-center animate-fade-in">
            <button
              onClick={() => setSelectedPassModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3">
              <ShieldCheck size={13} className="text-primary" />
              <span>Official PSS Dining Pass</span>
            </div>

            <h2 className="font-heading text-2xl font-bold text-primary mb-1">
              Maha Bhog Lunch Token
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              PBEL Sanskritik Samiti • PBEL City Durgotsav 2026
            </p>

            <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FDF8F0] rounded-2xl p-5 border border-amber-300 text-left space-y-3 mb-6 shadow-sm">
              <div className="flex items-center justify-between pb-2.5 border-b border-amber-900/10">
                <div>
                  <span className="font-heading text-lg font-bold text-gray-900 block">{selectedPassModal.name}</span>
                  <span className="text-xs text-amber-800 font-semibold">{selectedPassModal.tower} • Flat {selectedPassModal.flatNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block font-mono">TOKEN ID</span>
                  <span className="font-mono text-xs font-bold text-primary">{selectedPassModal.passId}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500 text-[11px] block">Daily Pass Headcount</span>
                  <span className="font-bold text-green-700 text-base font-heading">{selectedPassModal.passCount} Members</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[11px] block">Dining Timing</span>
                  <span className="font-semibold text-gray-900">01:00 PM – 03:30 PM</span>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-900/10 text-xs">
                <span className="text-gray-500 text-[11px] block mb-1">Selected Day:</span>
                <span className="bg-amber-200/90 text-amber-950 text-xs font-bold px-3 py-1 rounded-full">
                  🍛 {selectedPassModal.dayLabel || "All Pujo Days"}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download size={14} />
                <span>Save / Print Token</span>
              </button>
              <button
                onClick={() => setSelectedPassModal(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-3 rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
