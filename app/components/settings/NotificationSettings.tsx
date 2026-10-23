"use client";

import { useEffect, useState } from "react";
import { Bell, Mail, MessageSquare, CheckCircle2 } from "lucide-react";

interface NotificationItemProps {
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
  icon: React.ReactNode;
}

function NotificationItem({
  title,
  description,
  enabled,
  onChange,
  icon,
}: NotificationItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/[0.08] dark:bg-[#090d17]">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-white">
            {title}
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-label={`Toggle ${title}`}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${enabled ? "bg-violet-600" : "bg-zinc-300 dark:bg-white/10"}`}
      >
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${enabled ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}

export default function NotificationSettings() {
  const [interviewReminders, setInterviewReminders] = useState(true);
  const [resumeUpdates, setResumeUpdates] = useState(true);
  const [aiMentor, setAiMentor] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setInterviewReminders(localStorage.getItem("notification-interview") !== "false");
    setResumeUpdates(localStorage.getItem("notification-resume") !== "false");
    setAiMentor(localStorage.getItem("notification-ai") === "true");
  }, []);

  const updateSetting = (
    key: string,
    value: boolean,
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter(value);
    localStorage.setItem(key, String(value));
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white dark:border-white/[0.08] dark:bg-[#101117]">
      <div className="border-b border-zinc-200 p-6 dark:border-white/[0.08]">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Notifications
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Choose which notifications you want to receive.
        </p>
      </div>

      <div className="space-y-3 p-6">
        {saved && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/[0.06] dark:text-emerald-300">
            <CheckCircle2 size={16} />
            Notification preferences saved.
          </div>
        )}

        <NotificationItem
          title="Interview reminders"
          description="Get reminders about your interview preparation."
          enabled={interviewReminders}
          onChange={() => updateSetting("notification-interview", !interviewReminders, setInterviewReminders)}
          icon={<Bell size={18} />}
        />

        <NotificationItem
          title="Resume updates"
          description="Receive updates and suggestions related to your resume."
          enabled={resumeUpdates}
          onChange={() => updateSetting("notification-resume", !resumeUpdates, setResumeUpdates)}
          icon={<Mail size={18} />}
        />

        <NotificationItem
          title="AI Mentor"
          description="Receive useful suggestions and learning recommendations from AI Mentor."
          enabled={aiMentor}
          onChange={() => updateSetting("notification-ai", !aiMentor, setAiMentor)}
          icon={<MessageSquare size={18} />}
        />
      </div>
    </section>
  );
}