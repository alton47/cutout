// ─── Remove BG API ────────────────────────────────────────────────────────────

export interface RemoveBgError {
  title: string;
  code?: string;
}

export interface RemoveBgErrorResponse {
  errors: RemoveBgError[];
}

export type ImageFormat = "png" | "jpg" | "webp";
export type BgColor = "transparent" | string;

// ─── Upload ───────────────────────────────────────────────────────────────────

export type UploadMethod = "file" | "url";

export interface FilePayload {
  type: "file";
  file: File;
}

export interface UrlPayload {
  type: "url";
  url: string;
}

export type Payload = FilePayload | UrlPayload;

// ─── App state ────────────────────────────────────────────────────────────────

export type AppState = "upload" | "loading" | "result" | "error";

export interface ResultData {
  blob: Blob;
  objectUrl: string;
  originalSrc: string;
  width: string;
  height: string;
  originalFileName: string;
}

export interface ErrorData {
  title: string;
  message: string;
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

export type BillingCycle = "monthly" | "yearly";

export interface PricingPlan {
  tier: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  period: string;
  features: PricingFeature[];
  cta: string;
  popular?: boolean;
}

export interface PricingFeature {
  label: string;
  included: boolean;
}

// ─── API Docs ─────────────────────────────────────────────────────────────────

export interface ApiParam {
  name: string;
  type: string;
  status: "required" | "optional" | "one-of";
  description: string;
}

export interface CodeSample {
  lang: string;
  label: string;
  color: string;
  id: string;
  code: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
