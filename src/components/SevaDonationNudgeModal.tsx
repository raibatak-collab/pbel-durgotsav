"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Heart, CheckCircle2, ArrowRight, X, Flame, CreditCard, Loader2 } from "lucide-react";
import { loadCashfreeSDK } from "@/utils/cashfree";

interface SevaDonationNudgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityName: string;
  residentName?: string;
  stallOrEventName?: string;
  note?: string;
  phone?: string;
  flatNumber?: string;
  enablePaymentGateway?: boolean;
}

const PRESET_AMOUNTS = [
  { amount: 501, label: "₹501", subtitle: "Deepam & Aarti" },
  { amount: 1001, label: "₹1,001", subtitle: "Pushpanjali & Sweets" },
  { amount: 2501, label: "₹2,501", subtitle: "Maha Bhog Seva" },
  { amount: 5001, label: "₹5,001", subtitle: "Special Pujo Archana" },
];

const SEVA_PURPOSES = [
  "General Pujo Fund",
  "Maha Bhog & Prasad Seva",
  "Pushpanjali & Flower Samagri",
  "Evening Aarti & Cultural Dhunuchi Seva",
];

export default function SevaDonationNudgeModal({
  isOpen,
  onClose,
  activityName,
  residentName,
  stallOrEventName,
  note,
  phone = "",
  flatNumber = "",
  enablePaymentGateway = true,
}: SevaDonationNudgeModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(1001);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState<string>("General Pujo Fund");
  const [donorName, setDonorName] = useState(residentName || "");
  const [donorPhone, setDonorPhone] = useState(phone || "");
  const [donorFlat, setDonorFlat] = useState(flatNumber || "");
  const [isSubmittingPg, setIsSubmittingPg] = useState(false);
  const [pgError, setPgError] = useState<string | null>(null);

  if (!isOpen) return null;

  const effectiveAmount = isCustom ? (parseFloat(customAmount) || 0) : selectedAmount;

  const handleCashfreePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPgError(null);

    if (effectiveAmount <= 0) {
      setPgError("Please select or enter a valid contribution amount (greater than ₹0).");
      return;
    }

    const cleanName = (donorName || residentName || "PBEL Devotee").trim();
    const cleanPhone = (donorPhone || phone || "").replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setPgError("Please provide a valid 10-digit mobile number for receipt generation.");
      return;
    }

    const cleanFlat = (donorFlat || flatNumber || "PBEL City").trim();

    try {
      setIsSubmittingPg(true);

      const res = await fetch("/api/payment/cashfree/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: effectiveAmount,
          customerName: cleanName,
          email: "devotee@pbeldurgotsav.in",
          phone: cleanPhone,
          flatNumber: cleanFlat,
          purpose: selectedPurpose,
          isNameVisible: true,
          orderType: "contribution",
          metadata: {
            source: "cultural_nudge_modal",
            activity: activityName,
          },
        }),
      });

      const data = await res.json();

      if (!data.success || !data.paymentSessionId) {
        setPgError(data.error || "Unable to reach Payment Gateway. You can also contribute directly on the Contribute page.");
        setIsSubmittingPg(false);
        return;
      }

      // Launch Cashfree In-Page Modal Checkout
      const CashfreeSDK = await loadCashfreeSDK();
      if (CashfreeSDK) {
        const cashfree = CashfreeSDK({ mode: data.environment || "production" });
        cashfree
          .checkout({
            paymentSessionId: data.paymentSessionId,
            redirectTarget: "_modal",
          })
          .then((result: any) => {
            if (result?.error) {
              console.log("[Cashfree Nudge Modal Closed/Error]:", result.error);
              setIsSubmittingPg(false);
              fetch("/api/payment/cashfree/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: data.orderId,
                  reason: result.error.message || "Modal dismissed by user",
                  orderType: "contribution",
                }),
              }).catch(() => {});

              if (result.error.message && !result.error.message.toLowerCase().includes("closed")) {
                setPgError(result.error.message);
              }
            } else if (result?.redirect) {
              console.log("[Cashfree Nudge Modal Redirecting]");
            } else {
              window.location.href = `/api/payment/cashfree/return?order_id=${encodeURIComponent(data.orderId)}`;
            }
          })
          .catch((err: any) => {
            console.error("[Cashfree Nudge Modal Error]:", err);
            setIsSubmittingPg(false);
            setPgError("Payment could not be completed. Your registration is still safely recorded.");
          });
      } else {
        window.location.href = `/api/payment/cashfree/return?order_id=${encodeURIComponent(data.orderId)}`;
      }
    } catch (err: any) {
      console.error("[Cashfree Nudge Exception]:", err);
      setPgError("Could not connect to payment gateway. Your registration remains accepted.");
      setIsSubmittingPg(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full border border-amber-300 shadow-2xl relative my-auto overflow-hidden">
        
        {/* Festive Background Accents */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-red-100/50 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Registration Confirmation Badge */}
        <div className="text-center mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-600 text-white flex items-center justify-center mx-auto mb-2.5 shadow-md border-2 border-emerald-200">
            <CheckCircle2 size={30} />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-1.5 shadow-xs">
            <Sparkles size={12} className="text-emerald-700 animate-pulse" />
            <span>Registration Confirmed &amp; Accepted</span>
          </div>

          <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
            Thank You{residentName ? `, ${residentName}` : ""}! 🙏
          </h3>

          <p className="text-xs text-gray-600 mt-1 leading-relaxed max-w-sm mx-auto">
            Your entry for <strong className="text-gray-900">{stallOrEventName || activityName}</strong> is officially accepted by the PBEL Sanskritik Samiti committee.
          </p>
        </div>

        {note && (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-2.5 text-[11px] text-emerald-900 mb-4 text-center">
            {note}
          </div>
        )}

        {/* Devotional Seva Nudge Card */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50/80 to-amber-100/50 p-4 sm:p-5 rounded-2xl border border-amber-300 mb-4 text-left shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-primary font-bold text-xs uppercase tracking-wide">
              <Flame size={15} className="text-primary fill-primary" />
              <span>Offer a Pujo Seva</span>
            </div>
            <span className="text-[10px] font-semibold bg-amber-200/70 text-amber-950 px-2 py-0.5 rounded-full">
              100% Voluntary
            </span>
          </div>

          <p className="text-xs text-gray-700 leading-relaxed mb-3">
            PBEL City Durgotsav is organized solely through the voluntary contributions and pious seva of our resident families. Would you like to offer a seva for Maa Durga’s festival?
          </p>

          {enablePaymentGateway && (
            <form onSubmit={handleCashfreePayment} className="space-y-3 pt-1">
              
              {/* Preset Amounts Grid */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                  Select Seva Contribution Amount:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_AMOUNTS.map((p) => {
                    const isSelected = !isCustom && selectedAmount === p.amount;
                    return (
                      <button
                        key={p.amount}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(p.amount);
                          setIsCustom(false);
                          setCustomAmount("");
                        }}
                        className={
                          "p-2 rounded-xl border text-left transition flex flex-col justify-center text-xs " +
                          (isSelected
                            ? "bg-amber-100 border-amber-500 ring-2 ring-amber-400 font-bold text-amber-950"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50")
                        }
                      >
                        <span className="font-heading font-bold text-sm text-gray-900">{p.label}</span>
                        <span className="text-[10px] text-gray-500">{p.subtitle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Amount Option */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustom(true)}
                  className={
                    "text-xs px-3 py-1.5 rounded-xl border transition " +
                    (isCustom
                      ? "bg-amber-100 border-amber-500 font-bold text-amber-950 ring-1 ring-amber-400"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50")
                  }
                >
                  Custom Amount
                </button>
                {isCustom && (
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2 text-xs font-bold text-gray-500">₹</span>
                    <input
                      type="number"
                      min={100}
                      step={50}
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="e.g. 1500"
                      className="w-full pl-7 pr-3 py-1.5 text-xs border border-amber-400 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                    />
                  </div>
                )}
              </div>

              {/* Seva Category Dropdown */}
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1">
                  Seva Offering Category:
                </label>
                <select
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value)}
                  className="w-full p-2 text-xs border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-400 outline-none text-gray-800"
                >
                  {SEVA_PURPOSES.map((purp) => (
                    <option key={purp} value={purp}>
                      {purp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contributor Details (if missing) */}
              {(!phone || !residentName) && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Your Full Name"
                    className="p-2 text-xs border border-gray-200 rounded-xl bg-white outline-none"
                  />
                  <input
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="10-digit Phone"
                    className="p-2 text-xs border border-gray-200 rounded-xl bg-white outline-none"
                  />
                </div>
              )}

              {pgError && (
                <div className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-xl p-2 font-medium">
                  {pgError}
                </div>
              )}

              {/* Instant Payment Gateway Button */}
              <button
                type="submit"
                disabled={isSubmittingPg}
                className="w-full bg-gradient-to-r from-[#D99B26] via-[#B8801C] to-[#966714] hover:from-[#B8801C] hover:to-[#78520D] text-white font-bold py-3 px-4 rounded-xl transition shadow-md golden-glow flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
              >
                {isSubmittingPg ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Connecting to Payment Gateway...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    <span>Pay ₹{effectiveAmount.toLocaleString("en-IN")} via Payment Gateway</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Secondary Link to Contribution Page */}
          <div className="text-center pt-2.5">
            <Link
              href="/contribute"
              onClick={onClose}
              className="text-[11px] font-semibold text-amber-900 hover:text-amber-950 underline inline-flex items-center gap-1"
            >
              <span>Explore all Seva Offerings &amp; 80G Tax Exemption on /contribute</span>
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>

        {/* Cancellation / Dismiss Button */}
        <div className="space-y-2 text-center pt-1 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 text-xs sm:text-sm font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition"
          >
            I am not interested in donating for a seva
          </button>

          <p className="text-[10px] text-gray-400">
            Your event registration is 100% confirmed and accepted regardless of your decision.
          </p>
        </div>
      </div>
    </div>
  );
}
