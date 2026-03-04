"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

// Move this outside or to the top so it's available before useEffect
function applyTheme(t: Theme) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(t);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("cutout_theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      applyTheme(stored);
    }
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("cutout_theme", next);
  }

  return { theme, toggle };
}
