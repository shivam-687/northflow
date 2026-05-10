"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Globe, User, Camera, Loader2 } from "lucide-react";

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Mexico_City",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Madrid",
  "Europe/Rome",
  "Europe/Amsterdam",
  "Europe/Stockholm",
  "Europe/Helsinki",
  "Europe/Moscow",
  "Europe/Istanbul",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Shanghai",
  "Asia/Hong_Kong",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Australia/Perth",
  "Australia/Adelaide",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Pacific/Auckland",
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function SetupPage() {
  const router = useRouter();
  const { profile, updateProfile } = useAppStore();
  const [name, setName] = useState(profile?.name || "");
  const [timezone, setTimezone] = useState(profile?.timezone || "UTC");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("northflow")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Failed to upload image. Make sure the storage bucket 'northflow' is public.");
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("northflow")
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
    } catch (err) {
      console.error("Avatar upload failed:", err);
      alert("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await updateProfile({
      name: name.trim(),
      timezone,
      avatar_url: avatarUrl || null,
    });
    setLoading(false);
    router.push("/app/today");
  };

  return (
    <div className="min-h-full flex items-center justify-center px-5 md:px-0 pt-6 pb-8">
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {/* Header */}
        <motion.div variants={fadeUp} custom={0} className="mb-10">
          <h1 className="text-[28px] font-semibold tracking-tight text-text-primary mb-2">
            Welcome to NorthFlow
          </h1>
          <p className="text-[15px] text-text-secondary leading-relaxed">
            A few details to personalize your clarity space.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <motion.div variants={fadeUp} custom={1} className="flex flex-col items-center">
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={uploading}
              className="relative w-24 h-24 rounded-full bg-surface border-2 border-border flex items-center justify-center overflow-hidden group hover:border-accent/40 transition-colors"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[28px] font-medium text-text-secondary">
                  {(name || "U")[0].toUpperCase()}
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading ? (
                  <Loader2 size={20} className="text-white animate-spin" />
                ) : (
                  <Camera size={20} className="text-white" />
                )}
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="mt-3 text-[12px] text-text-disabled">
              Tap to add a photo
            </p>
          </motion.div>

          {/* Name */}
          <motion.div variants={fadeUp} custom={2}>
            <label
              className="text-meta text-text-disabled block mb-2"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What should we call you?"
              required
              autoFocus
              className="w-full px-4 py-3.5 rounded-xl bg-surface border border-border text-[15px] text-text-primary placeholder-text-disabled focus:border-accent/40 focus:outline-none transition-colors"
            />
          </motion.div>

          {/* Timezone */}
          <motion.div variants={fadeUp} custom={3}>
            <label
              className="text-meta text-text-disabled block mb-2"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              Timezone
            </label>
            <div className="relative">
              <Globe
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled"
              />
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-surface border border-border text-[15px] text-text-primary focus:border-accent/40 focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Tip */}
          <motion.div variants={fadeUp} custom={4}>
            <p className="text-[13px] text-text-disabled leading-relaxed">
              You can always update these later in Settings. We only use your
              name to personalize the experience.
            </p>
          </motion.div>

          {/* Submit */}
          <motion.div variants={fadeUp} custom={5} className="pt-2">
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent text-white text-[15px] font-medium hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Continue"}
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
