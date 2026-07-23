import type { JikanAnime } from "@/types/anime";

const BASE_URL = "https://api.jikan.moe/v4";

// Jikan enforces ~3 req/sec on the free tier. We keep a tiny in-memory
// queue so rapid client-side calls (filters changing quickly) don't
// trip rate limiting.
let lastCall = 0;
const MIN_GAP_MS = 380;

async function throttledFetch(url: string) {
  const now = Date.now();
  const wait = Math.max(0, lastCall + MIN_GAP_MS - now);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCall = Date.now();

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Jikan request failed: ${res.status} ${url}`);
  }
  return res.json();
}

export async function getTopAnime(page = 1, filter?: string): Promise<JikanAnime[]> {
  const q = filter ? `&filter=${filter}` : "";
  const data = await throttledFetch(`${BASE_URL}/top/anime?page=${page}${q}`);
  return data.data ?? [];
}

export async function getSeasonNow(): Promise<JikanAnime[]> {
  const data = await throttledFetch(`${BASE_URL}/seasons/now`);
  return data.data ?? [];
}

export async function getAnimeById(id: number): Promise<JikanAnime> {
  const data = await throttledFetch(`${BASE_URL}/anime/${id}/full`);
  return data.data;
}

export interface SearchParams {
  q?: string;
  genres?: string; // comma-separated genre ids
  type?: string;
  status?: string;
  min_score?: number;
  order_by?: string;
  sort?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export async function searchAnime(params: SearchParams): Promise<JikanAnime[]> {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.set(k, String(v));
  });
  usp.set("limit", String(params.limit ?? 24));
  const data = await throttledFetch(`${BASE_URL}/anime?${usp.toString()}`);
  return data.data ?? [];
}

export async function getGenres(): Promise<{ mal_id: number; name: string }[]> {
  const data = await throttledFetch(`${BASE_URL}/genres/anime`);
  return data.data ?? [];
}

export async function getRandomAnime(): Promise<JikanAnime> {
  const data = await throttledFetch(`${BASE_URL}/random/anime`);
  return data.data;
}
