"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { fetchCloudConfig } from "@/utils/cloudConfig";
import { DEFAULT_BRANDING, SamitiBrandingConfig } from "@/config/branding";
import { OfficialContributionReceipt, ReceiptData } from "@/components/OfficialContributionReceipt";
import { Search, ArrowLeft, Heart, Receipt as ReceiptIcon, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";

function ReceiptViewerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialId = searchParams.get("id") || searchParams.get("no") || "";

  const [branding, setBranding] = useState<SamitiBrandingConfig>(DEFAULT_BRANDING);
  const [searchQuery, setSearchQuery] = useState(initialId);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchCloudConfig("branding_config", DEFAULT_BRANDING).then((b) => {
      if (b) setBranding(b);
    });
  }, []);

  const formatContributionToReceipt = (contrib: any): ReceiptData => {
    // Extract PAN if stored in email (e.g. "email [PAN:ABCDE1234F]" or "[PAN:ABCDE1234F]")
    const panMatch = contrib.email ? contrib.email.match(/\[PAN:([A-Z0-9]+)\]/i) : null;
    const panNumber = panMatch ? panMatch[1].toUpperCase() : undefined;
    const cleanEmail = contrib.email ? contrib.email.replace(/\[PAN:[^\]]+\]/i, '').trim() : '';

    const categoryName = contrib.contribution_categories?.name || "General Pujo Fund";
    const paymentId = contrib.payment_id || contrib.id;

    return {
      name: contrib.contributor_name,
      flatNumber: contrib.flat_number || "PBEL City",
      phone: contrib.phone || undefined,
      email: cleanEmail || undefined,
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
      requiresTaxExemption: Boolean(panNumber),
      panNumber: panNumber,
      wantsWhatsappUpdates: true,
    };
  };

  const lookupById = async (idToLook: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const clean = idToLook.replace(/^PSS-2026-/i, "").trim();
      const { data, error } = await supabase
        .from("contributions")
        .select("*, contribution_categories(name)")
        .or(`id.eq.${clean},payment_id.eq.${clean},payment_id.ilike.%${clean}%`)
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setReceiptData(formatContributionToReceipt(data[0]));
      } else {
        setErrorMsg("No contribution record found matching this Receipt / Payment ID.");
      }
    } catch (err: any) {
      console.error("Lookup error:", err);
      setErrorMsg("Unable to fetch receipt. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      lookupById(initialId);
    }
  }, [initialId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setLoading(true);
    setErrorMsg(null);
    setReceiptData(null);

    try {
      const clean = query.replace(/^PSS-2026-/i, "").trim();
      const phoneDigits = query.replace(/[^0-9]/g, "");

      let sbQuery = supabase
        .from("contributions")
        .select("*, contribution_categories(name)")
        .order("created_at", { ascending: false });

      if (phoneDigits.length >= 6) {
        sbQuery = sbQuery.ilike("phone", `%${phoneDigits}%`);
      } else {
        sbQuery = sbQuery.or(`contributor_name.ilike.%${clean}%,flat_number.ilike.%${clean}%,payment_id.ilike.%${clean}%`);
      }

      const { data, error } = await sbQuery.limit(10);
      if (error) throw error;

      if (data && data.length === 1) {
        setReceiptData(formatContributionToReceipt(data[0]));
        setSearchResults([]);
      } else if (data && data.length > 1) {
        setSearchResults(data);
      } else {
        setSearchResults([]);
        setErrorMsg("No contribution records found. Please check your Phone number, Flat Number, or UTR.");
      }
    } catch (err: any) {
      console.error("Search error:", err);
      setErrorMsg("Failed to search records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Brand Header */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-primary transition"
          >
            <ArrowLeft size={15} />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/contribute"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3.5 py-1.5 rounded-full transition shadow-2xs"
          >
            <Heart size={14} className="text-primary" />
            <span>Make a Seva Offering</span>
          </Link>
        </div>

        {/* RECEIPT PRESENTATION VIEW */}
        {receiptData ? (
          <div>
            <div className="mb-4 flex items-center justify-between print:hidden">
              <button
                onClick={() => {
                  setReceiptData(null);
                  router.push("/receipt");
                }}
                className="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Search Another Receipt</span>
              </button>

              <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 size={13} /> Official Digital Record
              </span>
            </div>

            <OfficialContributionReceipt
              receiptData={receiptData}
              branding={branding}
              onMakeAnother={() => router.push("/contribute")}
            />
          </div>
        ) : (
          /* SEARCH & LOOKUP FORM VIEW */
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-amber-300/80 shadow-md p-6 sm:p-10 text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-900 border border-amber-300 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <ReceiptIcon size={32} className="text-primary" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-bold text-[11px] uppercase tracking-wider mb-2">
                <Sparkles size={12} className="text-primary" />
                <span>Devotional Verification Portal</span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Official Contribution Receipt Lookup
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mb-6">
                Forgot to save your receipt? Enter your <strong>Mobile Number</strong>, <strong>Flat Number</strong>, or <strong>Payment Reference ID</strong> to view and download your official printable A4 receipt.
              </p>

              <form onSubmit={handleSearch} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Mobile No., Flat (e.g. 1106), or UTR..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition shadow-sm shrink-0 cursor-pointer"
                >
                  {loading ? "Searching..." : "Find Receipt"}
                </button>
              </form>

              {errorMsg && (
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-2 rounded-xl">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* MULTIPLE SEARCH RESULTS */}
            {searchResults.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-heading text-base font-bold text-gray-900 mb-4">
                  Found {searchResults.length} Contribution Records
                </h3>
                <div className="divide-y divide-gray-100">
                  {searchResults.map((contrib) => {
                    const r = formatContributionToReceipt(contrib);
                    return (
                      <div
                        key={contrib.id}
                        className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-amber-50/40 p-2 rounded-xl transition"
                      >
                        <div>
                          <div className="font-bold text-sm text-gray-900">{r.name}</div>
                          <div className="text-xs text-gray-600 flex items-center gap-2 mt-0.5">
                            <span>Flat: <strong>{r.flatNumber}</strong></span>
                            <span>•</span>
                            <span>Seva: <strong className="text-primary">{r.category}</strong></span>
                            <span>•</span>
                            <span className="text-gray-500">{r.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="font-mono font-bold text-sm text-green-700">
                            ₹{Number(r.amount).toLocaleString("en-IN")}
                          </div>
                          <button
                            onClick={() => setReceiptData(r)}
                            className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-1.5 rounded-lg transition shadow-2xs cursor-pointer"
                          >
                            View &amp; Print Receipt
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF9]">
        <div className="animate-pulse text-sm font-bold text-gray-600">Loading Official Receipt...</div>
      </div>
    }>
      <ReceiptViewerContent />
    </Suspense>
  );
}
