"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, HeartHandshake, Users, Award } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Schedule", href: "/programs", icon: CalendarDays },
    { name: "Contribute", href: "/contribute", icon: HeartHandshake, isHighlight: true },
    { name: "Volunteer", href: "/volunteer", icon: Users },
    { name: "Sponsors", href: "/sponsors", icon: Award },
  ];

  return (
    <nav aria-label="Mobile Bottom Navigation" className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-amber-900/10 shadow-2xl lg:hidden z-50">
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname === item.href.split('#')[0]);
          const Icon = item.icon;

          if (item.isHighlight) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center relative -top-3 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#9E122C] to-[#D99B26] text-white flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-105 transition-transform">
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
                <Icon size={19} className={isActive ? "stroke-[2.5] text-primary" : "stroke-2"} />
              </div>
              <span className={`text-[10px] ${isActive ? "text-primary font-bold" : "font-medium"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
