import smartTagsMap from "./smartTags.json";
import type { EnrichedAnime, JikanAnime } from "@/types/anime";

// Fallback inference: derive plausible smart tags from Jikan's own
// genres/themes/demographics when an anime isn't in our curated map.
// This guarantees every anime returned by the API has *some* smart tags,
// so the recommendation engine always has signal to work with.
const GENRE_TO_TAGS: Record<string, string[]> = {
  Action: ["Group Battles"],
  Adventure: ["Fantasy"],
  Comedy: ["Comedy"],
  Drama: ["Emotional"],
  Fantasy: ["Fantasy", "Magic"],
  Horror: ["Horror", "Dark"],
  Mystery: ["Mystery"],
  Romance: ["Romance"],
  "Sci-Fi": ["Sci-Fi"],
  "Slice of Life": ["Slice of Life"],
  Sports: ["Sports"],
  Supernatural: ["Superpower"],
  Suspense: ["Psychological"],
  Ecchi: ["Ecchi"],
  Isekai: ["Isekai"],
  "Mecha": ["Mecha"],
  "School": ["School"],
  "Military": ["Military"],
  "Psychological": ["Psychological", "Dark"],
  "Girls Love": ["Romance"],
  "Boys Love": ["Romance"],
  "Gourmet": ["Cooking"],
  "Historical": ["Samurai"],
  "Idols (Female)": ["Idols"],
  "Idols (Male)": ["Idols"],
  "Music": ["Music"],
  "Detective": ["Detective", "Mystery"],
  "Vampire": ["Vampire"],
  "Harem": ["Harem"],
  "Reverse Harem": ["Reverse Harem"],
  "Time Travel": ["Time Travel"],
  "Video Game": ["Game World"],
  "Combat Sports": ["Martial Arts"],
  "CGDCT": ["Slice of Life", "Comedy"],
  "Award Winning": [],
};

export function enrichAnime(raw: JikanAnime): EnrichedAnime {
  const manual = (smartTagsMap as Record<string, { title: string; tags: string[] }>)[
    String(raw.mal_id)
  ];

  const inferred = new Set<string>();
  [...(raw.genres ?? []), ...(raw.themes ?? []), ...(raw.demographics ?? [])].forEach(
    (g) => {
      const mapped = GENRE_TO_TAGS[g.name];
      if (mapped) mapped.forEach((t) => inferred.add(t));
    }
  );

  // Score/popularity based heuristics for extra flavor
  if ((raw.score ?? 0) >= 8.3) inferred.add("Highest Rated");
  if ((raw.episodes ?? 0) === 1 || raw.type === "Movie") inferred.add("Movie");

  const tags = manual ? manual.tags : Array.from(inferred);

  return { ...raw, smartTags: Array.from(new Set(tags)) };
}

export function enrichList(list: JikanAnime[]): EnrichedAnime[] {
  return list.map(enrichAnime);
}
