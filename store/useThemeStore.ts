import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  // Default to light; the layout script will adjust this before paint
  theme: "light",
  toggleTheme: () => {
    const newTheme = get().theme === "dark" ? "light" : "dark";

    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      localStorage.setItem("theme", newTheme);
    }
    set({ theme: newTheme });
  },
  setTheme: (theme) => set({ theme }),
}));
