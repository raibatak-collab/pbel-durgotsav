"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  AlertCircle,
  Accessibility,
  Utensils,
  Car,
  HeartPulse,
  Music,
  Users,
  Compass,
  CheckCircle2,
  Clock,
  ExternalLink
} from "lucide-react";

interface FacilityZone {
  id: string;
  name: string;
  category: "Sanctum & Rituals" | "Dining & Bhog" | "Cultural Stage" | "Amenities & Medical" | "Parking & Entry";
  location: string;
  emoji: string;
  timings: string;
  description: string;
  features: string[];
}

const FACILITY_ZONES: FacilityZone[] = [
  {
    id: "zone-1",
    name: "Maa Durga Sanctum & Purohit Mandap",
    category: "Sanctum & Rituals",
    location: "Central Pandal Main Stage",
    emoji: "🌺",
    timings: "06:30 AM – 11:30 PM (Daily)",
    description: "The divine sanctum housing the traditional Ekchala Pratima with authentic Sholar Saaj, Purohit Vedika for all 6 days of Vedic rituals.",
    features: ["Quiet Darshan Queue", "Pushpanjali Enclosure", "Sandhi Pujo 108 Deepam Platform", "Prasad Counter"],
  },
  {
    id: "zone-2",
    name: "Senior Citizen Priority Darshan & Ramp",
    category: "Sanctum & Rituals",
    location: "Left Flank of Main Pandal Arch",
    emoji: "🦽",
    timings: "Open Throughout Festival",
    description: "Dedicated step-free accessible ramp with shaded seating for elders, toddlers, and specially-abled devotees with priority queue assistance.",
    features: ["Step-free Ramp Access", "Comfort Seating Chairs", "Dedicated Volunteer Escort", "Wheelchair Support on Request"],
  },
  {
    id: "zone-3",
    name: "Pratibimb Cultural Stage & Amphitheatre",
    category: "Cultural Stage",
    location: "Township Open Air Arena",
    emoji: "🎭",
    timings: "06:30 PM – 10:30 PM (Evening Gala)",
    description: "State-of-the-art acoustic stage hosting resident performances, Natok drama, and flagship headline concerts (*Fushmontor*).",
    features: ["1,200+ Seating Capacity", "Live Digital LED Wall", "Professional Sound & Lighting", "Green Rooms"],
  },
  {
    id: "zone-4",
    name: "Maha Bhog Community Dining Hall",
    category: "Dining & Bhog",
    location: "Community Hall B & Extension Pavilion",
    emoji: "🍚",
    timings: "01:00 PM – 03:30 PM (Saptami to Dashami)",
    description: "Township community feast pavilion serving freshly cooked traditional Khichuri, Labra, Payesh and Chutney to all registered patron families.",
    features: ["Token Scanning Desks", "Continuous Seating Batches", "Hygienic RO Water Stations", "Eco-friendly Sal Leaf Plating"],
  },
  {
    id: "zone-5",
    name: "Anandamela Food Fiesta Promenade",
    category: "Dining & Bhog",
    location: "Pandal Outer Boulevard",
    emoji: "🍲",
    timings: "Panchami Evening (15 Oct) 06:30 PM Onwards",
    description: "Vibrant home chef street hosting resident food stalls serving Kolkata rolls, Bhetki fish fry, Mughlai Parota, and traditional sweets.",
    features: ["20+ Resident Home Chef Stalls", "Live WhatsApp Pre-Orders", "High-Top Standing Tables", "Waste Segregation Dustbins"],
  },
  {
    id: "zone-6",
    name: "First Aid & Medical Emergency Station",
    category: "Amenities & Medical",
    location: "Near Gate #2 & Pandal Helpdesk",
    emoji: "🚑",
    timings: "24x7 On Call",
    description: "Equipped medical desk with paramedic kit, blood pressure monitor, first-aid essentials, and dedicated on-call township ambulance.",
    features: ["Doctor on Call", "Wheelchair & Stretcher", "Basic Emergency Meds", "ORS & Hydration Packs"],
  },
  {
    id: "zone-7",
    name: "Vehicle Parking & Traffic Circulation",
    category: "Parking & Entry",
    location: "Basement 2 & Outer Perimeter Lane",
    emoji: "🚗",
    timings: "Open 24 Hours",
    description: "Designated resident and visitor parking zones with marshaled entry/exit to avoid internal township congestion.",
    features: ["Resident Sticker Entry", "Senior Citizen Drop-off Bay", "2-Wheeler Parking Bay", "Security Traffic Marshals"],
  },
];

const EMERGENCY_CONTACTS = [
  { role: "Executive Emergency Desk", name: "PBEL Sanskritik Samiti Helpline", phone: "+91 98450 00000", desc: "For lost items, emergency pass verification & assistance" },
  { role: "Security Control Room", name: "PBEL City Main Gate Security", phone: "+91 98450 00001", desc: "For vehicle parking, gates, and crowd guidance" },
  { role: "First Aid & Medical Lead", name: "Township Medical Assistance Desk", phone: "+91 98450 00002", desc: "For urgent medical assistance and paramedic support" },
  { role: "Food & Bhog Desk", name: "Kitchen Coordination Desk", phone: "+91 98450 00003", desc: "For dining token inquiries and special dietary help" },
];

export default function PandalGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Sanctum & Rituals", "Dining & Bhog", "Cultural Stage", "Amenities & Medical", "Parking & Entry"];

  const filteredZones = selectedCategory === "All"
    ? FACILITY_ZONES
    : FACILITY_ZONES.filter((z) => z.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FCFAF6] text-[#2C1810] pb-24">
      
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#800C1F] via-[#9E122C] to-[#5C0512] text-white py-16 px-4 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
        <div className="absolute -top-12 -right-12 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-300/20 border border-amber-300/40 text-amber-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Compass size={14} className="text-amber-300" />
            <span>Visitor Navigator & Township Map</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4 drop-shadow-md">
            Pandal Map & Facility Guide 🗺️
          </h1>

          <p className="max-w-2xl mx-auto text-amber-100/90 text-sm sm:text-base leading-relaxed mb-6">
            Everything you need for a seamless and blissful Durgotsav celebration at PBEL City. Locate ritual sanctums, senior citizen ramps, Bhog dining halls, and emergency medical desks.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#emergency-contacts"
              className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition shadow-md flex items-center gap-1.5 golden-glow"
            >
              <PhoneCall size={16} />
              <span>Speed-Dial Emergency Desk</span>
            </a>
            <Link
              href="/programs"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/25 px-5 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm transition flex items-center gap-1.5"
            >
              <Clock size={16} />
              <span>Pujo Schedule (Nirghanto) →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE FACILITY ZONES DIRECTORY */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary">
              Township Pandal Key Locations
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Select a zone below to view accessibility details and specific amenities.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-xs"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredZones.map((zone) => (
            <div
              key={zone.id}
              className="bg-white rounded-3xl border border-amber-900/10 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group hover:border-amber-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2.5 bg-amber-50 rounded-2xl border border-amber-200 shadow-2xs">
                    {zone.emoji}
                  </span>
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase">
                    {zone.category}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-gray-900 group-hover:text-primary transition mb-1">
                  {zone.name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                  <MapPin size={14} className="text-primary shrink-0" />
                  <span className="font-semibold text-gray-700">{zone.location}</span>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl text-[11px] text-gray-600 mb-4 border border-gray-100 flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-800 shrink-0" />
                  <span><strong>Timings:</strong> {zone.timings}</span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {zone.description}
                </p>

                <div className="space-y-1.5 pt-3 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Key Features:
                  </span>
                  {zone.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-gray-700">
                      <CheckCircle2 size={13} className="text-green-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 3. EMERGENCY CONTACTS SPEED DIAL */}
      <section id="emergency-contacts" className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-3xl border border-amber-300 p-6 sm:p-8 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-amber-900/10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                <ShieldCheck size={14} />
                <span>24x7 Resident Safety & Support</span>
              </div>
              <h2 className="font-heading text-2xl font-bold text-gray-900">
                Speed-Dial Emergency Contacts
              </h2>
            </div>
            <span className="text-xs text-gray-500">
              Tap any contact to initiate direct phone call
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EMERGENCY_CONTACTS.map((c, idx) => (
              <a
                key={idx}
                href={`tel:${c.phone.replace(/[^0-9+]/g, "")}`}
                className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs hover:shadow-md transition flex flex-col justify-between group hover:border-primary"
              >
                <div>
                  <span className="text-[10px] font-bold text-amber-900 uppercase block mb-1">
                    {c.role}
                  </span>
                  <h4 className="font-heading font-bold text-gray-900 text-sm group-hover:text-primary transition mb-1">
                    {c.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2">
                    {c.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">
                    {c.phone}
                  </span>
                  <span className="p-1.5 bg-green-100 text-green-800 rounded-lg group-hover:bg-green-600 group-hover:text-white transition">
                    <PhoneCall size={13} />
                  </span>
                </div>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* 4. FESTIVE ETIQUETTE & GUIDELINES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Devotional Harmony
            </span>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mt-1">
              Pujo Etiquette & Green Festival Guidelines
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-700">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <span className="text-xl">🌸</span>
              <h4 className="font-bold text-gray-900 text-sm">Pushpanjali Discipline</h4>
              <p>
                Pushpanjali will be conducted in organized batches of 50 devotees. Please collect sanitized bel leaves & fresh flowers only from the designated distribution tray.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <span className="text-xl">♻️</span>
              <h4 className="font-bold text-gray-900 text-sm">Zero Single-Use Plastic</h4>
              <p>
                PBEL Durgotsav is a 100% eco-friendly green festival. Please use designated wet/dry waste bins for sal leaf plates and avoid single-use plastic water bottles.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <span className="text-xl">🦺</span>
              <h4 className="font-bold text-gray-900 text-sm">Priority for Seniors & Kids</h4>
              <p>
                Please offer precedence to our township elders, toddlers, and nursing mothers during darshan queues and Maha Bhog dining batches.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
