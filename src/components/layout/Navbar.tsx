"use client";

import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activePage?: "home" | "api" | "pricing";
}

export function Navbar({ activePage }: NavbarProps) {
  const { theme, toggle } = useTheme();

  return (
    <nav className="flex items-center justify-between py-5 pb-6">
      <Link
        href="/"
        className="font-black text-[21px] tracking-tight text-[var(--tx)] hover:opacity-80 transition-opacity"
        style={{ color: "var(--tx)" }}
      >
        cut<span style={{ color: "var(--accent)" }}>out</span>
      </Link>

      <div className="flex items-center gap-1.5">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className={cn(
            "w-[37px] h-[37px] rounded-full flex items-center justify-center transition-all duration-200",
            "border border-[var(--line2)] bg-[var(--bg3)]",
            "text-[var(--tx2)] hover:text-[var(--tx)] hover:bg-[var(--bg4)]",
          )}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            // Sun icon
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            // Moon icon
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <Link
          href="/api-docs"
          className={cn(
            "text-[13px] font-medium px-[15px] py-[7px] rounded-full border transition-all duration-200",
            "border-[var(--line2)] text-[var(--tx2)] hover:bg-[var(--bg3)] hover:text-[var(--tx)]",
            activePage === "api" && "bg-[var(--bg3)] text-[var(--tx)]",
          )}
        >
          API
        </Link>

        <Link
          href="/pricing"
          className={cn(
            "text-[13px] font-bold px-[15px] py-[7px] rounded-full border transition-all duration-200",
            "bg-[var(--accent)] border-[var(--accent)] text-black",
            "hover:bg-[var(--accent2)] hover:border-[var(--accent2)]",
            activePage === "pricing" && "opacity-90",
          )}
        >
          Pricing
        </Link>
      </div>
    </nav>
  );
}
