"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useState, useRef, useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : theme === "dark" ? (
          <Moon className="h-5 w-5 text-blue-400" />
        ) : (
          <Monitor className="h-5 w-5 text-white/70" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-lg bg-card border border-white/10 shadow-xl overflow-hidden z-50">
          <button
            onClick={() => { setTheme("light"); setIsOpen(false); }}
            className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${
              theme === "light" ? "text-purple-400" : "text-white/70"
            }`}
          >
            <Sun className="h-4 w-4" />
            Light
          </button>
          <button
            onClick={() => { setTheme("dark"); setIsOpen(false); }}
            className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${
              theme === "dark" ? "text-purple-400" : "text-white/70"
            }`}
          >
            <Moon className="h-4 w-4" />
            Dark
          </button>
          <button
            onClick={() => { setTheme("system"); setIsOpen(false); }}
            className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${
              theme === "system" ? "text-purple-400" : "text-white/70"
            }`}
          >
            <Monitor className="h-4 w-4" />
            System
          </button>
        </div>
      )}
    </div>
  );
}

// Simple toggle button (no dropdown)
export function ThemeToggleSimple() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-blue-400" />
      )}
    </button>
  );
}