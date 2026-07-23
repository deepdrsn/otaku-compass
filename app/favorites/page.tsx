"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { scoreAnime } from "@/lib/recommend/engine";
import AnimeCard from "@/components/anime/AnimeCard";

export default function FavoritesPage() {
  const favorites = useAppStore((s) => s.favorites);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="flex items-center gap-2 font-display text-3xl font-bold sm:text-4xl">
          <Heart className="h-8 w-8 text-neon-pink" fill="currentColor" /> Your Favorites
        </h1>
        <p className="mt-2 text-sm text-muted">Saved locally on this device — {favorites.length} anime.</p>
      </motion.div>

      {favorites.length === 0 ? (
        <div className="glass rounded-xl2 border border-white/10 p-12 text-center text-muted">
          No favorites yet. Tap the heart on any anime card to save it here.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.map((anime, i) => (
            <AnimeCard key={anime.mal_id} result={scoreAnime(anime, anime.smartTags)} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
