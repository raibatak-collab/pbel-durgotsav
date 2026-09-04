"use client";

import { useState } from "react";
import { X, Share2, Check, Sparkles, Heart, FileText, CheckSquare, Square } from "lucide-react";

interface DevotionalShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  contributorName?: string;
  categoryName?: string;
  flatNumber?: string;
  amount?: number;
  paymentId?: string;
  receiptNo?: string;
}

export function DevotionalShareModal({
  isOpen,
  onClose,
  contributorName,
  categoryName,
  flatNumber,
  amount,
  paymentId,
  receiptNo,
}: DevotionalShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [includeReceipt, setIncludeReceipt] = useState(true);

  if (!isOpen) return null;

  const displayName = contributorName || "A Devotee";
  const formattedFlat = flatNumber || "PBEL City";
  const formattedCategory = categoryName || "General Pujo Fund";
  const formattedAmount = amount ? ` (₹${Number(amount).toLocaleString("en-IN")})` : "";
  
  const receiptIdentifier = paymentId || "";
  const calculatedReceiptNo = receiptNo || (receiptIdentifier ? `PSS-2026-${receiptIdentifier.replace(/^UTR_/i, '').slice(-8).toUpperCase()}` : "PSS-2026-ONLINE");
  const receiptUrl = receiptIdentifier 
    ? `https://www.pbelcitydurgotsav.com/receipt?id=${encodeURIComponent(receiptIdentifier)}`
    : "https://www.pbelcitydurgotsav.com/receipt";

  const shareText = includeReceipt
    ? `🌺 *শুভ শারদীয়া • PBEL City Durgotsav 2026* 🌺\nJoy Maa Durga!\n\nOur family (*${displayName}*, *${formattedFlat}*) has offered devotional Seva for *${formattedCategory}*${formattedAmount}.\n\n🧾 *Official Receipt No:* ${calculatedReceiptNo}\n📄 *View & Download Official PDF Receipt:*\n👉 ${receiptUrl}\n\nMay Maa Durga bless all residents with joy, health, and prosperity! 🙏\n_PBEL Sanskritik Samiti (PSS)_`
    : `🌺 *শুভ দুর্গোৎসব • PBEL City Durgotsav 2026* 🌺\n\nMay Maa Durga bless our township with joy, health, and prosperity. I have joined the devotional Seva for PBEL City Durgotsav (15th – 20th Oct 2026).\n\nJoin hands in community seva, view the Pujo Nirghanto & contribute:\n👉 https://www.pbelcitydurgotsav.com\n\n_PBEL Sanskritik Samiti (PSS)_`;

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
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-amber-400/40 shadow-2xl relative overflow-hidden">
        {/* Decorative Aura */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-200/40 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-4">
          <div className="w-13 h-13 bg-gradient-to-tr from-[#9E122C] to-[#5C0512] text-amber-300 rounded-2xl flex items-center justify-center mx-auto mb-2.5 shadow-md border border-amber-400/30">
            <Sparkles size={24} />
          </div>
          <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
            <Heart size={11} className="text-primary fill-primary" />
            <span>Devotional Blessing</span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
            Share on WhatsApp
          </h3>
          <p className="text-xs text-gray-600 mt-0.5">
            Share your devotional offering and receipt link with your tower group.
          </p>
        </div>

        {/* RECEIPT INCLUSION TOGGLE */}
        <div
          onClick={() => setIncludeReceipt(!includeReceipt)}
          className={`mb-3.5 p-2.5 rounded-xl border flex items-center justify-between cursor-pointer select-none transition ${
            includeReceipt ? "bg-amber-50/90 border-amber-300 text-amber-950" : "bg-gray-50 border-gray-200 text-gray-600"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold">
            <FileText size={15} className={includeReceipt ? "text-primary" : "text-gray-400"} />
            <span>Include Official Receipt Link &amp; Details</span>
          </div>
          {includeReceipt ? (
            <CheckSquare size={17} className="text-primary shrink-0" />
          ) : (
            <Square size={17} className="text-gray-400 shrink-0" />
          )}
        </div>

        {/* Live Message Preview Card */}
        <div className="bg-[#F8FAF9] border border-gray-200/90 rounded-2xl p-3.5 mb-4 text-xs text-gray-700 space-y-1.5 font-sans relative">
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 flex items-center gap-1">
            <span>WhatsApp Message Preview</span>
          </div>
          <p className="font-bold text-[#1E7E34]">🌺 শুভ শারদীয়া • PBEL City Durgotsav 2026</p>
          <p className="text-[11.5px] leading-relaxed text-gray-800">
            Our family (<strong>{displayName}</strong>, <strong>{formattedFlat}</strong>) has offered Seva for <strong>{formattedCategory}</strong>{formattedAmount}.
          </p>
          {includeReceipt && (
            <div className="bg-white p-2 rounded-lg border border-gray-200 text-[10.5px] font-mono text-gray-700 space-y-0.5 mt-1">
              <div>Receipt No: <strong>{calculatedReceiptNo}</strong></div>
              <div className="text-primary truncate">Link: {receiptUrl}</div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleWhatsAppShare}
            className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 size={16} />
            <span>Forward to WhatsApp</span>
          </button>

          <button
            onClick={handleCopyText}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
            <span>{copied ? "Message Copied to Clipboard!" : "Copy Message Text"}</span>
          </button>
        </div>

        <div className="mt-3 text-center">
          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-gray-600 underline font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
