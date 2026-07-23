"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { getTopAnime } from "@/lib/api/jikan";
import { enrichList } from "@/lib/data/enrich";
import { rankAnimeList } from "@/lib/recommend/engine";
import AnimeCard from "@/components/anime/AnimeCard";
import { AnimeCardSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Top100Page() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["top100", page],
    queryFn: async () => enrichList(await getTopAnime(page)),
  });

  const ranked = data ? rankAnimeList(data, []) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="flex items-center gap-2 font-display text-3xl font-bold sm:text-4xl">
          <Trophy className="h-8 w-8 text-yellow-400" /> Top 100 Anime
        </h1>
        <p className="mt-2 text-sm text-muted">The highest-rated anime of all time, ranked by the community.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 9 }).map((_, i) => <AnimeCardSkeleton key={i} />)
          : ranked.map((r, i) => (
              <AnimeCard key={r.anime.mal_id} result={r} index={i} />
            ))}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Previous
        </Button>
        <span className="flex items-center px-4 text-sm text-muted">Page {page}</span>
        <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
