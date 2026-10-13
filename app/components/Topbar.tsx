"use client";

import { Bell, Menu, Search, ChevronDown } from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-white/[0.08] bg-[#08090d]/90 px-4 backdrop-blur-xl sm:px-7">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
          className="rounded-lg border border-white/10 p-2 text-zinc-300 hover:bg-white/5 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 sm:flex sm:w-64">
          <Search size={17} className="text-zinc-500" />
          <input
            type="search"
            placeholder="Search topics..."
            aria-label="Search topics"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
          />
          <span className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-500">
            /
          </span>
        </div>

        <p className="text-sm font-semibold sm:hidden">Dashboard</p>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-400" />
        </button>

        <div className="h-8 w-px bg-white/10" />

        <button
          type="button"
          className="flex items-center gap-2.5"
          aria-label="User profile"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
            SP
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-zinc-200">My Profile</p>
            <p className="text-xs text-zinc-500">Developer</p>
          </div>

          <ChevronDown size={15} className="hidden text-zinc-500 sm:block" />
        </button>
      </div>
    </header>
  );
}