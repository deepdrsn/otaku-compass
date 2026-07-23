"use client";

import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { scoreAnime } from "@/lib/recommend/engine";
import AnimeCard from "@/components/anime/AnimeCard";

export default function BookmarksPage() {
  const bookmarks = useAppStore((s) => s.bookmarks);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="flex items-center gap-2 font-display text-3xl font-bold sm:text-4xl">
          <Bookmark className="h-8 w-8 text-neon-cyan" fill="currentColor" /> Watch Later
        </h1>
        <p className="mt-2 text-sm text-muted">Saved locally on this device — {bookmarks.length} anime.</p>
      </motion.div>

      {bookmarks.length === 0 ? (
        <div className="glass rounded-xl2 border border-white/10 p-12 text-center text-muted">
          Nothing bookmarked yet. Tap the bookmark icon on any anime card to save it here.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {bookmarks.map((anime, i) => (
            <AnimeCard key={anime.mal_id} result={scoreAnime(anime, anime.smartTags)} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
