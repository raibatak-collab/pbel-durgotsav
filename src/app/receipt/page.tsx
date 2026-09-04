"use client";

import Link from "next/link";
import { ShieldCheck, ArrowLeft, Heart, Lock, Mail, Sparkles, Calendar } from "lucide-react";

export default function ReceiptPrivacyNoticePage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 border border-amber-300 shadow-xl relative overflow-hidden">
        {/* Decorative Festive Aura */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        {/* Security Shield Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#9E122C] to-[#5C0512] text-amber-300 flex items-center justify-center mx-auto mb-5 shadow-lg border border-amber-400/30">
          <Lock size={28} />
        </div>

        <div className="inline-flex items-center gap-1.5 bg-amber-100/80 border border-amber-300 text-amber-950 text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
          <ShieldCheck size={13} className="text-primary" />
          <span>Community Privacy Protection</span>
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
          Official Contribution Receipts
        </h1>

        <div className="text-xs sm:text-sm text-gray-600 space-y-3 mb-8 leading-relaxed text-left bg-amber-50/60 p-5 rounded-2xl border border-amber-200/70">
          <p>
            In strict adherence to PBEL Sanskritik Samiti community standards, <strong>individual contribution amounts and official receipts are private</strong> and are not accessible to the public.
          </p>
          <p>
            Official digital receipts are issued privately and securely by the Organizing Committee directly to the contributing resident.
          </p>
          <div className="pt-2 border-t border-amber-200/60 flex items-start gap-2 text-xs text-amber-950">
            <Mail size={15} className="text-primary shrink-0 mt-0.5" />
            <span>
              If you have made a contribution and require a copy of your official receipt, please write to us at{" "}
              <a href="mailto:pbelsanskritiksamiti@gmail.com" className="font-bold underline text-primary">
                pbelsanskritiksamiti@gmail.com
              </a>{" "}
              or connect with your PBEL Tower Representative with your payment reference.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs"
          >
            <ArrowLeft size={15} />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/programs"
            className="w-full sm:w-auto bg-amber-100/70 hover:bg-amber-200 text-amber-950 border border-amber-300 px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2"
          >
            <Calendar size={15} className="text-primary" />
            <span>View Pujo Schedule</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
