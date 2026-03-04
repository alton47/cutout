import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripExtension(filename: string): string {
  return filename.replace(/\.[^.]+$/, "") || "image";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/tiff",
];

export const MAX_FILE_SIZE = 22 * 1024 * 1024; // 22 MB

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    return "Unsupported format. Use JPG, PNG, WEBP, GIF, or BMP.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File too large: ${formatFileSize(file.size)} — max is 22 MB.`;
  }
  return null;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export const SAMPLE_IMAGES = {
  person:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  product:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  pet: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=80",
  car: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80",
} as const;

export type SampleKey = keyof typeof SAMPLE_IMAGES;
