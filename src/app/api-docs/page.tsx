"use client";

import { useState, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toast } from "@/components/ui/Toast";
import { LiveBadge } from "@/components/ui/Badge";
import { useToast } from "@/hooks/useToast";

const API_PARAMS = [
  {
    name: "image_file",
    type: "binary",
    status: "one-of",
    desc: "Multipart file upload. Max 22 MB.",
  },
  {
    name: "image_file_b64",
    type: "string",
    status: "one-of",
    desc: "Base64-encoded image string.",
  },
  {
    name: "image_url",
    type: "string",
    status: "one-of",
    desc: "Public image URL. Must be accessible without auth.",
  },
  {
    name: "size",
    type: "string",
    status: "optional",
    desc: "preview — free, 0.25 MP · full — 1 credit, 25 MP · 50MP · auto (recommended)",
  },
  {
    name: "format",
    type: "string",
    status: "optional",
    desc: "auto  png  jpg  webp  zip",
  },
  {
    name: "bg_color",
    type: "string",
    status: "optional",
    desc: "Solid background hex e.g. ffffff or 000000",
  },
  {
    name: "type",
    type: "string",
    status: "optional",
    desc: "auto  person  product  car  animal  graphic",
  },
  {
    name: "crop",
    type: "boolean",
    status: "optional",
    desc: "Crop empty transparent edges from result.",
  },
  {
    name: "shadow_type",
    type: "string",
    status: "optional",
    desc: "auto  car  3D  drop  none",
  },
] as const;

const STATUS_CODES = [
  { code: "200", color: "#52ffb0", label: "Success — binary image" },
  { code: "400", color: "#fbbf24", label: "Bad params / unprocessable" },
  { code: "402", color: "#fb923c", label: "Insufficient credits" },
  { code: "403", color: "#ff5252", label: "Invalid / missing API key" },
  { code: "429", color: "#fb923c", label: "Rate limited — check Retry-After" },
  { code: "5xx", color: "#ff5252", label: "Server error — use backoff" },
];

const RESPONSE_HEADERS = [
  { name: "X-Width / X-Height", desc: "Output image dimensions in pixels." },
  {
    name: "X-Credits-Charged",
    desc: "Credits deducted for this call (0 for free preview).",
  },
  { name: "X-Type", desc: "Detected foreground type (person, product, car…)" },
  {
    name: "X-Foreground-*",
    desc: "Top, left, width, height of detected foreground bounding box.",
  },
];

function getCodeSamples(apiKey: string) {
  return [
    {
      id: "curl",
      lang: "cURL",
      color: "#f97316",
      code: `# File upload
curl -X POST \\
  -H 'X-API-Key: ${apiKey}' \\
  -F 'image_file=@/path/to/photo.jpg' \\
  -F 'size=auto' \\
  -f https://api.remove.bg/v1.0/removebg \\
  -o photo-cutout.png`,
    },
    {
      id: "js",
      lang: "JavaScript",
      color: "#eab308",
      code: `async function removeBg(imageFile) {
  const form = new FormData();
  form.append('image_file', imageFile);
  form.append('size', 'auto');

  const res = await fetch('/api/remove-bg', {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? \`HTTP \${res.status}\`);
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}`,
    },
    {
      id: "python",
      lang: "Python",
      color: "#3b82f6",
      code: `import requests
from pathlib import Path

def remove_bg(input_path: str, api_key: str) -> bytes:
    path = Path(input_path)
    with path.open('rb') as f:
        res = requests.post(
            'https://api.remove.bg/v1.0/removebg',
            files={'image_file': (path.name, f, 'image/jpeg')},
            data={'size': 'auto'},
            headers={'X-API-Key': '${apiKey}'},
        )
    res.raise_for_status()
    return res.content  # PNG bytes

result = remove_bg('photo.jpg', '${apiKey}')
Path('photo-cutout.png').write_bytes(result)`,
    },
    {
      id: "nodejs",
      lang: "Node.js + retry",
      color: "#52ffb0",
      code: `const { fetch, FormData, Blob } = require('undici');
const fs = require('fs');
const path = require('path');

async function removeBg(filePath, retries = 3) {
  const form = new FormData();
  form.set('image_file', new Blob([fs.readFileSync(filePath)]));
  form.set('size', 'auto');

  const res = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-API-Key': '${apiKey}' },
    body: form,
  });

  if (res.status === 429 && retries > 0) {
    const wait = (+res.headers.get('Retry-After') || 10) * 1000;
    await new Promise(r => setTimeout(r, wait));
    return removeBg(filePath, retries - 1);
  }

  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);

  const buf = Buffer.from(await res.arrayBuffer());
  const out = path.basename(filePath, path.extname(filePath)) + '-cutout.png';
  fs.writeFileSync(out, buf);
  return buf;
}`,
    },
    {
      id: "react",
      lang: "React Hook",
      color: "#61dafb",
      code: `import { useState, useCallback } from 'react';

export function useRemoveBg() {
  const [state, setState] = useState({
    loading: false, resultUrl: null, resultBlob: null, error: null,
  });

  const remove = useCallback(async (file) => {
    setState(s => ({ ...s, loading: true, error: null }));
    const form = new FormData();
    form.append('image_file', file);

    try {
      // Calls our Next.js proxy — API key stays server-side
      const res = await fetch('/api/remove-bg', {
        method: 'POST', body: form,
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? \`Error \${res.status}\`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setState({ loading: false, resultUrl: url, resultBlob: blob, error: null });
    } catch (err) {
      setState({ loading: false, resultUrl: null, resultBlob: null, error: err.message });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, resultUrl: null, resultBlob: null, error: null });
  }, []);

  return { ...state, remove, reset };
}`,
    },
  ];
}

function CodeBlock({
  code,
  lang,
  color,
  id,
  apiKey,
}: {
  code: string;
  lang: string;
  color: string;
  id: string;
  apiKey: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }, [code]);

  return (
    <div
      className="rounded-[20px] overflow-hidden"
      style={{ background: "var(--bg2)", border: "1.5px solid var(--line)" }}
    >
      <div
        className="flex items-center justify-between px-[18px] py-3"
        style={{ borderBottom: "1px solid var(--line)" }}
      >
        <div
          className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.3px]"
          style={{ color: "var(--tx2)" }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
          {lang}
        </div>
        <button
          onClick={copy}
          className="text-[11px] px-2.5 py-1 rounded-md border transition-all duration-200"
          style={{
            background: "none",
            borderColor: copied ? "#52ffb0" : "var(--line)",
            color: copied ? "#52ffb0" : "var(--tx3)",
          }}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre
        className="px-[18px] py-5 text-[12.5px] leading-[1.78] overflow-x-auto whitespace-pre font-mono"
        style={{
          color: "#888",
          background: "var(--bg2)",
          fontFamily: "var(--font-jetbrains)",
        }}
      >
        {code}
      </pre>
    </div>
  );
}

export default function ApiDocsPage() {
  const [apiKey, setApiKey] = useState("YOUR_API_KEY");
  const [saved, setSaved] = useState(false);
  const { toast, show: showToast } = useToast();

  const saveKey = useCallback(() => {
    if (!apiKey.trim() || apiKey === "YOUR_API_KEY") {
      showToast("Enter an API key first", "error");
      return;
    }
    localStorage.setItem("cutout_key", apiKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    showToast("API key saved — examples updated ✓", "success");
  }, [apiKey, showToast]);

  // Load saved key on mount
  useState(() => {
    if (typeof window !== "undefined") {
      const k = localStorage.getItem("cutout_key");
      if (k) setApiKey(k);
    }
  });

  const samples = getCodeSamples(apiKey);

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
          <Navbar activePage="api" />

          {/* Hero */}
          <div
            className="py-10 pb-14 mb-12"
            style={{ borderBottom: "1px solid var(--line)" }}
          >
            <LiveBadge>REST API · JSON · Server-side proxy</LiveBadge>
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <h1
                  className="font-black leading-[1] mb-3.5 tracking-[-2.5px]"
                  style={{
                    fontSize: "clamp(36px, 5vw, 58px)",
                    color: "var(--tx)",
                  }}
                >
                  Build with the{" "}
                  <span style={{ color: "var(--accent)" }}>cutout</span> API.
                </h1>
                <p
                  className="text-[15px] font-light leading-relaxed max-w-[440px] mb-0"
                  style={{ color: "var(--tx2)" }}
                >
                  One HTTP call to our proxy. API key stays server-side.
                  Supports file upload, base64, and URL. Drop-in React hook
                  included.
                </p>
              </div>

              {/* Key widget */}
              <div className="flex-shrink-0">
                <div
                  className="flex items-center gap-2 rounded-full px-4 py-1.5 pr-1.5 max-w-[420px]"
                  style={{
                    background: "var(--bg2)",
                    border: "1.5px solid var(--line2)",
                  }}
                >
                  <span
                    className="text-[12px] whitespace-nowrap"
                    style={{ color: "var(--tx3)" }}
                  >
                    api key
                  </span>
                  <input
                    type="text"
                    className="flex-1 bg-transparent border-none outline-none text-[13px] min-w-0"
                    style={{
                      color: "var(--tx)",
                      fontFamily: "var(--font-outfit)",
                    }}
                    placeholder="your_api_key"
                    value={apiKey === "YOUR_API_KEY" ? "" : apiKey}
                    onChange={(e) =>
                      setApiKey(e.target.value || "YOUR_API_KEY")
                    }
                  />
                  <button
                    onClick={saveKey}
                    className="text-[12px] font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200 whitespace-nowrap"
                    style={{
                      background: "var(--bg3)",
                      borderColor: saved ? "#52ffb0" : "var(--line2)",
                      color: saved ? "#52ffb0" : "var(--tx)",
                    }}
                  >
                    {saved ? "Saved ✓" : "Update examples"}
                  </button>
                </div>
                <p
                  className="text-[11.5px] mt-1.5 text-right"
                  style={{ color: "var(--tx3)" }}
                >
                  Get a free key at{" "}
                  <a
                    href="https://www.remove.bg/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--accent)" }}
                  >
                    remove.bg/api
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-8 items-start max-md:flex-col">
            {/* Sticky sidebar */}
            <aside className="sticky top-6 w-[180px] flex-shrink-0 max-md:hidden">
              <div className="flex flex-col gap-0.5">
                {[
                  {
                    label: "Endpoints",
                    items: ["POST /removebg", "GET /account"],
                  },
                  {
                    label: "Examples",
                    items: [
                      "cURL",
                      "JavaScript",
                      "Python",
                      "Node.js",
                      "React Hook",
                    ],
                  },
                  {
                    label: "Reference",
                    items: ["Rate Limits", "Error Handling"],
                  },
                ].map((section) => (
                  <div key={section.label}>
                    <p
                      className="text-[10px] font-bold uppercase tracking-[1px] px-3 py-1.5 mt-2"
                      style={{ color: "var(--tx3)" }}
                    >
                      {section.label}
                    </p>
                    {section.items.map((item) => (
                      <a
                        key={item}
                        href={`#${item.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                        className="block text-[13px] font-medium px-3 py-1.5 rounded-lg transition-all duration-200 hover:text-[var(--tx)] hover:bg-[var(--bg3)]"
                        style={{ color: "var(--tx2)" }}
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col gap-12">
              {/* POST /removebg */}
              <section id="post--removebg">
                <h2
                  className="text-[22px] font-extrabold tracking-tight mb-3"
                  style={{ color: "var(--tx)" }}
                >
                  POST /removebg
                </h2>
                <p
                  className="text-[14px] font-light leading-relaxed mb-4"
                  style={{ color: "var(--tx2)" }}
                >
                  Remove the background from any image. Returns the processed
                  image as binary. In this Next.js app, call{" "}
                  <code
                    className="text-[12px] px-1.5 py-0.5 rounded"
                    style={{
                      background: "var(--bg3)",
                      color: "var(--accent)",
                      fontFamily: "var(--font-jetbrains)",
                    }}
                  >
                    /api/remove-bg
                  </code>{" "}
                  — your key never leaves the server.
                </p>

                <div
                  className="rounded-[20px] overflow-hidden mb-2"
                  style={{
                    background: "var(--bg2)",
                    border: "1.5px solid var(--line)",
                  }}
                >
                  <div
                    className="flex items-center gap-2.5 px-5 py-3.5"
                    style={{ borderBottom: "1px solid var(--line)" }}
                  >
                    <span
                      className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-md tracking-[0.5px]"
                      style={{
                        background: "rgba(200,255,87,0.1)",
                        color: "var(--accent)",
                      }}
                    >
                      POST
                    </span>
                    <code
                      className="text-[13px] flex-1 break-all"
                      style={{
                        color: "var(--tx)",
                        fontFamily: "var(--font-jetbrains)",
                      }}
                    >
                      https://api.remove.bg/v1.0/removebg
                    </code>
                    <span
                      className="text-[12px]"
                      style={{ color: "var(--tx2)" }}
                    >
                      via /api/remove-bg proxy
                    </span>
                  </div>
                  <table className="w-full text-[13px] border-collapse">
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--line)" }}>
                        {["Parameter", "Type", "Status", "Description"].map(
                          (h) => (
                            <th
                              key={h}
                              className="text-left py-2.5 px-[18px] text-[10px] font-bold uppercase tracking-[0.8px]"
                              style={{
                                color: "var(--tx3)",
                                background: "rgba(255,255,255,0.015)",
                              }}
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {API_PARAMS.map((p, i) => (
                        <tr
                          key={p.name}
                          style={{
                            borderBottom:
                              i < API_PARAMS.length - 1
                                ? "1px solid rgba(255,255,255,0.03)"
                                : "none",
                          }}
                        >
                          <td className="py-2.5 px-[18px]">
                            <code
                              className="text-[12px]"
                              style={{
                                color: "#7dd3fc",
                                fontFamily: "var(--font-jetbrains)",
                              }}
                            >
                              {p.name}
                            </code>
                          </td>
                          <td className="py-2.5 px-[18px]">
                            <span
                              className="text-[11px] px-1.5 py-0.5 rounded"
                              style={{
                                background: "var(--bg3)",
                                color: "var(--tx3)",
                              }}
                            >
                              {p.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-[18px]">
                            <span
                              className="text-[11px] px-1.5 py-0.5 rounded"
                              style={{
                                background:
                                  p.status === "one-of"
                                    ? "var(--accent-glow)"
                                    : "var(--bg3)",
                                color:
                                  p.status === "one-of"
                                    ? "var(--accent)"
                                    : "var(--tx3)",
                              }}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td
                            className="py-2.5 px-[18px] text-[13px] leading-relaxed"
                            style={{ color: "var(--tx2)" }}
                          >
                            {p.desc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Response headers */}
                  <div style={{ borderTop: "1px solid var(--line)" }}>
                    <div className="px-[18px] pt-3 pb-1">
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.8px]"
                        style={{ color: "var(--tx3)" }}
                      >
                        Response headers
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 px-[18px] pb-4">
                      {RESPONSE_HEADERS.map((h) => (
                        <div key={h.name} className="flex items-start gap-3">
                          <code
                            className="text-[12px] min-w-[180px] flex-shrink-0"
                            style={{
                              color: "#7dd3fc",
                              fontFamily: "var(--font-jetbrains)",
                            }}
                          >
                            {h.name}
                          </code>
                          <span
                            className="text-[13px] leading-relaxed"
                            style={{ color: "var(--tx2)" }}
                          >
                            {h.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status codes */}
                  <div style={{ borderTop: "1px solid var(--line)" }}>
                    <div className="px-[18px] pt-3 pb-1">
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.8px]"
                        style={{ color: "var(--tx3)" }}
                      >
                        Status codes
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 px-[18px] pb-4">
                      {STATUS_CODES.map((s) => (
                        <div
                          key={s.code}
                          className="flex items-center gap-2 rounded-[10px] px-3.5 py-2"
                          style={{
                            background: "var(--bg3)",
                            border: "1px solid var(--line)",
                          }}
                        >
                          <span
                            className="font-mono font-bold text-[13px]"
                            style={{ color: s.color }}
                          >
                            {s.code}
                          </span>
                          <span
                            className="text-[12px]"
                            style={{ color: "var(--tx2)" }}
                          >
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* GET /account */}
              <section id="get--account">
                <h2
                  className="text-[22px] font-extrabold tracking-tight mb-3"
                  style={{ color: "var(--tx)" }}
                >
                  GET /account
                </h2>
                <p
                  className="text-[14px] font-light leading-relaxed mb-4"
                  style={{ color: "var(--tx2)" }}
                >
                  Fetch your current credit balance and remaining free API
                  calls.
                </p>
                <div
                  className="rounded-[20px] overflow-hidden"
                  style={{
                    background: "var(--bg2)",
                    border: "1.5px solid var(--line)",
                  }}
                >
                  <div
                    className="flex items-center gap-2.5 px-5 py-3.5"
                    style={{ borderBottom: "1px solid var(--line)" }}
                  >
                    <span
                      className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-md tracking-[0.5px]"
                      style={{
                        background: "rgba(82,255,176,0.1)",
                        color: "#52ffb0",
                      }}
                    >
                      GET
                    </span>
                    <code
                      className="text-[13px]"
                      style={{
                        color: "var(--tx)",
                        fontFamily: "var(--font-jetbrains)",
                      }}
                    >
                      https://api.remove.bg/v1.0/account
                    </code>
                  </div>
                  <div className="p-[18px]">
                    <p
                      className="text-[13px] leading-relaxed mb-3"
                      style={{ color: "var(--tx2)" }}
                    >
                      Returns JSON with{" "}
                      <code
                        className="text-[12px] px-1.5 rounded"
                        style={{
                          background: "var(--bg3)",
                          color: "#7dd3fc",
                          fontFamily: "var(--font-jetbrains)",
                        }}
                      >
                        credits.total
                      </code>
                      ,{" "}
                      <code
                        className="text-[12px] px-1.5 rounded"
                        style={{
                          background: "var(--bg3)",
                          color: "#7dd3fc",
                          fontFamily: "var(--font-jetbrains)",
                        }}
                      >
                        credits.subscription
                      </code>
                      , and{" "}
                      <code
                        className="text-[12px] px-1.5 rounded"
                        style={{
                          background: "var(--bg3)",
                          color: "#7dd3fc",
                          fontFamily: "var(--font-jetbrains)",
                        }}
                      >
                        api.free_calls
                      </code>
                      .
                    </p>
                    <pre
                      className="text-[12px] leading-relaxed rounded-[12px] p-4 overflow-x-auto"
                      style={{
                        background: "var(--bg3)",
                        color: "#888",
                        fontFamily: "var(--font-jetbrains)",
                      }}
                    >
                      {`{
  "data": {
    "attributes": {
      "credits": { "total": 200, "subscription": 150, "payg": 50 },
      "api": { "free_calls": 42 }
    }
  }
}`}
                    </pre>
                  </div>
                </div>
              </section>

              {/* Code samples */}
              <section id="curl">
                <h2
                  className="text-[22px] font-extrabold tracking-tight mb-6"
                  style={{ color: "var(--tx)" }}
                >
                  Code examples
                </h2>
                <div className="flex flex-col gap-2.5">
                  {samples.map((s) => (
                    <div key={s.id} id={s.id}>
                      <CodeBlock {...s} apiKey={apiKey} />
                    </div>
                  ))}
                </div>
              </section>

              {/* Rate limits */}
              <section id="rate-limits">
                <h2
                  className="text-[22px] font-extrabold tracking-tight mb-3"
                  style={{ color: "var(--tx)" }}
                >
                  Rate Limits
                </h2>
                <p
                  className="text-[14px] font-light leading-relaxed mb-4"
                  style={{ color: "var(--tx2)" }}
                >
                  Rate limit is 500 megapixel-images per minute. A 4 MP image
                  counts as 4 units.
                </p>
                <div
                  className="rounded-[20px] overflow-hidden"
                  style={{
                    background: "var(--bg2)",
                    border: "1.5px solid var(--line)",
                  }}
                >
                  <table className="w-full text-[13px] border-collapse">
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--line)" }}>
                        <th
                          className="text-left py-2.5 px-4 text-[10px] font-bold uppercase tracking-[0.8px]"
                          style={{
                            color: "var(--tx3)",
                            background: "var(--bg3)",
                          }}
                        >
                          Resolution
                        </th>
                        <th
                          className="text-left py-2.5 px-4 text-[10px] font-bold uppercase tracking-[0.8px]"
                          style={{
                            color: "var(--tx3)",
                            background: "var(--bg3)",
                          }}
                        >
                          Effective limit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["625×400 (1 MP)", "500/min"],
                        ["1600×1200 (2 MP)", "250/min"],
                        ["2500×1600 (4 MP)", "125/min"],
                        ["4000×2500 (10 MP)", "50/min"],
                        ["6250×4000 (25 MP)", "20/min"],
                      ].map(([res, lim], i, arr) => (
                        <tr
                          key={res}
                          style={{
                            borderBottom:
                              i < arr.length - 1
                                ? "1px solid var(--line)"
                                : "none",
                          }}
                        >
                          <td
                            className="py-2.5 px-4"
                            style={{ color: "var(--tx2)" }}
                          >
                            {res}
                          </td>
                          <td
                            className="py-2.5 px-4 font-semibold"
                            style={{ color: "var(--tx)" }}
                          >
                            {lim}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div
                    className="px-4 py-3.5"
                    style={{ borderTop: "1px solid var(--line)" }}
                  >
                    <p
                      className="text-[13px] leading-relaxed"
                      style={{ color: "var(--tx2)" }}
                    >
                      On 429, read{" "}
                      <code
                        className="text-[12px] px-1.5 rounded"
                        style={{
                          background: "var(--bg3)",
                          color: "#7dd3fc",
                          fontFamily: "var(--font-jetbrains)",
                        }}
                      >
                        Retry-After
                      </code>{" "}
                      header and wait that many seconds. On 5xx, use exponential
                      backoff with jitter (1s → 2s → 4s → 8s).
                    </p>
                  </div>
                </div>
              </section>

              {/* Error handling */}
              <section id="error-handling" className="mb-8">
                <h2
                  className="text-[22px] font-extrabold tracking-tight mb-3"
                  style={{ color: "var(--tx)" }}
                >
                  Error Handling
                </h2>
                <p
                  className="text-[14px] font-light leading-relaxed mb-4"
                  style={{ color: "var(--tx2)" }}
                >
                  All error responses are JSON with an{" "}
                  <code
                    className="text-[12px] px-1.5 rounded"
                    style={{
                      background: "var(--bg3)",
                      color: "#7dd3fc",
                      fontFamily: "var(--font-jetbrains)",
                    }}
                  >
                    errors
                  </code>{" "}
                  array. Each error has a{" "}
                  <code
                    className="text-[12px] px-1.5 rounded"
                    style={{
                      background: "var(--bg3)",
                      color: "#7dd3fc",
                      fontFamily: "var(--font-jetbrains)",
                    }}
                  >
                    title
                  </code>{" "}
                  and optional{" "}
                  <code
                    className="text-[12px] px-1.5 rounded"
                    style={{
                      background: "var(--bg3)",
                      color: "#7dd3fc",
                      fontFamily: "var(--font-jetbrains)",
                    }}
                  >
                    code
                  </code>
                  .
                </p>
                <CodeBlock
                  id="error-wrapper"
                  lang="Robust fetch wrapper"
                  color="#888"
                  apiKey={apiKey}
                  code={`async function removeBgSafe(file, retries = 3) {
  const form = new FormData();
  form.append('image_file', file);

  let attempt = 0;

  while (attempt <= retries) {
    try {
      const res = await fetch('/api/remove-bg', {
        method: 'POST', body: form,
      });

      if (res.status === 429) {
        const wait = +res.headers.get('Retry-After') * 1000 || 10000;
        await sleep(wait); attempt++; continue;
      }

      if (res.status >= 500) {
        const wait = (2 ** attempt) * 1000 + Math.random() * 500;
        await sleep(wait); attempt++; continue;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? \`HTTP \${res.status}\`);
      }

      return await res.blob(); // success ✓

    } catch (e) {
      if (attempt >= retries) throw e;
      await sleep(1500); attempt++;
    }
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));`}
                />
              </section>
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
