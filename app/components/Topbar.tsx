"use client";

import {
  Bell,
  Menu,
  Search,
  ChevronDown,
  User,
  LogOut,
  Moon,
  FileText,
  Map,
  Settings,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import { getProfile, type Profile } from "@/services/profileApi";

import { logout } from "@/lib/app";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);

  const [loading, setLoading] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  /* =====================================================
     LOAD PROFILE
  ===================================================== */

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const response = await getProfile();

        setProfile(response.profile);
      } catch (error) {
        console.error("Profile load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /* =====================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ===================================================== */

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /* =====================================================
     PROFILE VALUES
  ===================================================== */

  const name = profile?.userId?.name || "My Profile";

  const email = profile?.userId?.email || "";

  const role = profile?.currentRole || "Developer";

  const initials = getInitials(name);

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-white/[0.08] bg-[#08090d]/90 px-4 backdrop-blur-xl sm:px-7">
      {/* LEFT */}

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
          className="rounded-lg border border-white/10 p-2 text-zinc-300 hover:bg-white/5 lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* SEARCH */}

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

      {/* RIGHT */}

      <div className="flex items-center gap-3 sm:gap-5">
        {/* NOTIFICATIONS */}

        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-400" />
        </button>

        <div className="h-8 w-px bg-white/10" />

        {/* ===============================================
            PROFILE DROPDOWN
        =============================================== */}

        <div ref={menuRef} className="relative">
          {/* PROFILE BUTTON */}

          <button
            type="button"
            onClick={() => setProfileMenuOpen((previous) => !previous)}
            className="flex items-center gap-2.5 rounded-xl p-1.5 transition hover:bg-white/[0.04]"
            aria-label="User profile menu"
            aria-expanded={profileMenuOpen}
          >
            {/* AVATAR */}

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
              {loading ? "..." : initials}
            </div>

            {/* NAME */}

            <div className="hidden text-left sm:block">
              <p className="max-w-[150px] truncate text-sm font-semibold text-zinc-200">
                {loading ? "Loading..." : name}
              </p>

              <p className="max-w-[150px] truncate text-xs text-zinc-500">
                {role}
              </p>
            </div>

            <ChevronDown
              size={15}
              className={`hidden text-zinc-500 transition-transform duration-200 sm:block ${
                profileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* =============================================
              DROPDOWN
          ============================================= */}

          {profileMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[260px] overflow-hidden rounded-2xl border border-white/[0.09] bg-[#111218] shadow-2xl shadow-black/50">
              {/* USER DETAILS */}

              <div className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
                  {initials}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-100">
                    {name}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-zinc-500">
                    {email || "No email"}
                  </p>
                </div>
              </div>

              {/* ROLE */}

              {profile?.currentRole && (
                <div className="px-4 pb-3">
                  <span className="flex justify-center rounded-md border border-violet-500/20 bg-violet-500/[0.07] px-2 py-1 text-[11px] text-violet-300">
                    {profile.currentRole}
                  </span>
                </div>
              )}

              <div className="h-px bg-white/[0.07]" />

              <div className="p-1">
                <div className="flex items-center justify-between rounded-lg px-3 py-3 text-zinc-300 transition hover:bg-white/[0.05] hover:text-white">
                  <div className="flex gap-4">
                  <div className="flex h-4 w-8 items-center justify-center rounded-lg bg-violet-500/[0.08]">
                    <Moon size={16} className="text-violet-300" />
                  </div>

                    <span className="text-sm">Dark mode</span>
                  </div>

                  <button
                    type="button"
                    aria-label="Toggle dark mode"
                    className="relative h-5 w-9 rounded-full bg-violet-600"
                  >
                    <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-[#151515]" />
                  </button>
                </div>
              </div>

              {/* PROFILE */}

              <div className="p-1">
                <Link
                  href="/profile"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <div className="flex h-4 w-8 items-center justify-center rounded-lg bg-violet-500/[0.08]">
                    <User size={16} className="text-violet-300" />
                  </div>

                  <div className="text-left">
                    <p className="font-medium">My Profile</p>

                    <p className="mt-0.5 text-[11px] text-zinc-600">
                      View and Edit uour profile
                    </p>
                  </div>
                </Link>
              </div>

              {/* Resumes */}
              <div className="p-1">
                <Link
                  href="/resumes"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <div className="flex h-4 w-8 items-center justify-center rounded-lg bg-violet-500/[0.08]">
                    <FileText size={16} className="text-violet-300" />
                  </div>

                  <div className="text-left">
                    <p className="font-medium">My Resumes</p>

                    <p className="mt-0.5 text-[11px] text-zinc-600">
                      View and Manage your resumes
                    </p>
                  </div>
                </Link>
              </div>

              {/* settings */}

              <div className="p-1">
                <Link
                  href="/setting"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <div className="flex h-4 w-8 items-center justify-center rounded-lg bg-violet-500/[0.08]">
                    <Settings size={16} className="text-violet-300" />
                  </div>

                  <div className="text-left">
                    <p className="font-medium">Settings</p>

                    <p className="mt-0.5 text-[11px] text-zinc-600">
                      Manage your account settings
                    </p>
                  </div>
                </Link>
              </div>

              <div className="h-px bg-white/[0.07]" />

              {/* LOGOUT */}

              <div className="p-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);

                    logout();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-300 transition hover:bg-red-500/[0.07]"
                >
                  <div className="flex h-4 w-8 items-center justify-center rounded-lg bg-red-500/[0.07]">
                    <LogOut size={16} />
                  </div>

                  <div className="text-left">
                    <p className="font-medium">Logout</p>

                    <p className="mt-0.5 text-[11px] text-red-300/50">
                      Sign out of SkillPrep AI
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   INITIALS
========================================================= */

function getInitials(name: string) {
  if (!name || name === "My Profile") {
    return "SP";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}
