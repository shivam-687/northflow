"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Play,
} from "lucide-react";
import Link from "next/link";
import { BreathingOrbs } from "@/components/breathing-orbs";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <BreathingOrbs />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-[15px] font-semibold tracking-tight text-text-primary"
          >
            Northflow
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="#manifesto"
              className="text-[13px] text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Manifesto
            </Link>
            <Link
              href="#flow"
              className="text-[13px] text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Flow
            </Link>
            <Link
              href="#journal"
              className="text-[13px] text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Journal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-5 overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto text-center pt-20">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-surface/60 backdrop-blur-sm mb-10"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.6s ease-out 0.2s",
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-tag-learning animate-pulse-soft" />
            <span
              className="text-[11px] font-medium tracking-[0.08em] uppercase text-text-secondary"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              Early Access
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className="text-[clamp(36px,8vw,72px)] font-semibold leading-[1.05] tracking-tight mb-6"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s ease-out 0.4s",
            }}
          >
            <span className="text-text-primary">You are busy,</span>
            <br />
            <span className="italic text-text-secondary/70">
              but are you{" "}
            </span>
            <span className="text-accent">clear</span>
            <span className="text-text-primary">?</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-[17px] md:text-[19px] text-text-secondary leading-relaxed max-w-lg mx-auto mb-4"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(16px)",
              transition: "all 0.7s ease-out 0.6s",
            }}
          >
            A calm daily clarity system for developers who feel busy but
            disconnected from meaningful progress.
          </p>

          {/* Calmness statement */}
          <p
            className="text-[13px] text-text-disabled mb-10"
            style={{
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.6s ease-out 0.9s",
              fontFamily: "var(--font-jetbrains)",
            }}
          >
            No gamification. No pressure. Just awareness.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.6s ease-out 0.8s",
            }}
          >
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white text-[15px] font-medium hover:brightness-110 transition-all duration-200 animate-glow"
            >
              Start Building Clarity
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#flow"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border bg-surface/60 backdrop-blur-sm text-[15px] font-medium text-text-secondary hover:text-text-primary hover:border-accent/30 transition-all duration-200"
            >
              <Play size={14} />
              See How It Works
            </Link>
          </div>

          {/* Social Proof / Trust */}
          <div
            className="mt-16 flex items-center justify-center gap-6"
            style={{
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.8s ease-out 1.2s",
            }}
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-elevated border-2 border-background flex items-center justify-center text-[10px] font-medium text-text-disabled"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-[13px] text-text-disabled">
              Trusted by engineers at early-stage startups
            </p>
          </div>
        </div>

        {/* Bottom fade to content */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </section>

      {/* Feature Cards */}
      <section id="manifesto" className="relative z-10 px-5 pb-24">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span
              className="text-meta text-text-disabled block mb-3"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              Manifesto
            </span>
            <h2 className="text-[28px] md:text-[36px] font-semibold text-text-primary tracking-tight">
              Built for clarity, not productivity.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div className="p-7 rounded-[24px] bg-elevated/80 border border-border nf-shadow relative overflow-hidden group animate-fade-in-up">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <Sparkles size={18} className="text-accent" />
                </div>
                <h3 className="text-[18px] font-semibold mb-3 text-text-primary">
                  Quiet Reflection
                </h3>
                <p className="text-[14px] text-text-secondary leading-relaxed">
                  Capture thinking, not just tasks. Journaling designed for
                  deep-focus moments that demand clarity.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-7 rounded-[24px] bg-surface/80 border border-border group hover:border-accent/10 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              <div className="w-10 h-10 rounded-xl bg-tag-learning/10 flex items-center justify-center mb-6">
                <BookOpen size={18} className="text-tag-learning" />
              </div>
              <h3 className="text-[18px] font-semibold mb-3 text-text-primary">
                Intentional Closure
              </h3>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                Close open loops and end your day with a clear mind and structured
                peace.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-7 rounded-[24px] bg-surface/80 border border-border group hover:border-accent/10 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <TrendingUp size={18} className="text-accent" />
              </div>
              <h3 className="text-[18px] font-semibold mb-3 text-text-primary">
                Reflective Synthesis
              </h3>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                Gain high-level views of your trajectory. Weekly insights that
                actually matter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Flow Section */}
      <section id="flow" className="relative z-10 px-5 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="text-meta text-text-disabled block mb-3"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              The Flow
            </span>
            <h2 className="text-[28px] md:text-[36px] font-semibold text-text-primary tracking-tight">
              From scattered to clear.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Steps */}
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Set Your Direction",
                  desc: "Choose one north-star goal. Identity-oriented, not task-oriented.",
                },
                {
                  step: "02",
                  title: "Log Meaningful Work",
                  desc: "Quickly capture what you worked on — goal, learning, admin, or noise.",
                },
                {
                  step: "03",
                  title: "Daily Needle-Mover",
                  desc: "Define what would make today feel meaningful. One thing.",
                },
                {
                  step: "04",
                  title: "Reflect & Close",
                  desc: "End your day with awareness. Process instead of carrying it mentally.",
                },
              ].map((item, i) => (
                <div
                  key={item.step}
                  className="flex gap-5 group animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  <span
                    className="text-[13px] font-semibold text-accent/40 mt-1 shrink-0 w-8"
                    style={{ fontFamily: "var(--font-jetbrains)" }}
                  >
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-[17px] font-semibold text-text-primary mb-1 group-hover:text-accent transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-[14px] text-text-secondary leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Visual representation */}
            <div className="relative">
              <div className="p-8 rounded-[24px] bg-elevated/60 border border-border nf-shadow">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-surface/60 border border-border">
                    <div className="w-2 h-2 rounded-full bg-tag-learning" />
                    <span className="text-[14px] text-text-primary">Deploy v2 Engine</span>
                    <span className="ml-auto text-[11px] text-text-disabled uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>Active Goal</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-surface/60 border border-border">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-[14px] text-text-primary">Refactor auth middleware</span>
                    <span className="ml-auto text-[11px] text-text-disabled uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>Needle-Mover</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-surface/60 border border-border">
                    <div className="w-2 h-2 rounded-full bg-tag-learning" />
                    <span className="text-[14px] text-text-primary">Learned Rust ownership</span>
                    <span className="ml-auto text-[11px] text-text-disabled uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>Learning</span>
                  </div>
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-[14px] italic text-text-secondary leading-relaxed text-center">
                      &ldquo;Today was mostly goal-aligned. Your focus held through the noise.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journal / Timeline Preview */}
      <section id="journal" className="relative z-10 px-5 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="text-meta text-text-disabled block mb-3"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              Journal
            </span>
            <h2 className="text-[28px] md:text-[36px] font-semibold text-text-primary tracking-tight">
              Your engineering awareness archive.
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              <TimelineItem
                time="09:12 AM"
                tag="Meaningful Work"
                tagColor="text-text-secondary"
                content="Reshaped the data modeling for the core engine. Felt a breakthrough in how we handle state persistence."
                delay="0s"
              />
              <TimelineItem
                time="02:15 PM"
                tag="Learning Moment"
                tagColor="text-tag-learning"
                content="Discovered that speed is often a proxy for lack of direction. Slowing down today led to fewer errors in the PR."
                delay="0.1s"
              />
              <TimelineItem
                time="05:30 PM"
                tag="Emotional Reflection"
                tagColor="text-accent"
                content='Closing the day feeling satisfied but tired. The "clear" state is reachable, just needs discipline.'
                delay="0.2s"
              />
            </div>

            {/* Weekly insight */}
            <div
              className="mt-10 p-8 rounded-[24px] bg-elevated/60 border border-border nf-shadow animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span
                    className="text-meta text-text-disabled block mb-1"
                    style={{ fontFamily: "var(--font-jetbrains)" }}
                  >
                    Weekly Trajectory
                  </span>
                  <h3 className="text-[22px] font-semibold text-text-primary">
                    Insight Synthesis
                  </h3>
                </div>
                <span
                  className="px-3 py-1 rounded-lg bg-surface border border-border text-[11px] font-medium text-text-secondary"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  WEEK 42
                </span>
              </div>

              <div className="flex gap-3 mb-6">
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface border border-border">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-[13px] text-text-primary">Deep Work</span>
                  <span className="text-[12px] text-text-secondary">+12%</span>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface border border-border">
                  <div className="w-1.5 h-1.5 rounded-full bg-tag-learning" />
                  <span className="text-[13px] text-text-primary">Consistency</span>
                  <span className="text-[12px] text-tag-learning">Optimal</span>
                </div>
              </div>

              <p className="text-[15px] italic text-text-secondary leading-relaxed">
                &ldquo;You navigated complex architectural refactoring with
                remarkable calm. By prioritizing structural integrity over volume,
                you maintained a sustainable pace throughout the sprint.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-5 pb-32 pt-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[28px] md:text-[36px] font-semibold mb-4 text-text-primary animate-fade-in-up">
            Ready to find your focus?
          </h2>
          <p className="text-[16px] text-text-secondary mb-10 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Join developers who are choosing clarity over chaos.
          </p>

          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent text-white text-[16px] font-medium hover:brightness-110 transition-all duration-200 animate-glow"
            >
              Start Building Clarity
              <ArrowRight size={18} />
            </Link>
          </div>

          <p
            className="mt-6 text-[12px] text-text-disabled animate-fade-in-up"
            style={{ animationDelay: "0.3s", fontFamily: "var(--font-jetbrains)" }}
          >
            SIMPLE ONBOARDING &middot; NO NOISE &middot; FREE DURING EARLY ACCESS
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-5 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[13px] font-medium text-text-primary">
              Northflow
            </span>
            <span className="text-[11px] text-text-disabled">
              Built for thoughtful developers
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="#manifesto"
              className="text-[12px] text-text-secondary hover:text-text-primary transition-colors"
            >
              Manifesto
            </Link>
            <Link
              href="https://twitter.com"
              className="text-[12px] text-text-secondary hover:text-text-primary transition-colors"
            >
              Twitter
            </Link>
            <span className="text-[11px] text-text-disabled">
              NorthFlow &copy; 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TimelineItem({
  time,
  tag,
  tagColor,
  content,
  delay,
}: {
  time: string;
  tag: string;
  tagColor: string;
  content: string;
  delay: string;
}) {
  return (
    <div
      className="flex gap-6 sm:gap-10 animate-fade-in-up"
      style={{ animationDelay: delay }}
    >
      <span
        className="text-[12px] text-text-disabled pt-1 w-16 shrink-0"
        style={{ fontFamily: "var(--font-jetbrains)" }}
      >
        {time}
      </span>
      <div>
        <span
          className={`text-[11px] font-medium tracking-[0.08em] uppercase mb-2 block ${tagColor}`}
          style={{ fontFamily: "var(--font-jetbrains)" }}
        >
          {tag}
        </span>
        <p className="text-[15px] text-text-primary leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
}
