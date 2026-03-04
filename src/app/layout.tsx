import type { Metadata } from "next";
import "./globals.css";
import { outfit, jetbrainsMono } from "@/lib/fonts";
import { ThemeScript } from "@/components/layout/ThemeScript";

export const metadata: Metadata = {
  title: {
    template: "%s | cutout",
    default: "cutout — Remove backgrounds instantly",
  },
  description:
    "AI-powered background removal. Drop any image and get a pixel-perfect cutout in seconds. No signup required.",
  keywords: [
    "background removal",
    "remove background",
    "AI",
    "photo editing",
    "cutout",
  ],
  openGraph: {
    title: "cutout — Remove backgrounds instantly",
    description:
      "AI-powered background removal. Drop any image, get a clean cutout in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="font-sans antialiased bg-[#090909] dark:bg-[#090909] light:bg-[#fafaf7] transition-colors duration-300 min-h-screen">
        {children}
      </body>
    </html>
  );
}
