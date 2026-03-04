"use client";

import { cn } from "@/lib/utils";
import type { ToastType } from "@/hooks/useToast";

interface ToastProps {
  message: string;
  type: ToastType;
  visible: boolean;
}

export function Toast({ message, type, visible }: ToastProps) {
  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-[9001]",
        "px-5 py-2.5 rounded-full text-[13px] font-medium whitespace-nowrap",
        "border transition-transform duration-300 ease-out",
        "shadow-[0_16px_40px_var(--shadow)]",
        "bg-[var(--bg2)] border-[var(--line2)] text-[var(--tx)]",
        type === "success" && "!border-green-400/35 !text-green-400",
        type === "error" && "!border-red-400/35 !text-red-400",
        visible ? "translate-y-0" : "translate-y-[70px]",
      )}
    >
      {message}
    </div>
  );
}
