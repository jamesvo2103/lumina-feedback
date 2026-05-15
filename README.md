# Lumina Feedback Dashboard

A minimalist internal tool for reading and filtering customer feedback.

## Tech Stack

Next.js 16 (App Router) · React 19 · Zustand · Tailwind CSS v4 · Chart.js · lucide-react

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design Decisions

**Visual language**: Apple-inspired minimalism — neutral palette, generous whitespace,
subtle card shadows, color used only for sentiment badges. No decorative elements.

**State management**: Zustand uses a factory + Context Provider pattern (not a global
singleton) to prevent state leaking between server-rendered requests in Next.js App
Router. The store holds only `searchQuery` and `activeSentiment`. Filtering is derived
at render time — no `useEffect`, no stale state.

**Search + filter**: Both predicates compose together, so searching `James` while
filtering by `Negative` works simultaneously.

**Chart**: Always uses the full unfiltered dataset so the trend view reflects all
historical data regardless of what the user is currently filtering.

## Tradeoffs

- Static data (no backend) to stay within sprint scope
- No pagination — would add for 50+ entries
- No date-range filter on chart — natural next feature
