import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeState = {
  darkMode: boolean;
  setTheme: () => void;
};

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      darkMode: false,
      setTheme: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    { name: "theme-storage" }
  )
);

export default useThemeStore;
