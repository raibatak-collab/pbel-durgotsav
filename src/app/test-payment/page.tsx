"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  Info, 
  Building, 
  Receipt, 
  RefreshCw,
  Zap,
  Lock
} from "lucide-react";
import { loadCashfreeSDK } from "@/utils/cashfree";
import { PBEL_TOWERS, getStoredTowers, TowerDefinition } from "@/config/towers";

export default function TestPaymentPage() {
  const [amount, setAmount] = useState<number>(1);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [testerName, setTesterName] = useState<string>("Committee Tester");
  const [testerPhone, setTesterPhone] = useState<string>("9845000000");
  const [selectedTower, setSelectedTower] = useState<string>("Tower A (Emerald)");
  const [flatUnit, setFlatUnit] = useState<string>("101");
  const [towersList, setTowersList] = useState<TowerDefinition[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredTowers();
    setTowersList(stored);
    if (stored.length > 0) {
      setSelectedTower(stored[0].fullName || `${stored[0].tower} (${stored[0].name})`);
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      if (err) {
        setErrorMessage("Transaction was not completed or was cancelled. You can retry anytime.");
      }
    }
  }, []);

  const activeAmount = customAmount ? Number(customAmount) : amount;

  const handleLaunchCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (activeAmount <= 0) {
      setErrorMessage("Please enter an amount greater than ₹0.");
      return;
    }

    const cleanPhone = testerPhone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!testerName.trim()) {
      setErrorMessage("Please enter a tester name.");
      return;
    }

    try {
      setIsSubmitting(true);
      const flatFormatted = `${selectedTower} - ${flatUnit.trim()}`;

      // 1. Call server API to create order
      const res = await fetch("/api/payment/cashfree/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: activeAmount,
          customerName: testerName.trim(),
          email: "pbelsanskritiksamiti@gmail.com",
          phone: cleanPhone,
          flatNumber: flatFormatted,
          purpose: `Cashfree Production Verification (₹${activeAmount})`,
          orderType: "contribution",
          isNameVisible: true,
        }),
      });

      const data = await res.json();

      if (!data.success || !data.paymentSessionId) {
        setErrorMessage(data.error || "Failed to initialize payment session with Cashfree.");
        setIsSubmitting(false);
        return;
      }

      // 2. Load Cashfree JS SDK and launch redirect checkout
      const CashfreeSDK = await loadCashfreeSDK();
      if (CashfreeSDK) {
        const cashfree = CashfreeSDK({ mode: data.environment || "production" });
        cashfree.checkout({
          paymentSessionId: data.paymentSessionId,
          redirectTarget: "_self",
        });
      } else {
        window.location.href = `/api/payment/cashfree/return?order_id=${encodeURIComponent(data.orderId)}`;
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setErrorMessage(err.message || "Failed to launch Cashfree checkout.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-gray-800 pb-20">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-b from-amber-900 via-amber-950 to-[#2A0E08] text-white py-10 px-4 sm:px-6 relative overflow-hidden shadow-lg border-b border-amber-600/30">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-white font-semibold mb-4 transition"
          >
            <ArrowLeft size={14} /> Back to Admin Console
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold border border-green-500/40 inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Cashfree Production Live Mode
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-mono">
              App ID: 1391744ac71f0408...
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-2">
            <span>🧪 Cashfree Payment Gateway Verification Lab</span>
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/80 max-w-2xl mt-1 leading-relaxed">
            Test real end-to-end payment checkout with a small contribution (e.g. <strong>₹1</strong>) using your UPI app (GPay, PhonePe, Paytm), Card, or NetBanking. Once verified, you can toggle the gateway live for all residents.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-4 relative z-20 space-y-6">

        {/* ERROR ALERT */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-2xl text-xs flex items-center justify-between shadow-xs">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="font-bold text-red-900 ml-2">Dismiss</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* MAIN TEST PAYMENT FORM */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="text-primary" size={20} />
                <h2 className="font-heading font-bold text-lg text-gray-900">
                  Initiate Test Contribution
                </h2>
              </div>
              <span className="text-xs font-mono font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">
                100% Real Live PG
              </span>
            </div>

            <form onSubmit={handleLaunchCheckout} className="space-y-4 text-xs">
              
              {/* AMOUNT SELECTOR */}
              <div className="space-y-2">
                <label className="block font-bold text-gray-800 text-xs">
                  Select Test Contribution Amount *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 5, 10, 50].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setAmount(amt);
                        setCustomAmount("");
                      }}
                      className={`py-3 px-2 rounded-xl font-mono font-bold text-sm transition border ${
                        !customAmount && amount === amt
                          ? "bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/30"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      ₹{amt}
                      {amt === 1 && <span className="block text-[9px] font-sans font-normal opacity-90">Micro</span>}
                    </button>
                  ))}
                </div>

                <div className="pt-1">
                  <input
                    type="number"
                    min="1"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Or enter custom test amount (e.g. ₹100)..."
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* TESTER NAME */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Tester / Resident Name *
                </label>
                <input
                  type="text"
                  required
                  value={testerName}
                  onChange={(e) => setTesterName(e.target.value)}
                  placeholder="e.g. Amit Roy (Committee)"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs"
                />
              </div>

              {/* TESTER PHONE */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Tester Mobile Number (10 Digits) *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={testerPhone}
                  onChange={(e) => setTesterPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="e.g. 9845000000"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono text-xs"
                />
              </div>

              {/* TOWER & FLAT */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
                    <Building size={12} className="text-primary" /> Tower
                  </label>
                  <select
                    value={selectedTower}
                    onChange={(e) => setSelectedTower(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none text-xs"
                  >
                    {towersList.map((t) => (
                      <option key={t.id} value={t.fullName || `${t.tower} (${t.name})`}>
                        {t.fullName || `${t.tower} (${t.name})`}
                      </option>
                    ))}
                    <option value="Tower A (Emerald)">Tower A (Emerald)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    Flat / Unit *
                  </label>
                  <input
                    type="text"
                    required
                    value={flatUnit}
                    onChange={(e) => setFlatUnit(e.target.value.toUpperCase().slice(0, 8))}
                    placeholder="e.g. 101"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono text-xs"
                  />
                </div>
              </div>

              {/* CTA BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting || activeAmount <= 0}
                className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm golden-glow disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                <CreditCard size={18} className={isSubmitting ? "animate-pulse" : ""} />
                <span>
                  {isSubmitting
                    ? "Connecting to Cashfree Production..."
                    : `Launch Cashfree Checkout (₹${activeAmount.toLocaleString("en-IN")})`}
                </span>
              </button>

              <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1 pt-1">
                <ShieldCheck size={13} className="text-green-600" /> Redirects to Cashfree's PCI-compliant checkout page
              </p>
            </form>
          </div>

          {/* SIDEBAR: TECHNICAL SPECS & WHAT TO EXPECT */}
          <div className="space-y-4">
            
            <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-md space-y-3">
              <span className="font-bold text-xs text-amber-950 uppercase tracking-wider block border-b border-gray-100 pb-2 flex items-center gap-1.5">
                <Zap size={14} className="text-primary" /> How This Test Works
              </span>
              <ul className="text-[11px] text-gray-600 space-y-2 list-disc pl-4 leading-relaxed">
                <li>
                  <strong>Direct Debit</strong>: ₹{activeAmount} will be debited from your selected UPI app or Card and credited to the PBEL Sanskritik Samiti ICICI account.
                </li>
                <li>
                  <strong>Automatic Redirect</strong>: Cashfree redirects back to our server-to-server return endpoint: <code>/api/payment/cashfree/return</code>.
                </li>
                <li>
                  <strong>DB Update</strong>: Supabase <code>contributions</code> table is updated with <code>status: 'Success'</code> and bank UTR.
                </li>
                <li>
                  <strong>Official Receipt</strong>: You will land on <code>/receipt?id=...</code> showing the verified receipt with WhatsApp sharing.
                </li>
              </ul>
            </div>

            <div className="bg-amber-50/60 rounded-3xl p-5 border border-amber-200/80 space-y-2 text-xs">
              <span className="font-bold text-gray-900 block flex items-center gap-1.5">
                <Info size={14} className="text-amber-700" /> Making It Live for All
              </span>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Once you test and confirm receipt of the test payment in your bank account, go to the Admin portal and toggle <strong>"Cashfree Gateway Live for All"</strong> to enable it across <code>/contribute</code> and <code>/anandamela</code>.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline pt-1"
              >
                Go to Admin Portal <ArrowRight size={12} />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
