import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: false,
      toggle: () => {
        const next = !get().isDark;
        set({ isDark: next });
        document.documentElement.classList.toggle("dark", next);
      },
      init: () => {
        document.documentElement.classList.toggle("dark", get().isDark);
      },
    }),
    { name: "shopi-theme" }
  )
);
