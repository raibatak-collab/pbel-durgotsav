"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Utensils,
  Sparkles,
  ShoppingBag,
  PlusCircle,
  Search,
  Filter,
  Phone,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  X,
  Send,
  ChefHat,
  Flame,
  Award
} from "lucide-react";
import { PBEL_TOWERS, PBEL_TOWER_NAMES, getStoredTowers, fetchStoredTowers, TowerDefinition } from "@/config/towers";
import { sanitizeText, validatePhoneNumber } from "@/utils/security";
import { fetchCloudConfig, saveCloudConfig } from "@/utils/cloudConfig";

export interface FoodDish {
  name: string;
  price: number;
  isVeg: boolean;
  specialty?: boolean;
}

export interface FoodStall {
  id: string;
  stallNumber: string;
  stallName: string;
  chefName: string;
  tower: string;
  flatNumber: string;
  phone: string;
  category: "Rolls & Mughlai" | "Bengali Delicacies" | "Street Food & Chaat" | "Sweets & Pithe" | "Snacks & Quick Bites";
  description: string;
  dishes: FoodDish[];
  emoji: string;
  status: "Approved" | "Pending";
}

const INITIAL_STALLS: FoodStall[] = [
  {
    id: "stall-1",
    stallNumber: "Stall #01",
    stallName: "Calcutta Roll Express",
    chefName: "Anirban & Sreeparna Mukherjee",
    tower: "Tower B (Sapphire)",
    flatNumber: "1104",
    phone: "9845000001",
    category: "Rolls & Mughlai",
    description: "Authentic Park Street style crisp Parota layered with farm eggs, spiced chicken tikka, sliced onions, green chillies & Kasundi.",
    emoji: "🌯",
    status: "Approved",
    dishes: [
      { name: "Double Egg Chicken Kathi Roll", price: 180, isVeg: false, specialty: true },
      { name: "Paneer Tikka Roll", price: 150, isVeg: true },
    ]
  },
  {
    id: "stall-2",
    stallNumber: "Stall #02",
    stallName: "Dhakai Biryani & Kebabs",
    chefName: "Debashis & Sharmila Sen",
    tower: "Tower A (Emerald)",
    flatNumber: "1401",
    phone: "9845000002",
    category: "Bengali Delicacies",
    description: "Traditional Kolkata fragrant Dum Biryani slow-cooked with aromatic spices, tender meat, boiled egg and melted golden potato.",
    emoji: "🍲",
    status: "Approved",
    dishes: [
      { name: "Kolkata Mutton Biryani (with Aloo & Egg)", price: 320, isVeg: false, specialty: true },
      { name: "Galouti Kebab with Roomali Roti", price: 240, isVeg: false },
    ]
  },
  {
    id: "stall-3",
    stallNumber: "Stall #03",
    stallName: "Mishti Mukh & Pithe Puli",
    chefName: "Rupa Sengupta & Debolina",
    tower: "Tower D (Topaz)",
    flatNumber: "603",
    phone: "9845000004",
    category: "Sweets & Pithe",
    description: "Home-made artisanal Bengali desserts, Nolen Gur delicacies, Kheer Patishapta, and warm baked Rosogolla straight from the oven.",
    emoji: "🍯",
    status: "Approved",
    dishes: [
      { name: "Kheer Patishapta (Plate of 2)", price: 90, isVeg: true, specialty: true },
      { name: "Baked Nolen Gur Rosogolla (2 Pcs)", price: 80, isVeg: true },
      { name: "Malpua with Rabdi Dip", price: 100, isVeg: true },
    ],
  },
  {
    id: "stall-4",
    stallNumber: "Stall #04",
    stallName: "Dacres Lane Street Delights",
    chefName: "Debashis & Sourav",
    tower: "Tower A (Emerald)",
    flatNumber: "802",
    phone: "9845000002",
    category: "Street Food & Chaat",
    description: "Hot Kolkata Phuchka with spiced Gondhoraj lime water, Churmur, and spicy Kolkata Mutton Ghugni with butter-toasted Pav.",
    emoji: "🥟",
    status: "Approved",
    dishes: [
      { name: "Gondhoraj Lebu Phuchka (6 Pcs)", price: 50, isVeg: true },
      { name: "Kolkata Mutton Ghugni with Butter Pav", price: 150, isVeg: false, specialty: true },
      { name: "Dahi Phuchka Papdi Chaat Royale", price: 80, isVeg: true },
    ],
  },
  {
    id: "stall-5",
    stallNumber: "Stall #05",
    stallName: "The Royal Biryani Pot",
    chefName: "Raibatak Banerjee & Family",
    tower: "Tower C (Coral)",
    flatNumber: "402",
    phone: "9845000000",
    category: "Bengali Delicacies",
    description: "Slow-cooked Kolkata style Basmati rice aromatic Biryani with melt-in-mouth aloo, tender chicken & boiled egg, paired with spicy raita.",
    emoji: "🍚",
    status: "Approved",
    dishes: [
      { name: "Kolkata Special Chicken Biryani (with Aloo & Egg)", price: 240, isVeg: false, specialty: true },
      { name: "Kolkata Mutton Kassa (2 Pcs tender)", price: 280, isVeg: false, specialty: true },
      { name: "Basanti Pulao with Chanar Dalna", price: 180, isVeg: true },
    ],
  },
];

export default function AnandamelaPage() {
  const [stalls, setStalls] = useState<FoodStall[]>(INITIAL_STALLS);
  const [towersList, setTowersList] = useState<TowerDefinition[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [selectedStallModal, setSelectedStallModal] = useState<FoodStall | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Form State for Stall Registration
  const [regForm, setRegForm] = useState({
    stallName: "",
    chefName: "",
    tower: PBEL_TOWER_NAMES[0] || "Tower A (Emerald)",
    flatNumber: "",
    phone: "",
    category: "Rolls & Mughlai" as FoodStall["category"],
    description: "",
    dish1Name: "",
    dish1Price: "",
    dish1Veg: false,
    dish2Name: "",
    dish2Price: "",
    dish2Veg: true,
  });
  const [regSuccess, setRegSuccess] = useState(false);

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

  const handleRegisterStall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.stallName.trim() || !regForm.chefName.trim() || !regForm.flatNumber.trim()) {
      alert("Please fill in Stall Name, Chef Name, and Flat Number.");
      return;
    }
    if (!validatePhoneNumber(regForm.phone)) {
      alert("Please provide a valid 10-digit WhatsApp phone number.");
      return;
    }

    const dishes: FoodDish[] = [];
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

    const newStall: FoodStall = {
      id: `stall-${Date.now()}`,
      stallNumber: `Stall #${String(stalls.length + 1).padStart(2, "0")}`,
      stallName: sanitizeText(regForm.stallName),
      chefName: sanitizeText(regForm.chefName),
      tower: regForm.tower,
      flatNumber: sanitizeText(regForm.flatNumber),
      phone: sanitizeText(regForm.phone),
      category: regForm.category,
      description: sanitizeText(regForm.description) || "Home-cooked festive specialty prepared with love by PBEL City residents.",
      emoji: regForm.category === "Sweets & Pithe" ? "🍯" : regForm.category === "Rolls & Mughlai" ? "🌯" : "🍲",
      dishes: dishes.length > 0 ? dishes : [{ name: "Festive Specialty", price: 150, isVeg: false }],
      status: "Approved",
    };

    const updated = [newStall, ...stalls];
    setStalls(updated);
    localStorage.setItem("pbel_anandamela_stalls", JSON.stringify(updated));
    saveCloudConfig("anandamela_stalls", updated);
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setIsRegisterOpen(false);
      setRegForm({
        stallName: "",
        chefName: "",
        tower: PBEL_TOWER_NAMES[0] || "Tower A (Emerald)",
        flatNumber: "",
        phone: "",
        category: "Rolls & Mughlai",
        description: "",
        dish1Name: "",
        dish1Price: "",
        dish1Veg: false,
        dish2Name: "",
        dish2Price: "",
        dish2Veg: true,
      });
    }, 2000);
  };

  const categories = ["All", "Rolls & Mughlai", "Bengali Delicacies", "Street Food & Chaat", "Sweets & Pithe", "Snacks & Quick Bites"];

  const filteredStalls = stalls.filter((stall) => {
    const matchCategory = selectedCategory === "All" || stall.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      stall.stallName.toLowerCase().includes(q) ||
      stall.chefName.toLowerCase().includes(q) ||
      stall.tower.toLowerCase().includes(q) ||
      stall.dishes.some((d) => d.name.toLowerCase().includes(q));

    let matchDiet = true;
    if (dietaryFilter === "veg") {
      matchDiet = stall.dishes.some((d) => d.isVeg);
    } else if (dietaryFilter === "non-veg") {
      matchDiet = stall.dishes.some((d) => !d.isVeg);
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
            <span>Maha Panchami Evening Food Fiesta • 15th October</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-md">
            Anandamela Food Fiesta 🍲
          </h1>

          <p className="max-w-2xl mx-auto text-amber-100/90 text-sm sm:text-base leading-relaxed mb-8">
            Experience the vibrant flavours of Bengal cooked with love by our very own <strong>PBEL City Resident Home Chefs</strong>! From Kolkata egg chicken rolls to Bhetki fish fry and hot Nolen Gur sweets.
          </p>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8 text-left">
            <div className="bg-black/30 backdrop-blur-xs border border-white/10 rounded-2xl p-4">
              <span className="text-[11px] text-amber-200 uppercase font-bold block">Event Timing</span>
              <span className="text-lg font-bold font-heading text-white">06:30 PM Onwards</span>
            </div>
            <div className="bg-black/30 backdrop-blur-xs border border-white/10 rounded-2xl p-4">
              <span className="text-[11px] text-amber-200 uppercase font-bold block">Venue</span>
              <span className="text-lg font-bold font-heading text-white">Community Arena</span>
            </div>
            <div className="bg-black/30 backdrop-blur-xs border border-white/10 rounded-2xl p-4">
              <span className="text-[11px] text-amber-200 uppercase font-bold block">Resident Stalls</span>
              <span className="text-lg font-bold font-heading text-amber-300">{stalls.length} Home Stalls</span>
            </div>
            <div className="bg-black/30 backdrop-blur-xs border border-white/10 rounded-2xl p-4">
              <span className="text-[11px] text-amber-200 uppercase font-bold block">Pre-Orders</span>
              <span className="text-lg font-bold font-heading text-green-300">Live WhatsApp</span>
            </div>
          </div>

          {/* CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 golden-glow"
            >
              <ChefHat size={18} />
              <span>Register Your Home Chef Stall →</span>
            </button>
            <a
              href="#stalls-directory"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/25 px-5 py-3 rounded-2xl font-semibold text-xs sm:text-sm transition flex items-center gap-2"
            >
              <Utensils size={16} />
              <span>Explore Food Menu ({stalls.reduce((acc, s) => acc + s.dishes.length, 0)} Dishes)</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <section id="stalls-directory" className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-3xl border border-amber-900/10 p-5 sm:p-6 shadow-xs mb-8 space-y-4">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dish (e.g. Fish Fry, Rolls, Patishapta, Biryani) or chef..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
              />
            </div>

            {/* Dietary Filter */}
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
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-2 border-t border-gray-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
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
          {filteredStalls.map((stall) => (
            <div
              key={stall.id}
              className="bg-white rounded-3xl border border-amber-900/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-amber-300"
            >
              <div>
                {/* Stall Header */}
                <div className="p-5 bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-white border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full uppercase">
                      {stall.stallNumber}
                    </span>
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
                        Chef: {stall.chefName}
                      </p>
                      <span className="text-[11px] text-gray-500">
                        {stall.tower} • Flat {stall.flatNumber}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                    {stall.description}
                  </p>
                </div>

                {/* Signature Dishes List */}
                <div className="p-5 space-y-2.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Signature Menu & Pricing:
                  </span>
                  <div className="divide-y divide-gray-100 text-xs">
                    {stall.dishes.map((dish, idx) => (
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
                            <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded shrink-0">
                              ⭐ Must Try
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-primary font-mono shrink-0">
                          ₹{dish.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stall Footer Actions */}
              <div className="p-5 pt-0">
                <a
                  href={`https://api.whatsapp.com/send?phone=${stall.phone.replace(/[^0-9]/g, "")}&text=Hello%20${encodeURIComponent(stall.chefName)}%2C%20I%20saw%20your%20Anandamela%20stall%20"${encodeURIComponent(stall.stallName)}"%20on%20the%20PBEL%20Durgotsav%20Portal!%20I%20would%20like%20to%20know%20more%20and%20pre-order.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-2.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>💬 WhatsApp Chef / Pre-Order</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredStalls.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs text-gray-500 max-w-md mx-auto space-y-3">
            <Utensils size={32} className="mx-auto text-gray-400" />
            <h3 className="font-heading text-lg font-bold text-gray-900">No Food Stalls Found</h3>
            <p>Try searching for a different dish or clear the selected category filters.</p>
          </div>
        )}

      </section>

      {/* 4. REGISTER YOUR STALL MODAL / DRAWER */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-amber-400/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👩‍🍳</span>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Register Your Anandamela Stall
              </h2>
            </div>
            <p className="text-xs text-gray-500 mb-6">
              Showcase your signature homemade culinary delicacies to over 1,500+ PBEL City resident families on Panchami evening (15th Oct).
            </p>

            {regSuccess ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 size={32} className="mx-auto text-green-600" />
                <h4 className="font-heading text-lg font-bold text-green-900">
                  Stall Registered Successfully!
                </h4>
                <p className="text-xs text-green-700">
                  Your food stall has been published to the Anandamela directory. The PSS food committee will connect with you for stall allotment.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterStall} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Stall / Food Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={regForm.stallName}
                    onChange={(e) => setRegForm({ ...regForm, stallName: e.target.value })}
                    placeholder="e.g. Grandma's Rasogolla & Mughlai Hub"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Home Chef Name *</label>
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
                    <label className="block font-semibold text-gray-700 mb-1">WhatsApp Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      placeholder="e.g. 9845000000"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Select Tower</label>
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
                    <label className="block font-semibold text-gray-700 mb-1">Flat / Unit *</label>
                    <input
                      type="text"
                      required
                      value={regForm.flatNumber}
                      onChange={(e) => setRegForm({ ...regForm, flatNumber: e.target.value })}
                      placeholder="e.g. 1104"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Food Category</label>
                  <select
                    value={regForm.category}
                    onChange={(e) => setRegForm({ ...regForm, category: e.target.value as any })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="Rolls & Mughlai">Rolls & Mughlai Delicacies</option>
                    <option value="Bengali Delicacies">Bengali Heritage Cuisine (Fish Fry, Biryani)</option>
                    <option value="Street Food & Chaat">Kolkata Street Food & Phuchka</option>
                    <option value="Sweets & Pithe">Sweets, Pithe Puli & Desserts</option>
                    <option value="Snacks & Quick Bites">Snacks & Beverages</option>
                  </select>
                </div>

                {/* Dish 1 */}
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <span className="font-bold text-gray-900 block text-[11px] uppercase">Primary Signature Dish:</span>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      value={regForm.dish1Name}
                      onChange={(e) => setRegForm({ ...regForm, dish1Name: e.target.value })}
                      placeholder="Dish Name (e.g. Kolkata Fish Fry)"
                      className="col-span-2 p-2 border border-gray-200 rounded-xl outline-none text-xs"
                    />
                    <input
                      type="number"
                      required
                      value={regForm.dish1Price}
                      onChange={(e) => setRegForm({ ...regForm, dish1Price: e.target.value })}
                      placeholder="₹ Price"
                      className="p-2 border border-gray-200 rounded-xl outline-none text-xs font-bold font-mono"
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
                      className="col-span-2 p-2 border border-gray-200 rounded-xl outline-none text-xs"
                    />
                    <input
                      type="number"
                      value={regForm.dish2Price}
                      onChange={(e) => setRegForm({ ...regForm, dish2Price: e.target.value })}
                      placeholder="₹ Price"
                      className="p-2 border border-gray-200 rounded-xl outline-none text-xs font-bold font-mono"
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

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition shadow-sm flex items-center justify-center gap-2 golden-glow"
                >
                  <Send size={15} />
                  <span>Submit Food Stall Application</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
