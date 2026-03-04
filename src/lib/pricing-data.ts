import type { PricingPlan, FaqItem } from "@/types";

export const PLANS: PricingPlan[] = [
  {
    tier: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    period: "forever",
    cta: "Get started free",
    features: [
      { label: "50 images per month", included: true },
      { label: "Preview resolution (625×400)", included: true },
      { label: "PNG, JPG, WebP output", included: true },
      { label: "API access included", included: true },
      { label: "No credit card needed", included: true },
      { label: "Full resolution", included: false },
      { label: "Bulk processing", included: false },
    ],
  },
  {
    tier: "Pro",
    monthlyPrice: 12,
    yearlyPrice: 10,
    period: "per month",
    cta: "Start Pro",
    popular: true,
    features: [
      { label: "500 images per month", included: true },
      { label: "Full resolution up to 25 MP", included: true },
      { label: "PNG, JPG, WebP, ZIP output", included: true },
      { label: "Custom background colors", included: true },
      { label: "Priority processing", included: true },
      { label: "API + webhook support", included: true },
      { label: "Email support", included: true },
    ],
  },
  {
    tier: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    period: "volume pricing",
    cta: "Contact us",
    features: [
      { label: "Unlimited images", included: true },
      { label: "50 MP max resolution", included: true },
      { label: "500 images/min via API", included: true },
      { label: "SLA guarantee", included: true },
      { label: "Dedicated Slack support", included: true },
      { label: "Custom integrations", included: true },
      { label: "Invoice billing", included: true },
    ],
  },
];

export const COMPARE_ROWS = [
  {
    feature: "Images per month",
    free: "50",
    pro: "500",
    enterprise: "Unlimited",
  },
  {
    feature: "Max resolution",
    free: "0.25 MP",
    pro: "25 MP",
    enterprise: "50 MP",
  },
  {
    feature: "Output formats",
    free: "PNG, JPG, WebP",
    pro: "+ ZIP",
    enterprise: "All",
  },
  { feature: "API access", free: true, pro: true, enterprise: true },
  { feature: "Custom background", free: false, pro: true, enterprise: true },
  { feature: "Bulk processing", free: false, pro: true, enterprise: true },
  { feature: "Webhook support", free: false, pro: true, enterprise: true },
  {
    feature: "Rate limit",
    free: "500 MP/min",
    pro: "500 MP/min",
    enterprise: "Custom",
  },
  {
    feature: "Support",
    free: "Community",
    pro: "Email",
    enterprise: "Dedicated Slack",
  },
  { feature: "SLA", free: false, pro: false, enterprise: true },
  { feature: "Invoice billing", free: false, pro: false, enterprise: true },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What counts as one image?",
    answer:
      "Each unique image processed counts as one call. Re-downloading the same result doesn't use additional calls. Preview-size (0.25 MP) costs 0.25 credits; full resolution costs 1 credit.",
  },
  {
    question: "Do unused images roll over?",
    answer:
      "No — monthly allowances reset at the start of each billing period. Enterprise plans can negotiate custom rollover terms.",
  },
  {
    question: "Can I use this without a backend or database?",
    answer:
      "Yes — that's the whole point. API calls go server-side through our Next.js API route, so your key is never exposed in the browser. No additional database or server setup needed.",
  },
  {
    question: "Is my data private?",
    answer:
      "Images are processed by remove.bg's API and are not stored by cutout. Remove.bg deletes uploaded images after processing. See remove.bg's privacy policy for full details.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "Input: JPG, PNG, WebP, GIF (static), BMP, TIFF — up to 22 MB and 50 megapixels. Output: PNG (transparent), JPG, WebP, ZIP. PNG is capped at 10 MP; use WebP or ZIP for larger transparent outputs.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Cancel from your account page at any time. You retain access until the end of the current billing period — no proration, no penalties.",
  },
];
