"use client";

import Image from "next/image";

interface LoaderProps {
  thumbSrc: string;
}

const ORB_CONFIGS = [
  {
    w: 80,
    h: 80,
    top: "10%",
    left: "5%",
    dur: "5s",
    delay: "0s",
    x1: "40px",
    y1: "-30px",
    x2: "-20px",
    y2: "-60px",
    x3: "50px",
    y3: "-15px",
  },
  {
    w: 50,
    h: 50,
    top: "20%",
    right: "8%",
    dur: "4s",
    delay: "-1.5s",
    x1: "-30px",
    y1: "-40px",
    x2: "20px",
    y2: "-70px",
    x3: "-40px",
    y3: "-20px",
  },
  {
    w: 30,
    h: 30,
    top: "60%",
    left: "10%",
    dur: "6s",
    delay: "-3s",
    x1: "20px",
    y1: "-20px",
    x2: "-15px",
    y2: "-35px",
    x3: "25px",
    y3: "-10px",
  },
  {
    w: 60,
    h: 60,
    bottom: "15%",
    right: "5%",
    dur: "3.5s",
    delay: "-2s",
    x1: "-20px",
    y1: "-25px",
    x2: "15px",
    y2: "-45px",
    x3: "-25px",
    y3: "-15px",
  },
  {
    w: 20,
    h: 20,
    top: "40%",
    left: "50%",
    dur: "4.5s",
    delay: "-1s",
    x1: "15px",
    y1: "-15px",
    x2: "-10px",
    y2: "-30px",
    x3: "20px",
    y3: "-8px",
  },
] as const;

export function Loader({ thumbSrc }: LoaderProps) {
  return (
    <div
      className="relative rounded-[28px] text-center overflow-hidden animate-[fadeSlide_0.4s_ease]"
      style={{
        padding: "72px 32px",
        background: "var(--bg2)",
        border: "1.5px solid var(--line2)",
      }}
    >
      {/* Floating orbs */}
      {ORB_CONFIGS.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none float-orb"
          style={
            {
              width: orb.w,
              height: orb.h,
              top: "top" in orb ? orb.top : "auto",
              left: "left" in orb ? orb.left : "auto",
              right: "right" in orb ? orb.right : "auto",
              bottom: "bottom" in orb ? orb.bottom : "auto",
              background: "var(--accent)",
              opacity: 0.12,
              "--dur": orb.dur,
              "--delay": orb.delay,
              "--x1": orb.x1,
              "--y1": orb.y1,
              "--x2": orb.x2,
              "--y2": orb.y2,
              "--x3": orb.x3,
              "--y3": orb.y3,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Thumbnail */}
      <div className="relative inline-block mb-8">
        {thumbSrc && (
          <img
            src={thumbSrc}
            alt="Processing"
            className="w-[80px] h-[80px] rounded-[18px] object-cover block animate-[thumbFloat_2.5s_ease-in-out_infinite] shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          />
        )}
        {/* Scissors badge */}
        <div
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center animate-[scissors_2s_ease-in-out_infinite]"
          style={{
            background: "var(--accent)",
            boxShadow: "0 4px 12px var(--accent-glow)",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <line x1="20" y1="4" x2="8.12" y2="15.88" />
            <line x1="14.47" y1="14.48" x2="20" y2="20" />
            <line x1="8.12" y1="8.12" x2="12" y2="12" />
          </svg>
        </div>
      </div>

      {/* Rings */}
      <div className="relative w-16 h-16 mx-auto mb-6">
        <span
          className="absolute inset-0 rounded-full border-[2.5px] border-transparent animate-[spin_1.1s_linear_infinite]"
          style={{ borderTopColor: "var(--accent)" }}
        />
        <span
          className="absolute inset-[9px] rounded-full border-[2.5px] border-transparent animate-[spin_0.85s_linear_infinite_reverse]"
          style={{
            borderRightColor:
              "color-mix(in srgb, var(--accent) 55%, transparent)",
          }}
        />
        <span
          className="absolute inset-[18px] rounded-full border-[2.5px] border-transparent animate-[spin_0.65s_linear_infinite]"
          style={{
            borderBottomColor:
              "color-mix(in srgb, var(--accent) 30%, transparent)",
          }}
        />
      </div>

      <p
        className="text-[17px] font-bold mb-1.5 tracking-tight"
        style={{ color: "var(--tx)" }}
      >
        Removing background…
      </p>
      <p className="text-[13px] font-light" style={{ color: "var(--tx2)" }}>
        AI is processing your image · usually under 3s
      </p>

      {/* Shimmer bar */}
      <div
        className="w-[180px] h-[3px] rounded-[10px] mx-auto mt-5 overflow-hidden"
        style={{ background: "var(--bg3)" }}
      >
        <div
          className="h-full w-[55%] rounded-[10px] animate-[shimmer_1.5s_ease-in-out_infinite]"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--accent), transparent)",
          }}
        />
      </div>
    </div>
  );
}
