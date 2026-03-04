"use client";

import { useState, useCallback } from "react";
import { CurtainCompare } from "./CurtainCompare";
import { ActionsBar } from "./ActionsBar";
import type { ResultData } from "@/types";
import type { ImageFormat, BgColor } from "@/types";

interface ResultViewProps {
  result: ResultData;
  onReset: () => void;
  onToast: (msg: string, type?: "success" | "error") => void;
}

export function ResultView({ result, onReset, onToast }: ResultViewProps) {
  const [bgColor, setBgColor] = useState<BgColor>("transparent");

  const handleDownload = useCallback(
    (format: ImageFormat, bg: BgColor) => {
      // Transparent PNG — direct download
      if (format === "png" && bg === "transparent") {
        triggerDownload(result.blob, `${result.originalFileName}-cutout.png`);
        onToast("Download started ✓", "success");
        return;
      }

      // Convert via canvas for format change or solid bg
      const img = new Image();
      const objUrl = URL.createObjectURL(result.blob);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;

        if (bg !== "transparent") {
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        const mimes: Record<ImageFormat, string> = {
          png: "image/png",
          jpg: "image/jpeg",
          webp: "image/webp",
        };

        canvas.toBlob(
          (b) => {
            if (b) {
              triggerDownload(b, `${result.originalFileName}-cutout.${format}`);
              onToast("Download started ✓", "success");
            }
          },
          mimes[format],
          0.95,
        );
        URL.revokeObjectURL(objUrl);
      };
      img.src = objUrl;
    },
    [result, onToast],
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": result.blob }),
      ]);
      onToast("Copied to clipboard ✓", "success");
    } catch {
      onToast("Clipboard not supported in this browser", "error");
    }
  }, [result, onToast]);

  return (
    <div className="animate-[fadeSlide_0.45s_ease]">
      <CurtainCompare
        originalSrc={result.originalSrc}
        resultSrc={result.objectUrl}
        width={result.width}
        height={result.height}
        bgColor={bgColor}
      />
      <ActionsBar
        resultBlob={result.blob}
        bgColor={bgColor}
        onBgChange={setBgColor}
        onDownload={handleDownload}
        onCopy={handleCopy}
        onReset={onReset}
      />
    </div>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
