"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Bookmark, Star, PlayCircle, Tv, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store/useAppStore";
import { formatNumber, truncate, cn } from "@/lib/utils";
import type { RecommendationResult } from "@/types/anime";

export default function AnimeCard({
  result,
  index = 0,
}: {
  result: RecommendationResult;
  index?: number;
}) {
  const { anime, score, matchedTags } = result;
  const isFavorite = useAppStore((s) => s.isFavorite(anime.mal_id));
  const isBookmarked = useAppStore((s) => s.isBookmarked(anime.mal_id));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);

  const poster = anime.images?.webp?.large_image_url ?? anime.images?.jpg?.large_image_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4) }}
      className="card-glow-hover glass group relative flex flex-col overflow-hidden rounded-xl2 border border-white/10"
    >
      {/* Confidence score ring */}
      {score > 0 && (
        <div className="absolute left-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full glass-strong border border-neon-cyan/40 text-xs font-bold text-cyan-200 shadow-glow-cyan">
          {score}%
        </div>
      )}

      <div className="absolute right-3 top-3 z-20 flex gap-2">
        <button
          onClick={() => toggleFavorite(anime)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full glass-strong border transition-colors",
            isFavorite ? "border-neon-pink text-neon-pink" : "border-white/15 text-white/70 hover:text-neon-pink"
          )}
          aria-label="Toggle favorite"
        >
          <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => toggleBookmark(anime)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full glass-strong border transition-colors",
            isBookmarked ? "border-neon-cyan text-neon-cyan" : "border-white/15 text-white/70 hover:text-neon-cyan"
          )}
          aria-label="Toggle bookmark"
        >
          <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      <Link href={`/anime/${anime.mal_id}`} className="relative block h-64 w-full overflow-hidden">
        {poster && (
          <Image
            src={poster}
            alt={anime.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/anime/${anime.mal_id}`}>
          <h3 className="line-clamp-2 font-display text-base font-semibold leading-tight transition-colors group-hover:text-neon-cyan">
            {anime.title_english || anime.title}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-400" fill="currentColor" />
            {anime.score ?? "N/A"}
          </span>
          <span className="flex items-center gap-1">
            <PlayCircle className="h-3 w-3" /> {anime.episodes ?? "?"} eps
          </span>
          <span className="flex items-center gap-1">
            <Tv className="h-3 w-3" /> {anime.type ?? "TV"}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {anime.year ?? "—"}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-xs text-muted/90">{truncate(anime.synopsis, 100)}</p>

        {matchedTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {matchedTags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="default" className="text-[10px]">
                {tag}
              </Badge>
            ))}
            {matchedTags.length > 3 && (
              <Badge variant="outline" className="text-[10px]">
                +{matchedTags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <Link
          href={`/anime/${anime.mal_id}`}
          className="mt-4 flex items-center justify-center rounded-full border border-white/10 bg-white/5 py-2.5 text-xs font-semibold transition-all hover:border-neon-purple/60 hover:bg-gradient-to-r hover:from-neon-purple/30 hover:to-neon-blue/30 hover:shadow-glow"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
