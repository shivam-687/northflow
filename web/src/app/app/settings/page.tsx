"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ProfileEditDrawer } from "@/components/profile-edit-drawer";
import {
  User,
  Bell,
  Moon,
  Download,
  Shield,
  LogOut,
  ChevronRight,
  Globe,
  Pencil,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function SettingsItem({
  icon: Icon,
  label,
  value,
  onClick,
  danger,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 rounded-xl bg-surface border border-border hover:border-accent/20 transition-colors text-left ${
        danger ? "hover:border-red-500/20" : ""
      }`}
    >
      <Icon
        size={18}
        className={danger ? "text-red-400" : "text-text-secondary"}
      />
      <span
        className={`flex-1 text-[14px] font-medium ${
          danger ? "text-red-400" : "text-text-primary"
        }`}
      >
        {label}
      </span>
      {value && (
        <span className="text-[13px] text-text-secondary">{value}</span>
      )}
      <ChevronRight size={14} className="text-text-disabled" />
    </button>
  );
}

export default function SettingsPage() {
  const { profile, signOut } = useAppStore();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
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
          <h1 className="text-[28px] font-semibold tracking-tight text-text-primary">
            Settings
          </h1>
          <p className="text-[14px] text-text-secondary">
            Personalize your clarity space.
          </p>
        </motion.div>

        {/* Profile Card — clickable */}
        <motion.button
          variants={fadeUp}
          custom={1}
          onClick={() => setEditOpen(true)}
          className="w-full flex items-center gap-4 p-5 rounded-[20px] bg-elevated border border-border mb-6 text-left hover:border-accent/20 transition-colors group"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-surface border border-border flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[18px] font-medium text-text-secondary">
                  {(profile?.name || "U")[0].toUpperCase()}
                </span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Pencil size={12} className="text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[16px] font-semibold text-text-primary truncate">
              {profile?.name || "Set your name"}
            </h2>
            <p className="text-[13px] text-text-secondary truncate">
              {profile?.email}
            </p>
          </div>
          <ChevronRight size={16} className="text-text-disabled shrink-0" />
        </motion.button>

        {/* Settings Groups */}
        <motion.div variants={fadeUp} custom={2} className="space-y-6">
          {/* Appearance */}
          <div>
            <span
              className="text-meta text-text-disabled block mb-3 px-1"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              Appearance
            </span>
            <div className="space-y-2">
              <SettingsItem
                icon={Moon}
                label="Dark Mode"
                value="Always on"
              />
            </div>
          </div>

          {/* Notifications */}
          <div>
            <span
              className="text-meta text-text-disabled block mb-3 px-1"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              Notifications
            </span>
            <div className="space-y-2">
              <SettingsItem
                icon={Bell}
                label="Daily Reminder"
                value="Off"
              />
              <SettingsItem
                icon={Bell}
                label="Weekly Summary"
                value="On"
              />
            </div>
          </div>

          {/* Account */}
          <div>
            <span
              className="text-meta text-text-disabled block mb-3 px-1"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              Account
            </span>
            <div className="space-y-2">
              <SettingsItem
                icon={User}
                label="Edit Profile"
                onClick={() => setEditOpen(true)}
              />
              <SettingsItem
                icon={Globe}
                label="Timezone"
                value={profile?.timezone || "UTC"}
              />
              <SettingsItem
                icon={Download}
                label="Export Data"
              />
              <SettingsItem
                icon={Shield}
                label="Privacy"
              />
            </div>
          </div>

          {/* Session */}
          <div>
            <span
              className="text-meta text-text-disabled block mb-3 px-1"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              Session
            </span>
            <div className="space-y-2">
              <SettingsItem
                icon={LogOut}
                label="Sign Out"
                danger
                onClick={handleSignOut}
              />
            </div>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          variants={fadeUp}
          custom={3}
          className="mt-10 text-center"
        >
          <p
            className="text-[11px] text-text-disabled"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            NORTHFLOW v0.1.0
          </p>
          <p className="text-[11px] text-text-disabled mt-1">
            Built for thoughtful developers
          </p>
        </motion.div>
      </motion.div>

      {/* Profile Edit Drawer */}
      <ProfileEditDrawer open={editOpen} onClose={() => setEditOpen(false)} />
    </div>
  );
}
