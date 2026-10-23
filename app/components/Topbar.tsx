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
  Sun,
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

  const [notificationOpen, setNotificationOpen] = useState(false);

  //  LOAD Profile

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

  //  CLOSE DROPDOWN WHEN CLICKING O

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

  //  PROFILE

  const name = profile?.userId?.name || "My Profile";

  const email = profile?.userId?.email || "";

  const role = profile?.currentRole || "Developer";

  const initials = getInitials(name);

  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    const isDark = savedTheme ? savedTheme === "dark" : true;

    setDarkMode(isDark);

    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;

    setDarkMode(newDarkMode);

    document.documentElement.classList.toggle("dark", newDarkMode);

    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  return (
    <header className=" sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-zinc-200 bg-white/90 px-4 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#08090d]/90 sm:px-7">
      {/* LEFT */}

      <div className="flex items-center gap-3">
        {/* MENU */}

        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
          className=" rounded-lg border border-zinc-200 p-2 text-zinc-600 hover:bg-black/5 lg:hidden dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
        >
          <Menu size={20} />
        </button>

        {/* SEARCH */}

        <div className=" hidden items-center gap-2 rounded-xl border border-zinc-200 bg-black/[0.02] px-3 py-2.5 sm:flex sm:w-64 dark:border-white/[0.08] dark:bg-white/[0.02]">
          <Search size={17} className="text-zinc-500" />

          <input
            type="search"
            placeholder="Search topics..."
            aria-label="Search topics"
            className=" w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-white"
          />

          <span className=" rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:border-white/10">
            /
          </span>
        </div>

        <p
          className=" text-sm font-semibold text-zinc-900 sm:hidden dark:text-white
          "
        >
          Dashboard
        </p>
      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-3 sm:gap-5">
        {/* NOTIFICATIONS */}

        <button
          type="button"
          aria-label="Notifications"
          onClick={() => setNotificationOpen((previous) => !previous)}
          className="relative rounded-xl p-2 text-zinc-500 transition hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-400" />
        </button>

        {notificationOpen && (
          <div className="absolute right-4 top-[70px] z-50 w-[340px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-white/[0.08] dark:bg-[#101117]">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-white/[0.08]">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Notifications
              </h3>

              <button
                type="button"
                className="text-xs text-violet-600 hover:text-violet-700 dark:text-violet-400"
              >
                Mark all as read
              </button>
            </div>

            <div className="p-2">
              <div className="rounded-xl p-3 transition hover:bg-zinc-100 dark:hover:bg-white/[0.04]">
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  Welcome to SkillPrep AI
                </p>

                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Start building your resume and preparing for interviews.
                </p>

                <p className="mt-2 text-[11px] text-zinc-400">Just now</p>
              </div>
            </div>

            <div className="border-t border-zinc-200 p-2 dark:border-white/[0.08]">
              <Link
                href="/setting?section=notifications"
                className="block rounded-lg px-3 py-2 text-center text-xs font-medium text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-500/10"
              >
                Notification settings
              </Link>
            </div>
          </div>
        )}

        <div className=" h-8 w-px bg-zinc-200 dark:bg-white/10" />

        {/* ===================================================
            PROFILE DROPDOWN
        ==================================================== */}

        <div ref={menuRef} className="relative">
          {/* PROFILE BUTTON */}

          <button
            type="button"
            onClick={() => setProfileMenuOpen((previous) => !previous)}
            className=" flex items-center gap-2.5 rounded-xl p-1.5 transition hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            aria-label="User profile menu"
            aria-expanded={profileMenuOpen}
          >
            {/* AVATAR */}

            <div className=" flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
              {loading ? (
                "..."
              ) : profile?.userId?.profileImage ? (
                <img
                  src={profile.userId.profileImage}
                  alt={profile?.userId?.name || "User"}
                  className=" h-full w-full rounded-full object-cover
                  "
                  referrerPolicy="no-referrer"
                />
              ) : (
                name.charAt(0).toUpperCase()
              )}
            </div>

            {/* NAME */}

            <div className="hidden text-left sm:block">
              <p className=" max-w-[150px] truncate text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                {loading ? "Loading..." : name}
              </p>

              <p
                className=" max-w-[150px] truncate text-xs text-zinc-500
                "
              >
                {role}
              </p>
            </div>

            <ChevronDown
              size={15}
              className={` hidden text-zinc-500 transition-transform duration-200 sm:block
                ${profileMenuOpen ? "rotate-180" : ""}
              `}
            />
          </button>

          {/* DROPDOWN */}

          {profileMenuOpen && (
            <div className=" absolute right-0 top-[calc(100%+12px)] z-50 w-[260px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-black/20 dark:border-white/[0.09] dark:bg-[#111218] dark:shadow-black/50">
              {/* USER DETAILS */}

              <div className="flex items-center gap-3 p-4">
                <div className=" flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
                  {loading ? (
                    "..."
                  ) : profile?.userId?.profileImage ? (
                    <img
                      src={profile.userId.profileImage}
                      alt={profile?.userId?.name || "User"}
                      className="h-full w-full rounded-full object-cover "
                    />
                  ) : (
                    name.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="min-w-0">
                  <p
                    className=" truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100
                    "
                  >
                    {name}
                  </p>

                  <p
                    className=" mt-0.5 truncate text-xs text-zinc-500
                    "
                  >
                    {email || "No email"}
                  </p>
                </div>
              </div>

              {/* ROLE */}

              {profile?.currentRole && (
                <div className="px-4 pb-3">
                  <span className=" flex justify-center rounded-md border border-violet-500/20 bg-violet-500/[0.07] px-2 py-1 text-[11px] text-violet-600 dark:text-violet-300">
                    {profile.currentRole}
                  </span>
                </div>
              )}

              <div className="h-px bg-zinc-200 dark:bg-white/[0.07]" />

              {/* =================================================
                  DARK / LIGHT MODE
              ================================================== */}

              <div className="p-1">
                <div className="flex items-center justify-between rounded-lg px-3 py-3 text-zinc-700 transition hover:bg-black/[0.05] dark:text-zinc-300 dark:hover:bg-white/[0.05] dark:hover:text-white">
                  <div className="flex gap-4">
                    <div className="flex h-4 w-8 items-center justify-center rounded-lg bg-violet-500/[0.08] ">
                      {" "}
                      {darkMode ? (
                        <Moon
                          size={16}
                          className=" text-violet-600 dark:text-violet-300     "
                        />
                      ) : (
                        <Sun size={16} className="text-amber-500" />
                      )}
                    </div>

                    <span className="text-sm">
                      {" "}
                      {darkMode ? "Dark mode" : "Light mode"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleDarkMode}
                    aria-label="Toggle dark mode"
                    className={` relative h-5 w-9 rounded-full transition-colors duration-300 ${
                      darkMode ? "bg-violet-600" : "bg-zinc-300"
                    }
                    `}
                  >
                    <span
                      className={` absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-300 ${
                        darkMode ? "left-[18px]" : "left-0.5"
                      } `}
                    />
                  </button>
                </div>
              </div>

              {/* PROFILE */}

              <div className="p-1">
                <Link
                  href="/profile"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-700 transition hover:bg-black/[0.05] hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/[0.05] dark:hover:text-white"
                >
                  <div className="flex h-4 w-8 items-center justify-center rounded-lg bg-violet-500/[0.08]">
                    <User
                      size={16}
                      className="text-violet-600 dark:text-violet-300 "
                    />
                  </div>

                  <div className="text-left">
                    <p className="font-medium">My Profile</p>

                    <p className="   mt-0.5   text-[11px]   text-zinc-500   dark:text-zinc-600 ">
                      {" "}
                      View and Edit your profile
                    </p>
                  </div>
                </Link>
              </div>

              {/* RESUMES */}

              <div className="p-1">
                <Link
                  href="/resumes"
                  onClick={() => setProfileMenuOpen(false)}
                  className=" flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-700 transition hover:bg-black/[0.05] hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/[0.05] dark:hover:text-white"
                >
                  <div
                    className=" flex h-4 w-8 items-center justify-center rounded-lg bg-violet-500/[0.08]
                    "
                  >
                    <FileText
                      size={16}
                      className="text-violet-600 dark:text-violet-300 "
                    />
                  </div>

                  <div className="text-left">
                    <p className="font-medium">My Resumes</p>

                    <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-600 ">
                      {" "}
                      View and Manage your resumes
                    </p>
                  </div>
                </Link>
              </div>

              {/* SETTINGS */}

              <div className="p-1">
                <Link
                  href="/setting"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-700 transition hover:bg-black/[0.05] hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/[0.05] dark:hover:text-white"
                >
                  <div className="flex h-4 w-8 items-center justify-center rounded-lg bg-violet-500/[0.08]">
                    <Settings
                      size={16}
                      className="text-violet-600 dark:text-violet-300"
                    />
                  </div>

                  <div className="text-left">
                    <p className="font-medium">Settings</p>
                    <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-600">
                      {" "}
                      Manage your account settings
                    </p>
                  </div>
                </Link>
              </div>

              <div className=" h-px bg-zinc-200 dark:bg-white/[0.07]" />

              {/* LOGOUT */}

              <div className="p-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);

                    logout();
                  }}
                  className=" flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 transition hover:bg-red-500/[0.07] dark:text-red-300"
                >
                  <div
                    className=" flex h-4 w-8 items-center justify-center rounded-lg bg-red-500/[0.07]
                    "
                  >
                    <LogOut size={16} />
                  </div>

                  <div className="text-left">
                    <p className="font-medium">Logout</p>

                    <p className="mt-0.5 text-[11px] text-red-400/60 dark:text-red-300/50 ">
                      {" "}
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
//  INITIALS

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
