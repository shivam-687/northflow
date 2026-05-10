"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";
import { BottomNav } from "@/components/bottom-nav";
import { SidebarNav } from "@/components/sidebar-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, profile, fetchProfile, fetchGoals, fetchActivities, fetchTodayNeedleMover, fetchReflections } = useAppStore();

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (mounted) router.push("/auth");
        return;
      }
      setUser(user);
      await fetchProfile();
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        router.push("/auth");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, setUser, fetchProfile]);

  // Fetch data after profile is loaded
  useEffect(() => {
    if (!profile) return;
    fetchGoals();
    fetchActivities();
    fetchTodayNeedleMover();
    fetchReflections();
  }, [profile, fetchGoals, fetchActivities, fetchTodayNeedleMover, fetchReflections]);

  // Redirect based on profile completeness
  useEffect(() => {
    if (!profile) return;
    const isSetupPage = pathname === "/app/setup";
    const hasName = !!profile.name?.trim();

    if (!hasName && !isSetupPage) {
      router.replace("/app/setup");
    }
    if (hasName && isSetupPage) {
      router.replace("/app/today");
    }
  }, [profile, pathname, router]);

  return (
    <div className="min-h-full flex">
      {/* Desktop Sidebar — hidden on setup page */}
      {pathname !== "/app/setup" && <SidebarNav />}

      {/* Main Content Area */}
      <main className={`flex-1 min-h-full ${pathname !== "/app/setup" ? "md:ml-[220px]" : ""}`}>
        <div className="max-w-2xl mx-auto md:px-8 pb-24 md:pb-12">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav — hidden on setup page */}
      {pathname !== "/app/setup" && (
        <div className="md:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  );
}
