"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  UserRound,
  Save,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getProfile, updateUser, User } from "@/services/profileApi";
import { toast } from "sonner";

export default function AccountSettings() {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const response = await getProfile();

        setUser({
          name: response.profile?.userId?.name || "",
          email: response.profile?.userId?.email || "",
        });
      } catch (error) {
        console.error("Profile load error:", error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!user.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    try {
      setSaving(true);

      await updateUser({
        name: user.name.trim(),
        email: user.email,
      });

      setUser((prev) => ({
        ...prev,
        name: prev.name.trim(),
      }));

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600 dark:text-violet-400" />
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white dark:border-white/[0.08] dark:bg-[#101117]">
      <div className="border-b border-zinc-200 p-6 dark:border-white/[0.08]">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Account
        </h2>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your basic account information.
        </p>
      </div>

      <div className="space-y-6 p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Full name
          </label>

          <div className="relative">
            <UserRound size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600" />

            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm text-zinc-900 outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-[#090d17] dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-violet-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email address
          </label>

          <div className="relative">
            <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600" />

            <input
              type="email"
              name="email"
              value={user.email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-100 py-3 pl-10 pr-4 text-sm text-zinc-500 outline-none dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-500"
            />
          </div>

          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-600">
            Your email address cannot be changed here.
          </p>
        </div>

        <div className="flex justify-end border-t border-zinc-200 pt-5 dark:border-white/[0.08]">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !user.name.trim()}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save changes
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}