import type { EnrichedAnime, FilterState, RecommendationResult } from "@/types/anime";

/**
 * Core scoring algorithm. Produces a 0-100 confidence score per anime
 * based on how many of the user's selected tags it satisfies, weighted
 * by genre match, popularity, and rating — then sorted descending.
 *
 * Weighting rationale:
 *  - tag/genre overlap is the dominant signal (this is a *tag-driven*
 *    recommender, not a generic "top anime" list)
 *  - popularity & rating act as tie-breakers / quality boosts so that
 *    two equally-tag-matched anime surface the better one first
 */
export function scoreAnime(
  anime: EnrichedAnime,
  selectedTags: string[]
): RecommendationResult {
  const normalizedTags = selectedTags.map((t) => t.toLowerCase());
  const animeTagPool = [
    ...anime.smartTags,
    ...(anime.genres?.map((g) => g.name) ?? []),
    ...(anime.themes?.map((t) => t.name) ?? []),
    ...(anime.demographics?.map((d) => d.name) ?? []),
  ].map((t) => t.toLowerCase());

  const matchedTags: string[] = [];
  let tagHits = 0;

  normalizedTags.forEach((tag) => {
    const hit = animeTagPool.some(
      (poolTag) => poolTag === tag || poolTag.includes(tag) || tag.includes(poolTag)
    );
    if (hit) {
      tagHits += 1;
      const original = selectedTags[normalizedTags.indexOf(tag)];
      if (original) matchedTags.push(original);
    }
  });

  const tagMatchRatio = normalizedTags.length > 0 ? tagHits / normalizedTags.length : 0;
  const genreMatch = Math.min(40, tagMatchRatio * 40);
  const tagMatch = Math.min(35, tagMatchRatio * 35);

  const scoreVal = anime.score ?? 6.5;
  const ratingBoost = Math.min(15, (scoreVal / 10) * 15);

  const popularity = anime.members ?? 0;
  const popularityBoost = Math.min(10, Math.log10(popularity + 10) * 2.2);

  // If the user selected zero tags (pure "surprise me" / trending mode)
  // fall back to a quality-only score so results still rank sensibly.
  const total =
    normalizedTags.length === 0
      ? ratingBoost * 3 + popularityBoost * 2
      : genreMatch + tagMatch + ratingBoost + popularityBoost;

  return {
    anime,
    score: Math.round(Math.min(100, total)),
    matchedTags: Array.from(new Set(matchedTags)),
    matchBreakdown: {
      genreMatch: Math.round(genreMatch),
      tagMatch: Math.round(tagMatch),
      popularityBoost: Math.round(popularityBoost),
      ratingBoost: Math.round(ratingBoost),
    },
  };
}

export function rankAnimeList(
  list: EnrichedAnime[],
  selectedTags: string[]
): RecommendationResult[] {
  return list
    .map((a) => scoreAnime(a, selectedTags))
    .sort((a, b) => b.score - a.score);
}

/** Applies structured filters (year, episodes, format, etc) before scoring. */
export function applyFilters(
  list: EnrichedAnime[],
  filters: Partial<FilterState>
): EnrichedAnime[] {
  return list.filter((a) => {
    if (filters.format && filters.format !== "ANY" && a.type !== filters.format) return false;
    if (filters.status && filters.status !== "ANY" && a.status !== filters.status) return false;
    if (filters.minScore && (a.score ?? 0) < filters.minScore) return false;
    if (filters.years) {
      const [min, max] = filters.years;
      if (a.year && (a.year < min || a.year > max)) return false;
    }
    if (filters.episodesRange) {
      const [min, max] = filters.episodesRange;
      const ep = a.episodes ?? 0;
      if (ep > 0 && (ep < min || ep > max)) return false;
    }
    if (filters.genres && filters.genres.length > 0) {
      const names = (a.genres ?? []).map((g) => g.name);
      if (!filters.genres.some((g) => names.includes(g))) return false;
    }
    if (filters.studios && filters.studios.length > 0) {
      const names = (a.studios ?? []).map((s) => s.name);
      if (!filters.studios.some((s) => names.includes(s))) return false;
    }
    return true;
  });
}
