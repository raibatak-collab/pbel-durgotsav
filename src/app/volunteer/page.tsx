"use client";

import { useState, useEffect } from "react";
import { Users, CheckCircle2, Heart, Sparkles, Calendar, ShieldCheck, Clock, MapPin, Building } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { getStoredTowers, fetchStoredTowers, TowerDefinition } from "@/config/towers";

interface VolunteerRole {
  id: string;
  title: string;
  icon: string;
  description: string;
  recommendedSlots: string;
}

const volunteerRoles: VolunteerRole[] = [
  {
    id: "bhog-distribution",
    title: "Maha Bhog & Prasad Distribution",
    icon: "🍚",
    description: "Serve afternoon hot khichuri, labra, payesh, and prasad to 1,000+ residents & guests with love.",
    recommendedSlots: "12:30 PM - 03:00 PM",
  },
  {
    id: "pujo-assistance",
    title: "Pujo Nirghanto & Purohit Seva",
    icon: "🪔",
    description: "Assist purohit with flower arrangements, Sandhi pujo 108 deepam, and Pushpanjali line coordination.",
    recommendedSlots: "09:00 AM - 01:00 PM",
  },
  {
    id: "cultural-coordination",
    title: "Pratibimb Stage & Sound Team",
    icon: "🎭",
    description: "Help coordinate green room, artist line-up, microphones, and stage lighting for evening cultural acts.",
    recommendedSlots: "06:30 PM - 10:30 PM",
  },
  {
    id: "crowd-pandal-management",
    title: "Pandal Flow & Senior Citizen Seva",
    icon: "🤝",
    description: "Help guide visitors, manage darshan queues, and ensure comfortable seating for seniors and kids.",
    recommendedSlots: "Morning / Evening Shifts",
  },
];

const pujoDates = [
  { label: "15 Oct (Panchami) - Agomoni Opening", value: "2026-10-15" },
  { label: "16 Oct (Maha Sashti) - Devi Bodhon", value: "2026-10-16" },
  { label: "17 Oct (Maha Saptami) - Kola Bou & Bhog", value: "2026-10-17" },
  { label: "18 Oct (Maha Ashtami) - Sandhi Pujo Peak", value: "2026-10-18" },
  { label: "19 Oct (Maha Nabami) - Havan & Grand Feast", value: "2026-10-19" },
  { label: "20 Oct (Vijaya Dashami) - Sindoor Khela & Visarjan", value: "2026-10-20" },
];

export default function VolunteerPage() {
  const [selectedRole, setSelectedRole] = useState<string>("Maha Bhog & Prasad Distribution");
  const [towersList, setTowersList] = useState<TowerDefinition[]>([]);
  const [selectedTower, setSelectedTower] = useState<string>("");
  const [flatUnit, setFlatUnit] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    category: "Maha Bhog & Prasad Distribution",
    date: "2026-10-17", // Default Saptami
    shiftTime: "Morning (09:00 AM - 01:00 PM)",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = getStoredTowers();
      setTowersList(stored);
      if (stored.length > 0) {
        setSelectedTower(stored[0].fullName || `${stored[0].tower} (${stored[0].name})`);
      }
      fetchStoredTowers().then((cloudTowers) => {
        if (cloudTowers && cloudTowers.length > 0) {
          setTowersList(cloudTowers);
        }
      });
    } catch (_) {}

    const handleTowerUpdate = () => {
      const stored = getStoredTowers();
      setTowersList(stored);
    };

    window.addEventListener("pbel_towers_updated", handleTowerUpdate);
    return () => {
      window.removeEventListener("pbel_towers_updated", handleTowerUpdate);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedFlat = selectedTower === "Other"
      ? flatUnit.trim() || "Guest Devotee"
      : `${selectedTower} - ${flatUnit.trim()}`;

    if (!formData.name.trim() || !flatUnit.trim() || !formData.phone.trim()) {
      alert("Please fill in your Name, Flat Number, and WhatsApp Phone Number.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Get or create category
      let { data: catData } = await supabase
        .from("volunteer_categories")
        .select("id")
        .eq("name", formData.category)
        .single();

      if (!catData) {
        const { data: newCat } = await supabase
          .from("volunteer_categories")
          .insert({ name: formData.category })
          .select("id")
          .single();
        catData = newCat;
      }

      // 2. Get or create slot
      let { data: slotData } = await supabase
        .from("volunteer_slots")
        .select("id")
        .eq("category_id", catData!.id)
        .eq("slot_date", formData.date)
        .single();

      if (!slotData) {
        const { data: newSlot } = await supabase
          .from("volunteer_slots")
          .insert({
            category_id: catData!.id,
            slot_date: formData.date,
            total_capacity: 20,
          })
          .select("id")
          .single();
        slotData = newSlot;
      }

      // 3. Register volunteer
      const { error } = await supabase.from("volunteer_registrations").insert({
        slot_id: slotData!.id,
        full_name: formData.name,
        phone: formData.phone,
        email: formData.email,
        flat_number: formattedFlat,
      });

      if (error) throw error;

      setIsSuccess(true);
    } catch (error) {
      console.error("Error registering volunteer:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-900/15 shadow-2xl">
          <div className="w-18 h-18 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={44} />
          </div>
          <span className="text-xs uppercase font-bold text-amber-800 tracking-wider bg-amber-100/60 px-3 py-1 rounded-full">
            Seva Registration Confirmed
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl text-primary font-bold mt-3 mb-2">
            Welcome to the Seva Team!
          </h1>
          <p className="text-gray-600 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Thank you, <strong>{formData.name}</strong>! Your registration for <strong>{formData.category}</strong> on <strong>{formData.date}</strong> has been confirmed. The committee coordinator will reach out to you with details.
          </p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setFormData({
                name: "",
                phone: "",
                email: "",
                category: "Maha Bhog & Prasad Distribution",
                date: "2026-10-17",
                shiftTime: "Morning (09:00 AM - 01:00 PM)",
              });
              setFlatUnit("");
            }}
            className="bg-primary hover:bg-primary-hover text-white font-semibold px-7 py-3 rounded-full text-xs transition shadow-sm"
          >
            Register for Another Day / Role
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      
      {/* 1. ROYAL FESTIVE HERO BANNER */}
      <section className="w-full bg-festive-hero text-white relative overflow-hidden py-14 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20 text-center">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-md">
            <Users size={14} className="text-amber-400" />
            <span>PBEL City Community Seva Team</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">
            Join the <span className="text-gold-gradient">Volunteer Seva Team</span>
          </h1>

          <p className="text-sm sm:text-base text-amber-100/90 max-w-2xl mx-auto font-normal leading-relaxed">
            PBEL City Durgotsav is powered entirely by the energy, smiles, and dedication of resident volunteers. 
            Pick your preferred day and seva role to be an essential part of the celebration!
          </p>
        </div>
      </section>

      {/* 2. MAIN VOLUNTEER SELECTION AREA */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        
        {/* Role Picker Cards */}
        <div className="mb-12">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs uppercase font-bold text-amber-800 tracking-wider bg-amber-100/60 px-3 py-1 rounded-full">
              Step 1 of 2
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl text-gray-900 font-bold mt-2">
              Choose Your Seva Domain
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {volunteerRoles.map((role) => {
              const isSelected = formData.category === role.title;
              return (
                <div
                  key={role.id}
                  onClick={() => {
                    setFormData({ ...formData, category: role.title });
                    setSelectedRole(role.title);
                  }}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-amber-50/80 border-primary shadow-lg ring-2 ring-primary/20 scale-[1.02]"
                      : "bg-white border-amber-900/10 shadow-sm hover:shadow-md hover:border-amber-400"
                  }`}
                >
                  <div>
                    <span className="text-3xl mb-2 block">{role.icon}</span>
                    <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">{role.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">{role.description}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-amber-800 font-semibold">{role.recommendedSlots}</span>
                    <span className={`font-bold ${isSelected ? "text-primary" : "text-gray-400"}`}>
                      {isSelected ? "Selected ✓" : "Select"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-3xl shadow-xl border border-amber-900/15 p-6 sm:p-10 max-w-3xl mx-auto">
          <div className="pb-4 border-b border-gray-100 mb-6">
            <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">
              Step 2 of 2
            </span>
            <h2 className="font-heading text-2xl font-bold text-gray-900">
              Enter Your Availability & Contact Details
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Selected Seva Role
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-semibold text-primary"
                >
                  {volunteerRoles.map((r) => (
                    <option key={r.id} value={r.title}>{r.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Preferred Date (15 - 20 Oct) *
                </label>
                <select
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                >
                  {pujoDates.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name"
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  WhatsApp Phone Number (10 Digits) *
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
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-mono"
                />
              </div>

              {/* 1-TAP TOWER SELECTOR + FLAT UNIT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200 sm:col-span-2">
                <div>
                  <label className="block text-xs font-bold text-amber-950 uppercase mb-1 flex items-center gap-1">
                    <Building size={13} className="text-primary" /> Select PBEL Tower *
                  </label>
                  <select
                    value={selectedTower}
                    onChange={(e) => setSelectedTower(e.target.value)}
                    className="w-full p-3 border border-amber-300/80 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm font-semibold text-gray-900"
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
                    Flat / Unit Number (e.g. 402, 1204, or G01) *
                  </label>
                  <input
                    type="text"
                    required
                    autoCapitalize="characters"
                    maxLength={8}
                    value={flatUnit}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 8);
                      setFlatUnit(val);
                    }}
                    placeholder="e.g. 402, 1204, or G01"
                    className="w-full p-3 border border-amber-300/80 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm font-bold font-mono"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#D99B26] via-[#B8801C] to-[#966714] hover:from-[#B8801C] hover:to-[#78520D] text-white font-bold text-base py-4 rounded-xl transition-all shadow-lg golden-glow disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Users size={18} />
              <span>{isSubmitting ? "Registering Seva Slot..." : "Confirm Volunteer Seva Slot"}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
