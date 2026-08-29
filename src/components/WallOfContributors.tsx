"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, X, Users, Search, HeartHandshake } from "lucide-react";

interface Contributor {
  amount: number | string;
  contributor_name: string;
  flat_number: string;
  is_name_visible: boolean;
  created_at?: string;
}

export function WallOfContributors({ contributors }: { contributors: Contributor[] }) {
  const [showAllModal, setShowAllModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const validContributors = contributors || [];
  const filtered = validContributors.filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const name = c.is_name_visible ? c.contributor_name.toLowerCase() : "well wisher";
    const flat = (c.flat_number || "").toLowerCase();
    return name.includes(term) || flat.includes(term);
  });

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl p-8 border border-amber-900/10 shadow-sm text-center">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <Sparkles size={13} className="text-primary" />
          <span>Devotional Solidarity</span>
        </div>
        <h2 className="font-heading text-3xl text-primary font-bold mb-2">
          Honor Roll of Contributors
        </h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto mb-8">
          Special gratitude to our PBEL City community residents and well-wishers who have supported this year's Durgotsav!
        </p>

        <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto mb-8">
          {validContributors.length > 0 ? (
            validContributors.slice(0, 12).map((c, i) => (
              <span
                key={i}
                className="bg-amber-50 text-amber-900 border border-amber-200/60 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:border-amber-400 transition"
              >
                <Sparkles size={12} className="text-amber-600" />
                {c.is_name_visible ? c.contributor_name : "Well Wisher"}
                {c.is_name_visible && c.flat_number && (
                  <span className="text-gray-500 font-normal">({c.flat_number})</span>
                )}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-xs italic">
              Be the first to contribute and be featured on the Wall of Contributors!
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {validContributors.length > 12 && (
            <button
              onClick={() => setShowAllModal(true)}
              className="inline-flex items-center gap-1.5 bg-amber-100/70 hover:bg-amber-200 text-amber-950 px-5 py-2.5 rounded-full font-bold text-xs transition border border-amber-300 shadow-2xs"
            >
              <Users size={14} className="text-primary" />
              <span>View All {validContributors.length} Contributors</span>
            </button>
          )}

          <Link
            href="/contribute"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold text-sm hover:underline"
          >
            <span>Join the Wall of Contributors</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* VIEW ALL CONTRIBUTORS MODAL */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-amber-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-50 via-white to-amber-50">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-gray-900">
                    All Devotee Contributors ({validContributors.length})
                  </h3>
                  <p className="text-xs text-gray-500">PBEL City Sanskritik Samiti Durgotsav 2026</p>
                </div>
              </div>
              <button
                onClick={() => setShowAllModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Filter */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/70">
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by resident name or flat / tower..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Scrollable Contributors List */}
            <div className="p-6 overflow-y-auto flex-1 space-y-2">
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filtered.map((c, i) => (
                    <div
                      key={i}
                      className="bg-amber-50/60 border border-amber-200/50 p-3 rounded-2xl flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-amber-200/60 text-amber-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <div className="truncate">
                          <span className="font-bold text-gray-900 block truncate">
                            {c.is_name_visible ? c.contributor_name : "Well Wisher (Anonymous)"}
                          </span>
                          {c.is_name_visible && c.flat_number && (
                            <span className="text-[11px] text-gray-500 block truncate">
                              {c.flat_number}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full shrink-0">
                        Verified
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400 text-xs">
                  No contributors found matching "{searchTerm}"
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                100% verified community seva fund
              </span>
              <Link
                href="/contribute"
                onClick={() => setShowAllModal(false)}
                className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <HeartHandshake size={14} />
                <span>Offer Seva</span>
              </Link>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
