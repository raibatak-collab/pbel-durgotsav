"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Utensils,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  X,
  Send,
  ChefHat,
  Flame,
  QrCode,
  Copy,
  Check,
  Info,
  ShieldCheck,
  AlertCircle,
  ShoppingBag,
  CreditCard,
  Tag,
  Palette,
  Gift
} from "lucide-react";
import { PBEL_TOWERS, PBEL_TOWER_NAMES, getStoredTowers, fetchStoredTowers, TowerDefinition } from "@/config/towers";
import { sanitizeText, validatePhoneNumber, buildUpiPayUri, OFFICIAL_BANK_UPI } from "@/utils/security";
import { fetchCloudConfig, saveCloudConfig } from "@/utils/cloudConfig";
import { loadCashfreeSDK } from "@/utils/cashfree";
import SevaDonationNudgeModal from "@/components/SevaDonationNudgeModal";

export interface FoodDish {
  name: string;
  price: number;
  isVeg: boolean;
  specialty?: boolean;
}

export type StallType = "Food" | "Non-Food";

export const FOOD_CATEGORIES = [
  "Rolls & Mughlai",
  "Bengali Delicacies",
  "Street Food & Chaat",
  "Sweets & Pithe",
  "Snacks & Quick Bites",
] as const;

export const NON_FOOD_CATEGORIES = [
  "Handicrafts & Art",
  "Jewellery & Accessories",
  "Apparel & Festive Wear",
  "Games & Fun Activities",
  "Mehndi & Face Art",
  "Home Decor & Festive",
  "Other Services & Goods",
] as const;

export interface FoodStall {
  id: string;
  stallNumber: string;
  stallName: string;
  chefName: string; // Used for Chef / Stall Host
  stallType?: StallType;
  tower: string;
  flatNumber: string;
  phone: string;
  category: string;
  description: string;
  dishes?: FoodDish[];
  itemsDescription?: string; // For non-food stalls
  priceRange?: string; // For non-food stalls (e.g. ₹50 - ₹500)
  emoji: string;
  status: "Approved" | "Pending";
  tablesCount?: number; // 1 or 2
  totalAmount?: number; // 1000 or 2000
  paymentRef?: string; // UPI UTR or Reference Number
  paymentStatus?: "Pending Verification" | "Payment Verified" | "Paid Online (Cashfree)";
  createdAt?: string;
}

const MAX_STALLS = 15;
const PRICE_PER_TABLE = 1000;
const SOCIETY_UPI_ID = OFFICIAL_BANK_UPI.pa;
const INITIAL_STALLS: FoodStall[] = [];

export default function AnandamelaPage() {
  const [stalls, setStalls] = useState<FoodStall[]>(INITIAL_STALLS);
  const [towersList, setTowersList] = useState<TowerDefinition[]>([]);
  const [stallTypeFilter, setStallTypeFilter] = useState<"all" | "Food" | "Non-Food">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"cashfree" | "manual_upi">("cashfree");
  const [isSubmittingPg, setIsSubmittingPg] = useState(false);
  const [isPgEnabled, setIsPgEnabled] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Form State for Stall Registration
  const [regForm, setRegForm] = useState({
    stallType: "Food" as StallType,
    stallName: "",
    chefName: "",
    tower: PBEL_TOWER_NAMES[0] || "Tower A (Emerald)",
    flatNumber: "",
    phone: "",
    category: "Rolls & Mughlai" as string,
    description: "",
    tablesCount: 1 as 1 | 2,
    paymentRef: "",
    // Food-specific fields
    dish1Name: "",
    dish1Price: "",
    dish1Veg: false,
    dish2Name: "",
    dish2Price: "",
    dish2Veg: true,
    // Non-food specific fields
    itemsDescription: "",
    priceRange: "",
  });

  // Seva Nudge Modal State
  const [nudgeModalOpen, setNudgeModalOpen] = useState(false);
  const [submittedStallInfo, setSubmittedStallInfo] = useState<{ stallName: string; chefName: string; stallType: StallType } | null>(null);

  useEffect(() => {
    try {
      const storedTowers = getStoredTowers();
      setTowersList(storedTowers);
      if (storedTowers.length > 0) {
        setRegForm((prev) => ({
          ...prev,
          tower: storedTowers[0].fullName || `${storedTowers[0].tower} (${storedTowers[0].name})`,
        }));
      }
      fetchStoredTowers().then((cloudTowers) => {
        if (cloudTowers && cloudTowers.length > 0) {
          setTowersList(cloudTowers);
        }
      });

      const stored = localStorage.getItem("pbel_anandamela_stalls");
      if (stored) {
        setStalls(JSON.parse(stored));
      }

      // Check for returning successful Cashfree stall payment
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("status") === "success") {
          const pendingRaw = localStorage.getItem("pbel_pending_anandamela_stall");
          if (pendingRaw) {
            try {
              const pendingStall = JSON.parse(pendingRaw);
              const bankRef = urlParams.get("ref") || urlParams.get("order_id") || "Cashfree PG Verified";
              pendingStall.paymentRef = bankRef;
              pendingStall.paymentStatus = "Paid Online (Cashfree)";
              pendingStall.status = "Pending";

              fetch("/api/anandamela/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pendingStall),
              }).then(async (res) => {
                const data = await res.json();
                if (data.success && Array.isArray(data.stalls)) {
                  setStalls(data.stalls);
                  localStorage.setItem("pbel_anandamela_stalls", JSON.stringify(data.stalls));
                }
              }).catch((e) => console.error("Error registering return stall:", e));
              setSubmittedStallInfo({
                stallName: pendingStall.stallName,
                chefName: pendingStall.chefName,
                stallType: pendingStall.stallType || "Food",
              });
              setNudgeModalOpen(true);
              localStorage.removeItem("pbel_pending_anandamela_stall");
              window.history.replaceState({}, document.title, window.location.pathname);
            } catch (err) {
              console.error("[Anandamela Payment Return Error]", err);
            }
          }
        }
      }

      // Fetch fresh cloud stalls
      fetchCloudConfig<FoodStall[]>("anandamela_stalls", INITIAL_STALLS).then((cloudStalls) => {
        if (cloudStalls && cloudStalls.length > 0) {
          setStalls(cloudStalls);
          localStorage.setItem("pbel_anandamela_stalls", JSON.stringify(cloudStalls));
        }
      });
    } catch (e) {
      console.error(e);
    }

    const handleTowerUpdate = () => {
      const storedTowers = getStoredTowers();
      setTowersList(storedTowers);
    };

    window.addEventListener("pbel_towers_updated", handleTowerUpdate);
    return () => {
      window.removeEventListener("pbel_towers_updated", handleTowerUpdate);
    };
  }, []);

  const approvedStalls = stalls.filter((s) => s.status === "Approved");
  const isCapacityFull = approvedStalls.length >= MAX_STALLS;
  const remainingSlots = Math.max(0, MAX_STALLS - approvedStalls.length);

  // Progressive disclosure check: Has the resident completed all stall details based on Stall Type?
  const isFood = regForm.stallType === "Food";
  const isDetailsFilled = Boolean(
    regForm.stallName.trim() &&
    regForm.chefName.trim() &&
    regForm.flatNumber.trim() &&
    validatePhoneNumber(regForm.phone) &&
    (regForm.tablesCount === 1 || regForm.tablesCount === 2) &&
    (isFood
      ? regForm.dish1Name.trim() && Number(regForm.dish1Price) > 0
      : regForm.itemsDescription.trim().length > 0)
  );

  const totalFeeToPay = regForm.tablesCount * PRICE_PER_TABLE;

  const handleCashfreeStallPayment = async () => {
    if (!isDetailsFilled) return;
    try {
      setIsSubmittingPg(true);
      const cleanStallName = sanitizeText(regForm.stallName);
      const cleanChefName = sanitizeText(regForm.chefName);
      const cleanPhone = sanitizeText(regForm.phone).replace(/\D/g, "");
      const cleanFlat = `${regForm.tower} - ${sanitizeText(regForm.flatNumber)}`;

      const dishes: FoodDish[] = [];
      if (regForm.dish1Name.trim()) {
        dishes.push({
          name: sanitizeText(regForm.dish1Name),
          price: Number(regForm.dish1Price) || 100,
          isVeg: regForm.dish1Veg,
          specialty: true,
        });
      }
      if (regForm.dish2Name.trim()) {
        dishes.push({
          name: sanitizeText(regForm.dish2Name),
          price: Number(regForm.dish2Price) || 100,
          isVeg: regForm.dish2Veg,
          specialty: false,
        });
      }

      let emoji = "🍲";
      if (isFood) {
        if (regForm.category === "Sweets & Pithe") emoji = "🍯";
        else if (regForm.category === "Rolls & Mughlai") emoji = "🌯";
        else if (regForm.category === "Bengali Delicacies") emoji = "🐟";
        else if (regForm.category === "Snacks & Quick Bites") emoji = "🥟";
        else emoji = "🍲";
      } else {
        if (regForm.category === "Handicrafts & Art") emoji = "🎨";
        else if (regForm.category === "Jewellery & Accessories") emoji = "💍";
        else if (regForm.category === "Apparel & Festive Wear") emoji = "👗";
        else if (regForm.category === "Games & Fun Activities") emoji = "🎯";
        else if (regForm.category === "Mehndi & Face Art") emoji = "🪔";
        else if (regForm.category === "Home Decor & Festive") emoji = "🏮";
        else emoji = "🛍️";
      }

      const pendingStall: FoodStall = {
        id: `stall-${Date.now()}`,
        stallNumber: `Stall #${String(stalls.length + 1).padStart(2, "0")}`,
        stallName: cleanStallName,
        chefName: cleanChefName,
        stallType: regForm.stallType,
        tower: regForm.tower,
        flatNumber: sanitizeText(regForm.flatNumber),
        phone: sanitizeText(regForm.phone),
        category: regForm.category,
        description: sanitizeText(regForm.description) || (isFood ? "Home-cooked festive specialty prepared with love by PBEL City residents." : "Festive items and community creations curated with passion by PBEL City residents."),
        emoji,
        dishes: isFood ? (dishes.length > 0 ? dishes : [{ name: "Festive Specialty", price: 150, isVeg: false }]) : undefined,
        itemsDescription: !isFood ? sanitizeText(regForm.itemsDescription) : undefined,
        priceRange: !isFood && regForm.priceRange.trim() ? sanitizeText(regForm.priceRange.trim()) : undefined,
        status: "Pending",
        tablesCount: regForm.tablesCount,
        totalAmount: totalFeeToPay,
        paymentRef: "Online PG (Pending)",
        paymentStatus: "Paid Online (Cashfree)",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("pbel_pending_anandamela_stall", JSON.stringify(pendingStall));

      const res = await fetch('/api/payment/cashfree/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalFeeToPay,
          customerName: cleanChefName,
          phone: cleanPhone,
          flatNumber: cleanFlat,
          purpose: `Anandamela Stall Fee (${regForm.tablesCount} Table) - ${cleanStallName}`,
          orderType: 'anandamela',
          metadata: {
            stall_name: cleanStallName,
            tables_count: String(regForm.tablesCount),
          },
        }),
      });

      const data = await res.json();
      if (!data.success || !data.paymentSessionId) {
        alert("Unable to initialize Cashfree payment: " + (data.error || "Please try manual UPI transfer."));
        setIsSubmittingPg(false);
        return;
      }

      const CashfreeSDK = await loadCashfreeSDK();
      if (CashfreeSDK) {
        const cashfree = CashfreeSDK({ mode: data.environment || 'production' });
        cashfree.checkout({
          paymentSessionId: data.paymentSessionId,
          redirectTarget: "_modal",
        }).then((result: any) => {
          if (result?.error) {
            console.log("[Anandamela Cashfree Modal Closed/Error]:", result.error);
            setIsSubmittingPg(false);
            fetch('/api/payment/cashfree/cancel', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: data.orderId,
                reason: result.error.message || 'Modal dismissed by user',
                orderType: 'anandamela',
              }),
            }).catch(() => {});

            if (result.error.message && !result.error.message.toLowerCase().includes("closed")) {
              alert(result.error.message);
            }
          } else if (result?.redirect) {
            console.log("[Anandamela Cashfree Modal Redirecting]");
          } else {
            // Modal completed: route to return verification endpoint
            window.location.href = `/api/payment/cashfree/return?order_id=${encodeURIComponent(data.orderId)}&type=anandamela`;
          }
        }).catch((err: any) => {
          console.error("[Anandamela Modal Error]:", err);
          setIsSubmittingPg(false);
        });
      } else {
        window.location.href = `/api/payment/cashfree/return?order_id=${encodeURIComponent(data.orderId)}&type=anandamela`;
      }
    } catch (err: any) {
      console.error("[Anandamela Cashfree Error]", err);
      alert("Error opening payment gateway: " + (err.message || "Please use manual UPI QR scan."));
      setIsSubmittingPg(false);
    }
  };

  const handleRegisterStall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDetailsFilled) {
      if (isFood) {
        alert("Please fill in Stall Name, Chef Name, Flat Number, WhatsApp Phone, and Primary Signature Dish.");
      } else {
        alert("Please fill in Stall Name, Host Name, Flat Number, WhatsApp Phone, and Featured Items / Services Description.");
      }
      return;
    }

    if (!regForm.paymentRef.trim()) {
      alert("Please provide the UPI Transaction Reference / UTR Number from your payment receipt.");
      return;
    }

    const dishes: FoodDish[] = [];
    if (isFood) {
      if (regForm.dish1Name.trim()) {
        dishes.push({
          name: sanitizeText(regForm.dish1Name),
          price: Number(regForm.dish1Price) || 150,
          isVeg: regForm.dish1Veg,
          specialty: true,
        });
      }
      if (regForm.dish2Name.trim()) {
        dishes.push({
          name: sanitizeText(regForm.dish2Name),
          price: Number(regForm.dish2Price) || 120,
          isVeg: regForm.dish2Veg,
        });
      }
    }

    // Determine representative emoji
    let emoji = "🍲";
    if (isFood) {
      if (regForm.category === "Sweets & Pithe") emoji = "🍯";
      else if (regForm.category === "Rolls & Mughlai") emoji = "🌯";
      else if (regForm.category === "Bengali Delicacies") emoji = "🐟";
      else if (regForm.category === "Snacks & Quick Bites") emoji = "🥟";
      else emoji = "🍲";
    } else {
      if (regForm.category === "Handicrafts & Art") emoji = "🎨";
      else if (regForm.category === "Jewellery & Accessories") emoji = "💍";
      else if (regForm.category === "Apparel & Festive Wear") emoji = "👗";
      else if (regForm.category === "Games & Fun Activities") emoji = "🎯";
      else if (regForm.category === "Mehndi & Face Art") emoji = "🪔";
      else if (regForm.category === "Home Decor & Festive") emoji = "🏮";
      else emoji = "🛍️";
    }

    const newStall: FoodStall = {
      id: `stall-${Date.now()}`,
      stallNumber: `Stall #${String(stalls.length + 1).padStart(2, "0")}`,
      stallName: sanitizeText(regForm.stallName),
      chefName: sanitizeText(regForm.chefName),
      stallType: regForm.stallType,
      tower: regForm.tower,
      flatNumber: sanitizeText(regForm.flatNumber),
      phone: sanitizeText(regForm.phone),
      category: regForm.category,
      description: sanitizeText(regForm.description) || (isFood ? "Home-cooked festive specialty prepared with love by PBEL City residents." : "Festive items and community creations curated with passion by PBEL City residents."),
      emoji,
      dishes: isFood ? (dishes.length > 0 ? dishes : [{ name: "Festive Specialty", price: 150, isVeg: false }]) : undefined,
      itemsDescription: !isFood ? sanitizeText(regForm.itemsDescription) : undefined,
      priceRange: !isFood && regForm.priceRange.trim() ? sanitizeText(regForm.priceRange.trim()) : undefined,
      status: "Pending",
      tablesCount: regForm.tablesCount,
      totalAmount: totalFeeToPay,
      paymentRef: sanitizeText(regForm.paymentRef.trim()),
      paymentStatus: "Pending Verification",
      createdAt: new Date().toISOString(),
    };

    try {
      const regRes = await fetch("/api/anandamela/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStall),
      });
      const regData = await regRes.json();
      if (regData.success && Array.isArray(regData.stalls)) {
        setStalls(regData.stalls);
        localStorage.setItem("pbel_anandamela_stalls", JSON.stringify(regData.stalls));
      } else {
        const updated = [newStall, ...stalls];
        setStalls(updated);
        localStorage.setItem("pbel_anandamela_stalls", JSON.stringify(updated));
        saveCloudConfig("anandamela_stalls", updated);
      }
    } catch (_) {
      const updated = [newStall, ...stalls];
      setStalls(updated);
      localStorage.setItem("pbel_anandamela_stalls", JSON.stringify(updated));
      saveCloudConfig("anandamela_stalls", updated);
    }

    // Close registration drawer
    setIsRegisterOpen(false);

    // Save info for nudge modal
    setSubmittedStallInfo({
      stallName: newStall.stallName,
      chefName: newStall.chefName,
      stallType: newStall.stallType || "Food",
    });

    // Open Seva Donation Nudge Modal
    setNudgeModalOpen(true);

    // Reset Form
    setRegForm({
      stallType: "Food",
      stallName: "",
      chefName: "",
      tower: PBEL_TOWER_NAMES[0] || "Tower A (Emerald)",
      flatNumber: "",
      phone: "",
      category: "Rolls & Mughlai",
      description: "",
      tablesCount: 1,
      paymentRef: "",
      dish1Name: "",
      dish1Price: "",
      dish1Veg: false,
      dish2Name: "",
      dish2Price: "",
      dish2Veg: true,
      itemsDescription: "",
      priceRange: "",
    });
  };

  // Compute active category options for filter chips based on selected stall type
  const activeCategoryList: string[] = [
    "All",
    ...(stallTypeFilter === "Food"
      ? FOOD_CATEGORIES
      : stallTypeFilter === "Non-Food"
      ? NON_FOOD_CATEGORIES
      : [...FOOD_CATEGORIES, ...NON_FOOD_CATEGORIES]),
  ];

  const filteredStalls = stalls.filter((stall) => {
    if (stall.status !== "Approved") return false;

    // Stall Type Filter
    const isThisFood = !stall.stallType || stall.stallType === "Food";
    if (stallTypeFilter === "Food" && !isThisFood) return false;
    if (stallTypeFilter === "Non-Food" && isThisFood) return false;

    // Category Filter
    const matchCategory = selectedCategory === "All" || stall.category === selectedCategory;

    // Search Query
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      stall.stallName.toLowerCase().includes(q) ||
      stall.chefName.toLowerCase().includes(q) ||
      stall.tower.toLowerCase().includes(q) ||
      (stall.category && stall.category.toLowerCase().includes(q)) ||
      (stall.dishes && stall.dishes.some((d) => d.name.toLowerCase().includes(q))) ||
      (stall.itemsDescription && stall.itemsDescription.toLowerCase().includes(q));

    // Dietary Filter (applies to food dishes; if veg/non-veg selected, only matching food stalls appear)
    let matchDiet = true;
    if (dietaryFilter === "veg") {
      matchDiet = Boolean(isThisFood && stall.dishes && stall.dishes.some((d) => d.isVeg));
    } else if (dietaryFilter === "non-veg") {
      matchDiet = Boolean(isThisFood && stall.dishes && stall.dishes.some((d) => !d.isVeg));
    }

    return matchCategory && matchQuery && matchDiet;
  });

  return (
    <div className="min-h-screen bg-[#FCFAF6] text-[#2C1810] pb-24">
      
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#800C1F] via-[#9E122C] to-[#5C0512] text-white py-16 px-4 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-300/20 border border-amber-300/40 text-amber-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles size={14} className="text-amber-300" />
            <span>Maha Panchami Evening Food &amp; Artisan Fiesta • 15th October • 05:00 PM Onwards</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-md">
            Anandamela Food &amp; Artisan Fiesta 🍲🛍️
          </h1>

          <p className="max-w-2xl mx-auto text-amber-100/90 text-sm sm:text-base leading-relaxed mb-8">
            Experience the vibrant flavours and creative crafts prepared with love by our very own <strong>PBEL City Residents</strong>! From authentic Bengali cuisine, rolls &amp; sweets to handmade jewellery, handicrafts, apparel, and games.
          </p>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8 text-left">
            <div className="bg-black/30 backdrop-blur-xs border border-white/10 rounded-2xl p-4">
              <span className="text-[11px] text-amber-200 uppercase font-bold block">Event Timing</span>
              <span className="text-lg font-bold font-heading text-white">05:00 PM Onwards</span>
            </div>
            <div className="bg-black/30 backdrop-blur-xs border border-white/10 rounded-2xl p-4">
              <span className="text-[11px] text-amber-200 uppercase font-bold block">Venue</span>
              <span className="text-lg font-bold font-heading text-white">Community Arena</span>
            </div>
            <div className="bg-black/30 backdrop-blur-xs border border-white/10 rounded-2xl p-4">
              <span className="text-[11px] text-amber-200 uppercase font-bold block">Stall Capacity</span>
              <span className="text-lg font-bold font-heading text-amber-300">
                {approvedStalls.length} / {MAX_STALLS} Stalls
              </span>
            </div>
            <div className="bg-black/30 backdrop-blur-xs border border-white/10 rounded-2xl p-4">
              <span className="text-[11px] text-amber-200 uppercase font-bold block">Table Setup</span>
              <span className="text-lg font-bold font-heading text-green-300">₹1,000 / Table</span>
            </div>
          </div>

          {/* CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {isCapacityFull ? (
              <div className="bg-red-500/20 border border-red-300/40 text-red-200 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle size={18} className="text-red-300" />
                <span>All {MAX_STALLS} Stalls Full • Registrations Closed</span>
              </div>
            ) : (
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 golden-glow"
              >
                <ChefHat size={18} />
                <span>Register Your Stall ({remainingSlots} Slots Left) →</span>
              </button>
            )}
            <a
              href="#stalls-directory"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/25 px-5 py-3 rounded-2xl font-semibold text-xs sm:text-sm transition flex items-center gap-2"
            >
              <ShoppingBag size={16} />
              <span>Explore Stalls &amp; Offerings ({approvedStalls.length} Stalls)</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <section id="stalls-directory" className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-3xl border border-amber-900/10 p-5 sm:p-6 shadow-xs mb-8 space-y-4">
          
          {/* Top Filter Chips: Stall Type (All vs Food vs Non-Food) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-1">
                Stall Type:
              </span>
              <button
                type="button"
                onClick={() => {
                  setStallTypeFilter("all");
                  setSelectedCategory("All");
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  stallTypeFilter === "all"
                    ? "bg-gray-900 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>All Stalls</span>
                <span className="text-[10px] opacity-75">({approvedStalls.length})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setStallTypeFilter("Food");
                  setSelectedCategory("All");
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  stallTypeFilter === "Food"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                <Utensils size={13} />
                <span>Food Stalls</span>
                <span className="text-[10px] opacity-75">
                  ({approvedStalls.filter((s) => !s.stallType || s.stallType === "Food").length})
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setStallTypeFilter("Non-Food");
                  setSelectedCategory("All");
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  stallTypeFilter === "Non-Food"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200"
                }`}
              >
                <ShoppingBag size={13} />
                <span>Non-Food &amp; Artisan Stalls</span>
                <span className="text-[10px] opacity-75">
                  ({approvedStalls.filter((s) => s.stallType === "Non-Food").length})
                </span>
              </button>
            </div>

            {/* Quick action to register */}
            {!isCapacityFull && (
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="text-primary hover:text-primary-hover font-bold text-xs flex items-center gap-1 transition"
              >
                <span>+ Register New Stall</span>
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stalls, dishes, handicrafts, jewellery, games, or resident hosts..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
              />
            </div>

            {/* Dietary Filter (primarily for food stalls) */}
            {stallTypeFilter !== "Non-Food" && (
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl shrink-0">
                <button
                  onClick={() => setDietaryFilter("all")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    dietaryFilter === "all" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All Menu
                </button>
                <button
                  onClick={() => setDietaryFilter("veg")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    dietaryFilter === "veg" ? "bg-green-100 text-green-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-green-600 inline-block" /> Pure Veg
                </button>
                <button
                  onClick={() => setDietaryFilter("non-veg")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    dietaryFilter === "non-veg" ? "bg-red-100 text-red-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-600 inline-block" /> Non-Veg
                </button>
              </div>
            )}
          </div>

          {/* Category Filter Chips / Pills (Dynamically adapts to Stall Type) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-2 border-t border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase shrink-0 mr-1">Category:</span>
            {activeCategoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-xs"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* 3. STALLS DIRECTORY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStalls.map((stall) => {
            const isNonFood = stall.stallType === "Non-Food";

            return (
              <div
                key={stall.id}
                className="bg-white rounded-3xl border border-amber-900/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-amber-300"
              >
                <div>
                  {/* Stall Header */}
                  <div className="p-5 bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-white border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full uppercase">
                          {stall.stallNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isNonFood
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : "bg-amber-100 text-amber-900 border border-amber-200"
                          }`}
                        >
                          {isNonFood ? "🛍️ Non-Food" : "🍲 Food"}
                        </span>
                      </div>
                      <span className="text-xs bg-white text-gray-600 border border-gray-200 px-2.5 py-0.5 rounded-full font-medium">
                        {stall.category}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 mt-3">
                      <span className="text-3xl p-2 bg-white rounded-2xl shadow-xs border border-amber-200 shrink-0">
                        {stall.emoji}
                      </span>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-gray-900 group-hover:text-primary transition leading-snug">
                          {stall.stallName}
                        </h3>
                        <p className="text-xs text-amber-900/80 font-medium mt-0.5">
                          {isNonFood ? "Host" : "Chef"}: {stall.chefName}
                        </p>
                        <span className="text-[11px] text-gray-500">
                          {stall.tower} • Flat {stall.flatNumber}
                          {stall.tablesCount ? ` • ${stall.tablesCount} ${stall.tablesCount === 1 ? 'Table' : 'Tables'}` : ""}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                      {stall.description}
                    </p>
                  </div>

                  {/* Offerings Section: Dishes for Food OR Products / Services for Non-Food */}
                  {isNonFood ? (
                    <div className="p-5 space-y-2.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Featured Products / Offerings:
                      </span>
                      <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200/60 text-xs text-gray-700 leading-relaxed font-medium">
                        {stall.itemsDescription || stall.description}
                      </div>
                      {stall.priceRange && (
                        <div className="flex items-center justify-between text-xs pt-1 px-1">
                          <span className="text-gray-500 font-medium">Estimated Pricing:</span>
                          <span className="font-bold text-primary font-mono bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                            {stall.priceRange}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-5 space-y-2.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Signature Menu &amp; Pricing:
                      </span>
                      <div className="divide-y divide-gray-100 text-xs">
                        {stall.dishes && stall.dishes.length > 0 ? (
                          stall.dishes.map((dish, idx) => (
                            <div key={idx} className="py-2 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 truncate">
                                <span
                                  className={`w-2.5 h-2.5 rounded-xs shrink-0 border flex items-center justify-center ${
                                    dish.isVeg ? "border-green-600" : "border-red-600"
                                  }`}
                                >
                                  <span
                                    className={`w-1 h-1 rounded-full ${dish.isVeg ? "bg-green-600" : "bg-red-600"}`}
                                  />
                                </span>
                                <span className="font-semibold text-gray-800 truncate">
                                  {dish.name}
                                </span>
                                {dish.specialty && (
                                  <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded shrink-0">
                                    ⭐ Must Try
                                  </span>
                                )}
                              </div>
                              <span className="font-bold text-primary font-mono shrink-0">
                                ₹{dish.price}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="py-2 text-gray-500 italic">Menu details to be announced</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stall Footer Actions */}
                <div className="p-5 pt-0">
                  <a
                    href={`https://api.whatsapp.com/send?phone=91${stall.phone.replace(/[^0-9]/g, "")}&text=Hello%20${encodeURIComponent(stall.chefName)}%2C%20I%20saw%20your%20Anandamela%20stall%20"${encodeURIComponent(stall.stallName)}"%20on%20the%20PBEL%20Durgotsav%20Portal!%20I%20would%20like%20to%20know%20more%20and%20pre-order.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-2.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>{isNonFood ? "💬 WhatsApp Host / Inquire" : "💬 WhatsApp Chef / Pre-Order"}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filteredStalls.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs text-gray-500 max-w-md mx-auto space-y-3">
            <ShoppingBag size={32} className="mx-auto text-gray-400" />
            <h3 className="font-heading text-lg font-bold text-gray-900">No Stalls Found</h3>
            <p>Try searching for a different item or clear the selected stall type and category filters.</p>
          </div>
        )}

      </section>

      {/* 4. REGISTER YOUR STALL MODAL / DRAWER */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-amber-400/40 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              aria-label="Close form"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">✨</span>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Register Your Anandamela Stall
              </h2>
            </div>
            <p className="text-xs text-gray-600 mb-5 leading-relaxed">
              Showcase your homemade delicacies, handicrafts, jewellery, fashion, games, or services on <strong>Maha Panchami Evening (5:00 PM Onwards)</strong>.
              <br />
              <strong>Notice:</strong> Strictly 15 stalls capacity. Table setup charge is <strong>₹1,000 per table</strong> (1 or 2 tables).
            </p>

            <form onSubmit={handleRegisterStall} className="space-y-4 text-xs">
              
              {/* STEP 1: STALL TYPE SELECTOR */}
              <div className="space-y-2">
                <label className="block font-bold text-gray-800 text-xs">
                  Choose Stall Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRegForm((prev) => ({
                        ...prev,
                        stallType: "Food",
                        category: (FOOD_CATEGORIES as readonly string[]).includes(prev.category) ? prev.category : FOOD_CATEGORIES[0],
                      }));
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                      regForm.stallType === "Food"
                        ? "bg-amber-50 border-amber-500 shadow-xs ring-2 ring-amber-500/20"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-2xl">🍲</span>
                    <div>
                      <span className="font-bold text-xs text-gray-900 block">Food Stall</span>
                      <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">
                        Home-cooked delicacies, rolls, chaat, fish fry, sweets &amp; snacks
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegForm((prev) => ({
                        ...prev,
                        stallType: "Non-Food",
                        category: (NON_FOOD_CATEGORIES as readonly string[]).includes(prev.category) ? prev.category : NON_FOOD_CATEGORIES[0],
                      }));
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                      regForm.stallType === "Non-Food"
                        ? "bg-purple-50 border-purple-500 shadow-xs ring-2 ring-purple-500/20"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-2xl">🛍️</span>
                    <div>
                      <span className="font-bold text-xs text-gray-900 block">Non-Food Stall</span>
                      <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">
                        Handicrafts, jewellery, festive apparel, games, mehndi, decor &amp; goods
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* SECTION A: STALL & HOST DETAILS */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-100 pb-1">
                  1. Stall &amp; Host Information
                </span>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {isFood ? "Stall / Food Brand Name *" : "Stall / Brand / Shop Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.stallName}
                    onChange={(e) => setRegForm({ ...regForm, stallName: e.target.value })}
                    placeholder={isFood ? "e.g. Grandma's Rasogolla & Mughlai Hub" : "e.g. Srijan Terracotta & Festive Crafts"}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      {isFood ? "Home Chef Name *" : "Stall Lead / Host Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={regForm.chefName}
                      onChange={(e) => setRegForm({ ...regForm, chefName: e.target.value })}
                      placeholder="e.g. Sharmila Sen"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">WhatsApp Mobile (10 Digits) *</label>
                    <input
                      type="tel"
                      required
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      value={regForm.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setRegForm({ ...regForm, phone: val });
                      }}
                      placeholder="e.g. 9845000000"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Select Tower *</label>
                    <select
                      value={regForm.tower}
                      onChange={(e) => setRegForm({ ...regForm, tower: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm font-semibold"
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
                    <label className="block font-semibold text-gray-700 mb-1">Flat / Unit (e.g. 402, 1104, or G01) *</label>
                    <input
                      type="text"
                      required
                      autoCapitalize="characters"
                      maxLength={8}
                      value={regForm.flatNumber}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 8);
                        setRegForm({ ...regForm, flatNumber: val });
                      }}
                      placeholder="e.g. 1104 or G01"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {isFood ? "Food Category *" : "Stall Category *"}
                  </label>
                  <select
                    value={regForm.category}
                    onChange={(e) => setRegForm({ ...regForm, category: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  >
                    {isFood ? (
                      <>
                        <option value="Rolls & Mughlai">Rolls &amp; Mughlai Delicacies</option>
                        <option value="Bengali Delicacies">Bengali Heritage Cuisine (Fish Fry, Biryani)</option>
                        <option value="Street Food & Chaat">Kolkata Street Food &amp; Phuchka</option>
                        <option value="Sweets & Pithe">Sweets, Pithe Puli &amp; Desserts</option>
                        <option value="Snacks & Quick Bites">Snacks &amp; Beverages</option>
                      </>
                    ) : (
                      <>
                        <option value="Handicrafts & Art">Handicrafts, Art &amp; Paintings</option>
                        <option value="Jewellery & Accessories">Jewellery, Ornaments &amp; Accessories</option>
                        <option value="Apparel & Festive Wear">Apparel, Sarees &amp; Festive Fashion</option>
                        <option value="Games & Fun Activities">Kids / Family Games &amp; Fun Activities</option>
                        <option value="Mehndi & Face Art">Mehndi, Tattoos &amp; Face Art</option>
                        <option value="Home Decor & Festive">Home Decor, Diyas &amp; Pujo Essentials</option>
                        <option value="Other Services & Goods">Other Products / Custom Services</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* SECTION B: NUMBER OF TABLES SELECTION */}
              <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-amber-950 text-xs">
                    Number of Tables Needed *
                  </label>
                  <span className="text-[11px] font-bold text-primary">
                    ₹{PRICE_PER_TABLE.toLocaleString("en-IN")} / Table
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRegForm({ ...regForm, tablesCount: 1 })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      regForm.tablesCount === 1
                        ? "bg-white border-primary shadow-sm ring-2 ring-primary/20"
                        : "bg-white/60 border-gray-200 hover:border-amber-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-gray-900">1 Table</span>
                      <span className="font-bold font-mono text-xs text-primary">₹1,000</span>
                    </div>
                    <span className="text-[10px] text-gray-500 block">Standard Single Table Space</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegForm({ ...regForm, tablesCount: 2 })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      regForm.tablesCount === 2
                        ? "bg-white border-primary shadow-sm ring-2 ring-primary/20"
                        : "bg-white/60 border-gray-200 hover:border-amber-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-gray-900">2 Tables</span>
                      <span className="font-bold font-mono text-xs text-primary">₹2,000</span>
                    </div>
                    <span className="text-[10px] text-gray-500 block">Double Table Space (Recommended for large setups)</span>
                  </button>
                </div>
              </div>

              {/* SECTION C: CONDITIONAL DISHES (FOOD) OR PRODUCTS/SERVICES (NON-FOOD) */}
              {isFood ? (
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-100 pb-1">
                    2. Signature Dishes &amp; Pricing
                  </span>

                  {/* Dish 1 */}
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                    <span className="font-bold text-gray-900 block text-[11px] uppercase">Primary Signature Dish: *</span>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        value={regForm.dish1Name}
                        onChange={(e) => setRegForm({ ...regForm, dish1Name: e.target.value })}
                        placeholder="Dish Name (e.g. Kolkata Fish Fry)"
                        className="col-span-2 p-2 bg-white border border-gray-200 rounded-xl outline-none text-xs"
                      />
                      <input
                        type="number"
                        required
                        min="10"
                        value={regForm.dish1Price}
                        onChange={(e) => setRegForm({ ...regForm, dish1Price: e.target.value })}
                        placeholder="₹ Price"
                        className="p-2 bg-white border border-gray-200 rounded-xl outline-none text-xs font-bold font-mono"
                      />
                    </div>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-gray-700">
                      <input
                        type="checkbox"
                        checked={regForm.dish1Veg}
                        onChange={(e) => setRegForm({ ...regForm, dish1Veg: e.target.checked })}
                        className="rounded accent-primary"
                      />
                      <span>Is this item Pure Vegetarian?</span>
                    </label>
                  </div>

                  {/* Dish 2 */}
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                    <span className="font-bold text-gray-900 block text-[11px] uppercase">Secondary Dish (Optional):</span>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={regForm.dish2Name}
                        onChange={(e) => setRegForm({ ...regForm, dish2Name: e.target.value })}
                        placeholder="Dish Name (e.g. Postor Bora)"
                        className="col-span-2 p-2 bg-white border border-gray-200 rounded-xl outline-none text-xs"
                      />
                      <input
                        type="number"
                        min="10"
                        value={regForm.dish2Price}
                        onChange={(e) => setRegForm({ ...regForm, dish2Price: e.target.value })}
                        placeholder="₹ Price"
                        className="p-2 bg-white border border-gray-200 rounded-xl outline-none text-xs font-bold font-mono"
                      />
                    </div>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-gray-700">
                      <input
                        type="checkbox"
                        checked={regForm.dish2Veg}
                        onChange={(e) => setRegForm({ ...regForm, dish2Veg: e.target.checked })}
                        className="rounded accent-primary"
                      />
                      <span>Is this item Pure Vegetarian?</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-100 pb-1">
                    2. Featured Products, Activities &amp; Offerings
                  </span>

                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2.5">
                    <div>
                      <label className="block font-bold text-gray-900 text-[11px] uppercase mb-1">
                        Featured Items / Services / Activity Description *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={regForm.itemsDescription}
                        onChange={(e) => setRegForm({ ...regForm, itemsDescription: e.target.value })}
                        placeholder="Describe what you will sell, showcase or host (e.g. Handcrafted terracotta jewellery, hand-painted sarees, festive greeting cards, ring toss game with prizes, organic herbal mehndi)..."
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl outline-none text-xs leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-900 text-[11px] uppercase mb-1">
                        Estimated Price Range / Starting Price (Optional)
                      </label>
                      <input
                        type="text"
                        value={regForm.priceRange}
                        onChange={(e) => setRegForm({ ...regForm, priceRange: e.target.value })}
                        placeholder="e.g. Starting from ₹50 (₹50 - ₹500)"
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl outline-none text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION D: PAYMENT SECTION (ONLINE GATEWAY OR DIRECT UPI) */}
              <div className="pt-2">
                {!isDetailsFilled ? (
                  <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-2xl text-center space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 text-gray-600 text-xs font-semibold">
                      <Info size={15} className="text-amber-600" />
                      <span>Step 3: Payment &amp; QR Code (Locked)</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      {isFood
                        ? "Please fill in your Stall Name, Chef Name, WhatsApp Phone, Flat, and Signature Dish above to unlock stall payment."
                        : "Please fill in your Stall Name, Host Name, WhatsApp Phone, Flat, and Featured Offerings details above to unlock stall payment."}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-gradient-to-br from-amber-50 via-orange-50/60 to-amber-100/40 rounded-2xl border border-amber-300 shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 uppercase">
                        <CreditCard size={16} className="text-primary" />
                        <span>Step 3: Stall Setup Fee Payment</span>
                      </div>
                      <span className="text-sm font-bold font-mono text-primary">
                        ₹{totalFeeToPay.toLocaleString("en-IN")} ({regForm.tablesCount} {regForm.tablesCount === 1 ? "Table" : "Tables"})
                      </span>
                    </div>

                    {/* Payment Mode Selector Tabs (Manual QR only shown when PG is disabled) */}
                    {!isPgEnabled && (
                      <div className="grid grid-cols-2 gap-2 bg-amber-100/60 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setPaymentMode("cashfree")}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            paymentMode === "cashfree"
                              ? "bg-white text-primary shadow-xs"
                              : "text-gray-700 hover:text-gray-900"
                          }`}
                        >
                          <CreditCard size={14} />
                          <span>Pay Online (Instant)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMode("manual_upi")}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            paymentMode === "manual_upi"
                              ? "bg-white text-primary shadow-xs"
                              : "text-gray-700 hover:text-gray-900"
                          }`}
                        >
                          <QrCode size={14} />
                          <span>Scan UPI QR &amp; UTR</span>
                        </button>
                      </div>
                    )}

                    {paymentMode === "cashfree" ? (
                      /* Online Cashfree Checkout Option */
                      <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-primary shrink-0">
                            <CreditCard size={20} />
                          </div>
                          <div>
                            <span className="font-bold text-xs text-gray-900 block">
                              Instant Automated Checkout via Cashfree
                            </span>
                            <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                              Pay via GPay, PhonePe, Paytm, BHIM UPI, RuPay / Visa / Mastercard cards, or NetBanking. Instant automated confirmation.
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleCashfreeStallPayment}
                          disabled={isSubmittingPg || !isDetailsFilled}
                          className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white py-3.5 rounded-xl font-bold transition shadow-sm flex items-center justify-center gap-2 golden-glow disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                        >
                          <CreditCard size={16} className={isSubmittingPg ? "animate-pulse" : ""} />
                          <span>
                            {isSubmittingPg
                              ? "Connecting to Cashfree Gateway..."
                              : `Pay ₹${totalFeeToPay.toLocaleString("en-IN")} Table Fee Online`}
                          </span>
                        </button>
                        <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                          <ShieldCheck size={12} className="text-green-600" /> Secure 128-bit Encrypted Checkout • Zero Manual UTR Typing Required
                        </p>
                      </div>
                    ) : (
                      /* Manual UPI QR Option */
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-amber-200">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                              buildUpiPayUri({
                                am: totalFeeToPay,
                                tn: `Anandamela Stall - ${regForm.stallName.slice(0, 20)}`,
                              })
                            )}`}
                            alt="Anandamela Stall Fee UPI QR"
                            className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg border border-gray-200 shadow-2xs"
                          />
                          <div className="space-y-2 flex-1 text-center sm:text-left">
                            <span className="text-xs font-bold text-gray-800 block">
                              Scan &amp; Pay ₹{totalFeeToPay.toLocaleString("en-IN")} via Any UPI App
                            </span>
                            <p className="text-[11px] text-gray-500">
                              Official Society VPA: <strong className="font-mono text-primary">{SOCIETY_UPI_ID}</strong>
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(SOCIETY_UPI_ID);
                                setCopiedUpi(true);
                                setTimeout(() => setCopiedUpi(false), 2000);
                              }}
                              className="text-[11px] font-bold text-primary bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1.5"
                            >
                              {copiedUpi ? <Check size={13} /> : <Copy size={13} />}
                              <span>{copiedUpi ? "UPI ID Copied!" : "1-Tap Copy UPI ID"}</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-gray-800 text-xs mb-1">
                            UPI UTR / Transaction Reference Number *
                          </label>
                          <input
                            type="text"
                            required={paymentMode === "manual_upi"}
                            value={regForm.paymentRef}
                            onChange={(e) => setRegForm({ ...regForm, paymentRef: e.target.value.trim() })}
                            placeholder="e.g. 12-digit UPI UTR from GPay / PhonePe / Paytm"
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono text-xs"
                          />
                          <span className="text-[10px] text-gray-500 block mt-1">
                            Required for PSS Finance Committee to verify your table fee before confirming the stall.
                          </span>
                        </div>

                        <button
                          type="submit"
                          disabled={!isDetailsFilled || !regForm.paymentRef.trim()}
                          className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold transition shadow-sm flex items-center justify-center gap-2 golden-glow disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                        >
                          <Send size={15} />
                          <span>
                            {!isDetailsFilled
                              ? "Fill Details Above to Unlock Payment"
                              : !regForm.paymentRef.trim()
                              ? "Enter UPI Reference / UTR Number to Submit"
                              : `Submit Application with UTR (₹${totalFeeToPay.toLocaleString("en-IN")})`}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. POST-REGISTRATION SEVA DONATION NUDGE POPUP */}
      <SevaDonationNudgeModal
        isOpen={nudgeModalOpen}
        onClose={() => setNudgeModalOpen(false)}
        activityName={submittedStallInfo?.stallType === "Non-Food" ? "Anandamela Non-Food Stall Registration" : "Anandamela Food Stall Registration"}
        residentName={submittedStallInfo?.chefName}
        stallOrEventName={submittedStallInfo?.stallName}
        note="The Anandamela Committee and Finance Team will verify your table payment and confirm your stall allocation in the festival directory."
      />

    </div>
  );
}
