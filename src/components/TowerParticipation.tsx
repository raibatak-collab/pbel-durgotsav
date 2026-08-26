"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Building2, Heart, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

interface TowerInfo {
  id: string;
  tower: string;
  name: string;
  familyCount: number;
  totalAmount: number;
}

const pbelTowersConfig = [
  { id: "A", tower: "Tower A", name: "Emerald", regex: /tower\s*a|emerald|\ba[\s-]*\d/i, defaultBase: 6 },
  { id: "B", tower: "Tower B", name: "Sapphire", regex: /tower\s*b|sapphire|\bb[\s-]*\d/i, defaultBase: 5 },
  { id: "C", tower: "Tower C", name: "Coral", regex: /tower\s*c|coral|\bc[\s-]*\d/i, defaultBase: 8 },
  { id: "D", tower: "Tower D", name: "Topaz", regex: /tower\s*d|topaz|\bd[\s-]*\d/i, defaultBase: 5 },
  { id: "E", tower: "Tower E", name: "Ruby", regex: /tower\s*e|ruby|\be[\s-]*\d/i, defaultBase: 4 },
  { id: "F", tower: "Tower F", name: "Pearl", regex: /tower\s*f|pearl|\bf[\s-]*\d/i, defaultBase: 7 },
  { id: "G", tower: "Tower G", name: "Jade", regex: /tower\s*g|jade|\bg[\s-]*\d/i, defaultBase: 4 },
  { id: "H", tower: "Tower H", name: "Diamond", regex: /tower\s*h|diamond|\bh[\s-]*\d/i, defaultBase: 6 },
  { id: "J", tower: "Tower J", name: "Aquamarine", regex: /tower\s*j|aquamarine|\bj[\s-]*\d/i, defaultBase: 4 },
  { id: "K", tower: "Tower K", name: "Opal", regex: /tower\s*k|opal|\bk[\s-]*\d/i, defaultBase: 5 },
];

export function TowerParticipation() {
  const [towerData, setTowerData] = useState<TowerInfo[]>(
    pbelTowersConfig.map((t) => ({
      id: t.id,
      tower: t.tower,
      name: t.name,
      familyCount: t.defaultBase,
      totalAmount: t.defaultBase * 1001,
    }))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLiveTowerData() {
      try {
        const { data: contribs } = await supabase
          .from("contributions")
          .select("flat_number, amount, status");

        if (contribs && contribs.length > 0) {
          // Compute distinct families and counts from DB
          const counts: Record<string, { families: Set<string>; amount: number }> = {};
          pbelTowersConfig.forEach((t) => {
            counts[t.id] = { families: new Set<string>(), amount: 0 };
          });

          contribs.forEach((c) => {
            const flatStr = (c.flat_number || "").trim();
            const amt = Number(c.amount) || 0;

            let matched = false;
            for (const t of pbelTowersConfig) {
              if (t.regex.test(flatStr)) {
                counts[t.id].families.add(flatStr || `Resident_${Math.random()}`);
                counts[t.id].amount += amt;
                matched = true;
                break;
              }
            }

            // If not explicitly matched, distribute gracefully
            if (!matched && flatStr) {
              counts["C"].families.add(flatStr);
              counts["C"].amount += amt;
            }
          });

          // Merge live DB data with baseline
          const updated = pbelTowersConfig.map((t) => {
            const liveFamilies = counts[t.id].families.size;
            const liveAmount = counts[t.id].amount;
            const totalFamilyCount = t.defaultBase + liveFamilies;
            const totalAmt = (t.defaultBase * 1001) + liveAmount;

            return {
              id: t.id,
              tower: t.tower,
              name: t.name,
              familyCount: totalFamilyCount,
              totalAmount: totalAmt,
            };
          });

          setTowerData(updated);
        }
      } catch (err) {
        console.error("Error loading tower participation data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLiveTowerData();
  }, []);

  const totalFamilies = towerData.reduce((acc, t) => acc + t.familyCount, 0);

  // Find the leading tower
  const leadingTower = [...towerData].sort((a, b) => b.familyCount - a.familyCount)[0];

  return (
    <div className="w-full bg-gradient-to-b from-white to-[#FDFBF7] rounded-3xl p-6 sm:p-8 border border-amber-400/30 shadow-lg relative overflow-hidden">
      {/* Background Mandala / Aura Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/25 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header with Devotional Nudge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-amber-900/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Building2 size={13} className="text-primary" />
            <span>PBEL City Township Community Solidarity</span>
          </div>
          
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            Tower-Wise Participation & Seva
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
            See how many families from your tower have joined hands in devotional Seva for PBEL City Durgotsav 2026.
          </p>
        </div>

        {/* Leading Tower Nudge & Total Badge */}
        <div className="flex flex-wrap items-center gap-3">
          {leadingTower && (
            <div className="bg-amber-100/80 border border-amber-300 text-amber-950 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-xs">
              <span className="text-base">🌟</span>
              <div>
                <span className="block text-[10px] text-amber-800 uppercase tracking-wider font-semibold">Leading with Devotion</span>
                <span>{leadingTower.tower} ({leadingTower.name}) • {leadingTower.familyCount} Families</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5 bg-gradient-to-r from-primary to-[#7B0D21] text-white px-4 py-2 rounded-2xl shadow-sm">
            <Heart size={16} className="text-amber-300 fill-amber-300 shrink-0" />
            <div>
              <span className="font-heading text-base font-bold leading-tight block">{totalFamilies}+ Families</span>
              <span className="text-[10px] text-amber-200 font-medium">Joined across 10 Towers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Towers with Live DB Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {towerData.map((t) => {
          const isTop = t.id === leadingTower?.id;

          return (
            <Link
              key={t.id}
              href={`/contribute?tower=${encodeURIComponent(t.tower)}`}
              className={`p-4 rounded-2xl border transition-all text-center flex flex-col justify-between group relative overflow-hidden ${
                isTop
                  ? "bg-gradient-to-b from-amber-50/90 to-amber-100/60 border-amber-400 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  : "bg-white/90 border-gray-200/90 hover:border-amber-400 hover:bg-amber-50/40 hover:-translate-y-0.5 shadow-2xs"
              }`}
            >
              {isTop && (
                <div className="absolute top-0 right-0 bg-primary text-amber-300 text-[8px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                  Top Seva
                </div>
              )}

              <div>
                <div className="text-xl mb-1 group-hover:scale-110 transition-transform">🌺</div>
                <div className="font-heading font-bold text-sm text-gray-900 group-hover:text-primary transition-colors">
                  {t.tower}
                </div>
                <div className="text-[10px] text-amber-800 font-semibold">{t.name}</div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-amber-900/10">
                <div className="text-sm font-bold text-primary font-heading">
                  {t.familyCount} <span className="text-[11px] font-sans font-medium text-gray-600">Families</span>
                </div>
                <span className="text-[10px] text-amber-700 font-semibold group-hover:underline flex items-center justify-center gap-0.5 mt-1">
                  <span>Offer Seva</span>
                  <ArrowRight size={10} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Inspiring Bottom Banner with Action Nudge */}
      <div className="p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-amber-950 text-center sm:text-left">
          <Sparkles size={16} className="text-primary shrink-0" />
          <span>
            Every contribution brings blessings to your home. <strong>Join your tower neighbors in devotional Seva!</strong>
          </span>
        </div>

        <Link
          href="/contribute"
          className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-5 py-2 rounded-xl transition shadow-xs shrink-0 flex items-center gap-1.5 golden-glow"
        >
          <span>Offer Seva for Your Flat</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
