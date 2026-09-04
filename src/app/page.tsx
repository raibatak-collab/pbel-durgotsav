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
  Share2,
  Utensils,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { TowerParticipation } from "@/components/TowerParticipation";
import { FestiveHero } from "@/components/FestiveHero";
import { SponsorLogoCarousel } from "@/components/SponsorLogoCarousel";
import { WallOfContributors } from "@/components/WallOfContributors";
import { SiteHighlightModal } from "@/components/SiteHighlightModal";
import { fetchCloudConfig } from "@/utils/cloudConfig";
import { DEFAULT_PUJO_SCHEDULE, DaySchedule } from "@/config/schedule";

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

  // Fetch PSS members to aggregate member family contributions (₹7,500 per family) if enabled by Admin
  const includeMemberContributions = await fetchCloudConfig<boolean>("include_member_contributions", true);
  let memberSubscriptionTotal = 0;
  let memberFamiliesCount = 0;

  if (includeMemberContributions) {
    try {
      const pssMembers = await fetchCloudConfig<any[]>("pss_members", []);
      if (pssMembers && Array.isArray(pssMembers)) {
        memberFamiliesCount = pssMembers.length;
        memberSubscriptionTotal = pssMembers.reduce(
          (sum: number, m: any) => sum + (Number(m.membershipFee) || 7500),
          0
        );
      }
    } catch (err) {
      console.error("Error fetching member config:", err);
    }
  }

  const combinedTotal = totalAmount + memberSubscriptionTotal;
  const combinedContributorsCount = totalContributorsCount + memberFamiliesCount;

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(combinedTotal);

  // Fetch active sponsors
  const { data: sponsors } = await supabase
    .from("sponsors")
    .select("*")
    .eq("is_active", true);

  // 1. DYNAMIC 6-DAY PUJO SCHEDULE FROM CLOUD CONFIG (EDITABLE VIA ADMIN)
  const cloudSchedule = await fetchCloudConfig<DaySchedule[]>("schedule_days", DEFAULT_PUJO_SCHEDULE);

  const daysTimeline = (cloudSchedule && cloudSchedule.length > 0 ? cloudSchedule : DEFAULT_PUJO_SCHEDULE).map((d) => {
    const icon = d.id === "panchami" ? "🌟" : d.id === "sashti" ? "🌺" : d.id === "saptami" ? "🌿" : d.id === "ashtami" ? "🪔" : d.id === "nabami" ? "🔥" : "🔴";
    const ritualHighlights = d.rituals && d.rituals.length > 0 ? d.rituals.slice(0, 3).map((r) => r.event).join(", ") : "";

    return {
      id: d.id,
      day: d.dayName || (d.id === "sashti" ? "Maha Sashti" : d.id === "saptami" ? "Maha Saptami" : d.id === "ashtami" ? "Maha Ashtami" : d.id === "nabami" ? "Maha Nabami" : d.id === "dashami" ? "Vijaya Dashami" : "Maha Panchami"),
      date: d.date || "15 - 20 Oct 2026",
      theme: d.theme || d.culturalEvening?.title || "Devotion, Rituals & Aarti",
      highlights: d.culturalEvening?.description || ritualHighlights || "Vedic rituals, Pushpanjali, Aarti, and evening cultural performances.",
      icon: icon,
      tag: d.culturalEvening?.pssHeadliner?.title ? "Headliner Night" : d.bengaliName || d.dayName || "Pujo Day",
      pssHeadliner: d.culturalEvening?.pssHeadliner?.title
        ? `${d.culturalEvening.pssHeadliner.title} (${d.culturalEvening.pssHeadliner.time || ""})`
        : null,
    };
  });

  // 2. DYNAMIC E-SEVA CATEGORIES FROM SUPABASE DATABASE (EDITABLE VIA ADMIN)
  const { data: dbCategories } = await supabase
    .from("contribution_categories")
    .select("*")
    .order("created_at", { ascending: true });

  let popularSevaOfferings: any[] = [];

  if (dbCategories && dbCategories.length > 0) {
    const decodeDesc = (desc?: string) => {
      const str = desc || "";
      const featuredMatch = str.match(/\[featured:(true|false)\]/);
      const statusMatch = str.match(/\[status:(active|inactive)\]/);
      const cleanDesc = str
        .replace(/\[limit:\d+\]/g, "")
        .replace(/\[status:(active|inactive)\]/g, "")
        .replace(/\[featured:(true|false)\]/g, "")
        .trim();
      return {
        cleanDesc,
        isFeatured: featuredMatch ? featuredMatch[1] === "true" : false,
        isActive: statusMatch ? statusMatch[1] === "active" : true,
      };
    };

    const valid = dbCategories.filter((c) => c.name !== "General Pujo Fund");
    const featured = valid.filter((c) => {
      const d = decodeDesc(c.description);
      return d.isFeatured && d.isActive;
    });

    const pool = featured.length > 0 ? featured : valid;

    popularSevaOfferings = pool.slice(0, 4).map((c) => {
      const d = decodeDesc(c.description);
      const titleLower = c.name.toLowerCase();
      let icon = "🌺";
      let category = "Pujo Seva";
      if (titleLower.includes("bhog") || titleLower.includes("prasad") || titleLower.includes("khichuri")) {
        icon = "🍚";
        category = "Maha Bhog & Prasad";
      } else if (titleLower.includes("sweet") || titleLower.includes("mishti")) {
        icon = "🍬";
        category = "Sweets & Mishti";
      } else if (titleLower.includes("sandhi") || titleLower.includes("lamp") || titleLower.includes("deepam")) {
        icon = "🪔";
        category = "Sandhi Pujo";
      } else if (titleLower.includes("lotus") || titleLower.includes("pushpanjali") || titleLower.includes("flower") || titleLower.includes("mala")) {
        icon = "🪷";
        category = "Flowers & Pushpanjali";
      } else if (titleLower.includes("homa") || titleLower.includes("havan") || titleLower.includes("yajna")) {
        icon = "🔥";
        category = "Maha Yajna";
      }

      return {
        id: c.id,
        title: c.name,
        amount: c.fixed_amount ? Number(c.fixed_amount) : 1001,
        description: d.cleanDesc || "Special devotional offering for PBEL City Durgotsav.",
        category: category,
        icon: icon,
      };
    });
  }

  // Fallback to cloud config if database table is empty
  if (popularSevaOfferings.length === 0) {
    popularSevaOfferings = await fetchCloudConfig<any[]>("featured_sevas", []);
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      {/* Dynamic Pop-up Highlight (Path Alpona / Breaking Announcements) */}
      <SiteHighlightModal />
      
      {/* 1. DYNAMIC FESTIVE HERO SECTION (Self-Service Branding, Wallpapers & Top Sponsor Ribbon) */}
      <FestiveHero sponsors={sponsors} />

      {/* 2. LIVE PUJO FUND COUNTER BAR */}
      <section className="w-full max-w-6xl mx-auto px-3 sm:px-6 -mt-4 relative z-20 space-y-6 box-border min-w-0">
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
              <span className="text-xs text-gray-500 font-medium">Raised so far from {combinedContributorsCount} resident offerings</span>
            </div>
            <p className="text-xs text-gray-600">
              100% of resident contributions fund the Pujo rituals, daily Maha Bhog distribution, Dhaaki artists, and Pratibimb cultural stage.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
            <Link
              href="/contribute"
              className="bg-primary hover:bg-primary-hover text-white text-center py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <HeartHandshake size={16} />
              <span>Offer Pujo Seva (UPI / QR) →</span>
            </Link>
            <Link
              href="/volunteer"
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-center py-2.5 px-6 rounded-2xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Users size={14} />
              <span>Join Volunteer Seva Roster</span>
            </Link>
          </div>

        </div>

        {/* PROMINENT TOWER-WISE PARTICIPATION & DEVOTIONAL SOLIDARITY */}
        <div className="pt-2">
          <TowerParticipation />
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
                      href={`/contribute?tab=general&amount=${seva.amount}&purpose=${encodeURIComponent(seva.title)}`}
                      className="w-full block text-center bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>Sponsor Seva (₹{seva.amount}) →</span>
                    </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-center">
            <Link
              href="/contribute?tab=general"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D99B26] to-[#B8801C] hover:from-[#B8801C] text-white font-bold px-7 py-3.5 rounded-full transition shadow-md golden-glow text-sm"
            >
              <HeartHandshake size={17} />
              <span>General Contribution (Any Amount)</span>
            </Link>
            <Link
              href="/contribute?tab=catalog"
              className="inline-flex items-center gap-2 bg-white hover:bg-amber-50 text-gray-900 border border-amber-300 font-bold px-7 py-3.5 rounded-full transition shadow-sm text-sm"
            >
              <Sparkles size={17} className="text-primary" />
              <span>Explore All Specific Seva Packages</span>
              <ArrowRight size={16} />
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
                <span>Explore Stage Schedule &amp; Line-Up →</span>
              </Link>
              <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-200 border border-amber-400/30 text-xs font-semibold px-4 py-2.5 rounded-full backdrop-blur-xs">
                <span>⏳ Slot Registrations Opening Soon</span>
              </span>
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

            {/* Sponsor Action Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200/70 text-center flex flex-col justify-between">
              <div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-1">Corporate Deck</h3>
                <p className="text-xs text-gray-600 mb-4">Download the official 2026 Sponsorship Brochure & explore tiers.</p>
              </div>

              <div className="space-y-2.5">
                <Link
                  href="/sponsors"
                  className="w-full block bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold text-xs transition shadow-xs"
                >
                  Explore Packages & Inquire Online
                </Link>
                <a
                  href="/docs/PBEL_Durgotsav_2026_Sponsorship_Deck.pdf"
                  download
                  className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-amber-100/60 text-amber-900 border border-amber-300 py-2 rounded-xl font-semibold text-xs transition"
                >
                  <Award size={13} />
                  <span>Download Deck (PDF)</span>
                </a>
              </div>
            </div>

          </div>

          {/* Current Sponsors & Partner Brand Logos */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                Our Esteemed Sponsors &amp; Corporate Partners
              </h3>
              <Link href="/sponsors" className="text-xs text-primary font-bold hover:underline">
                View All Partnership Tiers →
              </Link>
            </div>
            
            <SponsorLogoCarousel sponsors={sponsors} />
          </div>

        </div>
      </section>

      {/* 6.8 PBEL SANSKRITIK SAMITI ORGANIZING COMMITTEE SPOTLIGHT */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FFF8ED] to-[#FFF4DF] rounded-3xl p-6 sm:p-10 border-2 border-amber-300 shadow-md relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
                <Users size={13} className="text-primary" />
                <span>PBEL Sanskritik Samiti (PSS) • Core Organizing Wings</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                Dedicated Resident Leadership Behind Durgotsav 2026
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Durga Pujo at PBEL City is organized by dedicated resident volunteer wings across Executive Leadership, 
                Cultural Directorate, Pure Ghee Maha Bhog Kitchen, Vedic Rites &amp; Pandal Production.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <Link
                href="/committee"
                className="bg-primary hover:bg-primary-hover text-white text-center py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 golden-glow"
              >
                <Users size={16} />
                <span>Meet the Organizing Wings →</span>
              </Link>
              <Link
                href="/volunteer"
                className="bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 text-center py-2.5 px-6 rounded-2xl font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <HeartHandshake size={14} />
                <span>Join Volunteer Seva Team</span>
              </Link>
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

        {/* Sleek 3-Card Spotlight Teaser linking to Full Gallery & YouTube */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {/* Card 1: Divine Pratima & Rituals */}
          <Link
            href="/gallery"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#850E1F]/90 via-[#610815]/95 to-[#2A0208] p-6 text-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[210px] border border-amber-500/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">🌺</span>
              <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                Traditional Ekchala
              </span>
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-amber-100 group-hover:text-amber-300 transition">
                Maa Durga Pratima Darshan
              </h3>
              <p className="text-xs text-amber-200/70 mt-1">
                Sacred Bodhon, Sandhi Pujo 108 Deepam, Pushpanjali &amp; Aarti
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <span>View Photo Albums</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition" />
              </div>
            </div>
          </Link>

          {/* Card 2: Pratibimb Cultural Stage */}
          <Link
            href="/gallery"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#D99B26]/90 via-[#B8801C]/95 to-[#6E4907] p-6 text-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[210px] border border-amber-400/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">🎭</span>
              <span className="text-[10px] font-bold bg-white/20 text-white border border-white/30 px-2.5 py-0.5 rounded-full">
                Pratibimb Stage
              </span>
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white group-hover:text-amber-100 transition">
                Cultural Evenings &amp; Natok
              </h3>
              <p className="text-xs text-amber-100/80 mt-1">
                Dance dramas, community choir, musical nights &amp; resident performances
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-white">
                <span>Browse Stage Moments</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition" />
              </div>
            </div>
          </Link>

          {/* Card 3: Official YouTube Channel */}
          <a
            href="https://www.youtube.com/@pbelsanskritiksamiti-offic3003"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#B81932]/90 via-[#850E1F]/95 to-[#3B0009] p-6 text-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[210px] border border-red-500/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">🎥</span>
              <span className="text-[10px] font-bold bg-red-500/40 text-red-200 border border-red-400/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                Official Channel
              </span>
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-amber-100 group-hover:text-amber-300 transition">
                Video Highlights &amp; Streams
              </h3>
              <p className="text-xs text-amber-200/70 mt-1">
                Watch Dhaaki beats, Aarti live streams, and past cultural showcases
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <span>Watch on YouTube</span>
                <ExternalLink size={13} className="group-hover:translate-x-1 transition" />
              </div>
            </div>
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-7 py-3 rounded-full text-xs sm:text-sm transition shadow-md golden-glow"
          >
            <Sparkles size={16} />
            <span>Explore Full Photo &amp; Video Gallery →</span>
          </Link>
          <a
            href="https://www.youtube.com/@pbelsanskritiksamiti-offic3003"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition shadow-md"
          >
            <span>Watch on Official YouTube ↗</span>
          </a>
        </div>
      </section>

      {/* 8. WALL OF CONTRIBUTORS */}
      <WallOfContributors contributors={contributionsData || []} />

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
              <li><Link href="/programs" className="hover:text-amber-300 transition">Pujo Nirghanto &amp; Rituals Schedule</Link></li>
              <li><Link href="/programs#register-performance" className="hover:text-amber-300 transition">Pratibimb Stage Registrations</Link></li>
              <li><Link href="/volunteer" className="hover:text-amber-300 transition">Volunteer Slots &amp; Kitchen Seva</Link></li>
              <li><Link href="/contribute" className="hover:text-amber-300 transition">E-Seva &amp; Bhog Sponsorship</Link></li>
              <li><Link href="/sponsors" className="hover:text-amber-300 transition">Corporate Brand Sponsorships</Link></li>
              <li><Link href="/committee" className="hover:text-amber-300 transition">Organizing Committee</Link></li>
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
                <span>pbelsanskritiksamiti@gmail.com</span>
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
