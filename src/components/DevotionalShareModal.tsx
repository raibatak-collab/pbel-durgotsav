"use client";

import { useState } from "react";
import { X, Share2, Check, Sparkles, Heart } from "lucide-react";

interface DevotionalShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  contributorName?: string;
  categoryName?: string;
  flatNumber?: string;
}

export function DevotionalShareModal({
  isOpen,
  onClose,
  contributorName,
  categoryName,
  flatNumber,
}: DevotionalShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const displayName = contributorName || "A Devotee";
  const shareText = `🌺 *শুভ দুর্গোৎসব • PBEL City Durgotsav 2026* 🌺\n\nMay Maa Durga bless our township with joy, health, and prosperity. I have joined the devotional Seva for PBEL City Durgotsav (15th – 20th Oct 2026).\n\nJoin hands in community seva, view the Pujo Nirghanto & contribute:\n👉 https://pbel-durgotsav.vercel.app\n\n_PBEL Sanskritik Samiti (PSS)_`;

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-amber-400/40 shadow-2xl relative overflow-hidden">
        {/* Decorative Aura */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-200/40 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-[#9E122C] to-[#5C0512] text-amber-300 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md border border-amber-400/30">
            <Sparkles size={26} />
          </div>
          <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider mb-2">
            <Heart size={12} className="text-primary fill-primary" />
            <span>Devotional Blessing</span>
          </div>
          <h3 className="font-heading text-2xl font-bold text-gray-900">
            Heartfelt Gratitude!
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Thank you, <strong className="text-gray-900">{displayName}</strong> {flatNumber ? `(${flatNumber})` : ""} for offering your Seva to Maa Durga.
          </p>
        </div>

        {/* Preview Card */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 mb-6 text-xs text-gray-700 space-y-2">
          <p className="font-semibold text-primary">🌺 শুভ দুর্গোৎসব • PBEL City Durgotsav 2026</p>
          <p className="italic text-gray-600 leading-relaxed">
            "May Maa Durga bless our township with joy, health, and prosperity. Let's come together for community seva, cultural evenings & Maha Bhog."
          </p>
          <div className="text-[11px] text-amber-900 font-bold pt-1 border-t border-amber-200/60 flex items-center justify-between">
            <span>PBEL Sanskritik Samiti</span>
            <span>15 - 20 Oct 2026</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleWhatsAppShare}
            className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Share2 size={16} />
            <span>Share Blessing on WhatsApp</span>
          </button>

          <button
            onClick={handleCopyText}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2"
          >
            {copied ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
            <span>{copied ? "Message Copied to Clipboard!" : "Copy Greeting Text"}</span>
          </button>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-gray-600 underline font-medium"
          >
            Return to site
          </button>
        </div>
      </div>
    </div>
  );
}
