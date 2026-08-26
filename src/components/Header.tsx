"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { HeartHandshake, Menu, X, Sparkles, Calendar, Users, ShieldCheck, MapPin, Lock, Award, Utensils, Compass } from "lucide-react";
import { usePathname } from "next/navigation";
import { getStoredBranding, SamitiBrandingConfig, DEFAULT_BRANDING } from "@/config/branding";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggedInAdmin, setLoggedInAdmin] = useState<any>(null);
  const [customAnnouncement, setCustomAnnouncement] = useState<string>("");
  const [branding, setBranding] = useState<SamitiBrandingConfig>(DEFAULT_BRANDING);
  const pathname = usePathname();

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

  const navLinks = [
    { name: "Home", href: "/", icon: Sparkles },
    { name: "Pujo Schedule", href: "/programs", icon: Calendar },
    { name: "Anandamela", href: "/anandamela", icon: Utensils },
    { name: "Pandal Guide", href: "/guide", icon: Compass },
    { name: "Organizing Committee", href: "/committee", icon: Users },
    { name: "Volunteer Seva", href: "/volunteer", icon: HeartHandshake },
    { name: "Corporate Sponsors", href: "/sponsors", icon: Award },
    { name: "Contribute & E-Seva", href: "/contribute", icon: HeartHandshake },
    { name: "Admin Portal", href: "/admin", icon: ShieldCheck },
  ];

  return (
    <>
      {/* Top Notification Announcement Bar with Dynamic Content */}
      <div className="bg-gradient-to-r from-[#5E0A16] via-[#850E1F] to-[#5E0A16] text-[#FDE68A] text-xs font-medium py-1.5 px-4 text-center border-b border-amber-500/20 shadow-inner flex items-center justify-between sm:justify-center gap-2">
        <div className="flex items-center gap-1.5 mx-auto">
          <Sparkles size={13} className="text-amber-400 animate-pulse" />
          <span>{customAnnouncement || "PBEL City Durgotsav 2026 • 15th to 20th October (Panchami to Dashami)"}</span>
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

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#9E122C] to-[#5C0512] flex items-center justify-center shadow-md border border-amber-400/30 group-hover:scale-105 transition-transform">
                <span className="font-heading text-xl text-[#FDE68A] font-bold">ॐ</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl md:text-2xl font-bold tracking-tight text-primary leading-tight">
                  PBEL City Durgotsav
                </span>
                <span className="text-[11px] text-gray-500 font-medium tracking-wide flex items-center gap-1">
                  PBEL Sanskritik Samiti <span className="text-amber-600 font-semibold">• 2026</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const isSpecialAdmin = link.href === "/admin";
                
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-primary-light text-primary font-semibold shadow-xs"
                        : isSpecialAdmin && loggedInAdmin
                        ? "bg-amber-100/80 text-amber-950 hover:bg-amber-200/80 font-bold border border-amber-300"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    {isSpecialAdmin && loggedInAdmin && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/contribute"
                className="flex items-center gap-2 bg-gradient-to-r from-[#D99B26] to-[#B8801C] hover:from-[#B8801C] hover:to-[#966714] text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 golden-glow"
              >
                <HeartHandshake size={17} />
                <span>Contribute / E-Seva</span>
              </Link>
            </div>

            {/* Mobile Header Controls */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                href="/contribute"
                className="bg-gradient-to-r from-[#D99B26] to-[#B8801C] text-white text-xs px-3.5 py-2 rounded-full font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <HeartHandshake size={14} />
                <span>Contribute</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-primary hover:bg-gray-100 rounded-xl transition"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-amber-900/15 shadow-xl px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-3 duration-200">
            <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider px-3 pt-2 pb-1">
              Navigation Menu
            </div>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              const isSpecialAdmin = link.href === "/admin";

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-primary text-white font-semibold shadow-sm"
                      : isSpecialAdmin && loggedInAdmin
                      ? "bg-amber-100 text-amber-950 font-bold border border-amber-300"
                      : "text-gray-700 hover:bg-amber-50/60 hover:text-primary"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-amber-300" : isSpecialAdmin && loggedInAdmin ? "text-green-600" : "text-amber-700"} />
                  <span>{link.name}</span>
                  {isSpecialAdmin && loggedInAdmin && (
                    <span className="ml-auto text-[10px] bg-green-200 text-green-900 font-bold px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 px-3">
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-primary" /> PBEL City, Hyderabad
              </span>
              <span className="text-amber-700 font-semibold">Oct 15 - 20, 2026</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
