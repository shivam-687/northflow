"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { ActivityTag } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, Plus, Target } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function TagBadge({ tag }: { tag: ActivityTag }) {
  const styles: Record<ActivityTag, string> = {
    goal: "text-tag-goal bg-tag-goal/10 border-tag-goal/20",
    learning: "text-tag-learning bg-tag-learning/10 border-tag-learning/20",
    admin: "text-tag-admin bg-tag-admin/10 border-tag-admin/20",
    noise: "text-tag-noise bg-tag-noise/10 border-tag-noise/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold tracking-[0.08em] uppercase ${styles[tag]}`}
      style={{ fontFamily: "var(--font-jetbrains)" }}
    >
      {tag}
    </span>
  );
}

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

  const isToday =
    date.toISOString().split("T")[0] === new Date().toISOString().split("T")[0];

  const getRelativeDay = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const actDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffMs = today.getTime() - actDay.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return timeStr;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="flex gap-4 items-start"
    >
      <div className="flex flex-col items-center gap-1 pt-1">
        <div className="w-2 h-2 rounded-full bg-border" />
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-3 mb-1.5">
          <span
            className="text-[11px] text-text-disabled"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            {getRelativeDay()}
          </span>
          <TagBadge tag={activity.tag} />
        </div>
        <p className="text-[15px] text-text-primary leading-relaxed">
          {activity.content}
        </p>
      </div>
    </motion.div>
  );
}

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

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-full px-5 md:px-0 pt-6 pb-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {/* Header */}
        <motion.div
          variants={fadeUp}
          custom={0}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-elevated border border-border flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[13px] font-medium text-text-secondary">
                  {(profile?.name || "U")[0].toUpperCase()}
                </span>
              )}
            </div>
            <span
              className="text-[11px] font-semibold tracking-[0.1em] uppercase text-text-disabled"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              NorthFlow
            </span>
          </div>
          <Link
            href="/app/reflect"
            className="p-2 rounded-xl hover:bg-surface transition-colors"
            title="Reflect"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-disabled">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </Link>
        </motion.div>

        {/* Greeting */}
        <motion.h1
          variants={fadeUp}
          custom={1}
          className="text-[28px] font-semibold tracking-tight text-text-primary mb-8"
        >
          {greeting()}, {profile?.name?.split(" ")[0] || "there"}.
        </motion.h1>

        {/* Current Goal */}
        <motion.div variants={fadeUp} custom={2} className="mb-6">
          {activeGoal ? (
            <>
              <span
                className="text-meta text-text-disabled block mb-2"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                Current Goal
              </span>
              <h2 className="text-[22px] font-semibold text-text-primary leading-tight mb-1">
                {activeGoal.title}
              </h2>
              <p className="text-[13px] text-text-secondary">
                Goal-aligned this week
              </p>
            </>
          ) : (
            <EmptyGoalState />
          )}
        </motion.div>

        {/* Needle Mover */}
        <motion.div variants={fadeUp} custom={3} className="mb-8">
          {todayNeedleMover && !showNeedleInput ? (
            <div className="p-5 rounded-[20px] bg-elevated border border-border nf-shadow">
              <span
                className="text-meta text-text-disabled block mb-3"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                Today&apos;s Needle-Mover
              </span>
              <p className="text-[17px] font-medium text-text-primary leading-snug mb-4">
                {todayNeedleMover.content}
              </p>
              <div className="flex gap-3">
                {todayNeedleMover.status === "pending" ? (
                  <>
                    <button
                      onClick={markNeedleMoverDone}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border text-[13px] font-medium text-text-primary hover:bg-surface/80 transition-colors"
                    >
                      <Check size={14} />
                      Mark Done
                    </button>
                    <button
                      onClick={carryNeedleMover}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <ArrowRight size={14} />
                      Carry Forward
                    </button>
                  </>
                ) : (
                  <span
                    className={`text-[13px] font-medium ${
                      todayNeedleMover.status === "done"
                        ? "text-tag-learning"
                        : "text-tag-noise"
                    }`}
                  >
                    {todayNeedleMover.status === "done"
                      ? "Completed"
                      : "Carried forward"}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-[20px] bg-elevated border border-border nf-shadow">
              <span
                className="text-meta text-text-disabled block mb-3"
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
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-[14px] text-text-primary placeholder-text-disabled focus:border-accent/40 focus:outline-none transition-colors mb-3"
              />
              <button
                onClick={handleSetNeedleMover}
                className="px-4 py-2.5 rounded-xl bg-accent text-white text-[13px] font-medium hover:brightness-110 transition-all"
              >
                Set Focus
              </button>
            </div>
          )}
        </motion.div>

        {/* Quick Add */}
        <motion.div variants={fadeUp} custom={4} className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="flex gap-2 mb-3">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide uppercase transition-all border ${
                  selectedTag === tag
                    ? tag === "goal"
                      ? "text-tag-goal bg-tag-goal/10 border-tag-goal/30"
                      : tag === "learning"
                      ? "text-tag-learning bg-tag-learning/10 border-tag-learning/30"
                      : tag === "admin"
                      ? "text-tag-admin bg-tag-admin/10 border-tag-admin/30"
                      : "text-tag-noise bg-tag-noise/10 border-tag-noise/30"
                    : "text-text-disabled bg-transparent border-transparent hover:bg-surface"
                }`}
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="What did you work on today?"
              value={activityInput}
              onChange={(e) => setActivityInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddActivity()}
              className="flex-1 px-4 py-3 rounded-xl bg-surface border border-border text-[14px] text-text-primary placeholder-text-disabled focus:border-accent/40 focus:outline-none transition-colors"
            />
            <button
              onClick={handleAddActivity}
              className="px-4 py-3 rounded-xl bg-accent text-white hover:brightness-110 transition-all"
            >
              <Plus size={18} />
            </button>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div variants={fadeUp} custom={5} className="mb-8">
          <span
            className="text-meta text-text-disabled block mb-4"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            Timeline
          </span>
          {activities.length === 0 ? (
            <p className="text-[14px] text-text-disabled italic">
              No pressure. Start by logging one thing you worked on today.
            </p>
          ) : (
            <div className="relative">
              <div className="absolute left-[3px] top-2 bottom-2 w-px bg-border" />
              {activities.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  index={index}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Reflection Prompt */}
        <motion.div variants={fadeUp} custom={6} className="mb-6 text-center">
          <Link
            href="/app/reflect"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border text-[14px] font-medium text-text-secondary hover:text-text-primary hover:border-accent/30 transition-all"
          >
            Ready to reflect on today?
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Mini Insight */}
        <motion.div variants={fadeUp} custom={7} className="text-center pb-4">
          <p className="text-[13px] text-text-disabled italic">
            {activities.length > 0
              ? "Today was mostly goal-aligned."
              : "Every meaningful day starts with awareness."}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

function EmptyGoalState() {
  const router = useRouter();
  const exampleGoals = [
    "Become Senior Backend Engineer",
    "Ship My First SaaS",
    "Improve Deep Work Consistency",
    "Master System Design",
  ];

  return (
    <div className="p-6 rounded-[20px] bg-elevated border border-border nf-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
          <Target size={20} className="text-accent" />
        </div>
        <div>
          <h2 className="text-[17px] font-semibold text-text-primary mb-1">
            No active north star
          </h2>
          <p className="text-[13px] text-text-secondary leading-relaxed">
            A north star helps you stay aware of what truly matters. What kind of engineer are you becoming?
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-5">
        <span
          className="text-meta text-text-disabled block mb-2"
          style={{ fontFamily: "var(--font-jetbrains)" }}
        >
          Examples
        </span>
        <div className="flex flex-wrap gap-2">
          {exampleGoals.map((goal) => (
            <button
              key={goal}
              onClick={() => router.push(`/app/goal/new?title=${encodeURIComponent(goal)}`)}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border text-[12px] text-text-secondary hover:text-text-primary hover:border-accent/20 transition-all"
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => router.push("/app/goal/new")}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-white text-[14px] font-medium hover:brightness-110 transition-all"
      >
        <Plus size={16} />
        Set Your Direction
      </button>
    </div>
  );
}
