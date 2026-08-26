"use client";

import { Users, Sparkles, Building2, Heart } from "lucide-react";

interface TowerData {
  tower: string;
  name: string;
  families: number;
}

const defaultTowers: TowerData[] = [
  { tower: "Tower A", name: "Emerald", families: 18 },
  { tower: "Tower B", name: "Sapphire", families: 15 },
  { tower: "Tower C", name: "Coral", families: 21 },
  { tower: "Tower D", name: "Topaz", families: 16 },
  { tower: "Tower E", name: "Ruby", families: 14 },
  { tower: "Tower F", name: "Pearl", families: 19 },
  { tower: "Tower G", name: "Jade", families: 12 },
  { tower: "Tower H", name: "Diamond", families: 17 },
  { tower: "Tower J", name: "Aquamarine", families: 13 },
  { tower: "Tower K", name: "Opal", families: 15 },
];

export function TowerParticipation() {
  const totalFamilies = defaultTowers.reduce((acc, t) => acc + t.families, 0);

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/60 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Building2 size={13} /> Township Solidarity & Devotion
          </div>
          <h3 className="font-heading text-2xl font-bold text-gray-900">
            PBEL City Families in Seva
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Every tower coming together under Maa Durga's shelter for our 2026 celebration.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-amber-50/80 px-4 py-2.5 rounded-2xl border border-amber-200/60 self-start md:self-auto">
          <div className="w-9 h-9 rounded-xl bg-primary text-amber-300 flex items-center justify-center font-bold">
            <Heart size={18} className="fill-amber-300" />
          </div>
          <div>
            <div className="font-heading text-lg font-bold text-primary leading-tight">{totalFamilies}+ Families</div>
            <div className="text-[10px] text-gray-500 font-medium">Joined Seva across 10 Towers</div>
          </div>
        </div>
      </div>

      {/* Grid of Towers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {defaultTowers.map((t) => (
          <div
            key={t.tower}
            className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-amber-300 hover:bg-amber-50/40 transition-all text-center group"
          >
            <div className="text-base mb-1">🌺</div>
            <div className="font-bold text-xs text-gray-900 group-hover:text-primary transition-colors">
              {t.tower}
            </div>
            <div className="text-[10px] text-amber-800 font-semibold">{t.name}</div>
            <div className="mt-1.5 pt-1.5 border-t border-gray-200/60 text-[11px] text-gray-600 font-medium">
              <strong className="text-primary font-bold">{t.families}</strong> Families
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
        <span className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-500" />
          <span>Devotion unites every floor and every home in PBEL City.</span>
        </span>
        <span className="text-[11px] text-amber-800 font-semibold">
          Participate from your Tower during E-Seva
        </span>
      </div>
    </div>
  );
}
