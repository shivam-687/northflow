"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ArrowLeft, Frown, Meh, Smile, Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const moods = [
  { label: "Heavy", icon: Frown, value: "heavy" },
  { label: "Low", icon: Frown, value: "low" },
  { label: "Neutral", icon: Meh, value: "neutral" },
  { label: "Good", icon: Smile, value: "good" },
  { label: "Light", icon: Smile, value: "light" },
];

const energyLevels = [
  { label: "Drained", value: 1 },
  { label: "Low", value: 2 },
  { label: "Okay", value: 3 },
  { label: "Good", value: 4 },
  { label: "Energized", value: 5 },
];

const prompts = [
  "How did today feel?",
  "What drained your energy?",
  "What felt meaningful?",
  "What would you change tomorrow?",
  "What are you grateful for today?",
];

export default function ReflectPage() {
  const { addReflection } = useAppStore();
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState("");
  const [energy, setEnergy] = useState(3);
  const [note, setNote] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!note.trim()) return;
    await addReflection(selectedMood || null, energy, note.trim());
    setSubmitted(true);
    setTimeout(() => {
      router.push("/app/today");
    }, 2000);
  };

  return (
    <div className="min-h-full px-5 md:px-0 pt-6 pb-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {/* Header */}
        <motion.div variants={fadeUp} custom={0} className="mb-8">
          <button
            onClick={() => router.push("/app/today")}
            className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <h1 className="text-[28px] font-semibold tracking-tight text-text-primary mb-1">
            Reflect
          </h1>
          <p className="text-[14px] text-text-secondary">
            Process your day instead of carrying it mentally.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-16 h-16 rounded-full bg-tag-learning/10 flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-tag-learning" />
            </div>
            <h2 className="text-[20px] font-semibold text-text-primary mb-2">
              Reflection Saved
            </h2>
            <p className="text-[14px] text-text-secondary text-center">
              You processed your day with awareness.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Prompts */}
            <motion.div variants={fadeUp} custom={1} className="mb-6">
              <span
                className="text-meta text-text-disabled block mb-3"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                Prompts
              </span>
              <div className="flex flex-wrap gap-2">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      setSelectedPrompt(prompt);
                      if (!note) setNote(prompt + "\n\n");
                    }}
                    className={`px-4 py-2 rounded-xl text-[13px] border transition-all ${
                      selectedPrompt === prompt
                        ? "bg-accent/10 border-accent/30 text-accent"
                        : "bg-surface border-border text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Mood */}
            <motion.div variants={fadeUp} custom={2} className="mb-6">
              <span
                className="text-meta text-text-disabled block mb-3"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                How did today feel?
              </span>
              <div className="flex gap-2">
                {moods.map((mood) => {
                  const Icon = mood.icon;
                  return (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border transition-all ${
                        selectedMood === mood.value
                          ? "bg-accent/10 border-accent/30"
                          : "bg-surface border-border hover:border-accent/20"
                      }`}
                    >
                      <Icon
                        size={20}
                        className={
                          selectedMood === mood.value
                            ? "text-accent"
                            : "text-text-disabled"
                        }
                      />
                      <span
                        className={`text-[11px] font-medium ${
                          selectedMood === mood.value
                            ? "text-accent"
                            : "text-text-disabled"
                        }`}
                      >
                        {mood.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Energy */}
            <motion.div variants={fadeUp} custom={3} className="mb-6">
              <span
                className="text-meta text-text-disabled block mb-3"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                Energy Level
              </span>
              <div className="flex gap-2">
                {energyLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setEnergy(level.value)}
                    className={`flex-1 py-3 rounded-xl border text-[12px] font-medium transition-all ${
                      energy === level.value
                        ? "bg-accent/10 border-accent/30 text-accent"
                        : "bg-surface border-border text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Note */}
            <motion.div variants={fadeUp} custom={4} className="mb-8">
              <span
                className="text-meta text-text-disabled block mb-3"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                Notes
              </span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write freely. This is just for you."
                rows={6}
                className="w-full px-4 py-4 rounded-xl bg-surface border border-border text-[15px] text-text-primary placeholder-text-disabled focus:border-accent/40 focus:outline-none transition-colors resize-none leading-relaxed"
              />
            </motion.div>

            {/* Submit */}
            <motion.div variants={fadeUp} custom={5}>
              <button
                onClick={handleSubmit}
                disabled={!note.trim()}
                className="w-full py-3.5 rounded-xl bg-accent text-white text-[15px] font-medium hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save Reflection
              </button>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
