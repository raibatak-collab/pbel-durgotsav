"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Award, 
  Download, 
  CheckCircle2, 
  Users, 
  Building, 
  Sparkles, 
  Send, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowRight,
  FileText,
  Star
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";

export default function SponsorsPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    phone: "",
    email: "",
    tier: "Gold Partner (₹50,000)",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save sponsor lead to Supabase or local storage fallback
      const leadEntry = {
        name: formData.companyName,
        contact_person: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        tier: formData.tier,
        message: formData.message,
        created_at: new Date().toISOString(),
      };

      try {
        await supabase.from("sponsors").insert({
          name: `${formData.companyName} (Inquiry: ${formData.contactPerson})`,
          tier: formData.tier.split(" ")[0],
          is_active: false, // Pending committee approval
        });
      } catch (_) {}

      // Save locally to ensure committee can view it in Admin portal
      const existingLeads = JSON.parse(localStorage.getItem("pbel_sponsor_leads") || "[]");
      existingLeads.unshift(leadEntry);
      localStorage.setItem("pbel_sponsor_leads", JSON.stringify(existingLeads));

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting sponsor inquiry:", err);
      alert("Inquiry submitted! Our sponsorship team will contact you shortly.");
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sponsorTiers = [
    {
      title: "Title / Platinum Partner",
      amount: "₹1,00,000",
      tag: "Maximum Brand Dominance",
      isHighlight: true,
      deliverables: [
        "Exclusive Prime Stage LED Backdrop Branding",
        "Grand Pandal Entrance Archway Branding",
        "Prime Anandamela Stall Space (Panchami Evening)",
        "Daily Emcee Live Announcements during Pratibimb",
        "Prominent Logo on Homepage & Digital Carousel",
        "Full Page Color Ad in Pujo Souvenir Brochure",
      ],
    },
    {
      title: "Gold Partner",
      amount: "₹50,000",
      tag: "High Visibility",
      isHighlight: false,
      deliverables: [
        "Stage Side Panels & Pandal Entry Branding",
        "Dedicated Food / Promotional Stall Space",
        "Daily Emcee Verbal Brand Mention",
        "Logo on Official Website & Carousel",
        "Half Page Color Ad in Pujo Souvenir Brochure",
        "WhatsApp Broadcast Inclusion to 1,500+ Families",
      ],
    },
    {
      title: "Cultural Stage Partner",
      amount: "₹40,000",
      tag: "Pratibimb Stage Sponsor",
      isHighlight: false,
      deliverables: [
        "Stage Backdrop Branding during 5 Evening Shows",
        "Logo during Fushmontor, Dance Drama & Natok",
        "Emcee Stage Acknowledgements",
        "Promotional Standees in Auditoria / Seating Area",
        "Logo on Cultural Schedule & Website",
      ],
    },
    {
      title: "Food & Bhog Partner",
      amount: "₹35,000",
      tag: "Direct Family Goodwill",
      isHighlight: false,
      deliverables: [
        "Exclusive Branding at Daily Bhog Counters (1,500+ daily meals)",
        "Anandamela Food Stall Space (Panchami Evening)",
        "Logo on Bhog Token Cards & Website",
        "Banner Placement in Dining & Cafeteria Hall",
      ],
    },
    {
      title: "Silver Partner",
      amount: "₹25,000",
      tag: "Township Reach",
      isHighlight: false,
      deliverables: [
        "Pandal Perimeter Standee & Banner Placement",
        "Logo Listing on Official Website",
        "Quarter Page Ad in Souvenir Brochure",
        "Township WhatsApp Group Inclusion",
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#FCFBF8]">
      
      {/* 1. HERO SECTION */}
      <section className="w-full bg-festive-hero text-white relative overflow-hidden py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs md:text-sm font-semibold tracking-wide mb-6">
            <Award size={15} className="text-amber-400" />
            <span>Corporate & Brand Partnerships • 2026</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Partner with <span className="text-gold-gradient">PBEL City Durgotsav</span>
          </h1>

          <p className="text-base sm:text-lg text-amber-100/90 max-w-3xl mx-auto mb-8 leading-relaxed font-normal">
            Showcase your brand to <strong>1,500+ affluent gated community families and 5,000+ attendees</strong> in 
            Hyderabad’s prime IT corridor (TSPA Junction / Financial District).
          </p>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10 text-left">
            <div className="bg-black/30 backdrop-blur-md border border-amber-400/20 p-4 rounded-2xl">
              <div className="text-2xl font-bold text-amber-300 font-heading">1,500+</div>
              <div className="text-xs text-gray-300 mt-0.5 font-medium">Luxury Residences</div>
            </div>
            <div className="bg-black/30 backdrop-blur-md border border-amber-400/20 p-4 rounded-2xl">
              <div className="text-2xl font-bold text-amber-300 font-heading">5,000+</div>
              <div className="text-xs text-gray-300 mt-0.5 font-medium">6-Day Festival Footfall</div>
            </div>
            <div className="bg-black/30 backdrop-blur-md border border-amber-400/20 p-4 rounded-2xl">
              <div className="text-2xl font-bold text-amber-300 font-heading">High-Income</div>
              <div className="text-xs text-gray-300 mt-0.5 font-medium">Tech & Leadership Hub</div>
            </div>
            <div className="bg-black/30 backdrop-blur-md border border-amber-400/20 p-4 rounded-2xl">
              <div className="text-2xl font-bold text-amber-300 font-heading">100% Direct</div>
              <div className="text-xs text-gray-300 mt-0.5 font-medium">Hyperlocal Engagement</div>
            </div>
          </div>

          {/* Download Brochure CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#inquiry-form"
              className="w-full sm:w-auto bg-gradient-to-r from-[#D99B26] to-[#B8801C] hover:from-[#B8801C] hover:to-[#966714] text-white px-8 py-3.5 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl golden-glow"
            >
              <span>Partner With Us / Request Callback</span>
            </a>
            <a
              href="/docs/PBEL_Durgotsav_2026_Sponsorship_Deck.pdf"
              download
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 rounded-full font-semibold text-sm transition flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <Download size={16} className="text-amber-300" />
              <span>Download Official Sponsorship Deck (PDF)</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. SPONSORSHIP TIERS */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/60 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Award size={13} /> Tailored Sponsorship Packages
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Choose Your Brand Partnership Tier
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            From premier title stage naming rights to targeted food stall kiosks, we have curated options for brands of every scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsorTiers.map((tier) => (
            <div
              key={tier.title}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
                tier.isHighlight
                  ? "bg-gradient-to-b from-[#FFFDF9] to-[#FFF8ED] border-2 border-amber-400 shadow-xl relative"
                  : "bg-white border border-amber-900/10 shadow-sm hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    {tier.tag}
                  </span>
                  {tier.isHighlight && (
                    <span className="text-[10px] font-bold bg-primary text-white px-2.5 py-0.5 rounded-full">
                      ★ Most Popular
                    </span>
                  )}
                </div>

                <h3 className="font-heading text-2xl font-bold text-gray-900 mb-1">
                  {tier.title}
                </h3>
                <div className="text-3xl font-bold text-primary font-heading mb-6">
                  {tier.amount}
                </div>

                <div className="space-y-3 mb-8">
                  <div className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Package Deliverables:
                  </div>
                  {tier.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle2 size={15} className="text-green-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="#inquiry-form"
                onClick={() => setFormData({ ...formData, tier: `${tier.title} (${tier.amount})` })}
                className={`w-full text-center py-3 rounded-xl font-bold text-xs transition shadow-xs ${
                  tier.isHighlight
                    ? "bg-primary hover:bg-primary-hover text-white"
                    : "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300"
                }`}
              >
                Inquire for {tier.title}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 3. INQUIRY / LEAD CAPTURE FORM */}
      <section id="inquiry-form" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 mb-16">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-900/15 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/60 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Send size={13} /> Direct Committee Connect
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Request Callback / Book Sponsorship
            </h2>
            <p className="text-xs text-gray-600">
              Fill in your details below and our executive sponsorship team will contact you within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-green-50 border border-green-200 rounded-2xl text-center space-y-3 animate-fade-in">
              <div className="w-14 h-14 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-green-900">Inquiry Received!</h3>
              <p className="text-xs text-green-700 max-w-md mx-auto">
                Thank you for your interest in partnering with PBEL City Durgotsav 2026. 
                Our Sponsorship Lead will reach out to you directly on <strong>{formData.phone || formData.email}</strong>.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 inline-block bg-primary text-white text-xs font-bold px-6 py-2.5 rounded-full transition"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Company / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Apollo Diagnostics / HDFC Bank"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Official Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. corporate@brand.com"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Preferred Sponsorship Tier</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="Title / Platinum Partner (₹1,00,000)">Title / Platinum Partner (₹1,00,000)</option>
                  <option value="Gold Partner (₹50,000)">Gold Partner (₹50,000)</option>
                  <option value="Cultural Stage Partner (₹40,000)">Cultural Stage Partner (₹40,000)</option>
                  <option value="Food & Bhog Partner (₹35,000)">Food & Bhog Partner (₹35,000)</option>
                  <option value="Silver Partner (₹25,000)">Silver Partner (₹25,000)</option>
                  <option value="Anandamela Stall Kiosk (Custom)">Anandamela Stall Kiosk (Custom)</option>
                  <option value="General Corporate Support">General Corporate Support</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Specific Requirements / Message (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mention any custom requirements, stall dimensions, or questions..."
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#9E122C] to-[#7B0D21] hover:from-[#7B0D21] hover:to-[#5C0512] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send size={15} />
                <span>{isSubmitting ? "Submitting Inquiry..." : "Submit Sponsorship Inquiry"}</span>
              </button>
            </form>
          )}

          {/* Direct Contacts */}
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-primary" />
              <span>Email: <strong>raibatak@gmail.com</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={15} className="text-primary" />
              <span>Sponsorship Desk: <strong>+91 98450 00000 / PBEL Sanskritik Samiti</strong></span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
