"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn, SAMPLE_IMAGES, type SampleKey } from "@/lib/utils";

interface DropZoneProps {
  onFile: (file: File) => void;
  onUrl: (url: string) => void;
}

const SAMPLES: Array<{ key: SampleKey; emoji: string; label: string }> = [
  { key: "person", emoji: "🧑", label: "Person" },
  { key: "product", emoji: "👟", label: "Product" },
  { key: "pet", emoji: "🐶", label: "Pet" },
  { key: "car", emoji: "🚗", label: "Car" },
];

export function DropZone({ onFile, onUrl }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global paste handler
  useEffect(() => {
    function handlePaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file" && item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) onFile(file);
          return;
        }
      }
    }
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [onFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [onFile],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFile(file);
      e.target.value = "";
    },
    [onFile],
  );

  const handleUrlSubmit = useCallback(() => {
    const trimmed = urlValue.trim();
    if (!trimmed) return;
    onUrl(trimmed);
    setUrlValue("");
  }, [urlValue, onUrl]);

  const handleUrlKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleUrlSubmit();
    },
    [handleUrlSubmit],
  );

  return (
    <div>
      <div
        className={cn(
          "relative rounded-[28px] text-center cursor-pointer overflow-hidden",
          "transition-all duration-280ms ease-[cubic-bezier(0.4,0,0.2,1)]",
          "border-2 border-dashed",
          isDragOver ? "border-solid scale-[1.004]" : "hover:border-solid",
        )}
        style={{
          padding: "56px 32px 42px",
          background: isDragOver
            ? "color-mix(in srgb, var(--accent) 4%, var(--bg2))"
            : "var(--bg2)",
          borderColor: isDragOver ? "var(--accent)" : "var(--line2)",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 100%, var(--accent-glow), transparent 70%)",
            opacity: isDragOver ? 1 : 0,
          }}
        />

        {/* Icon */}
        <div
          className={cn(
            "w-[58px] h-[58px] mx-auto mb-[18px] rounded-[18px] flex items-center justify-center",
            "border transition-all duration-[250ms]",
          )}
          style={{
            background: isDragOver ? "var(--accent-glow)" : "var(--bg3)",
            borderColor: isDragOver
              ? "color-mix(in srgb, var(--accent) 40%, transparent)"
              : "var(--line2)",
            color: isDragOver ? "var(--accent)" : "var(--tx2)",
          }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: isDragOver ? "translateY(-3px)" : "none",
              transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <p
          className="text-[18px] font-bold mb-1.5"
          style={{ color: "var(--tx)" }}
        >
          Drop your image here
        </p>
        <p
          className="text-[14px] font-light mb-6"
          style={{ color: "var(--tx2)" }}
        >
          or click to browse · Ctrl/Cmd+V to paste
        </p>

        <button
          className="inline-flex items-center gap-2 font-bold text-[14px] px-[26px] py-[13px] rounded-full border-none text-black mb-5 transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: "var(--accent)",
            boxShadow: "0 0 0 var(--accent-glow)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.background = "var(--accent2)";
            (e.target as HTMLButtonElement).style.boxShadow =
              "0 12px 32px var(--accent-glow)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.background = "var(--accent)";
            (e.target as HTMLButtonElement).style.boxShadow = "none";
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
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          </svg>
          Choose Image
        </button>

        <p
          className="text-[11.5px] tracking-[0.4px] mb-4"
          style={{ color: "var(--tx3)" }}
        >
          JPG · PNG · WEBP · GIF · BMP · max 22 MB
        </p>

        {/* URL row */}
        <div
          className="flex gap-2 max-w-[420px] mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="url"
            className="flex-1 text-[13px] px-4 py-2.5 rounded-full border outline-none transition-colors duration-200"
            style={{
              background: "var(--bg3)",
              borderColor: "var(--line)",
              color: "var(--tx)",
            }}
            placeholder="Or paste an image URL…"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            onKeyDown={handleUrlKeyDown}
            onFocus={(e) => {
              e.target.style.borderColor =
                "color-mix(in srgb, var(--accent) 50%, transparent)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--line)";
            }}
          />
          <button
            className="text-[13px] font-semibold px-[18px] py-2.5 rounded-full border transition-all duration-200 whitespace-nowrap"
            style={{
              background: "var(--bg3)",
              borderColor: "var(--line2)",
              color: "var(--tx)",
            }}
            onClick={handleUrlSubmit}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = "var(--bg4)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = "var(--bg3)";
            }}
          >
            Go
          </button>
        </div>
      </div>

      {/* Samples row */}
      <div className="flex items-center gap-2.5 pt-3 pb-1 justify-center flex-wrap">
        <span className="text-[12px]" style={{ color: "var(--tx3)" }}>
          Try a sample →
        </span>
        {SAMPLES.map((s) => (
          <button
            key={s.key}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all duration-200"
            style={{
              background: "var(--bg3)",
              borderColor: "var(--line)",
              color: "var(--tx2)",
            }}
            onClick={() => onUrl(SAMPLE_IMAGES[s.key])}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "var(--accent)";
              el.style.color = "var(--accent)";
              el.style.background = "var(--accent-glow)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "var(--line)";
              el.style.color = "var(--tx2)";
              el.style.background = "var(--bg3)";
            }}
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
}
