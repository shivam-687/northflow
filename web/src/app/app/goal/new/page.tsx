"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const statusOptions = [
  {
    value: "active",
    label: "Active — My current north star",
    description: "This becomes your primary focus.",
  },
  {
    value: "future",
    label: "Future — For later",
    description: "Park this idea for when the time is right.",
  },
];

export default function NewGoalPage() {
  const router = useRouter();
  const { createGoal } = useAppStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [themes, setThemes] = useState<string[]>([]);
  const [themeInput, setThemeInput] = useState("");
  const [loading, setLoading] = useState(false);

  const addTheme = () => {
    if (themeInput.trim() && themes.length < 5) {
      setThemes([...themes, themeInput.trim()]);
      setThemeInput("");
    }
  };

  const removeTheme = (index: number) => {
    setThemes(themes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await createGoal(title.trim(), description.trim(), status, themes);
    router.push("/app/goal");
  };

  return (
    <div className="min-h-full px-5 md:px-0 pt-6 pb-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {/* Back */}
        <motion.div variants={fadeUp} custom={0} className="mb-8">
          <Link
            href="/app/goal"
            className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Goals
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div variants={fadeUp} custom={1} className="mb-8">
          <h1 className="text-[26px] font-semibold tracking-tight text-text-primary mb-2">
            Set your direction
          </h1>
          <p className="text-[14px] text-text-secondary leading-relaxed">
            What kind of engineer are you becoming? Think identity, not tasks.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <motion.div variants={fadeUp} custom={2}>
            <label className="text-meta text-text-disabled block mb-2" style={{ fontFamily: "var(--font-jetbrains)" }}>
              Direction
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Become Senior Backend Engineer"
              required
              className="w-full px-4 py-3.5 rounded-xl bg-surface border border-border text-[15px] text-text-primary placeholder-text-disabled focus:border-accent/40 focus:outline-none transition-colors"
            />
          </motion.div>

          {/* Description */}
          <motion.div variants={fadeUp} custom={3}>
            <label className="text-meta text-text-disabled block mb-2" style={{ fontFamily: "var(--font-jetbrains)" }}>
              Why this matters
              <span className="normal-case tracking-normal text-text-disabled"> (optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this direction mean to you?"
              rows={3}
              className="w-full px-4 py-3.5 rounded-xl bg-surface border border-border text-[14px] text-text-primary placeholder-text-disabled focus:border-accent/40 focus:outline-none transition-colors resize-none"
            />
          </motion.div>

          {/* Supporting Themes */}
          <motion.div variants={fadeUp} custom={4}>
            <label className="text-meta text-text-disabled block mb-2" style={{ fontFamily: "var(--font-jetbrains)" }}>
              Supporting Themes
              <span className="normal-case tracking-normal text-text-disabled"> (optional)</span>
            </label>
            <p className="text-[12px] text-text-disabled mb-3">
              Sub-focuses that support this direction.
            </p>

            {themes.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {themes.map((theme, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface border border-border text-[12px] text-text-secondary"
                    style={{ fontFamily: "var(--font-jetbrains)" }}
                  >
                    {theme}
                    <button
                      type="button"
                      onClick={() => removeTheme(i)}
                      className="hover:text-text-primary transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                value={themeInput}
                onChange={(e) => setThemeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTheme();
                  }
                }}
                placeholder="e.g. System Design"
                className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-border text-[13px] text-text-primary placeholder-text-disabled focus:border-accent/40 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={addTheme}
                disabled={!themeInput.trim() || themes.length >= 5}
                className="px-3 py-2.5 rounded-xl bg-surface border border-border text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30"
              >
                <Plus size={16} />
              </button>
            </div>
          </motion.div>

          {/* Status */}
          <motion.div variants={fadeUp} custom={5}>
            <label className="text-meta text-text-disabled block mb-3" style={{ fontFamily: "var(--font-jetbrains)" }}>
              When
            </label>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatus(option.value)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    status === option.value
                      ? "bg-accent/8 border-accent/30"
                      : "bg-surface border-border hover:border-border"
                  }`}
                >
                  <p
                    className={`text-[14px] font-medium mb-0.5 ${
                      status === option.value
                        ? "text-text-primary"
                        : "text-text-secondary"
                    }`}
                  >
                    {option.label}
                  </p>
                  <p className="text-[12px] text-text-disabled">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div variants={fadeUp} custom={6} className="pt-2">
            <button
              type="submit"
              disabled={!title.trim() || loading}
              className="w-full py-3.5 rounded-xl bg-accent text-white text-[15px] font-medium hover:brightness-110 transition-all disabled:opacity-50"
            >
              {loading ? "Setting direction..." : "Set Direction"}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
