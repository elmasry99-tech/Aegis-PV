This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Live mode (dashboard)

`/dashboard` has a **Demo | Live** toggle. Live mode analyses two simulated homes — Riyadh (Al-Malqa)
and Dhahran (KFUPM) — using **real weather** from [Open-Meteo](https://open-meteo.com) and a
**simulated inverter** built from Saudi averages, then asks Claude for a diagnosis.
**View evidence** (`/dashboard/evidence?site=…`) shows the exact data sent to the AI.

```bash
cp .env.example .env.local     # then set ANTHROPIC_API_KEY=...
npm run dev                    # open http://localhost:3000/dashboard and switch to Live
```

Without a key, live mode still works and uses the built-in rules engine (badged "Rules engine").
API: `GET /api/live/riyadh` or `/api/live/dhahran` (`?refresh=1` skips the 15-minute cache).
Code: `src/lib/live/` (weather, digital twin, AI, rules) · agent setup: `.claude/README.md`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Aegis-PV
