"use client";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function applyTheme(t: Theme) {
  if (typeof window === "undefined") return;
  document.documentElement.classList.remove("dark", "light");
  document.documentElement.classList.add(t);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("cutout_theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      requestAnimationFrame(() => {
        setTheme(stored);
        applyTheme(stored);
      });
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("cutout_theme", next);
  };

  return { theme, toggle };
}
