"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, BarChart3, Target, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";

const navItems = [
  { href: "/app/today", label: "Today", icon: CalendarDays },
  { href: "/app/week", label: "Week", icon: BarChart3 },
  { href: "/app/goal", label: "Goal", icon: Target },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { profile } = useAppStore();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] border-r border-border bg-surface/50 hidden md:flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/app/today" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
            <span className="text-[13px] font-bold text-accent">N</span>
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-text-primary">
            NorthFlow
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                isActive
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-elevated rounded-xl border border-border"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2 : 1.5}
                  className={isActive ? "text-accent" : ""}
                />
              </span>
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-elevated border border-border flex items-center justify-center overflow-hidden shrink-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[12px] font-medium text-text-secondary">
                {(profile?.name || "U")[0].toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-text-primary truncate">
              {profile?.name || "Set your name"}
            </p>
            <p className="text-[11px] text-text-disabled truncate">
              {profile?.email || ""}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
