"use client";

const USE_CASES = [
  {
    emoji: "🧑‍💼",
    name: "People & Portraits",
    desc: "Headshots, IDs, profile photos. Hair and fine edges handled with precision.",
  },
  {
    emoji: "👟",
    name: "Products",
    desc: "E-commerce, marketplace listings. White or custom backgrounds in one click.",
  },
  {
    emoji: "🐕",
    name: "Animals & Pets",
    desc: "Fur, feathers, fine edges. Same precision as human hair.",
  },
  {
    emoji: "🚗",
    name: "Cars & Vehicles",
    desc: "Dealer shots, insurance, custom scenes. Reflections preserved.",
  },
  {
    emoji: "🎨",
    name: "Graphics & Logos",
    desc: "Icons, stickers, artwork. Clean transparent PNG for any design tool.",
  },
  {
    emoji: "🏠",
    name: "Objects & Interiors",
    desc: "Furniture, architecture, real estate. Catalog-ready in seconds.",
  },
];

const STATS = [
  { num: "50 MP", label: "Max resolution" },
  { num: "<3s", label: "Average processing" },
  { num: "22 MB", label: "Max file size" },
  { num: "100%", label: "Automatic, zero tools" },
];

export function UseCases() {
  return (
    <section className="pt-[72px] pb-6">
      <p
        className="text-[11px] font-bold tracking-[1.5px] uppercase mb-3"
        style={{ color: "var(--accent)" }}
      >
        Works on everything
      </p>
      <h2
        className="text-[clamp(28px,4vw,44px)] font-black tracking-[-1.5px] leading-[1.05] mb-3"
        style={{ color: "var(--tx)" }}
      >
        One tool.
        <br />
        Any subject.
      </h2>
      <p
        className="text-[15px] font-light leading-relaxed mb-11 max-w-[380px]"
        style={{ color: "var(--tx2)" }}
      >
        The AI detects what&apos;s foreground automatically — no settings
        needed.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2.5 max-md:grid-cols-2 max-sm:grid-cols-1">
        {USE_CASES.map((uc) => (
          <div
            key={uc.name}
            className="rounded-[20px] overflow-hidden border transition-all duration-[250ms] hover:-translate-y-1 cursor-default"
            style={{
              background: "var(--card)",
              borderColor: "var(--line)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--line2)";
              e.currentTarget.style.boxShadow = "0 20px 48px var(--shadow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--line)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              className="h-[150px] flex items-center justify-center text-[56px]"
              style={{ background: "var(--bg3)" }}
            >
              {uc.emoji}
            </div>
            <div className="px-4 pt-3.5 pb-4">
              <p
                className="text-[14px] font-bold mb-1"
                style={{ color: "var(--tx)" }}
              >
                {uc.name}
              </p>
              <p
                className="text-[12.5px] font-light leading-relaxed"
                style={{ color: "var(--tx2)" }}
              >
                {uc.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div
        className="flex rounded-[20px] overflow-hidden mt-12 mb-2 max-sm:flex-col"
        style={{
          backgroundColor: "var(--card)",
          border: "1.5px solid var(--line)",
        }}
      >
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="flex-1 py-6 px-6 text-center max-sm:border-b max-sm:border-[var(--line)]"
            style={{
              borderRight:
                i < STATS.length - 1 ? "1px solid var(--line)" : "none",
            }}
          >
            <p
              className="text-[30px] font-black tracking-tight mb-0.5"
              style={{ color: "var(--accent)" }}
            >
              {s.num}
            </p>
            <p className="text-[12px]" style={{ color: "var(--tx2)" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
