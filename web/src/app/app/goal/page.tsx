"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Circle,
  Pause,
  CheckCircle2,
  Archive,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import type { Goal } from "@/lib/supabase";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function GoalPage() {
  const { goals, activeGoal, fetchGoals, updateGoalStatus } = useAppStore();

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const futureGoals = goals.filter((g) => g.status === "future");
  const pausedGoals = goals.filter((g) => g.status === "paused");
  const completedGoals = goals.filter((g) => g.status === "completed");
  const archivedGoals = goals.filter((g) => g.status === "archived");

  // Group completed goals by year for Goal History
  const historyGoals = [...completedGoals, ...archivedGoals].sort(
    (a, b) =>
      new Date(b.completed_at || b.archived_at || b.created_at).getTime() -
      new Date(a.completed_at || a.archived_at || a.created_at).getTime()
  );

  const historyByYear = historyGoals.reduce(
    (acc, goal) => {
      const year = new Date(
        goal.completed_at || goal.archived_at || goal.created_at
      )
        .getFullYear()
        .toString();
      if (!acc[year]) acc[year] = [];
      acc[year].push(goal);
      return acc;
    },
    {} as Record<string, Goal[]>
  );

  return (
    <div className="min-h-full px-5 md:px-0 pt-6 pb-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {/* Header */}
        <motion.div
          variants={fadeUp}
          custom={0}
          className="flex items-center justify-between mb-1"
        >
          <h1 className="text-[26px] font-semibold tracking-tight text-text-primary">
            Goals
          </h1>
          <Link
            href="/app/goal/new"
            className="p-2 rounded-lg hover:bg-surface transition-colors"
          >
            <Plus size={20} className="text-text-secondary" />
          </Link>
        </motion.div>

        <motion.p
          variants={fadeUp}
          custom={1}
          className="text-[14px] text-text-secondary mb-8"
        >
          Your current direction and past seasons.
        </motion.p>

        {/* Current North Star */}
        <motion.div variants={fadeUp} custom={2} className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <span
              className="text-meta text-accent"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              Current North Star
            </span>
          </div>
          <p className="text-[12px] italic text-text-disabled mb-3">
            Only one north star stays active at a time.
          </p>

          {activeGoal ? (
            <div className="p-6 rounded-[20px] bg-elevated border border-border nf-shadow">
              <h2 className="text-[22px] font-semibold text-text-primary mb-3 leading-snug">
                {activeGoal.title}
              </h2>
              {activeGoal.started_at && (
                <p
                  className="text-[11px] text-text-disabled mb-1"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  STARTED {getRelativeTime(activeGoal.started_at).toUpperCase()}
                </p>
              )}
              {activeGoal.description && (
                <p className="text-[13px] text-text-secondary mb-4">
                  {activeGoal.description}
                </p>
              )}

              {/* Supporting Themes */}
              {activeGoal.supporting_themes &&
                activeGoal.supporting_themes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {activeGoal.supporting_themes.map((theme) => (
                      <span
                        key={theme.id}
                        className="px-3 py-1 rounded-lg bg-surface border border-border text-[11px] font-medium text-text-secondary uppercase tracking-wide"
                        style={{ fontFamily: "var(--font-jetbrains)" }}
                      >
                        {theme.name}
                      </span>
                    ))}
                  </div>
                )}

              {/* Actions */}
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => updateGoalStatus(activeGoal.id, "completed")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-[12px] text-text-secondary hover:text-tag-learning transition-colors"
                >
                  <CheckCircle2 size={13} />
                  Complete
                </button>
                <button
                  onClick={() => updateGoalStatus(activeGoal.id, "paused")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-[12px] text-text-secondary hover:text-tag-noise transition-colors"
                >
                  <Pause size={13} />
                  Pause
                </button>
                <button
                  onClick={() => updateGoalStatus(activeGoal.id, "archived")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-[12px] text-text-secondary hover:text-text-disabled transition-colors"
                >
                  <Archive size={13} />
                  Archive
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/app/goal/new"
              className="block p-6 rounded-[20px] border border-border border-dashed text-center hover:border-accent/30 transition-colors"
            >
              <p className="text-[15px] text-text-secondary mb-1">
                No active north star
              </p>
              <p className="text-[13px] text-accent">Set your direction →</p>
            </Link>
          )}
        </motion.div>

        {/* Future Goals */}
        {futureGoals.length > 0 && (
          <GoalSection
            title="Future Goals"
            subtitle="Ideas for future growth."
            goals={futureGoals}
            icon={<Circle size={14} className="text-text-disabled" />}
            delay={3}
            onActivate={(id) => updateGoalStatus(id, "active")}
          />
        )}

        {/* Paused Goals */}
        {pausedGoals.length > 0 && (
          <GoalSection
            title="Paused Goals"
            subtitle="Not now — not failure."
            goals={pausedGoals}
            icon={<Pause size={14} className="text-text-disabled" />}
            delay={4}
            onActivate={(id) => updateGoalStatus(id, "active")}
          />
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <GoalSection
            title="Completed Goals"
            subtitle="Meaningful growth achieved."
            goals={completedGoals}
            icon={<CheckCircle2 size={14} className="text-tag-learning" />}
            delay={5}
            showDate
          />
        )}

        {/* Goal History Timeline */}
        {Object.keys(historyByYear).length > 0 && (
          <motion.div variants={fadeUp} custom={6} className="mb-8">
            <span
              className="text-meta text-text-disabled block mb-4"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              Goal History
            </span>

            <div className="space-y-6">
              {Object.entries(historyByYear).map(([year, yearGoals]) => (
                <div key={year} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent mt-1" />
                    <div className="w-px flex-1 bg-border mt-1" />
                  </div>
                  <div className="flex-1 pb-2">
                    <span className="text-[14px] font-semibold text-accent mb-1 block">
                      {year}
                    </span>
                    <p className="text-[14px] text-text-secondary leading-relaxed">
                      {yearGoals.map((g) => g.title).join(" and ")}.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Insight Quote */}
        {goals.length >= 3 && (
          <motion.div
            variants={fadeUp}
            custom={7}
            className="p-5 rounded-[20px] bg-surface border border-border mb-8"
          >
            <p className="text-[14px] italic text-text-secondary leading-relaxed flex items-start gap-2">
              <Sparkles
                size={14}
                className="text-accent/60 mt-0.5 shrink-0"
              />
              &ldquo;Your goals have shifted toward deeper technical
              mastery.&rdquo;
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function GoalSection({
  title,
  subtitle,
  goals,
  icon,
  delay,
  showDate,
  onActivate,
}: {
  title: string;
  subtitle: string;
  goals: Goal[];
  icon: React.ReactNode;
  delay: number;
  showDate?: boolean;
  onActivate?: (id: string) => void;
}) {
  return (
    <motion.div variants={fadeUp} custom={delay} className="mb-8">
      <span
        className="text-meta text-text-disabled block mb-0.5"
        style={{ fontFamily: "var(--font-jetbrains)" }}
      >
        {title}
      </span>
      <p className="text-[12px] text-text-disabled mb-3">{subtitle}</p>

      <div className="space-y-2">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span className="text-[15px] text-text-primary">{goal.title}</span>
            </div>
            <div className="flex items-center gap-2">
              {showDate && goal.completed_at && (
                <span
                  className="text-[11px] text-text-disabled"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  {formatDate(goal.completed_at)}
                </span>
              )}
              {onActivate && (
                <button
                  onClick={() => onActivate(goal.id)}
                  className="opacity-0 group-hover:opacity-100 text-[11px] text-accent transition-opacity"
                >
                  Activate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
