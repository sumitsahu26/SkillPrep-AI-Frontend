"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AuthGuard from "../components/AuthGuard";

import SettingsSidebar from "../components/settings/SettingsSidebar";
import AccountSettings from "../components/settings/AccountSettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import DangerZone from "../components/settings/DangerZone";

type SettingsSection =
  | "account"
  | "appearance"
  | "security"
  | "notifications"
  | "danger";

const validSections: SettingsSection[] = [
  "account",
  "appearance",
  "security",
  "notifications",
  "danger",
];

// PAGE

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <SettingsContent />
    </Suspense>
  );
}

// SETTINGS CONTENT
// useSearchParams must be inside Suspense

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeSection, setActiveSection] =
    useState<SettingsSection>("account");


  // READ SECTION FROM URL


  useEffect(() => {
    const section = searchParams.get("section");

    if (section && validSections.includes(section as SettingsSection)) {
      setActiveSection(section as SettingsSection);
    } else {
      setActiveSection("account");
    }
  }, [searchParams]);


  // CHANGE SECTION


  const handleSectionChange = (section: string) => {
    const newSection = section as SettingsSection;

    if (!validSections.includes(newSection)) {
      return;
    }

    setActiveSection(newSection);

    router.replace(`/setting?section=${newSection}`, {
      scroll: false,
    });
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-[#08090d] dark:text-white">
        {/* SIDEBAR */}

        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* CONTENT */}

        <div className="lg:pl-[260px]">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">
              {/* HEADER */}

              <div className="mb-7">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  Settings
                </h1>

                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Manage your account and application preferences.
                </p>
              </div>

              {/* SETTINGS LAYOUT */}

              <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
                {/* SETTINGS SIDEBAR */}
                
                <SettingsSidebar
                  activeSection={activeSection}
                  onSectionChange={handleSectionChange}
                />

                {/* SETTINGS CONTENT */}

                <div>
                  {activeSection === "account" && <AccountSettings />}

                  {activeSection === "appearance" && <AppearanceSettings />}

                  {activeSection === "security" && <SecuritySettings />}

                  {activeSection === "notifications" && (
                    <NotificationSettings />
                  )}

                  {activeSection === "danger" && <DangerZone />}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

// LOADING

function SettingsLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-[#08090d]">
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        Loading settings...
      </div>
    </div>
  );
}
