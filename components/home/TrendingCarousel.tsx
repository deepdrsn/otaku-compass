"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";
import { getTopAnime } from "@/lib/api/jikan";
import { enrichList } from "@/lib/data/enrich";
import { Skeleton } from "@/components/ui/skeleton";

export default function TrendingCarousel() {
  const { data, isLoading } = useQuery({
    queryKey: ["trending-top"],
    queryFn: async () => enrichList(await getTopAnime(1, "airing")),
  });

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-neon-pink" />
          <h2 className="font-display text-2xl font-bold">Trending Right Now</h2>
        </div>

        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-44 shrink-0 rounded-xl2" />
              ))
            : data?.slice(0, 15).map((anime, i) => (
                <motion.div
                  key={anime.mal_id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="group relative w-44 shrink-0"
                >
                  <Link href={`/anime/${anime.mal_id}`}>
                    <div className="card-glow-hover glass relative h-64 w-44 overflow-hidden rounded-xl2 border border-white/10">
                      <span className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-neon-cyan backdrop-blur">
                        {i + 1}
                      </span>
                      {anime.images?.jpg?.large_image_url && (
                        <Image
                          src={anime.images.jpg.large_image_url}
                          alt={anime.title}
                          fill
                          sizes="180px"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 w-full p-3">
                        <p className="line-clamp-2 text-xs font-semibold leading-tight">
                          {anime.title}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-[10px] text-yellow-300">
                          <Star className="h-2.5 w-2.5" fill="currentColor" /> {anime.score ?? "N/A"}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
