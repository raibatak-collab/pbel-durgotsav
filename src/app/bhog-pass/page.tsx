"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Utensils, 
  QrCode, 
  CheckCircle2, 
  Download, 
  Users, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Info, 
  ArrowRight,
  Share2,
  Building2
} from "lucide-react";

export default function BhogPassPage() {
  const [formData, setFormData] = useState({
    name: "",
    tower: "Tower C (Coral)",
    flatNumber: "",
    phone: "",
    passCount: 4,
    days: ["saptami", "ashtami", "nabami"],
  });

  const [generatedPass, setGeneratedPass] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pbelTowers = [
    "Tower A (Emerald)",
    "Tower B (Sapphire)",
    "Tower C (Coral)",
    "Tower D (Topaz)",
    "Tower E (Ruby)",
    "Tower F (Pearl)",
    "Tower G (Jade)",
    "Tower H (Diamond)",
    "Tower J (Aquamarine)",
    "Tower K (Opal)",
  ];

  const pujoLunchDays = [
    { id: "saptami", day: "Maha Saptami", date: "17 Oct 2026", menu: "Khichuri, Labra, Beguni, Tomato Chutney, Payesh" },
    { id: "ashtami", day: "Maha Ashtami", date: "18 Oct 2026", menu: "Bhog Khichuri, Chholar Dal, Luchi, Chanar Payesh, Rosogolla" },
    { id: "nabami", day: "Maha Nabami", date: "19 Oct 2026", menu: "Basanti Pulao, Paneer/Veg Delicacy, Sweet Chutney, Mishti Doi" },
    { id: "dashami", day: "Vijaya Dashami", date: "20 Oct 2026", menu: "Shanti Jal, Vijaya Sweets, Traditional Prasad" },
  ];

  const handleDayToggle = (dayId: string) => {
    if (formData.days.includes(dayId)) {
      if (formData.days.length === 1) return; // Keep at least one
      setFormData({ ...formData, days: formData.days.filter((d) => d !== dayId) });
    } else {
      setFormData({ ...formData, days: [...formData.days, dayId] });
    }
  };

  const handleGeneratePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.flatNumber.trim() || !formData.phone.trim()) {
      alert("Please fill in your Name, Flat Number, and Phone Number.");
      return;
    }

    setIsSubmitting(true);
    const cleanFlat = formData.flatNumber.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const towerLetter = formData.tower.split(" ")[1] || "C";
    const passId = `PSS-BHOG-2026-T${towerLetter}-${cleanFlat}`;

    const newPass = {
      passId,
      name: formData.name.trim(),
      tower: formData.tower,
      flatNumber: formData.flatNumber.trim(),
      phone: formData.phone.trim(),
      passCount: Number(formData.passCount),
      days: formData.days,
      issuedAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Save to local registry so admin kitchen dashboard can estimate headcounts
    try {
      const existing = JSON.parse(localStorage.getItem("pbel_bhog_passes") || "[]");
      const filtered = existing.filter((p: any) => p.passId !== passId);
      filtered.unshift(newPass);
      localStorage.setItem("pbel_bhog_passes", JSON.stringify(filtered));
    } catch (_) {}

    setGeneratedPass(newPass);
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#FCFBF8] pb-16">
      
      {/* 1. HERO BANNER */}
      <section className="w-full bg-festive-hero text-white relative overflow-hidden py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20 text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Utensils size={14} className="text-amber-400" />
            <span>Community Maha Bhog Seva</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3 leading-tight">
            Daily Lunch & <span className="text-gold-gradient">Maha Bhog Pass</span>
          </h1>

          <p className="text-xs sm:text-sm text-amber-100/90 max-w-2xl mx-auto font-normal leading-relaxed mb-6">
            PBEL Sanskritik Samiti cordially invites all township resident member families to partake in daily afternoon Maha Bhog. 
            Issue your digital lunch pass below (up to <strong>6 passes per member family</strong>).
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <div className="bg-black/30 backdrop-blur-md border border-amber-400/20 px-3.5 py-1.5 rounded-full text-amber-200 flex items-center gap-1.5">
              <Clock size={13} className="text-amber-400" />
              <span>Lunch Timings: <strong>01:00 PM – 03:30 PM</strong> Daily</span>
            </div>
            <div className="bg-black/30 backdrop-blur-md border border-amber-400/20 px-3.5 py-1.5 rounded-full text-amber-200 flex items-center gap-1.5">
              <Users size={13} className="text-amber-400" />
              <span>Max Limit: <strong>6 Passes per Family</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FORM OR GENERATED PASS CARD */}
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 -mt-6 relative z-20">
        {!generatedPass ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-900/15 shadow-2xl">
            <div className="pb-5 border-b border-gray-100 mb-6">
              <h2 className="font-heading text-2xl font-bold text-gray-900">
                Issue Family Lunch Pass
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Enter your flat details to generate your digital Bhog Token for the kitchen team.
              </p>
            </div>

            <form onSubmit={handleGeneratePass} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Head of Family / Member Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Subhashish Mukherjee"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">WhatsApp / Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">PBEL City Tower *</label>
                  <select
                    value={formData.tower}
                    onChange={(e) => setFormData({ ...formData, tower: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  >
                    {pbelTowers.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Flat / Unit Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.flatNumber}
                    onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
                    placeholder="e.g. 402 / Tower C"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Number of Family Lunch Passes (Max 6 per flat) *
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, passCount: num })}
                      className={`py-2.5 rounded-xl font-bold text-sm transition-all border ${
                        formData.passCount === num
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-amber-50"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Select Pujo Days Needed:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {pujoLunchDays.map((d) => {
                    const isChecked = formData.days.includes(d.id);
                    return (
                      <div
                        key={d.id}
                        onClick={() => handleDayToggle(d.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                          isChecked
                            ? "bg-amber-50/80 border-amber-400 text-amber-950"
                            : "bg-gray-50/60 border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 rounded text-primary focus:ring-primary"
                        />
                        <div>
                          <div className="font-bold text-xs">{d.day} ({d.date.split(" ")[0]} Oct)</div>
                          <div className="text-[10px] text-gray-500 line-clamp-1">{d.menu}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#D99B26] via-[#B8801C] to-[#966714] text-white font-bold py-3.5 rounded-xl transition shadow-lg golden-glow flex items-center justify-center gap-2 text-sm"
                >
                  <Utensils size={17} />
                  <span>Generate Official Digital Bhog Pass</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* DIGITAL BHOG PASS CARD (PRINTABLE & SCREENSHOT-READY) */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-2xl text-center relative overflow-hidden animate-fade-in">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-100/50 rounded-full blur-2xl -z-10 pointer-events-none" />

            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3">
              <ShieldCheck size={13} className="text-primary" />
              <span>Official Society Dining Pass</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-1">
              Maha Bhog Lunch Token
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              PBEL Sanskritik Samiti • PBEL City Durgotsav 2026
            </p>

            {/* Token Badge Card */}
            <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FDF8F0] rounded-2xl p-6 border border-amber-300 text-left space-y-4 mb-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-amber-900/10">
                <div>
                  <span className="font-heading text-xl font-bold text-gray-900 block">{generatedPass.name}</span>
                  <span className="text-xs text-amber-800 font-semibold">{generatedPass.tower} • Flat {generatedPass.flatNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block font-mono">TOKEN ID</span>
                  <span className="font-mono text-xs font-bold text-primary">{generatedPass.passId}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-gray-500 text-[11px] block">Daily Pass Count</span>
                  <span className="font-bold text-green-700 text-lg font-heading">{generatedPass.passCount} Members</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[11px] block">Dining Timing</span>
                  <span className="font-semibold text-gray-900">01:00 PM – 03:30 PM</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-gray-500 text-[11px] block">Dining Hall Venue</span>
                  <span className="font-semibold text-gray-900">Community Hall B</span>
                </div>
              </div>

              <div>
                <span className="text-gray-500 text-[11px] block mb-1">Active Pujo Days:</span>
                <div className="flex flex-wrap gap-1.5">
                  {generatedPass.days.map((d: string) => (
                    <span key={d} className="bg-amber-200/80 text-amber-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize">
                      ✓ {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-amber-900/10 flex items-center justify-between text-[11px] text-gray-500">
                <span>Issued: {generatedPass.issuedAt}</span>
                <span className="text-green-700 font-bold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Verified Member Token
                </span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download size={14} />
                <span>Save / Print Token Card</span>
              </button>
              <button
                onClick={() => setGeneratedPass(null)}
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-full text-xs font-semibold transition"
              >
                Issue for Another Unit
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
