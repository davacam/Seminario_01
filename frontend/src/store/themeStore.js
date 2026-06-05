import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
  persist(
    (set) => ({
      isDark: true, // Default dark mode
      toggleTheme: () =>
        set((state) => ({
          isDark: !state.isDark,
        })),
      setTheme: (isDark) => set({ isDark }),
    }),
    {
      name: "theme-storage",
    }
  )
);

export default useThemeStore;
