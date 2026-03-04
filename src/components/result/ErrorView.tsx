"use client";

interface ErrorViewProps {
  title: string;
  message: string;
  onRetry: () => void;
  onReset: () => void;
}

export function ErrorView({
  title,
  message,
  onRetry,
  onReset,
}: ErrorViewProps) {
  return (
    <div
      className="rounded-[24px] px-9 py-[52px] text-center animate-[fadeSlide_0.3s_ease]"
      style={{
        background: "var(--bg2)",
        border: "1.5px solid rgba(255,82,82,0.2)",
      }}
    >
      <div
        className="w-[50px] h-[50px] rounded-[15px] flex items-center justify-center mx-auto mb-4"
        style={{ background: "rgba(255,82,82,0.1)", color: "#ff5252" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <h3
        className="text-[19px] font-extrabold mb-2 tracking-tight"
        style={{ color: "var(--tx)" }}
      >
        {title}
      </h3>
      <p
        className="text-[14px] font-light leading-relaxed mb-6 max-w-[360px] mx-auto"
        style={{ color: "var(--tx2)" }}
      >
        {message}
      </p>

      <div className="flex gap-2.5 justify-center flex-wrap">
        <button
          onClick={onRetry}
          className="font-bold text-[14px] px-6 py-[11px] rounded-full border-none text-white transition-opacity hover:opacity-85"
          style={{ background: "#ff5252" }}
        >
          Try again
        </button>
        <button
          onClick={onReset}
          className="text-[13px] font-medium px-5 py-[11px] rounded-full border transition-all duration-200"
          style={{
            background: "none",
            borderColor: "var(--line2)",
            color: "var(--tx2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg3)";
            e.currentTarget.style.color = "var(--tx)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "var(--tx2)";
          }}
        >
          Upload different image
        </button>
      </div>
    </div>
  );
}
