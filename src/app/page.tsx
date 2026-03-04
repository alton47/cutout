"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toast } from "@/components/ui/Toast";
import { LiveBadge } from "@/components/ui/Badge";
import { DropZone } from "@/components/upload/DropZone";
import { Loader } from "@/components/loader/Loader";
import { ResultView } from "@/components/result/ResultView";
import { ErrorView } from "@/components/result/ErrorView";
import { UseCases } from "@/components/home/UseCases";
import { useRemoveBg } from "@/hooks/useRemoveBg";
import { useToast } from "@/hooks/useToast";

export default function HomePage() {
  const {
    appState,
    result,
    error,
    loaderThumb,
    processFile,
    processUrl,
    retry,
    reset,
  } = useRemoveBg();
  const { toast, show: showToast } = useToast();

  return (
    <>
      {/* CSS vars scoped here */}
      <style>{`
        :root, .dark {
          --bg: #090909; --bg2: #111; --bg3: #1a1a1a; --bg4: #222;
          --line: rgba(255,255,255,0.07); --line2: rgba(255,255,255,0.13);
          --tx: #f0f0f0; --tx2: #777; --tx3: #3a3a3a;
          --card: #111; --shadow: rgba(0,0,0,0.7);
          --accent: #c8ff57; --accent2: #a8db2e; --accent-glow: rgba(200,255,87,0.14);
        }
        .light {
          --bg: #fafaf7; --bg2: #fff; --bg3: #f0f0ec; --bg4: #e8e8e4;
          --line: rgba(0,0,0,0.08); --line2: rgba(0,0,0,0.14);
          --tx: #0f0f0f; --tx2: #5a5a5a; --tx3: #bbb;
          --card: #fff; --shadow: rgba(0,0,0,0.1);
          --accent: #5a8c00; --accent2: #3d6600; --accent-glow: rgba(90,140,0,0.12);
        }
      `}</style>

      <div
        className="min-h-screen transition-colors duration-300"
        style={{ background: "var(--bg)", color: "var(--tx)" }}
      >
        <div className="max-w-[960px] mx-auto px-5">
          <Navbar activePage="home" />

          {/* Hero */}
          <div className="text-center pt-3 pb-10">
            <LiveBadge>AI-powered · Instant · Free</LiveBadge>
            <h1
              className="font-black leading-[0.93] mb-4 tracking-[-3px]"
              style={{
                fontSize: "clamp(44px, 8vw, 90px)",
                color: "var(--tx)",
              }}
            >
              Remove any
              <br />
              background.
              <br />
              <span style={{ color: "var(--accent)" }}>Instantly.</span>
            </h1>
            <p
              className="text-[16px] font-light leading-relaxed max-w-[320px] mx-auto"
              style={{ color: "var(--tx2)" }}
            >
              Drop any image and get a pixel-perfect cutout in seconds.
            </p>
          </div>

          {/* App core */}
          {appState === "upload" && (
            <DropZone onFile={processFile} onUrl={processUrl} />
          )}

          {appState === "loading" && <Loader thumbSrc={loaderThumb} />}

          {appState === "result" && result && (
            <ResultView result={result} onReset={reset} onToast={showToast} />
          )}

          {appState === "error" && error && (
            <ErrorView
              title={error.title}
              message={error.message}
              onRetry={retry}
              onReset={reset}
            />
          )}

          <UseCases />
          <Footer />
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
    </>
  );
}
