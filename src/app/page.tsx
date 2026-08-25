import Link from "next/link";
import { 
  HeartHandshake, 
  CalendarDays, 
  Users, 
  Sparkles, 
  Music, 
  Flame, 
  MapPin, 
  Award, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  Share2
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { GalleryCarousel } from "@/components/GalleryCarousel";
import { HomeQuickContribute } from "@/components/HomeQuickContribute";

export const revalidate = 0; // Fresh data on every load

export default async function Home() {
  // Fetch sum of all successful contributions
  const { data: contributionsData } = await supabase
    .from("contributions")
    .select("amount, contributor_name, flat_number, is_name_visible, created_at")
    .eq("status", "Success")
    .order("created_at", { ascending: false });

  const totalAmount = contributionsData
    ? contributionsData.reduce((sum, item) => sum + Number(item.amount), 0)
    : 0;

  const totalContributorsCount = contributionsData ? contributionsData.length : 0;

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(totalAmount);

  // Fetch active sponsors
  const { data: sponsors } = await supabase
    .from("sponsors")
    .select("*")
    .eq("is_active", true);

  const daysTimeline = [
    {
      id: "panchami",
      day: "Panchami",
      date: "15 Oct 2026",
      theme: "Agomoni & Stage Inauguration",
      highlights: "Anandamela Food Stalls, Lighting Ceremony, Opening Musical Night & Rabindra Sangeet.",
      icon: "🌟",
      tag: "Opening Day",
      pssHeadliner: null,
    },
    {
      id: "sashti",
      day: "Maha Sashti",
      date: "16 Oct 2026",
      theme: "Devi Bodhon & Retro Rock Gala",
      highlights: "Amantran & Adhibas Rituals, Evening Sandhya Aarti, Resident Dance Showcase.",
      icon: "🌺",
      tag: "Retro Rock Night",
      pssHeadliner: "🎸 Retro Rock by Fushmontor (08:15 PM • 1.5 Hrs)",
    },
    {
      id: "saptami",
      day: "Maha Saptami",
      date: "17 Oct 2026",
      theme: "Nabapatrika & Dance Drama",
      highlights: "Kola Bou Snan, Pushpanjali, Afternoon Maha Bhog, Resident Acoustic Band.",
      icon: "🌿",
      tag: "Dance Drama",
      pssHeadliner: "💃 Dance Drama Production by PSS (07:45 PM • 1.0 Hr)",
    },
    {
      id: "ashtami",
      day: "Maha Ashtami",
      date: "18 Oct 2026",
      theme: "Sandhi Pujo & Grand Drama",
      highlights: "Kumari Puja, 108 Lotuses Sandhi Aarti, Dhaak Jugalbandi Battle.",
      icon: "🪔",
      tag: "Grand Natok",
      pssHeadliner: "🎭 Grand Bangla Drama (Natok) by PSS (07:45 PM • 1.0 Hr)",
    },
    {
      id: "nabami",
      day: "Maha Nabami",
      date: "19 Oct 2026",
      theme: "Navami Havan & Grand Finale",
      highlights: "Maha Yajna, Grand Community Bhog Feast, Pratibimb Participant Awards & DJ Dandiya.",
      icon: "🔥",
      tag: "Grand Finale",
      pssHeadliner: null,
    },
    {
      id: "dashami",
      day: "Vijaya Dashami",
      date: "20 Oct 2026",
      theme: "Sindoor Khela & Immersion",
      highlights: "Devi Baran, Sindoor Khela, Dhunuchi Master Showcase, Shanti Jal & Visarjan Yatra.",
      icon: "🔴",
      tag: "Farewell & Shanti",
      pssHeadliner: null,
    },
  ];

  const popularSevaOfferings = [
    {
      title: "Sashti & Daily Flowers / Mala",
      amount: 501,
      description: "Sponsor fresh lotus, marigold garlands, and bilva patra for daily puja.",
      category: "Pushpanjali & Flowers",
      icon: "🌺",
    },
    {
      title: "Panchami & Sashti Sweets / Mishti",
      amount: 1501,
      description: "Traditional Bengali sweets, Sandesh & Rosogolla distribution for prasad.",
      category: "Sweets & Prasad",
      icon: "🍬",
    },
    {
      title: "Maha Bhog Family Seva",
      amount: 2501,
      description: "Full family sponsorship for afternoon Maha Bhog cooked in pure ghee.",
      category: "Maha Bhog",
      icon: "🍚",
    },
    {
      title: "Sandhi Pujo 108 Lotuses & Lamps",
      amount: 3100,
      description: "Auspicious offering of 108 red lotuses and 108 earthen lamps on Ashtami.",
      category: "Sandhi Pujo",
      icon: "🪔",
    },
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      
      {/* 1. HERO SECTION - LUXURY FESTIVE BANNER */}
      <section className="w-full bg-festive-hero text-white relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20">
        {/* Subtle Background Mandala Ornaments */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs md:text-sm font-semibold tracking-wide mb-6 backdrop-blur-md">
            <Sparkles size={15} className="text-amber-400" />
            <span>PBEL Sanskritik Samiti Presents</span>
            <span className="w-1 h-1 rounded-full bg-amber-400" />
            <span>Hyderabad</span>
          </div>

          {/* Main Title */}
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight drop-shadow-md">
            PBEL City <span className="text-gold-gradient">Durgotsav 2026</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-xl text-amber-100/90 max-w-3xl mx-auto mb-10 font-normal leading-relaxed">
            Welcome to the 6-day grand celebration of devotion, community bonding, mouth-watering Bhog, and 
            electrifying cultural evenings (<strong>Pratibimb</strong>) at PBEL City, Hyderabad.
          </p>

          {/* Key Event Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-10 text-xs md:text-sm">
            <div className="bg-black/30 backdrop-blur-md border border-amber-400/25 px-4 py-2 rounded-xl text-amber-200 flex items-center gap-2">
              <CalendarDays size={16} className="text-amber-400" />
              <span><strong>Dates:</strong> 15th – 20th Oct 2026 (Panchami to Dashami)</span>
            </div>
            <div className="bg-black/30 backdrop-blur-md border border-amber-400/25 px-4 py-2 rounded-xl text-amber-200 flex items-center gap-2">
              <MapPin size={16} className="text-amber-400" />
              <span><strong>Venue:</strong> PBEL City Main Ground, TSPA Junction</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link 
              href="/contribute" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#D99B26] to-[#B8801C] hover:from-[#B8801C] hover:to-[#966714] text-white px-8 py-3.5 rounded-full font-bold text-base transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 golden-glow"
            >
              <HeartHandshake size={20} />
              <span>Sponsor / E-Seva</span>
            </Link>
            <Link 
              href="/programs" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-full font-semibold text-base transition-all backdrop-blur-md"
            >
              <span>View Schedule</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. LIVE PUJO FUND COUNTER BAR */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-900/10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 tracking-wider uppercase">
              <Sparkles size={14} className="text-primary" />
              <span>Community Pujo Seva Fund (Live Verified)</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-4xl sm:text-5xl font-bold text-green-700">
                {formattedTotal}
              </span>
              <span className="text-xs text-gray-500 font-medium">Raised so far from {totalContributorsCount} devotee offerings</span>
            </div>
            <p className="text-xs text-gray-600">
              100% of resident contributions fund the Pujo rituals, daily Maha Bhog distribution, Dhaaki artists, and Pratibimb cultural stage.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
            <a
              href="#quick-contribute-section"
              className="bg-primary hover:bg-primary-hover text-white text-center py-3 px-6 rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <HeartHandshake size={16} />
              <span>Quick Offering Below</span>
            </a>
            <Link
              href="/volunteer"
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-center py-2.5 px-6 rounded-2xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Users size={14} />
              <span>Join Volunteer Seva Roster</span>
            </Link>
          </div>

        </div>

        {/* ZERO-FRICTION HOMEPAGE QUICK CONTRIBUTION CARD */}
        <div id="quick-contribute-section">
          <HomeQuickContribute />
        </div>
      </section>

      {/* 3. 6-DAY PUJO TIMELINE AT A GLANCE */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/60 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <CalendarDays size={14} /> Comprehensive Schedule
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl text-primary font-bold">
              6 Days of Devotion & Festivities
            </h2>
          </div>
          <Link 
            href="/programs" 
            className="inline-flex items-center gap-1.5 text-primary hover:text-primary-hover font-semibold text-sm mt-3 md:mt-0 group"
          >
            <span>View Full Pujo Nirghanto & Ritual Timings</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {daysTimeline.map((item) => (
            <Link
              key={item.id}
              href={`/programs?day=${item.id}`}
              className="bg-white rounded-3xl p-6 border border-amber-900/10 shadow-sm hover:shadow-xl hover:border-amber-400 hover:-translate-y-1 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-0.5 rounded-full uppercase">
                    {item.tag}
                  </span>
                </div>
                <div className="text-xs font-bold text-amber-700">{item.date}</div>
                <h3 className="font-heading text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
                  {item.day}
                </h3>
                <div className="text-sm font-semibold text-primary mb-3">{item.theme}</div>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">{item.highlights}</p>

                {/* Flagship Headliner Highlight Pill */}
                {item.pssHeadliner && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-2.5 rounded-xl border border-amber-300/80 text-[11px] font-bold text-amber-950 flex items-center gap-1.5 mb-2">
                    <Sparkles size={13} className="text-primary shrink-0" />
                    <span>{item.pssHeadliner}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1">
                  View {item.day} Schedule →
                </span>
                <span className="text-[11px] text-gray-400">
                  Tap to view
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. SEVA OFFERINGS & FIXED DONATION PACKAGES */}
      <section className="w-full bg-gradient-to-b from-[#FFFDF9] to-[#FDF8F0] py-16 px-4 sm:px-6 border-y border-amber-900/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/60 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <HeartHandshake size={14} /> E-Seva & Bhog Sponsorship
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl text-primary font-bold mb-3">
              Offer Your Seva for Maa Durga
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Choose from curated day-wise seva categories like Flowers, Sweets, Maha Bhog, and 108 Lotuses. 
              All contributions directly support the community pujo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {popularSevaOfferings.map((seva) => (
              <div 
                key={seva.title}
                className="bg-white rounded-2xl p-6 border border-amber-900/10 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mb-3">{seva.icon}</div>
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-1">{seva.title}</h3>
                  <div className="text-xs text-amber-700 font-semibold mb-3">{seva.category}</div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">{seva.description}</p>
                </div>

                <div>
                  <div className="text-2xl font-bold text-primary mb-3">₹{seva.amount}</div>
                  <Link
                    href={`/contribute?category=${encodeURIComponent(seva.title)}&amount=${seva.amount}`}
                    className="w-full block text-center bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-semibold text-xs transition shadow-xs"
                  >
                    Sponsor This Seva
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/contribute"
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-hover text-primary font-bold px-8 py-3.5 rounded-full transition shadow-md golden-glow text-sm"
            >
              <span>View All Seva Categories & Custom Contribution</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. PRATIBIMB CULTURAL EVENINGS & PARTICIPATION */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-br from-[#850E1F] to-[#5C0512] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden golden-border">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-amber-400/30">
              <Music size={14} /> Cultural Extravaganza
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Pratibimb 2026: The Cultural Stage
            </h2>
            <p className="text-amber-100/90 text-sm sm:text-base mb-8 leading-relaxed">
              Every evening from Panchami to Nabami, the PBEL City stage comes alive with resident performances:
              Rabindra Sangeet, classical & Bollywood dances, theater skits, and traditional Dhunuchi competitions.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/programs"
                className="bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold px-7 py-3 rounded-full text-sm transition shadow-lg flex items-center gap-2"
              >
                <Music size={17} />
                <span>Register Performance Slot</span>
              </Link>
              <Link
                href="/programs"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-full text-sm transition border border-white/20"
              >
                View Stage Line-Up
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CORPORATE SPONSORSHIP & PARTNER DECK */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-900/15 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/60 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                <Award size={14} /> Brand & Corporate Partnerships
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl text-gray-900 font-bold mb-3">
                Partner with PBEL City Durgotsav 2026
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                PBEL City is a premier residential township with <strong>1,500+ luxury apartments and 5,000+ residents</strong>. 
                We offer prime branding opportunities: LED stage backdrops, archway stalls, souvenir brochure inserts, 
                and social/WhatsApp reach.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold text-gray-800 mb-6">
                <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/50 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-amber-700" /> Title & Associate Tiers
                </div>
                <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/50 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-amber-700" /> Stall & Canopy Space
                </div>
                <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/50 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-amber-700" /> LED Screen Promos
                </div>
              </div>
            </div>

            {/* Sponsor Inquiry Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200/70 text-center flex flex-col justify-between">
              <div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-1">Corporate Deck</h3>
                <p className="text-xs text-gray-600 mb-4">Request the official 2026 Sponsorship Brochure.</p>
              </div>

              <div className="space-y-2.5">
                <a
                  href="mailto:raibatak@gmail.com?subject=PBEL City Durgotsav 2026 Sponsorship Inquiry"
                  className="w-full block bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-semibold text-xs transition shadow-xs"
                >
                  Contact Sponsorship Committee
                </a>
                <span className="text-[11px] text-gray-500 block">raibatak@gmail.com</span>
              </div>
            </div>

          </div>

          {/* Current Sponsors Grid */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-6 text-center">
              Our Esteemed Sponsors & Partners
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {sponsors && sponsors.length > 0 ? (
                sponsors.map((s) => (
                  <div key={s.id} className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center min-h-[100px] text-center">
                    <span className="font-bold text-sm text-gray-800">{s.name}</span>
                    <span className="text-[10px] text-amber-700 font-medium">{s.tier} Partner</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col items-center justify-center min-h-[90px] text-center">
                    <span className="text-gray-700 font-bold text-sm">Platinum Partner</span>
                    <span className="text-[11px] text-amber-700">Available</span>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col items-center justify-center min-h-[90px] text-center">
                    <span className="text-gray-700 font-bold text-sm">Gold Partner</span>
                    <span className="text-[11px] text-amber-700">Available</span>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col items-center justify-center min-h-[90px] text-center">
                    <span className="text-gray-700 font-bold text-sm">Food & Bhog Partner</span>
                    <span className="text-[11px] text-amber-700">Available</span>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col items-center justify-center min-h-[90px] text-center">
                    <span className="text-gray-700 font-bold text-sm">Cultural Stage Partner</span>
                    <span className="text-[11px] text-amber-700">Available</span>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 7. PHOTO GALLERY - GLIMPSES OF PUJO (CAROUSEL & LIGHTBOX) */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/60 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles size={14} /> Memories & Tradition
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl text-primary font-bold">
            Glimpses of Past Celebrations
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            Relive the divine moments, Dhaak beats, and cultural stages of PBEL City Durgotsav.
          </p>
        </div>

        <GalleryCarousel />
      </section>

      {/* 8. WALL OF CONTRIBUTORS */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl p-8 border border-amber-900/10 shadow-sm text-center">
          <h2 className="font-heading text-3xl text-primary font-bold mb-2">
            Honor Roll of Contributors
          </h2>
          <p className="text-gray-600 text-sm max-w-md mx-auto mb-8">
            Special gratitude to our community residents who have supported this year's Durgotsav!
          </p>

          <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto mb-8">
            {contributionsData && contributionsData.length > 0 ? (
              contributionsData.slice(0, 12).map((c, i) => (
                <span 
                  key={i}
                  className="bg-amber-50 text-amber-900 border border-amber-200/60 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5"
                >
                  <Sparkles size={12} className="text-amber-600" />
                  {c.is_name_visible ? c.contributor_name : "Well Wisher"}
                  {c.is_name_visible && c.flat_number && (
                    <span className="text-gray-400 font-normal">({c.flat_number})</span>
                  )}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-xs italic">
                Be the first to contribute and be featured on the Wall of Contributors!
              </span>
            )}
          </div>

          <Link
            href="/contribute"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold text-sm hover:underline"
          >
            <span>Join the Wall of Contributors</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 9. LUXURY FOOTER */}
      <footer className="w-full bg-[#1A0307] text-amber-100/80 pt-16 pb-24 md:pb-16 px-4 sm:px-6 lg:px-8 border-t border-amber-500/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-white/10">
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-gray-950 flex items-center justify-center font-heading font-bold text-sm">
                ॐ
              </div>
              <span className="font-heading text-xl font-bold text-white">PBEL City Durgotsav</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Organised by PBEL Sanskritik Samiti. Celebrating Bengali culture, heritage, and devotion with all residents.
            </p>
            <span className="inline-block bg-amber-400/10 text-amber-300 text-[11px] font-semibold px-3 py-1 rounded-full border border-amber-400/20">
              15 – 20 October 2026
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/programs" className="hover:text-amber-300 transition">Pujo Nirghanto (Rituals Schedule)</Link></li>
              <li><Link href="/programs" className="hover:text-amber-300 transition">Pratibimb Stage Registrations</Link></li>
              <li><Link href="/volunteer" className="hover:text-amber-300 transition">Volunteer Slots & Seva</Link></li>
              <li><Link href="/contribute" className="hover:text-amber-300 transition">E-Seva & Bhog Sponsorship</Link></li>
              <li><Link href="/admin" className="hover:text-amber-300 transition">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Venue & Contact</h4>
            <div className="space-y-2 text-xs text-gray-400">
              <p className="flex items-start gap-2">
                <MapPin size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <span>PBEL City Township, Near TSPA Junction, Peerancheru, Hyderabad, Telangana 500091</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={15} className="text-amber-400 shrink-0" />
                <span>raibatak@gmail.com</span>
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-6xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 PBEL Sanskritik Samiti. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with devotion by the PBEL City Community POD
          </p>
        </div>
      </footer>

    </div>
  );
}
