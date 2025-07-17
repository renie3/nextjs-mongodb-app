"use client";

import { useEffect } from "react";
import useThemeStore from "@/lib/zustand/useThemeStore";

const DarkModeToggle = () => {
  const { darkMode, setTheme } = useThemeStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <button
      className="flex items-center justify-between p-0.5 w-12.5 h-7 border border-gray-600 rounded-full cursor-pointer relative"
      onClick={setTheme}
    >
      <div className="text-sm">🌙</div>
      <div className="text-sm">🔆</div>
      <div
        className={`w-5 h-5 bg-green-500 rounded-full absolute transition-all duration-300 ease-in-out ${
          darkMode ? "translate-x-0" : "translate-x-6"
        }`}
      />
    </button>
  );
};

export default DarkModeToggle;
