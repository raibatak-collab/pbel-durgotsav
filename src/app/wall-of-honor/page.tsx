"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Search, 
  Filter, 
  HeartHandshake, 
  ArrowRight, 
  Building2, 
  Award, 
  ShieldCheck, 
  Calendar,
  Users,
  CheckCircle2,
  X,
  Printer,
  Share2
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { fetchCloudConfig } from "@/utils/cloudConfig";
import { PBEL_TOWERS, matchTower } from "@/config/towers";
import { DEFAULT_BRANDING, SamitiBrandingConfig, fetchStoredBranding } from "@/config/branding";
import { 
  PssLogoFallback, 
  DurgotsavLogoFallback, 
  SamitiOfficialSeal, 
  DefaultPresidentSignature 
} from "@/components/OfficialContributionReceipt";

interface ContributorRecord {
  id: string;
  amount: number | string;
  contributor_name: string;
  flat_number: string;
  is_name_visible: boolean;
  category_id?: string;
  created_at?: string;
  status?: string;
  contribution_categories?: {
    name?: string;
  };
}

export default function WallOfHonorPage() {
  const [contributions, setContributions] = useState<ContributorRecord[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTower, setSelectedTower] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [memberFamiliesCount, setMemberFamiliesCount] = useState<number>(0);
  const [selectedMemento, setSelectedMemento] = useState<ContributorRecord | null>(null);
  const [branding, setBranding] = useState<SamitiBrandingConfig>(DEFAULT_BRANDING);

  useEffect(() => {
    async function loadWallData() {
      setIsLoading(true);
      try {
        // 1. Fetch Categories for seva badge lookup (column is 'name')
        const { data: dbCategories } = await supabase
          .from("contribution_categories")
          .select("id, name");
        
        const catMap: Record<string, string> = {};
        if (dbCategories) {
          dbCategories.forEach((cat: any) => {
            catMap[cat.id] = cat.name;
          });
        }
        setCategoriesMap(catMap);

        // 2. Fetch all successful contributions with joined category name
        const { data: dbContributions, error } = await supabase
          .from("contributions")
          .select("id, amount, contributor_name, flat_number, is_name_visible, category_id, created_at, status, contribution_categories(name)")
          .eq("status", "Success")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching contributions for Wall of Honor:", error);
        } else if (dbContributions) {
          setContributions(dbContributions as ContributorRecord[]);
        }

        // 3. Fetch PSS members count for community solidarity
        const pssMembers = await fetchCloudConfig<any[]>("pss_members", []);
        if (pssMembers && Array.isArray(pssMembers)) {
          setMemberFamiliesCount(pssMembers.length);
        }
      } catch (err) {
        console.error("Failed to load Wall of Honor data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadWallData();
    fetchStoredBranding().then((b) => { if (b) setBranding(b); });
  }, []);

  // Compute key impact metrics
  const totalRaised = useMemo(() => {
    return contributions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [contributions]);

  const uniqueTowersRepresented = useMemo(() => {
    const towers = new Set<string>();
    contributions.forEach((c) => {
      if (c.flat_number) {
        const matched = matchTower(c.flat_number);
        if (matched) {
          towers.add(matched.id);
        }
      }
    });
    return towers.size;
  }, [contributions]);

  // Filtered list based on date, tower, and search query
  const filteredContributors = useMemo(() => {
    return contributions.filter((c) => {
      // 1. Date filter (match local calendar date YYYY-MM-DD)
      if (selectedDate) {
        if (!c.created_at) return false;
        const contribDate = new Date(c.created_at);
        const y = contribDate.getFullYear();
        const m = String(contribDate.getMonth() + 1).padStart(2, "0");
        const d = String(contribDate.getDate()).padStart(2, "0");
        const dateStr = `${y}-${m}-${d}`;
        if (dateStr !== selectedDate) return false;
      }

      // 2. Tower filter
      if (selectedTower !== "all") {
        if (selectedTower === "well-wishers") {
          if (c.is_name_visible && c.flat_number && matchTower(c.flat_number)) {
            return false;
          }
        } else {
          const matched = matchTower(c.flat_number || "");
          if (!matched || matched.id !== selectedTower) {
            return false;
          }
        }
      }

      // 3. Search query (Resident name, flat number, or seva offering category)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const displayName = c.is_name_visible ? c.contributor_name.toLowerCase() : "devout well wisher anonymous";
        const flat = (c.flat_number || "").toLowerCase();
        const categoryTitle = (
          (c.category_id && categoriesMap[c.category_id]) ||
          c.contribution_categories?.name ||
          ""
        ).toLowerCase();
        return displayName.includes(term) || flat.includes(term) || categoryTitle.includes(term);
      }

      return true;
    });
  }, [contributions, selectedDate, selectedTower, searchTerm, categoriesMap]);

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-gray-900 pb-20">
      
      {/* 1. HERO HEADER WITH BENGALI CHANTING */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#3D0C11] via-[#2A0509] to-[#1F0307] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-xs">
            <Sparkles size={14} className="text-amber-400 animate-pulse" />
            <span>॥ ভক্ত সম্মাননা ॥ • Devotee Wall of Honor</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-amber-100 tracking-tight leading-tight">
            Devotional Solidarity & Honor Roll
          </h1>

          <p className="text-amber-200/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            With heartfelt gratitude to our PBEL City community residents and well-wishers whose generous seva, dedication, and patronage power PBEL City Durgotsav 2026.
          </p>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/contribute"
              className="bg-amber-500 hover:bg-amber-400 text-amber-950 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
            >
              <HeartHandshake size={16} />
              <span>Offer Your Seva</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              href="/programs"
              className="bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-400/30 px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition backdrop-blur-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} />
              <span>View Pujo Nirghanto</span>
            </Link>
          </div>
        </div>

        {/* 2. IMPACT COUNTERS */}
        <div className="relative max-w-5xl mx-auto mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
          <div className="bg-black/30 border border-amber-500/20 rounded-2xl p-4 backdrop-blur-xs">
            <span className="block text-2xl sm:text-3xl font-extrabold font-heading text-amber-300">
              {contributions.length}
            </span>
            <span className="text-[11px] sm:text-xs text-amber-100/70 font-medium">
              Verified Devotees
            </span>
          </div>

          <div className="bg-black/30 border border-amber-500/20 rounded-2xl p-4 backdrop-blur-xs">
            <span className="block text-2xl sm:text-3xl font-extrabold font-heading text-amber-300 font-mono">
              ₹{totalRaised.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] sm:text-xs text-amber-100/70 font-medium">
              Devotee Seva Raised
            </span>
          </div>

          <div className="bg-black/30 border border-amber-500/20 rounded-2xl p-4 backdrop-blur-xs">
            <span className="block text-2xl sm:text-3xl font-extrabold font-heading text-amber-300">
              {uniqueTowersRepresented || 14}
            </span>
            <span className="text-[11px] sm:text-xs text-amber-100/70 font-medium">
              PBEL Towers United
            </span>
          </div>

          <div className="bg-black/30 border border-amber-500/20 rounded-2xl p-4 backdrop-blur-xs">
            <span className="block text-2xl sm:text-3xl font-extrabold font-heading text-amber-300">
              {memberFamiliesCount > 0 ? `${memberFamiliesCount}+` : "100%"}
            </span>
            <span className="text-[11px] sm:text-xs text-amber-100/70 font-medium">
              {memberFamiliesCount > 0 ? "PSS Member Families" : "Transparent Seva"}
            </span>
          </div>
        </div>
      </section>

      {/* 3. SEARCH & TOWER / DATE FILTER CONTROLS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-amber-200/80 space-y-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Resident Name, Flat Number (e.g. 1106, Tower D), or Seva Offering..."
              className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 px-2 py-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Date Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-gray-100 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-500 font-semibold flex items-center gap-1 shrink-0">
                <Calendar size={14} className="text-amber-600" />
                <span>Filter by Date:</span>
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 cursor-pointer transition"
                title="Filter by contribution date"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate("")}
                  className="text-[11px] text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>Clear Date</span>
                  <X size={12} />
                </button>
              )}
            </div>

            {selectedDate && (
              <span className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-medium">
                Showing offerings for: <strong className="text-amber-950">{new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong> ({filteredContributors.length} found)
              </span>
            )}
          </div>

          {/* Tower Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs border-t border-gray-100 pt-3">
            <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px] pl-1 pr-1.5 flex items-center gap-1 shrink-0">
              <Filter size={11} /> Towers:
            </span>

            <button
              onClick={() => setSelectedTower("all")}
              className={`px-3 py-1.5 rounded-full font-bold transition shrink-0 cursor-pointer ${
                selectedTower === "all"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Towers ({contributions.length})
            </button>

            {PBEL_TOWERS.map((t) => {
              const count = contributions.filter((c) => {
                const m = matchTower(c.flat_number || "");
                return m && m.id === t.id;
              }).length;

              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTower(t.id)}
                  className={`px-3 py-1.5 rounded-full font-semibold transition shrink-0 cursor-pointer flex items-center gap-1 ${
                    selectedTower === t.id
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-amber-50/70 text-amber-950 hover:bg-amber-100 border border-amber-200/50"
                  }`}
                >
                  <span>{t.tower}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedTower === t.id ? "bg-amber-800 text-amber-100" : "bg-amber-200/60 text-amber-900"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              onClick={() => setSelectedTower("well-wishers")}
              className={`px-3 py-1.5 rounded-full font-semibold transition shrink-0 cursor-pointer ${
                selectedTower === "well-wishers"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Well Wishers
            </button>
          </div>
        </div>
      </section>

      {/* 4. DEVOTEE CONTRIBUTORS GRID */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Award size={20} className="text-amber-600" />
              <span>Devotee Contributions</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Showing {filteredContributors.length} of {contributions.length} offerings
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
            <ShieldCheck size={14} />
            <span>100% Verified Community Seva</span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500">Loading Devotee Wall of Honor...</p>
          </div>
        ) : filteredContributors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContributors.map((c, idx) => {
              const matched = matchTower(c.flat_number || "");
              const sevaTitle = 
                (c.category_id && categoriesMap[c.category_id]) ||
                c.contribution_categories?.name ||
                "General Pujo Fund";

              const formattedDate = c.created_at
                ? new Date(c.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Durgotsav 2026";

              return (
                <div
                  key={c.id || idx}
                  className="bg-white rounded-2xl p-5 border border-amber-200/70 shadow-xs hover:shadow-md hover:border-amber-400 transition flex flex-col justify-between relative group"
                >
                  {/* Top: Avatar, Name & Tower */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-900 font-bold font-heading text-base flex items-center justify-center border border-amber-300/60 shadow-2xs">
                          {c.is_name_visible && c.contributor_name ? (
                            c.contributor_name.charAt(0).toUpperCase()
                          ) : (
                            "🪔"
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug group-hover:text-amber-800 transition">
                            {c.is_name_visible ? c.contributor_name : "Devout Well Wisher"}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                            <Building2 size={12} className="text-amber-600" />
                            <span>
                              {c.is_name_visible && c.flat_number
                                ? c.flat_number
                                : matched
                                ? matched.fullName
                                : "PBEL City Community"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0" title="Verified Seva Contribution">
                        <CheckCircle2 size={13} />
                      </span>
                    </div>

                    {/* Seva Offering Badge (Shows Exact Category) */}
                    <div className="mt-2 bg-amber-50/80 border border-amber-200/60 rounded-xl p-2.5 text-xs">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                        Devotional Offering:
                      </span>
                      <span className="font-semibold text-amber-950 line-clamp-1" title={sevaTitle}>
                        {sevaTitle}
                      </span>
                    </div>
                  </div>

                  {/* Bottom: Date & Devotional Memento Action */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{formattedDate}</span>
                    </div>

                    {/* Graceful Keepsake Memento Trigger (Replaces static text) */}
                    <button
                      onClick={() => setSelectedMemento(c)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-100 to-amber-200/80 hover:from-amber-200 hover:to-amber-300 text-amber-950 border border-amber-300/80 text-[11px] font-bold transition shadow-2xs hover:shadow-xs cursor-pointer group/memento"
                      title="View, print, or save devotional memento card"
                    >
                      <Sparkles size={11} className="text-amber-700 group-hover/memento:scale-110 transition-transform" />
                      <span>Memento Card 🪔</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 border border-gray-200 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <h3 className="font-heading text-lg font-bold text-gray-900">
              No matching contributors found
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We couldn&apos;t find any records matching your search or filters. Try adjusting the search term or clearing date/tower filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedTower("all");
                setSelectedDate("");
              }}
              className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* 5. DEVOTIONAL CTA FOOTER BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 print:hidden">
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-200 bg-black/20 px-3 py-1 rounded-full inline-block">
              ॥ মা দুর্গার চরণে পুষ্পাঞ্জলি ॥
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold">
              Join the PBEL City Durgotsav Wall of Honor
            </h3>
            <p className="text-sm text-amber-100/90 max-w-lg">
              Every seva, large or small, lights up our pandal, feeds devotees with sacred Maha Bhog, and supports traditional artistry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contribute"
              className="bg-white hover:bg-amber-50 text-amber-950 font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition shadow-md hover:shadow-lg cursor-pointer"
            >
              Offer Seva Now
            </Link>
            <Link
              href="/gallery"
              className="bg-black/20 hover:bg-black/30 border border-white/40 text-white font-semibold px-5 py-3 rounded-full text-xs sm:text-sm transition cursor-pointer"
            >
              Explore Media Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* 6. DEVOTIONAL KEEPSAKE MEMENTO MODAL */}
      {selectedMemento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-amber-400/80 overflow-hidden relative my-auto print:shadow-none print:border-none print:max-w-none print:w-full print:rounded-none">
            
            {/* Modal Control Bar (Hidden in Print) */}
            <div className="print:hidden bg-gradient-to-r from-[#3D0C11] via-[#2A0509] to-[#1F0307] text-white p-4 px-6 flex items-center justify-between border-b border-amber-500/30">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400 animate-pulse" />
                <span className="font-heading font-bold text-amber-200 text-sm sm:text-base">
                  Devotional Keepsake Memento Card
                </span>
              </div>
              <button
                onClick={() => setSelectedMemento(null)}
                className="p-1 text-amber-200/70 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
                title="Close Memento"
              >
                <X size={20} />
              </button>
            </div>

            {/* Print & Share Action Bar (Hidden in Print) */}
            <div className="print:hidden bg-amber-50/90 border-b border-amber-200/60 p-3 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <p className="text-gray-600 text-[11px] truncate">
                Official Keepsake Memento • Private &amp; free of monetary amounts
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const devName = selectedMemento.is_name_visible ? selectedMemento.contributor_name : "Devout Well Wisher";
                    const flat = selectedMemento.flat_number || "PBEL City";
                    const seva = (selectedMemento.category_id && categoriesMap[selectedMemento.category_id]) || selectedMemento.contribution_categories?.name || "Devotional Seva";
                    const shareText = `🌺 *শুভ শারদীয়া • PBEL City Durgotsav 2026* 🌺\nJoy Maa Durga!\n\n"Thank you for being part of PBEL Durgotsav 2026!" 🙏\n\nDevotional Keepsake Memento for *${devName}* (${flat}).\nSeva Offering: *${seva}*\n\nMay Maa Durga shower divine health, happiness, and peace upon your home!\n\nView Devotee Wall of Honor:\n👉 https://www.pbelcitydurgotsav.com/wall-of-honor\n\n_PBEL Sanskritik Samiti (PSS)_`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
                  }}
                  className="flex-1 sm:flex-initial bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold px-3 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Share Memento on WhatsApp"
                >
                  <Share2 size={13} />
                  <span>Share WhatsApp</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-initial bg-primary hover:bg-primary-hover text-white font-bold px-3 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs golden-glow"
                  title="Print or Save Memento as PDF"
                >
                  <Printer size={13} />
                  <span>Print Memento</span>
                </button>
              </div>
            </div>

            {/* MEMENTO CERTIFICATE BODY (PRINT-PERFECT LAYOUT) */}
            <div className="p-5 sm:p-7 bg-[#FFFDF9] text-gray-900 relative print:p-6">
              {/* Outer Traditional Crimson & Gold Border */}
              <div className="rounded-2xl border-4 border-[#991B1B] p-5 sm:p-6 relative shadow-inner bg-[radial-gradient(#FFF8EE_1px,transparent_1px)] [background-size:12px_12px]">
                {/* Inner Gold Inset Frame */}
                <div className="absolute inset-1.5 border border-[#D97706]/70 rounded-xl pointer-events-none" />

                {/* Auspicious Corner Motifs */}
                <div className="absolute top-2 left-2 text-[#991B1B] text-xs select-none">❖</div>
                <div className="absolute top-2 right-2 text-[#991B1B] text-xs select-none">❖</div>
                <div className="absolute bottom-2 left-2 text-[#991B1B] text-xs select-none">❖</div>
                <div className="absolute bottom-2 right-2 text-[#991B1B] text-xs select-none">❖</div>

                {/* Top Logos & Sacred Chant */}
                <div className="text-center space-y-2">
                  {/* Watermark in background */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.04] print:opacity-[0.06] overflow-hidden">
                    {branding.durgotsavLogoUrl ? (
                      <img src={branding.durgotsavLogoUrl} alt="" className="w-56 sm:w-72 object-contain" />
                    ) : (
                      <DurgotsavLogoFallback className="w-56 sm:w-72" />
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-3 relative z-10">
                    {branding.pssLogoUrl ? (
                      <img
                        src={branding.pssLogoUrl}
                        alt="PBEL Sanskritik Samiti Emblem"
                        className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-xl"
                      />
                    ) : (
                      <PssLogoFallback className="w-12 h-12 sm:w-14 sm:h-14" />
                    )}
                    <div>
                      <h4 className="font-heading text-base sm:text-lg font-bold text-primary tracking-tight uppercase">
                        {branding.samitiName || "PBEL SANSKRITIK SAMITI"}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-amber-800 font-semibold tracking-wide uppercase">
                        {branding.festivalName || "PBEL CITY DURGOTSAV 2026"} • HYDERABAD
                      </p>
                    </div>
                    {branding.durgotsavLogoUrl ? (
                      <img
                        src={branding.durgotsavLogoUrl}
                        alt="PBEL City Durgotsav Logo"
                        className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-xl"
                      />
                    ) : (
                      <DurgotsavLogoFallback className="w-12 h-12 sm:w-14 sm:h-14" />
                    )}
                  </div>

                  {/* Sacred Sanskrit Invocation */}
                  <div className="py-1">
                    <p className="font-serif text-[10px] sm:text-xs text-amber-900/90 italic tracking-wider font-semibold">
                      ॥ সর্বমঙ্গল মঙ্গল্যে শিবে সর্বার্থ সাধিকে । শরণ্যে ত্র্যম্বকে গৌরি নারায়ণি নমোহস্তুতে ॥
                    </p>
                  </div>

                  <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-[#D97706] to-transparent mx-auto my-1.5" />
                </div>

                {/* Core Commemorative Title */}
                <div className="text-center my-3 sm:my-4">
                  <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full mb-1">
                    Commemorative Devotional Souvenir
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[#991B1B] tracking-tight leading-tight">
                    Thank You for Being Part of PBEL Durgotsav 2026
                  </h3>
                  <p className="text-xs text-amber-800/80 font-serif mt-0.5">
                    ধন্যবাদ ও শারদীয় শুভকামনা
                  </p>
                </div>

                {/* Devotee Recognition Card */}
                <div className="my-4 bg-white/95 border border-amber-200/80 rounded-xl p-3.5 text-center space-y-1 shadow-2xs">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                    This sacred memento is warmly presented to
                  </p>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
                    {selectedMemento.is_name_visible ? selectedMemento.contributor_name : "Devout Well Wisher"}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    {selectedMemento.is_name_visible && selectedMemento.flat_number
                      ? selectedMemento.flat_number
                      : matchTower(selectedMemento.flat_number || "")?.fullName || "PBEL City Resident"}
                  </p>
                </div>

                {/* Seva Offering & Date Pill (Strictly Zero Financial Amount) */}
                <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                  <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 text-center">
                    <span className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">
                      Devotional Offering
                    </span>
                    <span className="font-bold text-amber-950 truncate block">
                      {(selectedMemento.category_id && categoriesMap[selectedMemento.category_id]) || selectedMemento.contribution_categories?.name || "General Pujo Fund"}
                    </span>
                  </div>
                  <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 text-center">
                    <span className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">
                      Auspicious Date
                    </span>
                    <span className="font-bold text-gray-800 truncate block">
                      {selectedMemento.created_at
                        ? new Date(selectedMemento.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Durgotsav 2026"}
                    </span>
                  </div>
                </div>

                {/* Holy Blessing Inscription */}
                <p className="text-center text-[11px] sm:text-xs text-gray-600 leading-relaxed font-serif my-3 max-w-md mx-auto">
                  May Maa Durga bestow divine health, joy, unity, and prosperity upon your residence and family. Thank you for strengthening our township&apos;s devotional solidarity!
                </p>

                {/* Official Seal & Signature */}
                <div className="mt-5 pt-3 border-t border-amber-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SamitiOfficialSeal className="w-13 h-13" />
                    <div className="text-left text-[10px] text-gray-500 leading-tight">
                      <span className="font-bold text-primary block">Official Verified Seal</span>
                      <span>PBEL Sanskritik Samiti</span>
                      <span className="block text-[9px] text-gray-400">Hyderabad, Telangana</span>
                    </div>
                  </div>

                  <div className="text-right">
                    {branding.presidentSignatureUrl ? (
                      <img src={branding.presidentSignatureUrl} alt="President Signature" className="h-8 ml-auto object-contain" />
                    ) : (
                      <DefaultPresidentSignature className="h-8 ml-auto" />
                    )}
                    <span className="text-[10px] font-bold text-gray-700 block border-t border-gray-300 pt-0.5">
                      President / General Secretary
                    </span>
                    <span className="text-[9px] text-amber-800 font-medium">PBEL Sanskritik Samiti</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
