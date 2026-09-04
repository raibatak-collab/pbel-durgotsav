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
  CheckCircle2
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { fetchCloudConfig } from "@/utils/cloudConfig";
import { PBEL_TOWERS, matchTower } from "@/config/towers";

interface ContributorRecord {
  id: string;
  amount: number | string;
  contributor_name: string;
  flat_number: string;
  is_name_visible: boolean;
  category_id?: string;
  created_at?: string;
  status?: string;
}

export default function WallOfHonorPage() {
  const [contributions, setContributions] = useState<ContributorRecord[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTower, setSelectedTower] = useState<string>("all");
  const [memberFamiliesCount, setMemberFamiliesCount] = useState<number>(0);

  useEffect(() => {
    async function loadWallData() {
      setIsLoading(true);
      try {
        // 1. Fetch Categories for seva badge lookup
        const { data: dbCategories } = await supabase
          .from("contribution_categories")
          .select("id, title");
        
        const catMap: Record<string, string> = {};
        if (dbCategories) {
          dbCategories.forEach((cat) => {
            catMap[cat.id] = cat.title;
          });
        }
        setCategoriesMap(catMap);

        // 2. Fetch all successful contributions
        const { data: dbContributions, error } = await supabase
          .from("contributions")
          .select("id, amount, contributor_name, flat_number, is_name_visible, category_id, created_at, status")
          .eq("status", "Success")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching contributions for Wall of Honor:", error);
        } else if (dbContributions) {
          setContributions(dbContributions);
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

  // Filtered list based on search and tower
  const filteredContributors = useMemo(() => {
    return contributions.filter((c) => {
      // 1. Tower filter
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

      // 2. Search query (Resident name, flat, or category)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const displayName = c.is_name_visible ? c.contributor_name.toLowerCase() : "devout well wisher anonymous";
        const flat = (c.flat_number || "").toLowerCase();
        const categoryTitle = (c.category_id && categoriesMap[c.category_id] ? categoriesMap[c.category_id] : "").toLowerCase();
        return displayName.includes(term) || flat.includes(term) || categoryTitle.includes(term);
      }

      return true;
    });
  }, [contributions, selectedTower, searchTerm, categoriesMap]);

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
              className="bg-amber-500 hover:bg-amber-400 text-amber-950 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition shadow-lg hover:shadow-amber-500/20 flex items-center gap-2"
            >
              <HeartHandshake size={16} />
              <span>Offer Your Seva</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              href="/programs"
              className="bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-400/30 px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition backdrop-blur-xs flex items-center gap-1.5"
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

      {/* 3. SEARCH & TOWER FILTER CONTROLS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-amber-200/80 space-y-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Devotee name, Flat number (e.g. Tower G-1402, 504), or Seva..."
              className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Tower Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
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
              const sevaTitle = c.category_id && categoriesMap[c.category_id]
                ? categoriesMap[c.category_id]
                : "Devotee Seva Fund";

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

                    {/* Seva Offering Badge */}
                    <div className="mt-2 bg-amber-50/80 border border-amber-200/60 rounded-xl p-2.5 text-xs">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                        Devotional Offering:
                      </span>
                      <span className="font-semibold text-amber-950 line-clamp-1">
                        {sevaTitle}
                      </span>
                    </div>
                  </div>

                  {/* Bottom: Date & Devotional Seva Verification */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{formattedDate}</span>
                    </div>

                    <span className="text-amber-800/80 font-semibold flex items-center gap-1">
                      <Sparkles size={11} className="text-amber-600" />
                      <span>Devotional Seva</span>
                    </span>
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
              We couldn&apos;t find any records matching &quot;{searchTerm}&quot; in the selected tower filter. Try adjusting your search term.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedTower("all");
              }}
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 5. DEVOTIONAL CTA FOOTER BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-50">
              Be Part of the Divine Celebration
            </h3>
            <p className="text-amber-100 text-xs sm:text-sm max-w-xl">
              Every offering, whether large or humble, powers the bhog, flowers, purohit dakshina, and lighting for PBEL City Durgotsav. Join hands with your neighbors today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/contribute"
              className="bg-white text-amber-900 hover:bg-amber-50 font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition shadow-md flex items-center gap-2"
            >
              <HeartHandshake size={16} />
              <span>Offer Seva Now</span>
            </Link>

            <Link
              href="/gallery"
              className="bg-amber-800/40 hover:bg-amber-800/60 text-amber-100 border border-amber-300/40 font-semibold px-5 py-3 rounded-full text-xs sm:text-sm transition"
            >
              <span>View Gallery</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
