# Pryysm V2 — 3D Fleet Control

Full-stack SaaS for 3D printing fleet management. Built with Next.js 14, Supabase, MQTT, and Tailwind CSS.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Fill in your Supabase URL and keys

# 3. Set up database
# In Supabase Dashboard → SQL Editor:
# Run: supabase/schema.sql

# 4. Start dev server
npm run dev
# → http://localhost:3000
# → Redirects to /app/dashboard (demo mode, no auth required)
```

## V1 → V2: What Reused

| File | Status | Notes |
|------|--------|-------|
| `lib/quote-calculator.ts` | ✅ Reused | Unchanged |
| `lib/mqtt-client.ts` | ✅ Reused | Topic prefix `printops/` → `pryysm/` |
| `supabase/schema.sql (V1)` | ✅ Extended | New: spools, maintenance, notifications |
| `vercel.json` | ✅ Reused | Unchanged |
| `package.json` | 🔄 Extended | Added: date-fns, react-dropzone |

## Project Structure

```
pryysm-v2/
├── app/
│   ├── app/
│   │   ├── dashboard/page.tsx   ← Fleet overview
│   │   ├── queue/page.tsx       ← Job queue management
│   │   ├── upload/page.tsx      ← STL upload + instant quote
│   │   ├── mqtt/page.tsx        ← MQTT console
│   │   ├── analytics/page.tsx   ← Charts + KPIs
│   │   ├── settings/page.tsx    ← Spools, maintenance, API
│   │   └── layout.tsx           ← Sidebar + Topbar shell
│   ├── auth/login/page.tsx      ← Login page
│   └── api/quote/route.ts       ← POST /api/quote
├── components/
│   ├── ui/          ← Button, Card, StatusPill, ArcGauge, Sparkline
│   ├── fleet/       ← PrinterCard, StatCard, FleetHealthDonut
│   ├── queue/       ← JobTable
│   └── layout/      ← Topbar, Sidebar
├── lib/
│   ├── quote-calculator.ts  ← (V1) Pricing engine
│   ├── mqtt-client.ts       ← (V1) MQTT bridge
│   ├── supabase.ts          ← Client setup
│   ├── types.ts             ← Shared TypeScript types
│   ├── mock-data.ts         ← Demo data (no Supabase needed)
│   └── utils.ts             ← cn, formatters
└── supabase/schema.sql      ← V2 extended schema
```

## Pages

- `/` → redirects to dashboard
- `/auth/login` → Login (demo button bypasses auth)
- `/app/dashboard` → Fleet overview, printer cards, job table
- `/app/queue` → Full job queue with status filters
- `/app/upload` → STL upload with drag-and-drop, instant quote
- `/app/mqtt` → MQTT console with live log and command input
- `/app/analytics` → Revenue, utilisation, material usage charts
- `/app/settings` → Spools, maintenance log, notifications, API keys

## API

```
POST /api/quote
{
  "volumeCm3": 50,
  "material": "PLA+",
  "infillPct": 20,
  "quality": "standard"
}
→ { "total": 4.15, "breakdown": {...}, "estimatedTimeSeconds": 3600 }
```

## Deploy

```bash
vercel --prod
# Set env vars in Vercel Dashboard
```

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL + Realtime + RLS)
- **Auth**: Supabase Auth
- **Real-time**: Supabase Realtime on `machines`, `jobs`, `notifications`
- **MQTT**: mqtt.js v5 → Raspberry Pi broker
- **Charts**: Recharts
- **Deploy**: Vercel
