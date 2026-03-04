"use client";

import { useEffect, useRef, useState } from "react";
import { useCurtain } from "@/hooks/useCurtain";
import { cn } from "@/lib/utils";

interface CurtainCompareProps {
  originalSrc: string;
  resultSrc: string;
  width: string;
  height: string;
  bgColor: string;
}

export function CurtainCompare({
  originalSrc,
  resultSrc,
  width,
  height,
  bgColor,
}: CurtainCompareProps) {
  const { pct, setPct, stageRef, onMouseDown, onTouchStart, onStageClick } =
    useCurtain(50);
  const [stageHeight, setStageHeight] = useState(360);
  const [revealed, setRevealed] = useState(false);
  const handleRef = useRef<HTMLDivElement>(null);

  // Curtain sweep-in animation on mount
  useEffect(() => {
    setPct(100);
    const t1 = setTimeout(() => setRevealed(true), 50);
    const t2 = setTimeout(() => setPct(50), 950);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [setPct]);

  // Dynamic height calculation
  useEffect(() => {
    if (width && height) {
      const w = parseInt(width);
      const h = parseInt(height);
      if (w && h) {
        const maxW = Math.min(920, window.innerWidth - 40);
        const ratio = h / w;
        const newHeight = Math.min(520, maxW * ratio);

        // Use requestAnimationFrame to avoid synchronous setState lint error
        requestAnimationFrame(() => {
          setStageHeight(newHeight);
        });
      }
    }
  }, [width, height]);

  // Check for dark mode safely
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
  }, []);

  const checkerClass = isDark ? "checker-dark" : "checker-light";

  return (
    <div
      className="rounded-[24px] overflow-hidden mb-2.5"
      style={{
        backgroundColor: "var(--bg2)",
        border: "1.5px solid var(--line)",
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--line)" }}
      >
        <span
          className="text-[11px] font-bold tracking-[0.6px] uppercase"
          style={{ color: "var(--tx2)" }}
        >
          Before / After — drag to compare
        </span>
        {width && height && (
          <span className="text-[11px]" style={{ color: "var(--tx3)" }}>
            {width}×{height}px
          </span>
        )}
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        className={cn(
          "relative w-full select-none cursor-col-resize",
          checkerClass,
        )}
        style={{
          height: stageHeight,
          // Fixed: Using longhand properties to avoid React style conflicts
          backgroundColor: bgColor !== "transparent" ? bgColor : "transparent",
          backgroundImage: bgColor !== "transparent" ? "none" : undefined,
          backgroundSize: bgColor !== "transparent" ? "auto" : undefined,
        }}
        onClick={onStageClick}
      >
        {/* Original — full width behind */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={originalSrc}
          alt="Original"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ zIndex: 1 }}
          draggable={false}
        />

        {/* Result — clipped from left by pct */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resultSrc}
          alt="Background removed"
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            zIndex: 2,
            clipPath: `inset(0 ${100 - pct}% 0 0)`,
            transition: revealed ? "none" : "clip-path 0.05s linear",
          }}
          draggable={false}
        />

        {/* Curtain handle */}
        <div
          ref={handleRef}
          className="absolute top-0 bottom-0 w-[3px] -translate-x-1/2 z-10 cursor-col-resize"
          style={{
            left: `${pct}%`,
            backgroundColor: "var(--accent)",
            transition: revealed
              ? "none"
              : "left 0.9s cubic-bezier(0.34,1.56,0.64,1)",
          }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        >
          {/* Knob */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "var(--accent)",
              boxShadow: "0 4px 16px var(--accent-glow)",
              color: "#000",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
              <polyline
                points="9 18 3 12 9 6"
                style={{ transform: "translateX(8px)" }}
              />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-between px-4 pointer-events-none z-[5]">
          <span
            className="text-[11px] font-bold tracking-[0.6px] uppercase text-white px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(6px)",
            }}
          >
            Original
          </span>
          <span
            className="text-[11px] font-bold tracking-[0.6px] uppercase text-white px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(6px)",
            }}
          >
            Removed ✦
          </span>
        </div>
      </div>
    </div>
  );
}
