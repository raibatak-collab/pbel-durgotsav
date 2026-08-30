"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, X, ArrowRight, Palette, Calendar } from "lucide-react";
import { fetchCloudConfig } from "@/utils/cloudConfig";

export interface SitePopupHighlight {
  enabled: boolean;
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  snippet: string;
  imageUrl?: string;
  actionText?: string;
  actionUrl?: string;
}

export const DEFAULT_POPUP_HIGHLIGHT: SitePopupHighlight = {
  enabled: true,
  id: "highlight-path-alpona-2026",
  badge: "🎨 Major Festival Attraction",
  title: "Grand 500m Sacred Path Alpona by Bengal Folk Artists",
  subtitle: "Complete by Panchami Morning • Major Attraction Throughout Pujo",
  snippet: "We are bringing renowned traditional Alpona folk artisans from Bengal to create a majestic 500-meter sacred street floor art across the PBEL City central boulevard. The masterpiece will be completed by Panchami morning and will remain a prime festival centerpiece throughout all 6 days of Durgotsav!",
  imageUrl: "/images/wallpapers/durga_festive_mandala.svg",
  actionText: "Explore Schedule & Cultural Acts →",
  actionUrl: "/programs",
};

export function SiteHighlightModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [highlight, setHighlight] = useState<SitePopupHighlight>(DEFAULT_POPUP_HIGHLIGHT);

  useEffect(() => {
    async function initHighlight() {
      try {
        const local = localStorage.getItem("pbel_site_popup_highlight");
        let activeConfig = local ? JSON.parse(local) : DEFAULT_POPUP_HIGHLIGHT;

        const cloud = await fetchCloudConfig<SitePopupHighlight>("site_popup_highlight", DEFAULT_POPUP_HIGHLIGHT);
        if (cloud && typeof cloud.enabled === "boolean") {
          activeConfig = cloud;
          localStorage.setItem("pbel_site_popup_highlight", JSON.stringify(cloud));
        }

        setHighlight(activeConfig);

        if (activeConfig.enabled) {
          const sessionKey = `pbel_seen_popup_${activeConfig.id || "default"}`;
          const hasSeen = sessionStorage.getItem(sessionKey);
          if (!hasSeen) {
            // Smooth reveal after 700ms on first load
            const timer = setTimeout(() => setIsOpen(true), 700);
            return () => clearTimeout(timer);
          }
        }
      } catch (err) {
        console.error("Error initializing site highlight popup:", err);
      }
    }

    initHighlight();

    const handleUpdate = () => {
      const local = localStorage.getItem("pbel_site_popup_highlight");
      if (local) setHighlight(JSON.parse(local));
    };

    window.addEventListener("pbel_popup_highlight_updated", handleUpdate);
    return () => window.removeEventListener("pbel_popup_highlight_updated", handleUpdate);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (highlight.id) {
      sessionStorage.setItem(`pbel_seen_popup_${highlight.id}`, "true");
    }
  };

  if (!isOpen || !highlight.enabled) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-gradient-to-b from-[#FFFDF9] to-[#FDF8F0] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-amber-400/80 relative transform transition-all animate-scaleUp max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition backdrop-blur-md shadow-md"
          aria-label="Close Announcement"
        >
          <X size={16} />
        </button>

        {/* Feature Image / Visual Banner */}
        {highlight.imageUrl && (
          <div className="relative h-44 sm:h-52 w-full bg-gradient-to-r from-[#850E1F] to-[#5C0A15] overflow-hidden shrink-0">
            <img
              src={highlight.imageUrl}
              alt={highlight.title}
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#200206] via-transparent to-black/30" />
            
            {highlight.badge && (
              <div className="absolute bottom-3 left-4 bg-amber-400/95 text-amber-950 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <Sparkles size={12} className="text-amber-900" />
                <span>{highlight.badge}</span>
              </div>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-3.5 overflow-y-auto">
          {!highlight.imageUrl && highlight.badge && (
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} className="text-primary" />
              <span>{highlight.badge}</span>
            </div>
          )}

          <div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
              {highlight.title}
            </h3>
            {highlight.subtitle && (
              <p className="text-xs sm:text-sm font-semibold text-primary mt-1 flex items-center gap-1.5">
                <Calendar size={13} className="shrink-0" />
                <span>{highlight.subtitle}</span>
              </p>
            )}
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            {highlight.snippet}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            {highlight.actionUrl && (
              <Link
                href={highlight.actionUrl}
                onClick={handleClose}
                className="flex-1 bg-gradient-to-r from-[#D99B26] to-[#B8801C] hover:from-[#B8801C] hover:to-[#966714] text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition text-center shadow-md golden-glow flex items-center justify-center gap-1.5"
              >
                <span>{highlight.actionText || "Learn More →"}</span>
                <ArrowRight size={14} />
              </Link>
            )}
            <button
              onClick={handleClose}
              className="bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 py-3 px-5 rounded-xl font-semibold text-xs transition text-center"
            >
              Continue to Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
