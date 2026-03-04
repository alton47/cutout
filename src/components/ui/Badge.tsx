interface BadgeProps {
  children: React.ReactNode;
}

export function LiveBadge({ children }: BadgeProps) {
  return (
    <div
      className="inline-flex items-center gap-[7px] border rounded-full px-[13px] py-[5px] mb-6 text-[11px] font-bold tracking-[0.5px] uppercase"
      style={{
        background: "var(--accent-glow)",
        borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)",
        color: "var(--accent)",
      }}
    >
      <span
        className="w-[6px] h-[6px] rounded-full animate-[blink_2s_infinite]"
        style={{ background: "var(--accent)" }}
      />
      {children}
    </div>
  );
}
