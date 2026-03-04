"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toast } from "@/components/ui/Toast";
import { LiveBadge } from "@/components/ui/Badge";
import { useToast } from "@/hooks/useToast";
import { PLANS, COMPARE_ROWS, FAQ_ITEMS } from "@/lib/pricing-data";
import type { BillingCycle } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { toast, show: showToast } = useToast();

  const getPrice = (plan: (typeof PLANS)[0]) => {
    if (plan.monthlyPrice === null) return "Custom";
    if (plan.monthlyPrice === 0) return "$0";
    const price = billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
    return `$${price}`;
  };

  const getPeriod = (plan: (typeof PLANS)[0]) => {
    if (plan.monthlyPrice === null) return "volume pricing";
    if (plan.monthlyPrice === 0) return "forever";
    return billing === "yearly" ? "per month, billed yearly" : "per month";
  };

  return (
    <>
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
          <Navbar activePage="pricing" />

          {/* Hero */}
          <div className="text-center py-12 pb-14">
            <LiveBadge>Simple pricing</LiveBadge>
            <h1
              className="font-black leading-[1] mb-3.5 tracking-[-3px]"
              style={{ fontSize: "clamp(40px, 6vw, 72px)", color: "var(--tx)" }}
            >
              Start free.
              <br />
              <span style={{ color: "var(--accent)" }}>Scale fast.</span>
            </h1>
            <p
              className="text-[16px] font-light leading-relaxed max-w-[380px] mx-auto mb-6"
              style={{ color: "var(--tx2)" }}
            >
              No hidden fees. Cancel anytime. Pay only for what you use.
            </p>

            {/* Billing toggle */}
            <div
              className="inline-flex items-center gap-1 rounded-full p-1 mb-14"
              style={{
                background: "var(--bg2)",
                border: "1.5px solid var(--line2)",
              }}
            >
              {(["monthly", "yearly"] as BillingCycle[]).map((b) => (
                <button
                  key={b}
                  className={cn(
                    "text-[13px] font-semibold px-[18px] py-[7px] rounded-full transition-all duration-200 flex items-center gap-2",
                  )}
                  style={{
                    background: billing === b ? "var(--accent)" : "none",
                    color: billing === b ? "#000" : "var(--tx2)",
                  }}
                  onClick={() => setBilling(b)}
                >
                  {b.charAt(0).toUpperCase() + b.slice(1)}
                  {b === "yearly" && (
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background:
                          billing === "yearly"
                            ? "rgba(0,0,0,0.15)"
                            : "rgba(82,255,176,0.1)",
                        color: billing === "yearly" ? "#000" : "#52ffb0",
                      }}
                    >
                      Save 20%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-3 gap-2.5 mb-16 max-md:grid-cols-1">
            {PLANS.map((plan) => (
              <div
                key={plan.tier}
                className="relative rounded-[24px] px-6 py-7 overflow-hidden transition-all duration-[250ms] hover:-translate-y-1"
                style={{
                  background: "var(--card)",
                  border: plan.popular
                    ? "1.5px solid color-mix(in srgb, var(--accent) 40%, transparent)"
                    : "1.5px solid var(--line)",
                  boxShadow: plan.popular
                    ? "0 0 0 1px color-mix(in srgb, var(--accent) 15%, transparent)"
                    : "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 24px 56px var(--shadow)${plan.popular ? ", 0 0 0 1px color-mix(in srgb, var(--accent) 25%, transparent)" : ""}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = plan.popular
                    ? "0 0 0 1px color-mix(in srgb, var(--accent) 15%, transparent)"
                    : "none";
                }}
              >
                {/* Glow for featured */}
                {plan.popular && (
                  <div
                    className="absolute -top-16 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full pointer-events-none"
                    style={{
                      background: "var(--accent)",
                      opacity: 0.04,
                      filter: "blur(40px)",
                    }}
                  />
                )}

                {plan.popular && (
                  <div
                    className="absolute top-[18px] right-[18px] text-[10px] font-extrabold px-2.5 py-[3px] rounded-full tracking-[0.5px]"
                    style={{ background: "var(--accent)", color: "#000" }}
                  >
                    POPULAR
                  </div>
                )}

                <p
                  className="text-[11px] font-bold uppercase tracking-[0.8px] mb-4"
                  style={{ color: "var(--tx2)" }}
                >
                  {plan.tier}
                </p>

                <div className="flex items-start gap-0.5 leading-none mb-1.5">
                  {plan.monthlyPrice !== null && (
                    <sup
                      className="text-[20px] font-bold mt-1.5"
                      style={{ color: "var(--tx)" }}
                    >
                      $
                    </sup>
                  )}
                  <span
                    className="font-black tracking-tight"
                    style={{
                      fontSize: plan.monthlyPrice === null ? "32px" : "48px",
                      letterSpacing:
                        plan.monthlyPrice === null ? "-1px" : "-2.5px",
                      color: "var(--tx)",
                    }}
                  >
                    {plan.monthlyPrice === null
                      ? "Custom"
                      : billing === "yearly"
                        ? plan.yearlyPrice
                        : plan.monthlyPrice}
                  </span>
                </div>

                <p className="text-[13px] mb-5" style={{ color: "var(--tx2)" }}>
                  {getPeriod(plan)}
                </p>

                <div
                  className="h-px my-0 mb-5"
                  style={{ background: "var(--line)" }}
                />

                <ul className="flex flex-col gap-2.5 mb-7">
                  {plan.features.map((f) => (
                    <li
                      key={f.label}
                      className="flex items-start gap-2 text-[13px] leading-[1.4]"
                    >
                      <span
                        className="text-[13px] font-extrabold flex-shrink-0 mt-[1px]"
                        style={{
                          color: f.included ? "var(--accent)" : "var(--tx3)",
                        }}
                      >
                        {f.included ? "✓" : "–"}
                      </span>
                      <span
                        style={{
                          color: f.included ? "var(--tx)" : "var(--tx3)",
                          fontWeight: f.included ? 400 : 300,
                        }}
                      >
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className="w-full py-3 rounded-full text-[14px] font-bold border transition-all duration-200"
                  style={{
                    background: plan.popular ? "var(--accent)" : "var(--bg3)",
                    borderColor: plan.popular
                      ? "var(--accent)"
                      : "var(--line2)",
                    color: plan.popular ? "#000" : "var(--tx)",
                  }}
                  onClick={() =>
                    showToast(
                      plan.tier === "Enterprise"
                        ? "Contact us: hello@cutout.ai"
                        : "Coming soon 🚀",
                    )
                  }
                  onMouseEnter={(e) => {
                    if (plan.popular) {
                      e.currentTarget.style.background = "var(--accent2)";
                      e.currentTarget.style.borderColor = "var(--accent2)";
                    } else {
                      e.currentTarget.style.background = "var(--bg4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = plan.popular
                      ? "var(--accent)"
                      : "var(--bg3)";
                    e.currentTarget.style.borderColor = plan.popular
                      ? "var(--accent)"
                      : "var(--line2)";
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Compare table */}
          <div className="mb-[72px]">
            <h2
              className="text-[22px] font-extrabold tracking-tight mb-5"
              style={{ color: "var(--tx)" }}
            >
              Full comparison
            </h2>
            <div
              className="rounded-[20px] overflow-hidden"
              style={{ border: "1.5px solid var(--line)" }}
            >
              <table className="w-full text-[13px] border-collapse">
                <thead>
                  <tr style={{ borderBottom: "1.5px solid var(--line2)" }}>
                    <th
                      className="text-left py-3 px-4 text-[11px] font-bold tracking-[0.7px] uppercase w-[45%]"
                      style={{ color: "var(--tx3)", background: "var(--bg3)" }}
                    >
                      Feature
                    </th>
                    {["Free", "Pro", "Enterprise"].map((t) => (
                      <th
                        key={t}
                        className="py-3 px-4 text-[11px] font-bold tracking-[0.7px] uppercase text-center"
                        style={{
                          color: "var(--tx3)",
                          background: "var(--bg3)",
                        }}
                      >
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, i) => (
                    <tr
                      key={row.feature}
                      style={{
                        borderBottom:
                          i < COMPARE_ROWS.length - 1
                            ? "1px solid var(--line)"
                            : "none",
                      }}
                    >
                      <td
                        className="py-3 px-4 font-normal"
                        style={{ color: "var(--tx)" }}
                      >
                        {row.feature}
                      </td>
                      {(["free", "pro", "enterprise"] as const).map((tier) => (
                        <td
                          key={tier}
                          className="py-3 px-4 text-center font-semibold"
                        >
                          {typeof row[tier] === "boolean" ? (
                            <span
                              style={{
                                color: row[tier]
                                  ? "var(--accent)"
                                  : "var(--tx3)",
                              }}
                            >
                              {row[tier] ? "✓" : "–"}
                            </span>
                          ) : (
                            <span style={{ color: "var(--tx2)" }}>
                              {row[tier]}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-20">
            <h2
              className="text-[28px] font-black tracking-tight mb-7"
              style={{ color: "var(--tx)" }}
            >
              Frequently asked
            </h2>
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="cursor-pointer"
                style={{
                  borderBottom: "1px solid var(--line)",
                  padding: "18px 0",
                }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between gap-3">
                  <p
                    className="text-[15px] font-semibold"
                    style={{ color: "var(--tx)" }}
                  >
                    {item.question}
                  </p>
                  <span
                    className="flex-shrink-0 transition-transform duration-200 text-[20px]"
                    style={{
                      color: openFaq === i ? "var(--accent)" : "var(--tx3)",
                      transform: openFaq === i ? "rotate(45deg)" : "none",
                    }}
                  >
                    +
                  </span>
                </div>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: openFaq === i ? "200px" : "0",
                    paddingTop: openFaq === i ? "10px" : "0",
                  }}
                >
                  <p
                    className="text-[14px] font-light leading-relaxed"
                    style={{ color: "var(--tx2)" }}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className="text-center py-16 px-8 rounded-[28px] mb-16 relative overflow-hidden"
            style={{
              background: "var(--bg2)",
              border: "1.5px solid var(--line)",
            }}
          >
            <div
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full pointer-events-none"
              style={{
                background: "var(--accent)",
                opacity: 0.04,
                filter: "blur(60px)",
              }}
            />
            <h2
              className="font-black tracking-tight mb-2.5"
              style={{ fontSize: "clamp(26px,4vw,40px)", color: "var(--tx)" }}
            >
              Start removing backgrounds
              <br />
              in 30 seconds.
            </h2>
            <p
              className="text-[15px] font-light mb-7"
              style={{ color: "var(--tx2)" }}
            >
              No signup needed. Get your API key and go.
            </p>
            <div className="flex gap-2.5 justify-center flex-wrap">
              <Link
                href="/"
                className="font-bold text-[15px] px-8 py-3.5 rounded-full text-black border-none transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "var(--accent)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent2)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 32px var(--accent-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--accent)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Try it now — free
              </Link>
              <Link
                href="/api-docs"
                className="font-medium text-[15px] px-7 py-3.5 rounded-full border transition-all duration-200"
                style={{
                  background: "none",
                  borderColor: "var(--line2)",
                  color: "var(--tx)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                }}
              >
                Read the API docs
              </Link>
            </div>
          </div>

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
