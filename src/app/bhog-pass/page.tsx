"use client";

import Link from "next/link";
import { 
  Utensils, 
  ShieldCheck, 
  Clock, 
  Users, 
  MapPin, 
  Sparkles,
  ArrowRight,
  HeartHandshake,
  Calendar
} from "lucide-react";

export default function BhogPassPage() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#FCFBF8] pb-16">
      
      {/* 1. HERO BANNER */}
      <section className="w-full bg-festive-hero text-white relative overflow-hidden py-14 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20 text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Utensils size={14} className="text-amber-400" />
            <span>Community Maha Bhog Seva</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            Daily Afternoon <span className="text-gold-gradient">Maha Bhog Feast</span>
          </h1>

          <p className="text-xs sm:text-base text-amber-100/90 max-w-2xl mx-auto font-normal leading-relaxed mb-6">
            PBEL Sanskritik Samiti cordially welcomes all patron member families to partake in traditional 
            Maha Bhog cooked in pure ghee during Saptami, Ashtami, Nabami, and Dashami.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <div className="bg-black/30 backdrop-blur-md border border-amber-400/20 px-4 py-2 rounded-full text-amber-200 flex items-center gap-2">
              <Clock size={14} className="text-amber-400" />
              <span>Lunch Timings: <strong>01:00 PM – 03:30 PM</strong> Daily</span>
            </div>
            <div className="bg-black/30 backdrop-blur-md border border-amber-400/20 px-4 py-2 rounded-full text-amber-200 flex items-center gap-2">
              <MapPin size={14} className="text-amber-400" />
              <span>Venue: <strong>PBEL City Dining Hall</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NOTICE & SCHEDULE CARD */}
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 -mt-6 relative z-20 space-y-6">
        
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-300/80 shadow-xl space-y-6">
          <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
              <ShieldCheck size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-gray-900">
                Official PSS Member Pass Distribution Desk
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                Daily family lunch passes are issued directly to verified <strong>PSS Patron Member families (capped at max 6 members per flat)</strong> 
                via the Food &amp; Kitchen Operations Desk in the Admin Portal to ensure smooth crowd discipline and zero food wastage.
              </p>
            </div>
          </div>

          {/* 4-Day Bhog Menu Grid */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-bold text-gray-800 uppercase tracking-wider">
              4-Day Traditional Maha Bhog Menu
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
                <span className="font-bold text-primary block">🍛 Maha Saptami (17 Oct)</span>
                <span className="text-gray-600 text-[11px]">Khichuri, Labra, Beguni, Tomato Khejur Chutney, Payesh</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
                <span className="font-bold text-primary block">🍛 Maha Ashtami (18 Oct)</span>
                <span className="text-gray-600 text-[11px]">Bhog Khichuri, Chholar Dal, Luchi, Chanar Payesh, Rosogolla</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
                <span className="font-bold text-primary block">🍛 Maha Nabami (19 Oct)</span>
                <span className="text-gray-600 text-[11px]">Basanti Pulao, Paneer/Veg Delicacy, Sweet Chutney, Mishti Doi</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
                <span className="font-bold text-primary block">🍛 Vijaya Dashami (20 Oct)</span>
                <span className="text-gray-600 text-[11px]">Shanti Jal, Traditional Sweets &amp; Prasad Distribution</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
            <Link
              href="/admin"
              className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <ShieldCheck size={14} />
              <span>Admin / Food Desk Login</span>
            </Link>

            <Link
              href="/programs"
              className="text-xs text-amber-900 hover:underline font-semibold flex items-center gap-1"
            >
              <span>View Full Festival Nirghanto Schedule →</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
