"use client";

import { useState, useEffect } from "react";
import { 
  HeartHandshake, 
  CheckCircle2, 
  QrCode, 
  Smartphone, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowRight, 
  Receipt, 
  Download, 
  X, 
  Info, 
  Lock,
  Sparkles,
  Building,
  Flame
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { getStoredTowers, fetchStoredTowers, TowerDefinition } from "@/config/towers";
import { buildUpiPayUri } from "@/utils/security";
import { saveQrCodeToGallery } from "@/utils/qrDownload";

const SOCIETY_UPI_ID = "pbelsanskritiksamiti@icici";
const SOCIETY_NAME = "PBEL Sanskritik Samiti";

const OPEN_PRESET_AMOUNTS = [501, 1001, 2000, 5001, 10001];

interface FeaturedSevaPackage {
  id: string;
  name: string;
  amount: number;
  icon: string;
  badge: string;
  desc: string;
  maxLimit: number;
  bookedCount: number;
  isSoldOut: boolean;
}

const DEFAULT_FEATURED_SEVAS: FeaturedSevaPackage[] = [
  { id: "def-1", name: "Maha Bhog Family Seva", amount: 2501, icon: "🍚", badge: "Most Popular", desc: "Sponsor 1-day pure ghee bhog for resident community", maxLimit: 10, bookedCount: 0, isSoldOut: false },
  { id: "def-2", name: "108 Sandhi Deepam & Lotuses", amount: 3100, icon: "🪔", badge: "Sacred Sandhi", desc: "108 earthen lamps, pure ghee & red lotuses", maxLimit: 5, bookedCount: 0, isSoldOut: false },
  { id: "def-3", name: "Pushpanjali & Kumari Puja", amount: 1501, icon: "🌺", badge: "Auspicious", desc: "Pushpanjali flowers, sacred bilva patra & Kumari puja", maxLimit: 10, bookedCount: 0, isSoldOut: false },
  { id: "def-4", name: "Grand Pujo Patron Seva", amount: 10001, icon: "👑", badge: "Grand Seva", desc: "Pandal lighting, Dhaaki troupe & flagship immersion", maxLimit: 3, bookedCount: 0, isSoldOut: false },
];

function decodeCategoryMeta(desc?: string) {
  const str = desc || "";
  const limitMatch = str.match(/\[limit:(\d+)\]/);
  const statusMatch = str.match(/\[status:(active|inactive)\]/);
  const featuredMatch = str.match(/\[featured:(true|false)\]/);

  const cleanDescription = str
    .replace(/\[limit:\d+\]/g, "")
    .replace(/\[status:(active|inactive)\]/g, "")
    .replace(/\[featured:(true|false)\]/g, "")
    .trim();

  const parsedLimit = limitMatch ? Number(limitMatch[1]) : 5;
  const parsedActive = statusMatch ? statusMatch[1] === "active" : true;
  const parsedFeatured = featuredMatch ? featuredMatch[1] === "true" : undefined;

  return { cleanDescription, parsedLimit, parsedActive, parsedFeatured };
}

export function HomeQuickContribute() {
  const [featuredSevas, setFeaturedSevas] = useState<FeaturedSevaPackage[]>(DEFAULT_FEATURED_SEVAS);
  const [selectedSevaId, setSelectedSevaId] = useState<string>("open_fund");
  const [amount, setAmount] = useState<number | "">("");
  const [purpose, setPurpose] = useState<string>("General Pujo Fund");
  const [contributorCount, setContributorCount] = useState<number>(0);
  const [towersList, setTowersList] = useState<TowerDefinition[]>([]);
  const [selectedTower, setSelectedTower] = useState<string>("");
  const [flatUnit, setFlatUnit] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    upiRef: "",
    isNameVisible: true,
  });

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  // Load live data: dynamic contributor count, admin featured categories & towers
  const loadDynamicData = async () => {
    try {
      // 1. Fetch Towers
      const stored = getStoredTowers();
      setTowersList(stored);
      if (stored.length > 0) {
        setSelectedTower((prev) => prev || stored[0].fullName || `${stored[0].tower} (${stored[0].name})`);
      }
      fetchStoredTowers().then((cloudTowers) => {
        if (cloudTowers && cloudTowers.length > 0) {
          setTowersList(cloudTowers);
        }
      });

      // 2. Fetch Contributions Count (Status === "Success")
      const { count, data: contribs } = await supabase
        .from("contributions")
        .select("category_id, amount, status", { count: "exact" })
        .eq("status", "Success");
      
      setContributorCount(count || 0);

      // 3. Fetch Categories from Supabase to load Admin's Featured Seva Offerings
      const { data: dbCategories } = await supabase
        .from("contribution_categories")
        .select("*");

      if (dbCategories && dbCategories.length > 0) {
        const allParsed = dbCategories.map((c: any) => {
          const meta = decodeCategoryMeta(c.description);
          const booked = (contribs || []).filter((item: any) => item.category_id === c.id).length;
          const max = c.max_limit ? Number(c.max_limit) : meta.parsedLimit;
          const isSoldOut = booked >= max;

          return {
            id: c.id,
            name: c.name,
            amount: c.fixed_amount ? Number(c.fixed_amount) : 1001,
            icon: c.name.toLowerCase().includes("bhog") ? "🍚" : c.name.toLowerCase().includes("sandhi") || c.name.toLowerCase().includes("deepam") ? "🪔" : c.name.toLowerCase().includes("pushpanjali") || c.name.toLowerCase().includes("flower") ? "🌺" : "👑",
            badge: meta.parsedFeatured ? "⭐ Featured" : (c.fixed_amount >= 10000 ? "Grand Seva" : "Sacred Offering"),
            desc: meta.cleanDescription || "Special seva offering for PBEL City Durgotsav.",
            maxLimit: max,
            bookedCount: booked,
            isSoldOut,
            isFeatured: meta.parsedFeatured,
            isActive: meta.parsedActive,
          };
        });

        // Filter explicitly featured categories by Admin, or fallback to active categories
        const featured = allParsed.filter((c: any) => c.isFeatured && c.isActive);
        if (featured.length > 0) {
          setFeaturedSevas(featured);
        } else {
          const topActive = allParsed.filter((c: any) => c.isActive && c.fixed_amount >= 1500).slice(0, 4);
          if (topActive.length > 0) {
            setFeaturedSevas(topActive);
          }
        }
      }
    } catch (err) {
      console.error("Error loading dynamic contribution data:", err);
    }
  };

  useEffect(() => {
    loadDynamicData();

    const handleTowerUpdate = () => {
      const stored = getStoredTowers();
      setTowersList(stored);
    };

    const handleCategoryUpdate = () => {
      loadDynamicData();
    };

    window.addEventListener("pbel_towers_updated", handleTowerUpdate);
    window.addEventListener("pbel_categories_updated", handleCategoryUpdate);

    return () => {
      window.removeEventListener("pbel_towers_updated", handleTowerUpdate);
      window.removeEventListener("pbel_categories_updated", handleCategoryUpdate);
    };
  }, []);

  const handleSelectPackage = (pkg: FeaturedSevaPackage) => {
    if (pkg.isSoldOut) return;
    setSelectedSevaId(pkg.id);
    setAmount(pkg.amount);
    setPurpose(pkg.name);
  };

  const handleSelectOpenFund = (presetAmt?: number) => {
    setSelectedSevaId("open_fund");
    setPurpose("General Pujo Fund");
    if (presetAmt !== undefined) {
      setAmount(presetAmt);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(SOCIETY_UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const generateUpiString = (
    amt: number, 
    appScheme?: "generic" | "gpay" | "phonepe" | "paytm"
  ) => {
    return buildUpiPayUri({
      am: amt,
      tn: purpose || "Pujo Seva",
      appScheme: appScheme || "generic",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    const formattedFlat = selectedTower === "Other"
      ? flatUnit.trim() || "Guest Devotee"
      : `${selectedTower} - ${flatUnit.trim()}`;

    if (!formData.name.trim() || !flatUnit.trim() || !formData.phone.trim()) {
      alert("Please enter your Name, Flat Number, and Phone Number.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Get or create category
      let { data: catData } = await supabase
        .from("contribution_categories")
        .select("id")
        .eq("name", purpose || "General Pujo Fund")
        .single();

      if (!catData) {
        const { data: newCat } = await supabase
          .from("contribution_categories")
          .insert({ name: purpose || "General Pujo Fund" })
          .select("id")
          .single();
        catData = newCat;
      }

      const generatedPaymentId = formData.upiRef.trim() 
        ? `UTR_${formData.upiRef.trim()}` 
        : `WEB_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      // 2. Insert with status "Pending" to comply with PostgreSQL check constraint
      const { error } = await supabase.from("contributions").insert({
        contributor_name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        flat_number: formattedFlat,
        amount: Number(amount),
        category_id: catData?.id,
        status: "Pending",
        is_name_visible: formData.isNameVisible,
        payment_id: generatedPaymentId,
      });

      if (error) throw error;

      setReceiptData({
        name: formData.name.trim(),
        flatNumber: formattedFlat,
        phone: formData.phone.trim(),
        amount: Number(amount),
        category: purpose || "General Pujo Fund",
        paymentId: generatedPaymentId,
        upiId: SOCIETY_UPI_ID,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      setIsSuccess(true);
    } catch (err) {
      console.error("Error submitting contribution:", err);
      alert("Submission failed. Please check your network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/15 shadow-xl relative overflow-hidden">
      {/* Decorative Accent Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {isSuccess && receiptData ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={36} />
          </div>
          <h3 className="font-heading text-2xl font-bold text-primary">
            ধন্যবাদ! Contribution Recorded
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            Your seva contribution has been successfully submitted for verification. 
            Maa Durga bless you and your family!
          </p>

          <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200 text-left max-w-md mx-auto space-y-2 text-xs">
            <div className="flex justify-between border-b border-amber-200/60 pb-2">
              <span className="text-gray-500">Devotee</span>
              <span className="font-bold text-gray-900">{receiptData.name} ({receiptData.flatNumber})</span>
            </div>
            <div className="flex justify-between border-b border-amber-200/60 pb-2">
              <span className="text-gray-500">Seva Offering</span>
              <span className="font-bold text-gray-900">{receiptData.category}</span>
            </div>
            <div className="flex justify-between border-b border-amber-200/60 pb-2">
              <span className="text-gray-500">Amount</span>
              <span className="font-bold text-green-700 text-sm">₹{Number(receiptData.amount).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-gray-500">Reference ID</span>
              <span className="font-mono text-gray-700">{receiptData.paymentId}</span>
            </div>
          </div>

          <div className="pt-3 flex justify-center gap-3">
            <button
              onClick={() => {
                setIsSuccess(false);
                setReceiptData(null);
                setFormData({ name: "", phone: "", email: "", upiRef: "", isNameVisible: true });
                setFlatUnit("");
              }}
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-6 py-2.5 rounded-full transition shadow-sm"
            >
              Contribute Again
            </button>
            <Link
              href="/contribute"
              className="bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold px-6 py-2.5 rounded-full transition"
            >
              View All Seva Offerings →
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {/* Header & Devotional Pitch */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-bold mb-2">
                <Sparkles size={13} className="text-primary" />
                <span>1-Click Zero-Fee Devotional Seva</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
                Sponsor Seva Offering &amp; Support PBEL Durgotsav
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Direct zero-fee UPI transfer to official PBEL Sanskritik Samiti ICICI account. 100% transparent.
              </p>
            </div>

            {/* DYNAMIC PARTICIPATION & FOMO BADGE */}
            <div className="shrink-0 bg-gradient-to-r from-amber-500/15 via-red-500/10 to-amber-500/15 border border-amber-300 rounded-2xl px-4 py-2.5 text-center sm:text-right">
              <span className="text-[11px] font-bold text-amber-950 flex items-center justify-center sm:justify-end gap-1">
                <Flame size={14} className="text-red-600 animate-pulse" /> Limited Sacred Seva Slots
              </span>
              {contributorCount > 0 ? (
                <span className="text-[10px] text-gray-700 font-semibold block mt-0.5">
                  {contributorCount} PBEL {contributorCount === 1 ? "Family Has" : "Families Have"} Contributed
                </span>
              ) : (
                <span className="text-[10px] text-amber-900 font-medium block mt-0.5">
                  Panchami to Dashami Sacred Offerings Open for PBEL Families
                </span>
              )}
            </div>
          </div>

          {/* CURATED / ADMIN-FEATURED SEVA OFFERINGS */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
                <span>Featured Sacred Seva Offerings</span>
                <span className="text-primary font-normal">• Or Choose Open Contribution Below</span>
              </label>
              <Link href="/contribute" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                View 6-Day Full Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {featuredSevas.map((pkg) => {
                const isSelected = selectedSevaId === pkg.id;
                return (
                  <button
                    key={pkg.id || pkg.name}
                    type="button"
                    disabled={pkg.isSoldOut}
                    onClick={() => handleSelectPackage(pkg)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      pkg.isSoldOut
                        ? "bg-gray-100/80 border-gray-200 opacity-60 cursor-not-allowed"
                        : isSelected
                        ? "bg-amber-50/80 border-primary shadow-sm ring-2 ring-primary/20 scale-[1.01]"
                        : "bg-gray-50/70 border-gray-200 hover:bg-white hover:border-amber-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">{pkg.icon}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          pkg.isSoldOut
                            ? "bg-red-100 text-red-800"
                            : isSelected 
                            ? "bg-primary text-white" 
                            : "bg-gray-200 text-gray-700"
                        }`}>
                          {pkg.isSoldOut ? "🔒 Sold Out" : pkg.badge}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 leading-tight">
                        {pkg.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">
                        {pkg.desc}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-gray-200/60 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-medium">
                        {pkg.isSoldOut ? "Capacity Reached" : `${Math.max(0, pkg.maxLimit - pkg.bookedCount)} slots left`}
                      </span>
                      <span className="font-heading text-sm font-bold text-primary font-mono">
                        ₹{pkg.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Grid */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. OPEN FUND PRESET AMOUNT CHIPS & CUSTOM INPUT */}
            <div className="bg-amber-50/50 p-4 sm:p-5 rounded-2xl border border-amber-200/80">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Offering Amount (₹ INR) *
                </label>
                <span className="text-[11px] text-amber-900 font-bold">
                  {purpose}
                </span>
              </div>

              {/* Pre-populated Fast Amount Chips (Starts without forced default) */}
              <div className="flex flex-wrap gap-2 mb-3">
                {OPEN_PRESET_AMOUNTS.map((amt) => {
                  const isChipActive = Number(amount) === amt && selectedSevaId === "open_fund";
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSelectOpenFund(amt)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold font-mono transition ${
                        isChipActive
                          ? "bg-primary text-white shadow-sm ring-2 ring-primary/30 scale-102"
                          : "bg-white hover:bg-amber-100 text-gray-800 border border-amber-200"
                      }`}
                    >
                      ₹{amt.toLocaleString("en-IN")}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => handleSelectOpenFund()}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    selectedSevaId === "open_fund" && !OPEN_PRESET_AMOUNTS.includes(Number(amount))
                      ? "bg-primary text-white font-bold"
                      : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  Custom ₹
                </button>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-gray-500 font-bold text-sm">₹</span>
                <input
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) : "";
                    setAmount(val);
                    if (selectedSevaId !== "open_fund") {
                      setSelectedSevaId("open_fund");
                      setPurpose("General Pujo Fund");
                    }
                  }}
                  placeholder="Select a preset above or enter custom amount..."
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-bold text-gray-900 bg-white"
                />
              </div>
            </div>

            {/* 2. DYNAMIC QR CODE & 1-TAP MOBILE PAYMENT WIDGET (PLACED BEFORE DETAILS FORM FOR ZERO SCROLLING ON MOBILE) */}
            {amount && Number(amount) > 0 ? (
              <div className="bg-gradient-to-br from-amber-50/95 via-orange-50/80 to-amber-100/50 p-5 sm:p-6 rounded-3xl border border-amber-300/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left space-y-3 flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-950 text-xs font-bold">
                    <Sparkles size={13} className="text-primary" />
                    <span>Official Society ICICI Bank Account</span>
                  </div>

                  <p className="text-base font-bold text-gray-900 leading-snug">
                    Offering Amount: <span className="text-primary font-mono text-xl">₹{Number(amount).toLocaleString("en-IN")}</span>
                  </p>

                  {/* Primary 1-Tap Copy Action & Banking App Link */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-98 golden-glow"
                      >
                        {copiedUpi ? <Check size={16} className="text-white" /> : <Copy size={16} />}
                        <span>{copiedUpi ? "✓ UPI ID Copied to Clipboard!" : "📋 1-Tap Copy UPI ID"}</span>
                      </button>

                      <a
                        href={generateUpiString(Number(amount))}
                        className="bg-white hover:bg-amber-50 text-gray-800 border border-amber-300 text-xs font-bold px-4 py-3 rounded-2xl transition flex items-center justify-center gap-1.5 shadow-2xs"
                        title="Open banking apps that support web deep links like Kotak, BHIM"
                      >
                        <Smartphone size={15} className="text-primary" />
                        <span>Open Banking App (Kotak / BHIM)</span>
                      </a>
                    </div>

                    <div className="bg-white/80 border border-amber-200/80 rounded-xl p-2.5 text-left text-[11px] text-gray-700 space-y-1">
                      <span className="font-bold text-gray-900 block">📱 How to Pay via Google Pay / PhonePe / Paytm:</span>
                      <ol className="list-decimal list-inside space-y-0.5 text-gray-600">
                        <li>Tap <strong className="text-amber-900">"1-Tap Copy UPI ID"</strong> above</li>
                        <li>Open <strong>GPay / PhonePe / Paytm</strong> ➔ Tap <strong>"Pay UPI ID / To UPI ID"</strong></li>
                        <li>Paste <strong className="font-mono text-primary">{SOCIETY_UPI_ID}</strong> &amp; Pay ₹{Number(amount).toLocaleString("en-IN")}</li>
                      </ol>
                    </div>

                    {/* Adaptive Pro-Tip for Google Pay / UPI amounts above Rs 2,000 */}
                    {Number(amount) > 2000 && (
                      <div className="bg-amber-100/90 border border-amber-300 p-3 rounded-2xl text-[11.5px] text-amber-950 flex items-start gap-2 shadow-2xs">
                        <span className="text-base shrink-0">💡</span>
                        <div className="leading-snug">
                          <strong>Note for Google Pay (&gt; ₹2,000):</strong> Google Pay restricts remote gallery photo uploads to ₹2,000. For your contribution of <strong className="text-primary font-bold">₹{Number(amount).toLocaleString("en-IN")}</strong>, please use <strong className="text-amber-900">"📋 1-Tap Copy UPI ID"</strong> and pay via <em>"Pay to UPI ID"</em> in GPay for instant approval without limits, or scan this QR directly with another device.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-white p-3.5 rounded-3xl border border-amber-300/90 shadow-md shrink-0 text-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                      generateUpiString(Number(amount))
                    )}`}
                    alt="PBEL Sanskritik Samiti UPI QR"
                    className="w-36 h-36 mx-auto rounded-xl"
                  />
                  <span className="text-[11px] text-gray-800 font-bold block mt-1.5 font-mono">Scan with Any UPI App</span>
                  <button
                    type="button"
                    onClick={() => saveQrCodeToGallery(generateUpiString(Number(amount)), amount, purpose || "Pujo-Offering")}
                    className="mt-2 text-[10px] font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition flex items-center justify-center gap-1 w-full shadow-2xs"
                  >
                    <Download size={12} />
                    <span>{Number(amount) > 2000 ? "Save QR (PhonePe / Paytm / <₹2k)" : "Save QR to Gallery / Photos"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-dashed border-amber-300/80 text-center text-xs text-amber-900">
                👆 <strong>Select a preset above (e.g. ₹501, ₹1,001) or enter any amount</strong> to generate your instant QR code &amp; 1-Tap Copy UPI details.
              </div>
            )}

            {/* 3. DEVOTEE PERSONAL DETAILS */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Devotee Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    WhatsApp Mobile (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setFormData({ ...formData, phone: val });
                    }}
                    placeholder="e.g. 9845000000"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm font-mono"
                  />
                </div>
              </div>

              {/* 1-TAP TOWER SELECTOR + FLAT UNIT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200">
                <div>
                  <label className="block text-xs font-bold text-amber-950 uppercase mb-1 flex items-center gap-1">
                    <Building size={13} className="text-primary" /> Select PBEL Tower *
                  </label>
                  <select
                    value={selectedTower}
                    onChange={(e) => setSelectedTower(e.target.value)}
                    className="w-full p-2.5 border border-amber-300/80 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm font-semibold text-gray-900"
                  >
                    {towersList.map((t) => (
                      <option key={t.id} value={t.fullName || `${t.tower} (${t.name})`}>
                        {t.fullName || `${t.tower} (${t.name})`}
                      </option>
                    ))}
                    <option value="Other">Other / Non-Resident Guest</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-950 uppercase mb-1">
                    Flat / Unit Number (Digits Only) *
                  </label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={6}
                    value={flatUnit}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setFlatUnit(val);
                    }}
                    placeholder="e.g. 402 or 1204"
                    className="w-full p-2.5 border border-amber-300/80 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm font-medium font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  UPI UTR / Ref No. (Optional for Instant Match)
                </label>
                <input
                  type="text"
                  value={formData.upiRef}
                  onChange={(e) => setFormData({ ...formData, upiRef: e.target.value })}
                  placeholder="e.g. 12-digit UTR from GPay / PhonePe / Paytm"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm font-mono"
                />
              </div>

              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/60 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="home-wall-visible"
                  checked={formData.isNameVisible}
                  onChange={(e) => setFormData({ ...formData, isNameVisible: e.target.checked })}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary mt-0.5"
                />
                <label htmlFor="home-wall-visible" className="text-xs text-gray-800 leading-normal cursor-pointer">
                  <strong>Display my name on the public "Wall of Contributors"</strong>
                  <span className="block text-gray-500 text-[11px] mt-0.5">
                    Uncheck if you prefer your contribution to remain Anonymous.
                  </span>
                </label>
              </div>

            </div>

            {/* 4. SUBMIT ACTION */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !amount || amount <= 0}
                className="w-full bg-gradient-to-r from-[#D99B26] via-[#B8801C] to-[#966714] hover:from-[#B8801C] text-white font-bold text-base py-3.5 rounded-2xl transition shadow-lg hover:shadow-xl disabled:opacity-50 golden-glow flex items-center justify-center gap-2"
              >
                <HeartHandshake size={20} />
                <span>
                  {isSubmitting
                    ? "Recording Offering..."
                    : `Confirm & Record ₹${amount ? Number(amount).toLocaleString("en-IN") : "0"} Offering`}
                </span>
              </button>
              <span className="text-[11px] text-gray-400 text-center block mt-2 flex items-center justify-center gap-1">
                <ShieldCheck size={13} className="text-green-600" /> 100% Direct Society Bank Settlement
              </span>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}
