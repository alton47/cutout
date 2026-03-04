"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ImageFormat, BgColor } from "@/types";

interface ActionsBarProps {
  onDownload: (format: ImageFormat, bg: BgColor) => void;
  onCopy: () => void;
  onReset: () => void;
  resultBlob: Blob;
  bgColor: BgColor;
  onBgChange: (color: BgColor) => void;
}

const SWATCHES: Array<{
  color: BgColor;
  label: string;
  checker?: boolean;
  style?: React.CSSProperties;
}> = [
  { color: "transparent", label: "Transparent", checker: true },
  {
    color: "#ffffff",
    label: "White",
    style: { background: "#fff", border: "2px solid var(--line2)" },
  },
  { color: "#000000", label: "Black", style: { background: "#000" } },
  { color: "#1d4ed8", label: "Blue", style: { background: "#1d4ed8" } },
  { color: "#15803d", label: "Green", style: { background: "#15803d" } },
];

export function ActionsBar({
  onDownload,
  onCopy,
  onReset,
  bgColor,
  onBgChange,
}: ActionsBarProps) {
  const [format, setFormat] = useState<ImageFormat>("png");

  return (
    <div
      className="flex items-center gap-2.5 rounded-[20px] px-[18px] py-3 flex-wrap"
      style={{ background: "var(--bg2)", border: "1.5px solid var(--line)" }}
    >
      {/* Format */}
      <span
        className="text-[12px] whitespace-nowrap"
        style={{ color: "var(--tx2)" }}
      >
        Format
      </span>
      <select
        className="text-[13px] px-3 py-1.5 rounded-lg border outline-none cursor-pointer"
        style={{
          background: "var(--bg3)",
          borderColor: "var(--line)",
          color: "var(--tx)",
          fontFamily: "var(--font-outfit)",
        }}
        value={format}
        onChange={(e) => setFormat(e.target.value as ImageFormat)}
      >
        <option value="png">PNG (transparent)</option>
        <option value="jpg">JPG</option>
        <option value="webp">WebP</option>
      </select>

      {/* BG */}
      <span
        className="text-[12px] whitespace-nowrap"
        style={{ color: "var(--tx2)" }}
      >
        BG
      </span>
      <div className="flex gap-1.5 items-center">
        {SWATCHES.map((s) => (
          <button
            key={s.color}
            title={s.label}
            onClick={() => onBgChange(s.color)}
            className={cn(
              "w-6 h-6 rounded-[6px] transition-transform duration-150 hover:scale-[1.2]",
              bgColor === s.color &&
                "ring-2 ring-[var(--accent)] ring-offset-1 ring-offset-[var(--bg2)]",
            )}
            style={
              s.checker
                ? {
                    backgroundImage:
                      "linear-gradient(45deg, var(--bg4) 25%, transparent 25%), linear-gradient(-45deg, var(--bg4) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--bg4) 75%), linear-gradient(-45deg, transparent 75%, var(--bg4) 75%)",
                    backgroundSize: "8px 8px",
                    backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0",
                    backgroundColor: "var(--bg3)",
                  }
                : s.style
            }
          />
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Copy */}
        <button
          onClick={onCopy}
          title="Copy to clipboard"
          className="w-9 h-9 rounded-[10px] flex items-center justify-center border transition-all duration-200 hover:text-[var(--tx)]"
          style={{
            background: "var(--bg3)",
            borderColor: "var(--line)",
            color: "var(--tx2)",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>

        {/* New image */}
        <button
          onClick={onReset}
          className="text-[13px] font-medium px-[18px] py-2.5 rounded-full border transition-all duration-200"
          style={{
            background: "none",
            borderColor: "var(--line2)",
            color: "var(--tx2)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = "var(--bg3)";
            el.style.color = "var(--tx)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = "none";
            el.style.color = "var(--tx2)";
          }}
        >
          ↑ New image
        </button>

        {/* Download */}
        <button
          onClick={() => onDownload(format, bgColor)}
          className="flex items-center gap-2 font-bold text-[14px] px-[22px] py-2.5 rounded-full border-none text-black transition-all duration-200 hover:-translate-y-px"
          style={{ background: "var(--accent)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--accent2)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 8px 24px var(--accent-glow)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--accent)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
      </div>
    </div>
  );
}
