"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, BarChart3, Target, Settings } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { href: "/app/today", label: "Today", icon: CalendarDays },
  { href: "/app/week", label: "Week", icon: BarChart3 },
  { href: "/app/goal", label: "Goal", icon: Target },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
      <div className="max-w-lg mx-auto px-2 h-16 flex items-center justify-around safe-bottom">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center justify-center gap-1 w-16 h-full"
            >
              <div className="relative">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2 : 1.5}
                  className={
                    isActive ? "text-accent" : "text-text-disabled"
                  }
                />
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span
                className={`text-[10px] font-medium tracking-wide ${
                  isActive ? "text-accent" : "text-text-disabled"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
