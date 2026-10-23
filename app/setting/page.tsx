"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AuthGuard from "../components/AuthGuard";

import SettingsSidebar from "../components/settings/SettingsSidebar";
import AccountSettings from "../components/settings/AccountSettings";
import AppearanceSettings from '../components/settings/AppearanceSettings';
import SecuritySettings from "../components/settings/SecuritySettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import DangerZone from "../components/settings/DangerZone";

export default function SettingsPage() {
  const [activeSection, setActiveSection] =
    useState("account");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-[#08090d] dark:text-white">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}/>

        <div className="lg:pl-[260px]">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">
              <div className="mb-7">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  Settings
                </h1>

                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Manage your account and application preferences.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
                <SettingsSidebar
                  activeSection={activeSection}
                  onSectionChange={setActiveSection}
                />

                <div>
                  {activeSection === "account" && (
                    <AccountSettings />
                  )}

                  {activeSection === "appearance" && (
                    <AppearanceSettings />
                  )}

                  {activeSection === "security" && (
                    <SecuritySettings />
                  )}

                  {activeSection === "notifications" && (
                    <NotificationSettings />
                  )}

                  {activeSection === "danger" && (
                    <DangerZone />
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}