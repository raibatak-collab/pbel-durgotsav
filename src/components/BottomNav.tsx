"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, CalendarDays, HeartHandshake, Utensils, ShieldCheck } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const session = localStorage.getItem("pbel_admin_session") || sessionStorage.getItem("pbel_admin_session");
      setIsAdminLoggedIn(!!session);
    } catch (_) {
      setIsAdminLoggedIn(false);
    }
  }, [pathname]);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Schedule", href: "/programs", icon: CalendarDays },
    { name: "Contribute", href: "/contribute", icon: HeartHandshake, isHighlight: true },
    { name: "Anandamela", href: "/anandamela", icon: Utensils },
    { name: "Admin", href: "/admin", icon: ShieldCheck, isAdmin: true },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-amber-900/10 shadow-2xl lg:hidden z-50">
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isHighlight) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center relative -top-3 group"
              >
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#9E122C] to-[#D99B26] text-white flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-105 transition-transform">
                  <Icon size={22} className="stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-primary mt-0.5">{item.name}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative ${
                isActive ? "text-primary font-semibold" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <div className="relative">
                <Icon size={19} className={isActive ? "stroke-[2.5] text-primary" : item.isAdmin && isAdminLoggedIn ? "text-amber-700 stroke-2" : "stroke-2"} />
                {item.isAdmin && isAdminLoggedIn && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] ${isActive ? "text-primary font-bold" : "font-medium"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
