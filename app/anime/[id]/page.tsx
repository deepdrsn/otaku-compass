"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Heart, Bookmark, Share2, Users, Calendar, Tv, Building2 } from "lucide-react";
import { getAnimeById } from "@/lib/api/jikan";
import { enrichAnime } from "@/lib/data/enrich";
import { scoreAnime } from "@/lib/recommend/engine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RecommendationReason from "@/components/anime/RecommendationReason";
import { useAppStore } from "@/lib/store/useAppStore";
import { formatNumber } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnimeDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: anime, isLoading } = useQuery({
    queryKey: ["anime", id],
    queryFn: async () => enrichAnime(await getAnimeById(id)),
    enabled: !!id,
  });

  const isFavorite = useAppStore((s) => (anime ? s.isFavorite(anime.mal_id) : false));
  const isBookmarked = useAppStore((s) => (anime ? s.isBookmarked(anime.mal_id) : false));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);
  const addRecentlyViewed = useAppStore((s) => s.addRecentlyViewed);
  const selectedTags = useAppStore((s) => s.selectedTags);

  useEffect(() => {
    if (anime) addRecentlyViewed(anime);
  }, [anime, addRecentlyViewed]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: anime?.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading || !anime) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Skeleton className="h-96 w-full rounded-xl2" />
      </div>
    );
  }

  const result = scoreAnime(anime, selectedTags.length > 0 ? selectedTags : anime.smartTags.slice(0, 4));
  const poster = anime.images?.webp?.large_image_url ?? anime.images?.jpg?.large_image_url;

  return (
    <div className="relative">
      {/* Backdrop blur hero */}
      <div className="relative h-72 w-full overflow-hidden sm:h-96">
        {poster && (
          <Image src={poster} alt="" fill className="scale-110 object-cover opacity-30 blur-2xl" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      </div>

      <div className="mx-auto -mt-40 max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="glass sticky top-24 overflow-hidden rounded-xl2 border border-white/10 shadow-glow">
              {poster && (
                <div className="relative h-96 w-full">
                  <Image src={poster} alt={anime.title} fill className="object-cover" />
                </div>
              )}
              <div className="flex gap-2 p-4">
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => toggleFavorite(anime)}
                >
                  <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} /> Favorite
                </Button>
                <Button
                  variant={isBookmarked ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => toggleBookmark(anime)}
                >
                  <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} /> Save
                </Button>
                <Button variant="glass" size="icon" onClick={handleShare} aria-label="Share">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              {anime.title_english || anime.title}
            </h1>
            {anime.title_english && anime.title !== anime.title_english && (
              <p className="mt-1 text-sm text-muted">{anime.title}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5 text-yellow-300">
                <Star className="h-4 w-4" fill="currentColor" /> {anime.score ?? "N/A"} ({formatNumber(anime.scored_by)} votes)
              </span>
              <span className="flex items-center gap-1.5">
                <Tv className="h-4 w-4" /> {anime.type} · {anime.episodes ?? "?"} episodes
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {anime.year ?? "—"} {anime.season ? `· ${anime.season}` : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> {formatNumber(anime.members)} members
              </span>
              {anime.studios && anime.studios.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" /> {anime.studios.map((s) => s.name).join(", ")}
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {anime.genres?.map((g) => (
                <Badge key={g.mal_id} variant="outline">{g.name}</Badge>
              ))}
              {anime.smartTags.map((t) => (
                <Badge key={t} variant="pink">{t}</Badge>
              ))}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted">{anime.synopsis}</p>

            {anime.streaming && anime.streaming.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 font-display text-sm font-semibold">Watch On</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.streaming.map((s) => (
                    <a
                      key={s.url}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium transition-colors hover:border-neon-purple/50"
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <RecommendationReason result={result} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
