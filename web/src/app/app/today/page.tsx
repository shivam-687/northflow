"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { ActivityTag } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, Plus, Target } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

/* ─── Helpers ─── */
function formatDate() {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getTagDotColor(tag: ActivityTag) {
  switch (tag) {
    case "goal":
      return "bg-[#8B5CF6]";
    case "learning":
      return "bg-[#22C55E]";
    case "admin":
      return "bg-[#6B7280]";
    case "noise":
      return "bg-[#F59E0B]";
  }
}

/* ─── Activity Timeline Item ─── */
function ActivityItem({
  activity,
  index,
}: {
  activity: { id: string; content: string; tag: ActivityTag; created_at: string };
  index: number;
}) {
  const date = new Date(activity.created_at);
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="group flex gap-4 py-4"
    >
      {/* Dot */}
      <div className="flex flex-col items-center pt-1.5">
        <div className={`w-2 h-2 rounded-full ${getTagDotColor(activity.tag)}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] text-text-primary leading-relaxed mb-1">
          {activity.content}
        </p>
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] text-text-disabled tracking-wide"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            {timeStr}
          </span>
          <span
            className="text-[10px] font-medium tracking-[0.06em] uppercase text-text-disabled/70"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            {activity.tag}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function TodayPage() {
  const {
    profile,
    activeGoal,
    activities,
    todayNeedleMover,
    addActivity,
    setNeedleMover,
    markNeedleMoverDone,
    carryNeedleMover,
  } = useAppStore();

  const [activityInput, setActivityInput] = useState("");
  const [selectedTag, setSelectedTag] = useState<ActivityTag>("goal");
  const [needleInput, setNeedleInput] = useState("");
  const [showNeedleInput, setShowNeedleInput] = useState(!todayNeedleMover);

  const tags: ActivityTag[] = ["goal", "learning", "admin", "noise"];

  const handleAddActivity = async () => {
    if (!activityInput.trim()) return;
    await addActivity(activityInput.trim(), selectedTag);
    setActivityInput("");
  };

  const handleSetNeedleMover = async () => {
    if (!needleInput.trim()) return;
    await setNeedleMover(needleInput.trim());
    setShowNeedleInput(false);
    setNeedleInput("");
  };

  const firstName = profile?.name?.split(" ")[0] || "there";

  return (
    <div className="min-h-full px-5 md:px-0 pt-8 pb-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        {/* ═══════════════════════════════════════
            1. HEADER
           ═══════════════════════════════════════ */}
        <motion.header variants={fadeUp} custom={0} className="mb-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[13px] text-text-secondary mb-1">
                {getGreeting()}
              </p>
              <h1 className="text-[28px] font-semibold tracking-tight text-text-primary">
                {firstName}
              </h1>
            </div>
            <p
              className="text-[11px] text-text-disabled tracking-wide pb-1"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              {formatDate()}
            </p>
          </div>
        </motion.header>

        {/* ═══════════════════════════════════════
            2. CURRENT GOAL — Typography only
           ═══════════════════════════════════════ */}
        <motion.section variants={fadeUp} custom={1} className="mb-8">
          {activeGoal ? (
            <div>
              <span
                className="text-[11px] font-medium tracking-[0.1em] uppercase text-text-disabled block mb-2"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                Current Goal
              </span>
              <p className="text-[20px] font-medium text-text-primary leading-snug mb-1.5">
                {activeGoal.title}
              </p>
              <p className="text-[13px] text-text-secondary">
                Goal-aligned this week
              </p>
            </div>
          ) : (
            <EmptyGoalState />
          )}
        </motion.section>

        {/* ═══════════════════════════════════════
            3. NEEDLE-MOVER — The ONLY elevated card
           ═══════════════════════════════════════ */}
        <motion.section variants={fadeUp} custom={2} className="mb-10">
          {todayNeedleMover && !showNeedleInput ? (
            <div className="p-6 rounded-[20px] bg-elevated border border-border nf-shadow">
              <span
                className="text-[11px] font-medium tracking-[0.1em] uppercase text-text-disabled block mb-3"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                Today&apos;s Needle-Mover
              </span>

              <p className="text-[18px] font-medium text-text-primary leading-snug mb-6">
                {todayNeedleMover.content}
              </p>

              {todayNeedleMover.status === "pending" ? (
                <div className="flex gap-3">
                  <button
                    onClick={markNeedleMoverDone}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-border text-[13px] font-medium text-text-primary hover:bg-surface/80 transition-colors"
                  >
                    <Check size={14} />
                    Done
                  </button>
                  <button
                    onClick={carryNeedleMover}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Carry Forward
                  </button>
                </div>
              ) : (
                <p
                  className={`text-[13px] font-medium ${
                    todayNeedleMover.status === "done"
                      ? "text-[#22C55E]"
                      : "text-[#F59E0B]"
                  }`}
                >
                  {todayNeedleMover.status === "done"
                    ? "Completed"
                    : "Carried forward"}
                </p>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-[20px] bg-elevated border border-border nf-shadow">
              <span
                className="text-[11px] font-medium tracking-[0.1em] uppercase text-text-disabled block mb-3"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                Today&apos;s Needle-Mover
              </span>
              <input
                type="text"
                placeholder="What would make today feel meaningful?"
                value={needleInput}
                onChange={(e) => setNeedleInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSetNeedleMover()}
                className="w-full px-4 py-3.5 rounded-xl bg-surface border border-border text-[15px] text-text-primary placeholder-text-disabled focus:border-[#8B5CF6]/40 focus:outline-none transition-colors mb-4"
              />
              <button
                onClick={handleSetNeedleMover}
                className="px-5 py-2.5 rounded-xl bg-[#8B5CF6] text-white text-[13px] font-medium hover:brightness-110 transition-all"
              >
                Set Focus
              </button>
            </div>
          )}
        </motion.section>

        {/* ═══════════════════════════════════════
            4. QUICK ADD — Frictionless, conversational
           ═══════════════════════════════════════ */}
        <motion.section variants={fadeUp} custom={3} className="mb-10">
          <div className="flex gap-2 mb-3">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium tracking-wide uppercase transition-all ${
                  selectedTag === tag
                    ? "bg-surface text-text-primary border border-border"
                    : "text-text-disabled hover:text-text-secondary"
                }`}
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="What did you work on?"
              value={activityInput}
              onChange={(e) => setActivityInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddActivity()}
              className="w-full px-4 py-3.5 pr-12 rounded-xl bg-transparent border border-border text-[15px] text-text-primary placeholder-text-disabled focus:border-[#8B5CF6]/40 focus:outline-none transition-colors"
            />
            <button
              onClick={handleAddActivity}
              disabled={!activityInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-text-disabled hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════
            5. TIMELINE — Journal-like, airy
           ═══════════════════════════════════════ */}
        <motion.section variants={fadeUp} custom={4} className="mb-10">
          <span
            className="text-[11px] font-medium tracking-[0.1em] uppercase text-text-disabled block mb-4"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            Today
          </span>

          {activities.length === 0 ? (
            <p className="text-[14px] text-text-disabled italic py-4">
              No pressure. Log one thing when you&apos;re ready.
            </p>
          ) : (
            <div className="divide-y divide-border/40">
              {activities.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  index={index}
                />
              ))}
            </div>
          )}
        </motion.section>

        {/* ═══════════════════════════════════════
            6. REFLECTION PROMPT
           ═══════════════════════════════════════ */}
        <motion.section variants={fadeUp} custom={5} className="mb-10 text-center">
          <Link
            href="/app/reflect"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Ready to reflect?
            <ArrowRight size={14} />
          </Link>
        </motion.section>

        {/* ═══════════════════════════════════════
            7. MINI INSIGHT — Subtle emotional reinforcement
           ═══════════════════════════════════════ */}
        <motion.section variants={fadeUp} custom={6} className="text-center pb-8">
          <p className="text-[13px] text-text-disabled/60 italic">
            {activities.length > 0
              ? "Today holds meaning."
              : "Awareness begins with a single breath."}
          </p>
        </motion.section>
      </motion.div>
    </div>
  );
}

/* ─── Empty Goal State ─── */
function EmptyGoalState() {
  const router = useRouter();

  return (
    <div>
      <span
        className="text-[11px] font-medium tracking-[0.1em] uppercase text-text-disabled block mb-2"
        style={{ fontFamily: "var(--font-jetbrains)" }}
      >
        Current Goal
      </span>
      <p className="text-[18px] font-medium text-text-secondary leading-snug mb-2">
        No direction set yet
      </p>
      <button
        onClick={() => router.push("/app/goal/new")}
        className="text-[13px] text-[#8B5CF6] hover:brightness-110 transition-all"
      >
        Set your north star →
      </button>
    </div>
  );
}
