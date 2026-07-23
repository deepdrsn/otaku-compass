# Otaku Compass 🧭

A tag-driven, natural-language anime recommendation engine built for people who are tired of generic genre filters. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand, React Query, and Fuse.js — powered by the free [Jikan API](https://jikan.moe/) (MyAnimeList).

## ✨ What makes this different

Instead of just filtering by genre, you can stack descriptive "weeb tags" (`OP MC` + `Isekai` + `Comedy`, or `Villain MC` + `Revenge` + `Fantasy`) or just type what you want in plain English:

> "I want an anime where the main character gets betrayed and comes back overpowered."

The app converts that into tags locally (no API key needed) and ranks a wide pool of anime by how well they match, showing an explainable confidence score ("87% match because: OP MC, Weak to Strong, Fantasy").

## 🧱 Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** — custom neon/glassmorphism theme
- **Framer Motion** — scroll/hover/loading animations
- **Zustand** (persisted) — favorites, bookmarks, search history, recently viewed
- **React Query** — data fetching/caching against Jikan
- **Fuse.js** — fuzzy tag autocomplete
- **Lucide Icons**
- **Jikan API** (MyAnimeList) — no key required

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

That's it — the app is fully static/serverless-compatible and requires no database or backend server.

## 🔑 Optional: AI-powered natural language search

By default, natural language search runs **entirely locally** via a keyword/synonym matcher (`lib/nlp/parseQuery.ts`) — fast, free, and works out of the box.

If you want richer language understanding, set an OpenAI key:

```bash
# .env.local
OPENAI_API_KEY=sk-...
```

The app automatically detects the key and routes NL queries through `/api/nlp` (GPT-4o-mini) instead, with the local parser as an automatic fallback if the request fails.

## 📁 Project Structure

```
app/                  # Next.js App Router pages + API routes
  anime/[id]/          - Anime detail page
  recommendations/      - Main discovery page (tag builder + filters + results)
  top100/, collections/, favorites/, bookmarks/
  api/nlp/              - Optional AI NL parsing route
components/
  home/                 - Hero, particle field, mouse glow, trending carousel
  search/               - Search bar, tag builder
  anime/                - Anime card, "why this recommendation" panel
  filters/              - Filter panel
  ui/                   - Reusable primitives (button, badge, card, skeleton)
  layout/               - Header/nav
lib/
  api/jikan.ts          - Jikan API client (throttled)
  data/                 - Tag taxonomy + smartTags.json enrichment map
  recommend/engine.ts   - Scoring/ranking algorithm
  nlp/parseQuery.ts     - Local NL -> tag parser
  store/useAppStore.ts  - Zustand global store
  hooks/                - React Query data hooks
types/                 # Shared TypeScript types
```

## 🧠 How the recommendation engine works

1. A broad candidate pool is pulled from Jikan's top-anime endpoint (deduplicated across pages).
2. Each anime is enriched with **smart tags** — either from the curated `lib/data/smartTags.json` map (hand-tagged for popular titles) or inferred automatically from its MAL genres/themes/demographics.
3. Structured filters (year, format, status, score, genre, studio) are applied.
4. Each remaining anime is scored 0–100 based on: tag/genre overlap (75% weight), MAL rating (15%), and popularity (10%).
5. Results are sorted by score, and the UI shows exactly which tags matched and the score breakdown.

## 🛠 Extending the smart-tags map

Add more curated entries to `lib/data/smartTags.json`, keyed by MAL id:

```json
"40748": { "title": "Solo Leveling", "tags": ["OP MC", "Weak to Strong", "Dungeon", "Hunter"] }
```

Any anime without a manual entry still gets inferred tags automatically, so the engine never runs dry.

## 📝 Notes on the Jikan API

Jikan enforces a soft rate limit (~3 req/sec) on its free tier. The client in `lib/api/jikan.ts` throttles requests and React Query caches results for 10 minutes to stay well within limits. If you hit rate-limit errors during heavy local testing, wait a few seconds and retry.

Site is live at https://otaku-compass-onfm.vercel.app/anime/9253


## License

MIT — do whatever you want with it.
