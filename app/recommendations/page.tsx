"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Shuffle, Sparkles } from "lucide-react";
import TagBuilder from "@/components/search/TagBuilder";
import SearchBar from "@/components/search/SearchBar";
import FilterPanel from "@/components/filters/FilterPanel";
import AnimeCard from "@/components/anime/AnimeCard";
import { AnimeCardSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRecommendations } from "@/lib/hooks/useRecommendations";
import { useAppStore } from "@/lib/store/useAppStore";
import type { FilterState } from "@/types/anime";

function RecommendationsContent() {
  const params = useSearchParams();
  const selectedTags = useAppStore((s) => s.selectedTags);
  const setSelectedTags = useAppStore((s) => s.setSelectedTags);
  const [filters, setFilters] = useState<Partial<FilterState>>({
    format: "ANY",
    status: "ANY",
    minScore: 0,
    genres: [],
    years: [1990, 2026],
  });
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    const tagsParam = params.get("tags");
    if (tagsParam) {
      setSelectedTags(tagsParam.split(",").filter(Boolean));
    }
  }, [params, setSelectedTags]);

  const { data: results, isLoading } = useRecommendations(selectedTags, filters);
  const visibleResults = results?.slice(0, visibleCount) ?? [];

  const surpriseMe = () => {
    if (!results || results.length === 0) return;
    const pool = results.slice(0, 30);
    const random = pool[Math.floor(Math.random() * pool.length)];
    document.getElementById(`anime-${random.anime.mal_id}`)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Discover <span className="text-neon-gradient">Your Match</span>
        </h1>
        <p className="mt-2 text-sm text-muted">
          Stack tags, describe a vibe, or filter — the more signal you give, the sharper the picks.
        </p>
        <div className="mt-5 max-w-2xl">
          <SearchBar large={false} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="space-y-6 lg:col-span-1">
          <div className="glass rounded-xl2 border border-white/10 p-5">
            <h3 className="mb-3 font-display text-sm font-semibold">Tag Builder</h3>
            <TagBuilder selected={selectedTags} onChange={setSelectedTags} />
          </div>
          <FilterPanel filters={filters} onChange={setFilters} />
          <Button variant="outline" className="w-full" onClick={surpriseMe}>
            <Shuffle className="h-4 w-4" /> Surprise Me
          </Button>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <Sparkles className="h-4 w-4 text-neon-purple" />
              {isLoading
                ? "Scanning the multiverse..."
                : `${results?.length ?? 0} matches found`}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading
              ? Array.from({ length: 9 }).map((_, i) => <AnimeCardSkeleton key={i} />)
              : visibleResults.map((result, i) => (
                  <div id={`anime-${result.anime.mal_id}`} key={result.anime.mal_id}>
                    <AnimeCard result={result} index={i} />
                  </div>
                ))}
          </div>

          {!isLoading && results && results.length === 0 && (
            <div className="glass mt-6 rounded-xl2 border border-white/10 p-10 text-center">
              <p className="text-muted">No matches yet — try loosening your filters or tags.</p>
            </div>
          )}

          {!isLoading && results && visibleCount < results.length && (
            <div className="mt-8 flex justify-center">
              <Button variant="outline" onClick={() => setVisibleCount((c) => c + 12)}>
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-muted">Loading...</div>}>
      <RecommendationsContent />
    </Suspense>
  );
}
