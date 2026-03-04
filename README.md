# cutout ✦

> AI-powered background removal. Drop any image, get a pixel-perfect cutout in seconds.

Built with **Next.js 14 · TypeScript · Tailwind CSS · remove.bg API**

---

## File Structure

```
cutout/
├── .env.local                          # API key (never committed)
├── .env.example                        # Template for contributors
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
│
└── src/
    ├── app/
    │   ├── layout.tsx                  # Root layout (fonts, metadata, ThemeScript)
    │   ├── page.tsx                    # Home page — upload, loader, result
    │   ├── globals.css                 # Tailwind directives + custom utilities
    │   │
    │   ├── api/
    │   │   └── remove-bg/
    │   │       └── route.ts            # Edge API route — proxies remove.bg, hides key
    │   │
    │   ├── pricing/
    │   │   └── page.tsx                # Pricing page (Free / Pro / Enterprise)
    │   │
    │   └── api-docs/
    │       └── page.tsx                # API docs (endpoints, params, code samples)
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx              # Top nav with theme toggle
    │   │   ├── Footer.tsx              # Footer with links
    │   │   └── ThemeScript.tsx         # Inline script — prevents theme flash (FOUC)
    │   │
    │   ├── ui/
    │   │   ├── Toast.tsx               # Animated toast notification
    │   │   └── Badge.tsx               # Live pulsing badge
    │   │
    │   ├── upload/
    │   │   └── DropZone.tsx            # Drag-drop, click, paste, URL, sample chips
    │   │
    │   ├── loader/
    │   │   └── Loader.tsx              # Floating orbs + triple rings + shimmer
    │   │
    │   ├── result/
    │   │   ├── CurtainCompare.tsx      # Draggable before/after curtain reveal
    │   │   ├── ActionsBar.tsx          # Format, BG color, copy, download
    │   │   └── ResultView.tsx          # Combines curtain + actions, handles download
    │   │   └── ErrorView.tsx           # Error state with retry
    │   │
    │   └── home/
    │       └── UseCases.tsx            # 6 use-case cards + stats row
    │
    ├── hooks/
    │   ├── useRemoveBg.ts              # Core state machine — upload → load → result
    │   ├── useCurtain.ts               # Drag logic for before/after slider
    │   ├── useTheme.ts                 # Dark/light toggle, persists to localStorage
    │   └── useToast.ts                 # Toast message state
    │
    ├── lib/
    │   ├── utils.ts                    # cn(), validateImageFile(), SAMPLE_IMAGES
    │   ├── fonts.ts                    # next/font — Outfit + JetBrains Mono
    │   └── pricing-data.ts             # PLANS, COMPARE_ROWS, FAQ_ITEMS
    │
    └── types/
        └── index.ts                    # All shared TypeScript interfaces
```

---

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/you/cutout.git
cd cutout
npm install

# 2. Set env
cp .env.example .env.local
# Edit .env.local and add your remove.bg key

# 3. Run dev
npm run dev
# → http://localhost:3000
```

### Environment Variables

| Variable            | Description                                                                        |
| ------------------- | ---------------------------------------------------------------------------------- |
| `REMOVE_BG_API_KEY` | Your remove.bg API key. Get one free at [remove.bg/api](https://www.remove.bg/api) |

> **Security:** The API key is only ever used in `src/app/api/remove-bg/route.ts` — a server-side Edge Function. It is never sent to the browser.

---

## How it works

```
Browser                  Next.js Edge Route        remove.bg
   │                           │                       │
   │── POST /api/remove-bg ───►│                       │
   │   (multipart, no key)     │── POST /removebg ────►│
   │                           │   (X-API-Key: ***)    │
   │                           │◄── 200 PNG blob ──────│
   │◄── 200 PNG blob ──────────│                       │
   │                           │                       │
```

---

## License

MIT
