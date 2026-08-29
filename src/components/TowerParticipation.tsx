"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Building2, Heart, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { getStoredTowers, fetchStoredTowers, TowerDefinition } from "@/config/towers";

interface TowerInfo {
  id: string;
  tower: string;
  name: string;
  fullName: string;
  familyCount: number;
  totalAmount: number;
}

export function TowerParticipation() {
  const [towerData, setTowerData] = useState<TowerInfo[]>([]);
  const [guestStats, setGuestStats] = useState({ familyCount: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    async function loadLiveTowerData() {
      try {
        let currentTowers = getStoredTowers();
        const cloudTowers = await fetchStoredTowers();
        if (cloudTowers && cloudTowers.length > 0) {
          currentTowers = cloudTowers;
        }
        const { data: contribs } = await supabase
          .from("contributions")
          .select("flat_number, amount, status")
          .eq("status", "Success");

        const counts: Record<string, { families: Set<string>; amount: number }> = {};
        currentTowers.forEach((t) => {
          counts[t.id] = { families: new Set<string>(), amount: 0 };
        });

        let guestFamilies = new Set<string>();
        let guestAmount = 0;

        if (contribs && contribs.length > 0) {
          contribs.forEach((c) => {
            const flatStr = (c.flat_number || "").trim();
            const amt = Number(c.amount) || 0;

            if (!flatStr) return;

            let matched = false;
            for (const t of currentTowers) {
              if (
                (t.regex && t.regex.test(flatStr)) ||
                flatStr.toLowerCase().includes(t.name.toLowerCase()) ||
                flatStr.toLowerCase().includes(t.tower.toLowerCase()) ||
                flatStr.toLowerCase().includes(t.fullName.toLowerCase())
              ) {
                if (!counts[t.id]) counts[t.id] = { families: new Set<string>(), amount: 0 };
                counts[t.id].families.add(flatStr);
                counts[t.id].amount += amt;
                matched = true;
                break;
              }
            }

            // Route non-resident/unmatched contributions to Guest Devotees pool
            if (!matched && flatStr) {
              guestFamilies.add(flatStr);
              guestAmount += amt;
            }
          });
        }

        const updated = currentTowers.map((t) => ({
          id: t.id,
          tower: t.tower,
          name: t.name,
          fullName: t.fullName,
          familyCount: counts[t.id]?.families.size || 0,
          totalAmount: counts[t.id]?.amount || 0,
        }));

        setTowerData(updated);
        setGuestStats({ familyCount: guestFamilies.size, totalAmount: guestAmount });
      } catch (err) {
        console.error("Error loading tower participation data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLiveTowerData();

    const handleTowersUpdate = () => {
      loadLiveTowerData();
    };
    window.addEventListener("pbel_towers_updated", handleTowersUpdate);
    return () => {
      window.removeEventListener("pbel_towers_updated", handleTowersUpdate);
    };
  }, []);

  const totalContributingFamilies = towerData.reduce((acc, t) => acc + t.familyCount, 0) + guestStats.familyCount;
  const totalTowerRaised = towerData.reduce((acc, t) => acc + t.totalAmount, 0) + guestStats.totalAmount;

  // Find leading tower (with at least 1 family)
  const maxFamilies = Math.max(...towerData.map((t) => t.familyCount));
  const leadingTower = maxFamilies > 0 ? towerData.find((t) => t.familyCount === maxFamilies) : null;

  const handleTowerSelect = (e: React.MouseEvent, towerFullName: string) => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("pbel_select_tower", {
          detail: { tower: towerFullName },
        })
      );
    }

    const quickContribEl = document.getElementById("quick-contribute-section") || document.getElementById("quick-contribute");
    if (quickContribEl) {
      e.preventDefault();
      quickContribEl.scrollIntoView({ behavior: "smooth" });
    } else {
      const topForm = document.getElementById("contribute-form-top");
      if (topForm) {
        e.preventDefault();
        topForm.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#FFFDF9] via-[#FFF8ED] to-[#FFF4DF] rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-md relative overflow-hidden">
      
      {/* Celebration Confetti Flash */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center bg-amber-500/10 backdrop-blur-[0.5px] transition-all animate-pulse">
          <div className="text-center font-bold text-amber-900 bg-white/95 px-6 py-2 rounded-full shadow-lg border border-amber-300 text-xs sm:text-sm flex items-center gap-2">
            <span>🎉</span>
            <span>Selected for Seva! Scroll down to contribute.</span>
            <span>🌸</span>
          </div>
        </div>
      )}

      {/* 1. HEADER & DEVOTIONAL SOLIDARITY FRAMING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-900/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Building2 size={13} className="text-primary" />
            <span>Township Families in Seva • Devotional Solidarity</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            PBEL City Tower Seva Participation
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
            Celebrating collective devotion across all towers. Every offering, regardless of amount, fuels the 6-day grand celebration.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-amber-200 shadow-xs text-center">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Devotee Families</span>
            <span className="text-xl font-heading font-bold text-primary">{totalContributingFamilies}</span>
          </div>
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-amber-200 shadow-xs text-center">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Towers Active</span>
            <span className="text-xl font-heading font-bold text-green-700">
              {towerData.filter((t) => t.familyCount > 0).length} / {towerData.length}
            </span>
          </div>
        </div>
      </div>

      {/* 2. LEADING TOWER DEVOTIONAL SPOTLIGHT (Non-Competitive) */}
      {leadingTower && (
        <div className="mt-4 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-400/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-950 font-medium">
            <Sparkles size={16} className="text-primary shrink-0 animate-pulse" />
            <span>
              <strong>🌟 Leading with Devotion:</strong> {leadingTower.fullName} with <strong>{leadingTower.familyCount} families</strong> in Seva!
            </span>
          </div>
          <Link
            href={`/contribute?tower=${encodeURIComponent(leadingTower.fullName)}`}
            onClick={(e) => handleTowerSelect(e, leadingTower.fullName)}
            className="text-primary hover:underline font-bold text-[11px] shrink-0"
          >
            Join your neighbors →
          </Link>
        </div>
      )}

      {/* 3. TOWER CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-6">
        {towerData.map((tower) => {
          const isLeading = leadingTower && tower.id === leadingTower.id;
          const towerFullLabel = tower.fullName || `${tower.tower} (${tower.name})`;

          return (
            <Link
              key={tower.id}
              href={`/contribute?tower=${encodeURIComponent(towerFullLabel)}`}
              onClick={(e) => handleTowerSelect(e, towerFullLabel)}
              className={`p-3.5 rounded-2xl border transition-all relative group flex flex-col justify-between cursor-pointer ${
                isLeading
                  ? "bg-gradient-to-b from-white to-amber-50 border-amber-400 shadow-sm ring-1 ring-amber-400/50"
                  : "bg-white border-amber-900/10 hover:border-amber-400 hover:shadow-sm"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-heading font-bold text-sm text-gray-900 group-hover:text-primary transition">
                    {tower.tower}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded">
                    {tower.name}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-gray-900 font-heading">
                      {tower.familyCount}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {tower.familyCount === 1 ? "family" : "families"}
                    </span>
                  </div>

                  {tower.totalAmount > 0 ? (
                    <div className="text-[11px] font-semibold text-green-700">
                      ₹{tower.totalAmount.toLocaleString("en-IN")}
                    </div>
                  ) : (
                    <div className="text-[10px] text-gray-400 italic">
                      Be first to contribute
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 group-hover:text-primary font-semibold">
                <span>Offer Seva</span>
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}

        {/* Guest Devotees Card (if any external contributions exist) */}
        {guestStats.familyCount > 0 && (
          <div className="p-3.5 rounded-2xl border border-amber-200/80 bg-white/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-heading font-bold text-sm text-amber-900">
                  Guest Devotees
                </span>
                <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded">
                  External
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-bold text-gray-900 font-heading">
                    {guestStats.familyCount}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {guestStats.familyCount === 1 ? "offering" : "offerings"}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-green-700">
                  ₹{guestStats.totalAmount.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100 text-[10px] text-amber-700 font-semibold">
              Well Wishers
            </div>
          </div>
        )}
      </div>

      {/* 4. FOOTER NOTE */}
      <div className="mt-5 text-center">
        <span className="text-[11px] text-gray-500">
          Click on your tower card above to pre-select it in the contribution form.
        </span>
      </div>

    </div>
  );
}
