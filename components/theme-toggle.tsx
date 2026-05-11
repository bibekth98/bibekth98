"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const iconMap = {
  system: Monitor,
  light: Sun,
  dark: Moon,
} as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (theme ?? "system") : "system";
  const Icon = iconMap[currentTheme as keyof typeof iconMap] ?? Monitor;

  return (
    <label className="relative inline-flex items-center rounded-xl border border-black/10 bg-white/80 px-2 py-1 text-sm text-black/80 shadow-sm backdrop-blur dark:border-white/20 dark:bg-white/5 dark:text-white/80">
      <span className="sr-only">Select theme</span>
      <Icon className="mr-2 size-4" aria-hidden="true" />
      <select
        aria-label="Theme"
        className="cursor-pointer bg-transparent pr-1 outline-none"
        value={currentTheme}
        onChange={(event) => setTheme(event.target.value)}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
