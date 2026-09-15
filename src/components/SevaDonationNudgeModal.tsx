"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Heart, CheckCircle2, ArrowRight, X, Flame } from "lucide-react";

interface SevaDonationNudgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityName: string;
  residentName?: string;
  stallOrEventName?: string;
  note?: string;
}

export default function SevaDonationNudgeModal({
  isOpen,
  onClose,
  activityName,
  residentName,
  stallOrEventName,
  note,
}: SevaDonationNudgeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-amber-300/80 shadow-2xl relative overflow-hidden text-center">
        {/* Festive Background Accents */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-200/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-red-100/60 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-amber-300">
          <CheckCircle2 size={32} />
        </div>

        {/* Registration Confirmation Badge */}
        <div className="inline-flex items-center gap-1.5 bg-green-100 border border-green-300 text-green-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <Sparkles size={13} className="text-green-700" />
          <span>Application Submitted Successfully</span>
        </div>

        <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 mb-1">
          Thank You{residentName ? `, ${residentName}` : ""}! 🙏
        </h3>

        <p className="text-xs sm:text-sm text-gray-600 mb-5 leading-relaxed">
          Your registration for <strong className="text-gray-900">{stallOrEventName || activityName}</strong> has been received by the PBEL Sanskritik Samiti committee for review and verification.
        </p>

        {note && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 mb-5 text-left">
            {note}
          </div>
        )}

        {/* Devotional Seva Nudge Card */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50/70 to-red-50/40 p-5 rounded-2xl border border-amber-300/80 mb-6 text-left shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-wide">
            <Flame size={15} className="text-primary fill-primary" />
            <span>Support PBEL City Durgotsav 2026</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed mb-3">
            Our township’s grand celebration is organized entirely through the collective voluntary donations and seva of our resident families.
          </p>
          <p className="text-xs font-semibold text-amber-950 flex items-center gap-1.5">
            <Heart size={14} className="text-red-500 fill-red-500 shrink-0" />
            <span>Would you also like to contribute towards a Pujo Seva or Bhog?</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <Link
            href="/contribute"
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#D99B26] via-[#B8801C] to-[#966714] hover:from-[#B8801C] hover:to-[#78520D] text-white font-bold py-3.5 px-4 rounded-xl transition shadow-lg golden-glow flex items-center justify-center gap-2 text-sm"
          >
            <span>Offer a Pujo Seva / Contribution</span>
            <ArrowRight size={16} />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm transition"
          >
            No, not now
          </button>
        </div>
      </div>
    </div>
  );
}
