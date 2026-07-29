"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/useThemeStore";

export function ThemeToggler() {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  // Sync state with localStorage/document on initial mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;
    const isDark = document.documentElement.classList.contains("dark");

    if (storedTheme) {
      setTheme(storedTheme);
    } else if (isDark) {
      setTheme("dark");
    }
  }, [setTheme]);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Sun
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          theme === "dark"
            ? "scale-0 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100",
        )}
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          theme === "dark"
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 -rotate-90 opacity-0",
        )}
      />
    </button>
  );
}
