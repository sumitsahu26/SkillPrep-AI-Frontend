"use client";

import {
  UserRound,
  Palette,
  ShieldCheck,
  Bell,
  Trash2,
} from "lucide-react";

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const items = [
  {
    id: "account",
    label: "Account",
    description: "Profile information",
    icon: UserRound,
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Theme preferences",
    icon: Palette,
  },
  {
    id: "security",
    label: "Security",
    description: "Password and login",
    icon: ShieldCheck,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Manage notifications",
    icon: Bell,
  },
  {
    id: "danger",
    label: "Danger Zone",
    description: "Delete account",
    icon: Trash2,
  },
];

export default function SettingsSidebar({
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) {
  return (
    <aside className="rounded-2xl border border-zinc-200 bg-white p-2 dark:border-white/[0.08] dark:bg-[#101117]">
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${active ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-white"}`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? "bg-violet-100 dark:bg-violet-500/15" : "bg-zinc-100 dark:bg-white/[0.04]"}`}>
                <Icon size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium">{item.label}</p>
                <p className={`mt-0.5 text-[11px] ${active ? "text-violet-600 dark:text-violet-400" : "text-zinc-500 dark:text-zinc-500"}`}>
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}