"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  Bell,
  Mail,
  MessageSquare,
  CheckCircle2,
  FileText,
  BrainCircuit,
  Map,
  ShieldCheck,
  Loader2,
  AlertCircle,
  ClipboardCheck,
} from "lucide-react";

import {
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
} from "@/services/notificationApi";

interface NotificationItemProps {
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
  icon: ReactNode;
  disabled?: boolean;
  locked?: boolean;
}

function NotificationItem({
  title,
  description,
  enabled,
  onChange,
  icon,
  disabled = false,
  locked = false,
}: NotificationItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/[0.08] dark:bg-[#090d17]">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
          {icon}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-zinc-900 dark:text-white">
              {title}
            </p>

            {locked && (
              <span className="rounded-md bg-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-white/10 dark:text-zinc-400">
                Required
              </span>
            )}
          </div>

          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onChange}
        disabled={disabled || locked}
        aria-label={`Toggle ${title}`}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          enabled
            ? "bg-violet-600"
            : "bg-zinc-300 dark:bg-white/10"
        } ${
          disabled || locked
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer"
        }`}
      >
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${enabled ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}

const defaultPreferences: NotificationPreferences = {
  interviewReminders: true,
  mockInterviewResults: true,
  resumeUpdates: true,
  aiMentor: true,
  roadmapUpdates: true,
  skillAssessmentResults: true,
  emailNotifications: false,
};

export default function NotificationSettings() {
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(
      defaultPreferences
    );

  const [loading, setLoading] =
    useState(true);

  const [savingKey, setSavingKey] =
    useState<
      keyof NotificationPreferences | null
    >(null);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================================================
  // LOAD SETTINGS
  // =========================================================

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getNotificationPreferences();

        setPreferences(
          response.preferences
        );
      } catch (error) {
        console.error(
          "Load notification preferences error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load notification preferences."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // =========================================================
  // UPDATE SETTING
  // =========================================================

  const updateSetting = async (
    key: keyof NotificationPreferences
  ) => {
    if (savingKey) {
      return;
    }

    const oldValue = preferences[key];

    const newValue = !oldValue;

    // optimistic UI update
    setPreferences((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    try {
      setSavingKey(key);
      setError("");
      setSaved(false);

      const response =
        await updateNotificationPreferences({
          [key]: newValue,
        });

      setPreferences(
        response.preferences
      );

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      // rollback
      setPreferences((prev) => ({
        ...prev,
        [key]: oldValue,
      }));

      console.error(
        "Update notification preference error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update notification preference."
      );
    } finally {
      setSavingKey(null);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white dark:border-white/[0.08] dark:bg-[#101117]">
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <Loader2 size={24} className="mx-auto animate-spin text-violet-600 dark:text-violet-400" />

            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              Loading notification preferences...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white dark:border-white/[0.08] dark:bg-[#101117]">
      {/* HEADER */}

      <div className="border-b border-zinc-200 p-6 dark:border-white/[0.08]">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Notifications
        </h2>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Choose which SkillPrep AI notifications you want to receive.
        </p>
      </div>

      <div className="space-y-6 p-6">
        {/* SUCCESS */}

        {saved && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/[0.06] dark:text-emerald-300">
            <CheckCircle2 size={16} />

            Notification preferences saved.
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            <AlertCircle size={16} />

            {error}
          </div>
        )}

        {/* INTERVIEW */}

        <div>
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Interview preparation
            </h3>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              Control interview and mock interview notifications.
            </p>
          </div>

          <div className="space-y-3">
            <NotificationItem
              title="Interview reminders"
              description="Receive reminders to continue your interview preparation."
              enabled={
                preferences.interviewReminders
              }
              disabled={
                savingKey ===
                "interviewReminders"
              }
              onChange={() =>
                updateSetting(
                  "interviewReminders"
                )
              }
              icon={<Bell size={18} />}
            />

            <NotificationItem
              title="Mock interview results"
              description="Receive a notification when your mock interview results and feedback are ready."
              enabled={
                preferences.mockInterviewResults
              }
              disabled={
                savingKey ===
                "mockInterviewResults"
              }
              onChange={() =>
                updateSetting(
                  "mockInterviewResults"
                )
              }
              icon={
                <ClipboardCheck size={18} />
              }
            />
          </div>
        </div>

        {/* CAREER TOOLS */}

        <div>
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Career tools
            </h3>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              Notifications from your SkillPrep AI tools.
            </p>
          </div>

          <div className="space-y-3">
            <NotificationItem
              title="Resume updates"
              description="Receive notifications when your resume is updated or new resume suggestions are available."
              enabled={
                preferences.resumeUpdates
              }
              disabled={
                savingKey ===
                "resumeUpdates"
              }
              onChange={() =>
                updateSetting(
                  "resumeUpdates"
                )
              }
              icon={<FileText size={18} />}
            />

            <NotificationItem
              title="AI Mentor"
              description="Receive learning suggestions and recommendations from your AI Mentor."
              enabled={preferences.aiMentor}
              disabled={
                savingKey === "aiMentor"
              }
              onChange={() =>
                updateSetting("aiMentor")
              }
              icon={
                <MessageSquare size={18} />
              }
            />

            <NotificationItem
              title="Learning roadmap"
              description="Receive notifications about roadmap progress and recommended next steps."
              enabled={
                preferences.roadmapUpdates
              }
              disabled={
                savingKey ===
                "roadmapUpdates"
              }
              onChange={() =>
                updateSetting(
                  "roadmapUpdates"
                )
              }
              icon={<Map size={18} />}
            />

            <NotificationItem
              title="Skill assessment results"
              description="Receive notifications when your skill assessment results are available."
              enabled={
                preferences
                  .skillAssessmentResults
              }
              disabled={
                savingKey ===
                "skillAssessmentResults"
              }
              onChange={() =>
                updateSetting(
                  "skillAssessmentResults"
                )
              }
              icon={
                <BrainCircuit size={18} />
              }
            />
          </div>
        </div>

        {/* DELIVERY */}

        <div>
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Delivery
            </h3>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              Choose how you receive notifications.
            </p>
          </div>

          <div className="space-y-3">
            <NotificationItem
              title="Email notifications"
              description="Allow SkillPrep AI to send enabled notifications to your email."
              enabled={
                preferences.emailNotifications
              }
              disabled={
                savingKey ===
                "emailNotifications"
              }
              onChange={() =>
                updateSetting(
                  "emailNotifications"
                )
              }
              icon={<Mail size={18} />}
            />

            <NotificationItem
              title="Security notifications"
              description="Important account, password, login and security notifications."
              enabled={true}
              locked={true}
              onChange={() => {}}
              icon={
                <ShieldCheck size={18} />
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}