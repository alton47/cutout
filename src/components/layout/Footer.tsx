import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-8 mt-6 border-t border-[var(--line)] flex items-center justify-between flex-wrap gap-3">
      <div className="font-black text-base" style={{ color: "var(--tx)" }}>
        cut<span style={{ color: "var(--accent)" }}>out</span>
      </div>

      <div className="flex gap-4">
        {[
          { href: "/api-docs", label: "API" },
          { href: "/pricing", label: "Pricing" },
          {
            href: "https://www.remove.bg/api",
            label: "remove.bg",
            external: true,
          },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="text-[13px] transition-colors duration-200 hover:text-[var(--tx2)]"
            style={{ color: "var(--tx3)" }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <p className="text-xs" style={{ color: "var(--tx3)" }}>
        No database · No backend · Powered by remove.bg
      </p>
    </footer>
  );
}
