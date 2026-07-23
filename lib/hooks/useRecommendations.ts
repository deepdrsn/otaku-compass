import { useQuery } from "@tanstack/react-query";
import { getTopAnime, searchAnime } from "@/lib/api/jikan";
import { enrichList } from "@/lib/data/enrich";
import { rankAnimeList, applyFilters } from "@/lib/recommend/engine";
import type { FilterState, JikanAnime } from "@/types/anime";

/**
 * Builds a broad candidate pool (top-rated anime across several pages,
 * deduped), enriches it with smart tags, applies structured filters,
 * then scores + ranks by the selected tag set.
 *
 * We pull from /top/anime rather than a single narrow query because the
 * tag-matching engine needs a diverse pool to find genuinely good
 * matches — a generic genre search alone would defeat the purpose of a
 * tag-driven recommender.
 */
export function useRecommendations(tags: string[], filters: Partial<FilterState>) {
  return useQuery({
    queryKey: ["recommendation-pool", tags, filters],
    queryFn: async () => {
      const pages = await Promise.all([getTopAnime(1), getTopAnime(2), getTopAnime(3)]);
      let pool: JikanAnime[] = pages.flat();

      // Widen the pool further using genre-name search when a filter
      // genre is explicitly selected, so filtered results aren't
      // starved by the fixed top-anime pool.
      if (filters.genres && filters.genres.length > 0) {
        const extra = await searchAnime({
          q: filters.genres[0],
          limit: 24,
          order_by: "score",
          sort: "desc",
        });
        pool = [...pool, ...extra];
      }

      const deduped = Array.from(new Map(pool.map((a) => [a.mal_id, a])).values());
      const enriched = enrichList(deduped);
      const filtered = applyFilters(enriched, filters);
      return rankAnimeList(filtered, tags);
    },
    staleTime: 1000 * 60 * 10,
  });
}
