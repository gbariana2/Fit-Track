# FitTrack

A personal workout tracker built to log sessions, follow training plans, track progress over time, and record personal bests.

Live site: https://workout-tracker-taupe-rho.vercel.app/
GitHub: https://github.com/gbariana2/Fit-Track

---

## What it does

FitTrack is a client-side workout tracker that stores everything in your browser. No account needed, no backend.

- **Home** - personalized dashboard with greeting, suggested workout for the day, weekly overview, muscle balance, and PR highlights
- **Log** - record a workout session with exercises, sets, reps, and weight. Progressive overload targets auto-calculated from your history
- **Plans** - create and manage reusable workout templates (Push A/B, Pull A/B, Legs A/B) with drag-to-reorder
- **Progress** - workout score trend (0-100), per-exercise weight/volume charts, muscle group volume breakdown
- **PRs** - personal records board with max weight, max reps, and 1RM goals per exercise
- **Workout Detail** - dynamic route (`/workout/[id]`) showing full breakdown of any logged session

---

## Tech stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4 (frosted glass cards, dark mode, gradient accents)
- Recharts (line, area, and bar charts)
- Framer Motion (page transitions, scroll reveals, animated SVG background)
- Playwright (13 end-to-end tests)
- localStorage for all data persistence

---

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. On first visit, enter your name or click **Load Demo Data** to populate the app with 52 weeks of training data.

---

## Running tests

```bash
npx playwright install chromium
npx playwright test
```

---

## Built by

Gurshaan Bariana · [LinkedIn](https://www.linkedin.com/in/gbariana) · gbariana@chicagobooth.edu
