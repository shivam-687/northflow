"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { BookOpen, Target, Zap, Frown, Smile, Meh } from "lucide-react";

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function WeekPage() {
  const { activities, reflections, goals } = useAppStore();

  // Compute simple weekly stats from available data
  const goalActivities = activities.filter((a) => a.tag === "goal");
  const learningActivities = activities.filter((a) => a.tag === "learning");
  const noiseActivities = activities.filter((a) => a.tag === "noise");
  const adminActivities = activities.filter((a) => a.tag === "admin");

  const total = activities.length || 1;
  const goalPct = Math.round((goalActivities.length / total) * 100);
  const learningPct = Math.round((learningActivities.length / total) * 100);
  const noisePct = Math.round((noiseActivities.length / total) * 100);

  const activeGoal = goals.find((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  const avgEnergy =
    reflections.length > 0
      ? Math.round(
          reflections.reduce((sum, r) => sum + (r.energy_level || 3), 0) /
            reflections.length
        )
      : null;

  const moodIcons = [
    <Frown key="1" size={16} className="text-tag-noise" />,
    <Frown key="2" size={16} className="text-tag-noise/70" />,
    <Meh key="3" size={16} className="text-text-secondary" />,
    <Smile key="4" size={16} className="text-tag-learning/70" />,
    <Smile key="5" size={16} className="text-tag-learning" />,
  ];

  return (
    <div className="min-h-full px-5 md:px-0 pt-6 pb-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {/* Header */}
        <motion.div variants={fadeUp} custom={0} className="mb-8">
          <h1 className="text-[28px] font-semibold tracking-tight text-text-primary mb-1">
            This Week
          </h1>
          <p className="text-[14px] text-text-secondary">
            Your weekly awareness summary.
          </p>
        </motion.div>

        {/* Weekly Overview Card */}
        <motion.div
          variants={fadeUp}
          custom={1}
          className="p-6 rounded-[20px] bg-elevated border border-border nf-shadow mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <span
                className="text-meta text-text-disabled block mb-1"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                Weekly Trajectory
              </span>
              <h2 className="text-[22px] font-semibold text-text-primary">
                Insight Synthesis
              </h2>
            </div>
            <span
              className="px-3 py-1 rounded-lg bg-surface border border-border text-[11px] font-medium text-text-secondary"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              WEEK {getWeekNumber(new Date())}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface border border-border">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[13px] text-text-primary">Deep Work</span>
              <span className="text-[12px] text-text-secondary">{goalPct}%</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface border border-border">
              <div className="w-1.5 h-1.5 rounded-full bg-tag-learning" />
              <span className="text-[13px] text-text-primary">Learning</span>
              <span className="text-[12px] text-text-secondary">{learningPct}%</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface border border-border">
              <div className="w-1.5 h-1.5 rounded-full bg-tag-noise" />
              <span className="text-[13px] text-text-primary">Noise</span>
              <span className="text-[12px] text-text-secondary">{noisePct}%</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-surface border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Target size={14} className="text-accent" />
                <span className="text-[11px] text-text-disabled uppercase tracking-wider">
                  Activities
                </span>
              </div>
              <span className="text-[24px] font-semibold text-text-primary">
                {activities.length}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-border">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={14} className="text-tag-learning" />
                <span className="text-[11px] text-text-disabled uppercase tracking-wider">
                  Reflections
                </span>
              </div>
              <span className="text-[24px] font-semibold text-text-primary">
                {reflections.length}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Learning Highlights */}
        <motion.div variants={fadeUp} custom={2} className="mb-6">
          <span
            className="text-meta text-text-disabled block mb-3"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            Learning Highlights
          </span>
          {learningActivities.length === 0 ? (
            <p className="text-[14px] text-text-disabled italic">
              No learning logged this week yet.
            </p>
          ) : (
            <div className="space-y-3">
              {learningActivities.slice(0, 3).map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 rounded-xl bg-surface border border-border"
                >
                  <p className="text-[14px] text-text-primary leading-relaxed">
                    {activity.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Focus Patterns */}
        <motion.div variants={fadeUp} custom={3} className="mb-6">
          <span
            className="text-meta text-text-disabled block mb-3"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            Focus Patterns
          </span>
          <div className="p-5 rounded-[20px] bg-surface border border-border">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[13px] text-text-primary">Goal-Aligned</span>
                  <span className="text-[13px] text-text-secondary">{goalPct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${goalPct}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[13px] text-text-primary">Learning</span>
                  <span className="text-[13px] text-text-secondary">{learningPct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-tag-learning transition-all"
                    style={{ width: `${learningPct}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[13px] text-text-primary">Noise</span>
                  <span className="text-[13px] text-text-secondary">{noisePct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-tag-noise transition-all"
                    style={{ width: `${noisePct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reflection Notes */}
        <motion.div variants={fadeUp} custom={4} className="mb-6">
          <span
            className="text-meta text-text-disabled block mb-3"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            Reflection Notes
          </span>
          {reflections.length === 0 ? (
            <p className="text-[14px] text-text-disabled italic">
              Take a moment to reflect. It builds awareness.
            </p>
          ) : (
            <div className="space-y-3">
              {reflections.slice(0, 3).map((reflection) => (
                <div
                  key={reflection.id}
                  className="p-4 rounded-xl bg-surface border border-border"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {reflection.energy_level
                      ? moodIcons[reflection.energy_level - 1]
                      : null}
                    <span className="text-[12px] text-text-disabled">
                      {new Date(reflection.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {reflection.note && (
                    <p className="text-[14px] text-text-primary leading-relaxed">
                      {reflection.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* AI Insight */}
        <motion.div variants={fadeUp} custom={5} className="mb-6">
          <span
            className="text-meta text-text-disabled block mb-3"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            Weekly Insight
          </span>
          <div className="p-6 rounded-[20px] bg-surface border border-border">
            <Zap size={16} className="text-accent mb-3" />
            <p className="text-[15px] text-text-secondary leading-relaxed italic">
              {activities.length > 3
                ? `You navigated ${activities.length} meaningful work sessions with remarkable calm. By prioritizing structural integrity over volume, you maintained a sustainable pace.`
                : "As the week unfolds, notice where your energy flows. Awareness precedes meaningful change."}
            </p>
          </div>
        </motion.div>

        {/* Active Goal Reminder */}
        {activeGoal && (
          <motion.div variants={fadeUp} custom={6} className="mb-6">
            <div className="p-5 rounded-[20px] bg-elevated border border-border">
              <span
                className="text-meta text-text-disabled block mb-2"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                Active North Star
              </span>
              <p className="text-[17px] font-medium text-text-primary">
                {activeGoal.title}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
