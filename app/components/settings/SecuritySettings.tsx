"use client";

import { useState } from "react";
import {
  Lock,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";

import { updateUser, User } from "@/services/profileApi";

interface SecuritySettingsProps {
    authProvider?: "local" | "google";
  }

  export default function SecuritySettings({
    authProvider = "local",
  }: SecuritySettingsProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async () => {
    setError("");
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      const response = await updateUser({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage("Password changed successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to change password."
      );
    } finally {
      setSaving(false);
    }
  };

  if (authProvider === "google") {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white dark:border-white/[0.08] dark:bg-[#101117]">
        <div className="border-b border-zinc-200 p-6 dark:border-white/[0.08]">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Security
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage how you access your SkillPrep AI account.
          </p>
        </div>

        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/[0.08] dark:bg-[#090d17]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                <ShieldCheck size={19} />
              </div>

              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  Google account
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                  Your account is secured through Google.
                </p>
              </div>
            </div>

            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              Connected
            </span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white dark:border-white/[0.08] dark:bg-[#101117]">
      <div className="border-b border-zinc-200 p-6 dark:border-white/[0.08]">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Security
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your password and account security.
        </p>
      </div>

      <div className="space-y-6 p-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/[0.06] dark:text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/[0.06] dark:text-emerald-300">
            {message}
          </div>
        )}

        <div>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
              <KeyRound size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Change password
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                Use a strong password that you do not use elsewhere.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <PasswordInput
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              visible={showCurrent}
              onToggle={() => setShowCurrent(!showCurrent)}
            />

            <PasswordInput
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              visible={showNew}
              onToggle={() => setShowNew(!showNew)}
            />

            <PasswordInput
              label="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              visible={showConfirm}
              onToggle={() => setShowConfirm(!showConfirm)}
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-zinc-200 pt-5 dark:border-white/[0.08]">
          <button
            type="button"
            onClick={handleChangePassword}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Lock size={16} />
            {saving ? "Updating..." : "Update password"}
          </button>
        </div>
      </div>
    </section>
  );
}

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
}

function PasswordInput({
  label,
  value,
  onChange,
  visible,
  onToggle,
}: PasswordInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-4 pr-11 text-sm text-zinc-900 outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-[#090d17] dark:text-white dark:focus:border-violet-500"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:text-zinc-600 dark:hover:text-zinc-300"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}