"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Globe, User, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

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

interface ProfileEditDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileEditDrawer({ open, onClose }: ProfileEditDrawerProps) {
  const { profile, updateProfile } = useAppStore();
  const [name, setName] = useState(profile?.name || "");
  const [timezone, setTimezone] = useState(profile?.timezone || "UTC");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
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

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("northflow")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Failed to upload image");
        return;
      }

      // Get public URL
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

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await updateProfile({
      name: name.trim(),
      timezone,
      avatar_url: avatarUrl || null,
    });
    setSaving(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-t-[28px] sm:rounded-[28px] bg-elevated border border-border nf-shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[20px] font-semibold text-text-primary">
                Edit Profile
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-surface transition-colors"
              >
                <X size={18} className="text-text-disabled" />
              </button>
            </div>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-8">
              <button
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
                Tap to upload photo
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label
                  className="text-meta text-text-disabled block mb-2"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  Name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled"
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-[15px] text-text-primary placeholder-text-disabled focus:border-accent/40 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-[15px] text-text-primary focus:border-accent/40 focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-surface border border-border text-[14px] font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!name.trim() || saving}
                className="flex-1 py-3 rounded-xl bg-accent text-white text-[14px] font-medium hover:brightness-110 transition-all disabled:opacity-40"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
