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
  Settings,
  Sun,
  MessageSquare,
  BriefcaseBusiness,
  CheckCircle2,
  Loader2,
  Trash2,
} from "lucide-react";

import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  type Notification,
} from "@/services/notificationApi";

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

  const notificationRef = useRef<HTMLDivElement | null>(null);

  const [notificationOpen, setNotificationOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [notificationLoading, setNotificationLoading] = useState(false);

  const [markingAllRead, setMarkingAllRead] = useState(false);

  const [deletingNotificationId, setDeletingNotificationId] = useState<
    string | null
  >(null);

  // =========================================================
  // LOAD PROFILE
  // =========================================================

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

  // =========================================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // =========================================================
  // PROFILE DATA
  // =========================================================

  const name = profile?.userId?.name || "My Profile";

  const email = profile?.userId?.email || "";

  const role = profile?.currentRole || "Developer";

  // =========================================================
  // DARK / LIGHT MODE
  // =========================================================

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

  // =========================================================
  // LOAD NOTIFICATIONS
  // =========================================================

  const loadNotifications = async () => {
    try {
      setNotificationLoading(true);

      const [notificationsResponse, unreadResponse] = await Promise.all([
        getNotifications(),
        getUnreadNotificationCount(),
      ]);

      setNotifications(notificationsResponse.notifications || []);

      setUnreadCount(unreadResponse.count || 0);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setNotificationLoading(false);
    }
  };

  // Load notifications when Topbar mounts
  useEffect(() => {
    loadNotifications();
  }, []);

  // =========================================================
  // OPEN NOTIFICATION DROPDOWN
  // =========================================================

  const handleNotificationToggle = async () => {
    const newState = !notificationOpen;

    setNotificationOpen(newState);

    if (newState) {
      await loadNotifications();
    }
  };

  // =========================================================
  // MARK SINGLE NOTIFICATION AS READ
  // =========================================================

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);

        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  isRead: true,
                }
              : item
          )
        );

        setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
      }

      setNotificationOpen(false);

      if (notification.link) {
        window.location.href = notification.link;
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);

      if (notification.link) {
        window.location.href = notification.link;
      }
    }
  };

  // =========================================================
  // MARK ALL NOTIFICATIONS AS READ
  // =========================================================

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      setMarkingAllRead(true);

      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    } finally {
      setMarkingAllRead(false);
    }
  };

  // =========================================================
  // NOTIFICATION ICON
  // =========================================================

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "interview":
        return <BriefcaseBusiness size={17} />;

      case "resume":
        return <FileText size={17} />;

      case "ai_mentor":
        return <MessageSquare size={17} />;

      case "system":
      default:
        return <Bell size={17} />;
    }
  };

  // =========================================================
  // NOTIFICATION ICON STYLE
  // =========================================================

  const getNotificationIconStyle = (type: Notification["type"]) => {
    switch (type) {
      case "interview":
        return "bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300";

      case "resume":
        return "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300";

      case "ai_mentor":
        return "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300";

      case "system":
      default:
        return "bg-zinc-100 text-zinc-600 dark:bg-white/5 dark:text-zinc-300";
    }
  };

  // Delete Notification
  const handleDeleteNotification = async (notification: Notification) => {
    try {
      setDeletingNotificationId(notification._id);

      await deleteNotification(notification._id);

      setNotifications((prev) =>
        prev.filter((item) => item._id !== notification._id)
      );

      if (!notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    } finally {
      setDeletingNotificationId(null);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-zinc-200 bg-white/90 px-4 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#08090d]/90 sm:px-7">
      {/* =====================================================
          LEFT
      ===================================================== */}

      <div className="flex items-center gap-3">
        {/* MENU */}

        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
          className="rounded-lg border border-zinc-200 p-2 text-zinc-600 hover:bg-black/5 lg:hidden dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
        >
          <Menu size={20} />
        </button>

        {/* SEARCH */}

        <div className="hidden items-center gap-2 rounded-xl border border-zinc-200 bg-black/[0.02] px-3 py-2.5 sm:flex sm:w-64 dark:border-white/[0.08] dark:bg-white/[0.02]">
          <Search size={17} className="text-zinc-500" />

          <input
            type="search"
            placeholder="Search topics..."
            aria-label="Search topics"
            className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-white"
          />

          <span className="rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:border-white/10">
            /
          </span>
        </div>

        {/* MOBILE TITLE */}

        <p className="text-sm font-semibold text-zinc-900 sm:hidden dark:text-white">
          Dashboard
        </p>
      </div>

      {/* =====================================================
          RIGHT
      ===================================================== */}

      <div className="flex items-center gap-3 sm:gap-5">
        {/* ===================================================
            NOTIFICATIONS
        ==================================================== */}

        <div ref={notificationRef} className="relative">
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={notificationOpen}
            onClick={handleNotificationToggle}
            className="relative rounded-xl p-2 text-zinc-500 transition hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[9px] font-semibold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* NOTIFICATION DROPDOWN */}

          {notificationOpen && (
            <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[360px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-white/[0.08] dark:bg-[#101117]">
              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Notifications
                  </h3>

                  {unreadCount > 0 && (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    disabled={markingAllRead}
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-violet-400"
                  >
                    {markingAllRead && (
                      <Loader2 size={12} className="animate-spin" />
                    )}
                    Mark all as read
                  </button>
                )}
              </div>

              {/* BODY */}

              <div className="max-h-[400px] overflow-y-auto">
                {notificationLoading ? (
                  <div className="flex flex-col items-center justify-center px-4 py-10">
                    <Loader2
                      size={22}
                      className="animate-spin text-violet-500"
                    />

                    <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                      Loading notifications...
                    </p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-white/5">
                      <Bell className="text-zinc-400" size={20} />
                    </div>

                    <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                      No notifications
                    </p>

                    <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                      You're all caught up.
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`group relative border-b border-zinc-100 transition dark:border-white/[0.05] ${
                        !notification.isRead
                          ? "bg-violet-50/50 dark:bg-violet-500/[0.04]"
                          : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
                        className="block w-full p-4 pr-12 text-left transition hover:bg-zinc-50 dark:hover:bg-white/[0.03]"
                      >
                        <div className="flex gap-3">
                          {/* ICON */}

                          <div
                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${getNotificationIconStyle(
                              notification.type
                            )}`}
                          >
                            {getNotificationIcon(notification.type)}
                          </div>

                          {/* CONTENT */}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2">
                              <p className="min-w-0 flex-1 text-sm font-medium text-zinc-900 dark:text-white">
                                {notification.title}
                              </p>

                              {!notification.isRead && (
                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                              )}
                            </div>

                            <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                              {notification.description}
                            </p>

                            <p className="mt-2 text-[10px] text-zinc-400 dark:text-zinc-500">
                              {formatNotificationDate(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        disabled={deletingNotificationId === notification._id}
                        onClick={() => handleDeleteNotification(notification)}
                        aria-label="Delete notification"
                        title="Delete notification"
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 group-hover:opacity-100 dark:text-zinc-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      >
                        {deletingNotificationId === notification._id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* FOOTER */}

              <div className="border-t border-zinc-200 p-2 dark:border-white/[0.08]">
                <Link
                  href="/setting?section=notifications"
                  onClick={() => setNotificationOpen(false)}
                  className="block rounded-lg px-3 py-2 text-center text-xs font-medium text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-500/10"
                >
                  Notification settings
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* DIVIDER */}

        <div className="h-8 w-px bg-zinc-200 dark:bg-white/10" />

        {/* ===================================================
            PROFILE DROPDOWN
        ==================================================== */}

        <div ref={menuRef} className="relative">
          {/* PROFILE BUTTON */}

          <button
            type="button"
            onClick={() => setProfileMenuOpen((previous) => !previous)}
            className="flex items-center gap-2.5 rounded-xl p-1.5 transition hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            aria-label="User profile menu"
            aria-expanded={profileMenuOpen}
          >
            {/* AVATAR */}

            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
              {loading ? (
                "..."
              ) : profile?.userId?.profileImage ? (
                <img
                  src={profile.userId.profileImage}
                  alt={profile?.userId?.name || "User"}
                  className="h-full w-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                getInitials(name)
              )}
            </div>

            {/* NAME */}

            <div className="hidden text-left sm:block">
              <p className="max-w-[150px] truncate text-sm font-semibold text-zinc-900 dark:text-zinc-200">
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

          {/* PROFILE DROPDOWN */}

          {profileMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[260px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-black/20 dark:border-white/[0.09] dark:bg-[#111218] dark:shadow-black/50">
              {/* USER DETAILS */}

              <div className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
                  {loading ? (
                    "..."
                  ) : profile?.userId?.profileImage ? (
                    <img
                      src={profile.userId.profileImage}
                      alt={profile?.userId?.name || "User"}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(name)
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
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
                  <span className="flex justify-center rounded-md border border-violet-500/20 bg-violet-500/[0.07] px-2 py-1 text-[11px] text-violet-600 dark:text-violet-300">
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
                    <div className="flex h-4 w-8 items-center justify-center rounded-lg bg-violet-500/[0.08]">
                      {darkMode ? (
                        <Moon
                          size={16}
                          className="text-violet-600 dark:text-violet-300"
                        />
                      ) : (
                        <Sun size={16} className="text-amber-500" />
                      )}
                    </div>

                    <span className="text-sm">
                      {darkMode ? "Dark mode" : "Light mode"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleDarkMode}
                    aria-label="Toggle dark mode"
                    className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${
                      darkMode ? "bg-violet-600" : "bg-zinc-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-300 ${
                        darkMode ? "left-[18px]" : "left-0.5"
                      }`}
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
                      className="text-violet-600 dark:text-violet-300"
                    />
                  </div>

                  <div className="text-left">
                    <p className="font-medium">My Profile</p>

                    <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-600">
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
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-700 transition hover:bg-black/[0.05] hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/[0.05] dark:hover:text-white"
                >
                  <div className="flex h-4 w-8 items-center justify-center rounded-lg bg-violet-500/[0.08]">
                    <FileText
                      size={16}
                      className="text-violet-600 dark:text-violet-300"
                    />
                  </div>

                  <div className="text-left">
                    <p className="font-medium">My Resumes</p>

                    <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-600">
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
                      Manage your account settings
                    </p>
                  </div>
                </Link>
              </div>

              <div className="h-px bg-zinc-200 dark:bg-white/[0.07]" />

              {/* LOGOUT */}

              <div className="p-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 transition hover:bg-red-500/[0.07] dark:text-red-300"
                >
                  <div className="flex h-4 w-8 items-center justify-center rounded-lg bg-red-500/[0.07]">
                    <LogOut size={16} />
                  </div>

                  <div className="text-left">
                    <p className="font-medium">Logout</p>

                    <p className="mt-0.5 text-[11px] text-red-400/60 dark:text-red-300/50">
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

// =========================================================
// FORMAT NOTIFICATION DATE
// =========================================================

function formatNotificationDate(date: string): string {
  const notificationDate = new Date(date);

  if (Number.isNaN(notificationDate.getTime())) {
    return "";
  }

  const now = new Date();

  const diff = now.getTime() - notificationDate.getTime();

  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return notificationDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// =========================================================
// INITIALS
// =========================================================

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
