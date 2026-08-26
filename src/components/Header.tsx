"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  HeartHandshake, 
  Menu, 
  X, 
  Sparkles, 
  Calendar, 
  Users, 
  ShieldCheck, 
  MapPin, 
  Award, 
  Utensils, 
  Compass,
  ChevronDown
} from "lucide-react";
import { usePathname } from "next/navigation";
import { getStoredBranding, SamitiBrandingConfig, DEFAULT_BRANDING } from "@/config/branding";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [loggedInAdmin, setLoggedInAdmin] = useState<any>(null);
  const [customAnnouncement, setCustomAnnouncement] = useState<string>("");
  const [branding, setBranding] = useState<SamitiBrandingConfig>(DEFAULT_BRANDING);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check if admin is currently logged in on this browser & load announcement & branding
  useEffect(() => {
    try {
      setBranding(getStoredBranding());

      const handleBrandingUpdate = () => {
        setBranding(getStoredBranding());
      };
      window.addEventListener("pbel_branding_updated", handleBrandingUpdate);

      const savedAnnounce = localStorage.getItem("pbel_pujo_announcement");
      if (savedAnnounce) {
        setCustomAnnouncement(savedAnnounce);
      } else {
        setCustomAnnouncement("PBEL City Durgotsav 2026 • 15th to 20th October (Panchami to Dashami)");
      }

      const session = localStorage.getItem("pbel_admin_session") || sessionStorage.getItem("pbel_admin_session");
      if (session) {
        setLoggedInAdmin(JSON.parse(session));
      } else {
        setLoggedInAdmin(null);
      }

      return () => {
        window.removeEventListener("pbel_branding_updated", handleBrandingUpdate);
      };
    } catch (_) {
      setLoggedInAdmin(null);
    }
  }, [pathname]);

  // Primary High-Frequency Desktop Links
  const primaryLinks = [
    { name: "Home", href: "/", icon: Sparkles },
    { name: "Pujo Schedule", href: "/programs", icon: Calendar },
    { name: "Anandamela", href: "/anandamela", icon: Utensils },
  ];

  // Secondary Links for Accessible "More ▾" Dropdown
  const moreLinks = [
    { name: "Pandal & Facilities Guide", href: "/guide", icon: Compass, desc: "Pandal map, emergency contacts & zones" },
    { name: "Organizing Committee", href: "/committee", icon: Users, desc: "Executive wings, leads & volunteer teams" },
    { name: "Volunteer Seva", href: "/volunteer", icon: HeartHandshake, desc: "Join kitchen, crowd or stage seva shifts" },
    { name: "Corporate Sponsors", href: "/sponsors", icon: Award, desc: "Brand partnerships & 25MB official brochure" },
    { name: "Admin Portal", href: "/admin", icon: ShieldCheck, desc: "Committee CRM, budget, tickets & branding", isSpecial: true },
  ];

  return (
    <>
      {/* Top Notification Announcement Bar with Dynamic Content */}
      <div className="bg-gradient-to-r from-[#5E0A16] via-[#850E1F] to-[#5E0A16] text-[#FDE68A] text-xs font-medium py-1.5 px-4 text-center border-b border-amber-500/20 shadow-inner flex items-center justify-between sm:justify-center gap-2">
        <div className="flex items-center gap-1.5 mx-auto">
          <Sparkles size={13} className="text-amber-400 animate-pulse" />
          <span className="truncate max-w-[280px] sm:max-w-none">
            {customAnnouncement || "PBEL City Durgotsav 2026 • 15th to 20th October (Panchami to Dashami)"}
          </span>
          <span className="hidden sm:inline bg-amber-400/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
            Hyderabad
          </span>
        </div>

        {/* Quick Admin Return Link if Authenticated */}
        {loggedInAdmin && pathname !== "/admin" && (
          <Link
            href="/admin"
            className="shrink-0 bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 transition animate-pulse"
            title="Return to Admin Control Center"
          >
            <ShieldCheck size={11} className="text-amber-300" />
            <span>Admin Active</span>
          </Link>
        )}
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              {branding.pssLogoUrl || branding.durgotsavLogoUrl ? (
                <img
                  src={branding.pssLogoUrl || branding.durgotsavLogoUrl}
                  alt="PBEL Durgotsav Logo"
                  className="w-11 h-11 rounded-2xl object-cover shadow-md border border-amber-400/40 group-hover:scale-105 transition-transform bg-white"
                />
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#9E122C] to-[#5C0512] flex items-center justify-center shadow-md border border-amber-400/30 group-hover:scale-105 transition-transform">
                  <span className="font-heading text-xl text-[#FDE68A] font-bold">ॐ</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-primary leading-tight">
                  {branding.festivalName || "PBEL City Durgotsav"}
                </span>
                <span className="text-[11px] text-gray-500 font-medium tracking-wide flex items-center gap-1">
                  {branding.samitiName || "PBEL Sanskritik Samiti"} <span className="text-amber-600 font-semibold">• 2026</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation: Clutter-Free Primary Links + More Dropdown */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {primaryLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-primary-light text-primary font-semibold shadow-xs"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={15} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              {/* Accessible "Explore More ▾" Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                    moreLinks.some((l) => pathname === l.href)
                      ? "bg-primary-light text-primary font-semibold"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  <span>Explore More</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${moreDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl py-2 z-50 animate-fadeIn">
                    {moreLinks.map((link) => {
                      const isActive = pathname === link.href;
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setMoreDropdownOpen(false)}
                          className={`px-4 py-2.5 flex items-start gap-3 transition hover:bg-amber-50/60 ${
                            isActive ? "bg-amber-50/80 text-primary font-bold" : "text-gray-800"
                          }`}
                        >
                          <div className="p-1.5 rounded-lg bg-amber-100 text-primary mt-0.5">
                            <Icon size={15} />
                          </div>
                          <div>
                            <span className="text-xs font-bold block">{link.name}</span>
                            <span className="text-[10px] text-gray-500 line-clamp-1">{link.desc}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* Desktop Golden CTA Button */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/contribute"
                className="flex items-center gap-2 bg-gradient-to-r from-[#D99B26] to-[#B8801C] hover:from-[#B8801C] hover:to-[#966714] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 golden-glow"
              >
                <HeartHandshake size={17} />
                <span>Contribute / E-Seva</span>
              </Link>
            </div>

            {/* Mobile Header Controls */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                href="/contribute"
                className="bg-gradient-to-r from-[#D99B26] to-[#B8801C] text-white text-xs px-3.5 py-2 rounded-full font-bold flex items-center gap-1.5 shadow-sm"
              >
                <HeartHandshake size={14} />
                <span>E-Seva</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-primary hover:bg-gray-100 rounded-xl transition"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Fullscreen Slide-Down Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 shadow-xl px-4 pt-3 pb-6 space-y-2 animate-fadeIn max-h-[80vh] overflow-y-auto">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 pb-1">
              Festive Navigation
            </div>

            {primaryLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                    isActive ? "bg-primary-light text-primary" : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={18} className="text-primary" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">
              Community &amp; Services
            </div>

            {moreLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                    isActive ? "bg-primary-light text-primary" : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={18} className="text-primary" />
                  <div>
                    <span>{link.name}</span>
                    <span className="block text-[10px] text-gray-500 font-normal">{link.desc}</span>
                  </div>
                </Link>
              );
            })}

            <div className="pt-3">
              <Link
                href="/contribute"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D99B26] to-[#B8801C] text-white py-3 rounded-2xl font-bold text-sm shadow-md"
              >
                <HeartHandshake size={18} />
                <span>Sponsor Seva Offering / Contribute</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
