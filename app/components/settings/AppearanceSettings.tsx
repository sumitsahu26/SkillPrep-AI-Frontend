"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function AppearanceSettings() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme !== "light";

    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;

    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle(
      "dark",
      newDarkMode
    );

    localStorage.setItem(
      "theme",
      newDarkMode ? "dark" : "light"
    );
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white dark:border-white/[0.08] dark:bg-[#101117]">
      <div className="border-b border-zinc-200 p-6 dark:border-white/[0.08]">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Appearance
        </h2>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Customize how SkillPrep AI looks on your device.
        </p>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/[0.08] dark:bg-[#090d17]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                {darkMode ? "Dark mode" : "Light mode"}
              </p>

              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                Choose your preferred appearance.
              </p>
            </div>
          </div>

          <button type="button" onClick={toggleDarkMode} aria-label="Toggle dark mode" className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${darkMode ? "bg-violet-600" : "bg-zinc-300 dark:bg-white/10"}`}>
            <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${darkMode ? "left-6" : "left-1"}`} />
          </button>
        </div>
      </div>
    </section>
  );
}