"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { fetchCloudConfig } from "@/utils/cloudConfig";
import { DEFAULT_BRANDING, SamitiBrandingConfig, fetchStoredBranding } from "@/config/branding";
import OfficialContributionReceipt, { ReceiptData } from "@/components/OfficialContributionReceipt";
import { ShieldCheck, ArrowLeft, Heart, Lock, Mail, Calendar, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

function ReceiptViewerContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || searchParams.get("no") || "";

  const [branding, setBranding] = useState<SamitiBrandingConfig>(DEFAULT_BRANDING);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(initialId));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchStoredBranding().then((b) => {
      if (b) setBranding(b);
    });
  }, []);

  const formatContributionToReceipt = (contrib: any): ReceiptData => {
    const categoryName = 
      contrib.contribution_categories?.title || 
      contrib.contribution_categories?.name || 
      "General Pujo Fund";
    const paymentId = contrib.payment_id || contrib.id;

    return {
      name: contrib.contributor_name,
      flatNumber: contrib.flat_number || "PBEL City",
      phone: contrib.phone || undefined,
      email: contrib.email ? contrib.email.replace(/\[PAN:[^\]]+\]/i, '').trim() : undefined,
      amount: Number(contrib.amount) || 0,
      category: categoryName,
      paymentId: paymentId,
      upiRef: contrib.payment_id?.startsWith("UTR_") ? contrib.payment_id.replace("UTR_", "") : contrib.payment_id,
      date: new Date(contrib.created_at || Date.now()).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      requiresTaxExemption: false,
      panNumber: undefined,
      wantsWhatsappUpdates: true,
    };
  };

  useEffect(() => {
    async function lookupDirectReceipt() {
      if (!initialId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg(null);

      try {
        const raw = initialId.trim();
        const clean = raw.replace(/^(PSS-2026-|ONL-)/i, "").trim();
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);

        let data = null;
        let error = null;

        if (isUuid) {
          const res = await supabase
            .from("contributions")
            .select("*, contribution_categories(id, name)")
            .eq("id", clean)
            .limit(1);
          data = res.data;
          error = res.error;
        }

        if (!data || data.length === 0) {
          const res = await supabase
            .from("contributions")
            .select("*, contribution_categories(id, name)")
            .or(`payment_id.eq.${clean},payment_id.eq.UTR_${clean}`)
            .limit(1);
          if (res.data && res.data.length > 0) {
            data = res.data;
          } else if (!isUuid && clean.length >= 4) {
            const res2 = await supabase
              .from("contributions")
              .select("*, contribution_categories(id, name)")
              .ilike("payment_id", `%${clean}%`)
              .limit(1);
            if (res2.data && res2.data.length > 0) {
              data = res2.data;
            }
          }
        }

        if (error) throw error;

        if (data && data.length > 0) {
          setReceiptData(formatContributionToReceipt(data[0]));
        } else {
          setErrorMsg("No official contribution record found matching this Receipt Reference. Please verify your link or contact the PSS Committee.");
        }
      } catch (err: any) {
        console.error("Direct receipt lookup error:", err);
        setErrorMsg("Unable to retrieve official receipt record. Please check your internet connection.");
      } finally {
        setLoading(false);
      }
    }

    lookupDirectReceipt();
  }, [initialId]);

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-primary transition"
          >
            <ArrowLeft size={15} />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/contribute"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-4 py-1.5 rounded-full transition shadow-2xs"
          >
            <Heart size={14} className="text-primary" />
            <span>Make a Seva Offering</span>
          </Link>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-gray-600">Verifying and loading official receipt...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && errorMsg && (
          <div className="max-w-xl mx-auto bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <h3 className="font-heading text-lg font-bold text-gray-900">
              Receipt Reference Not Found
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {errorMsg}
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-5 py-2 rounded-xl transition inline-flex items-center gap-1.5"
              >
                <span>Return to Homepage</span>
              </Link>
            </div>
          </div>
        )}

        {/* DIRECT RECEIPT CERTIFICATE DISPLAY */}
        {!loading && !errorMsg && receiptData && (
          <div>
            <div className="mb-4 flex items-center justify-between print:hidden">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Verified Official Digital Record</span>
              </span>

              <span className="text-xs text-gray-500">
                PBEL Sanskritik Samiti • Durgotsav 2026
              </span>
            </div>

            <OfficialContributionReceipt
              receiptData={receiptData}
              branding={branding}
            />
          </div>
        )}

        {/* DEFAULT PRIVACY POLICY VIEW (WHEN NO DIRECT ?id= IS SPECIFIED) */}
        {!loading && !errorMsg && !receiptData && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-amber-300 shadow-xl relative overflow-hidden text-center">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

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
                In strict adherence to PBEL Sanskritik Samiti community standards, <strong>individual contribution receipts and amounts are private</strong> and are not open to public directory search.
              </p>
              <p>
                Official contribution receipts are accessible directly via the private receipt link provided upon completing your seva offering or shared by the contributor.
              </p>
              <div className="pt-2 border-t border-amber-200/60 flex items-start gap-2 text-xs text-amber-950">
                <Mail size={15} className="text-primary shrink-0 mt-0.5" />
                <span>
                  If you have made a contribution and require a duplicate copy of your receipt, please write to us at{" "}
                  <a href="mailto:pbelsanskritiksamiti@gmail.com" className="font-bold underline text-primary">
                    pbelsanskritiksamiti@gmail.com
                  </a>{" "}
                  with your Payment Reference / UTR.
                </span>
              </div>
            </div>

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
        )}

      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFFDF9] py-20 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-gray-500">Loading receipt service...</p>
        </div>
      }
    >
      <ReceiptViewerContent />
    </Suspense>
  );
}
