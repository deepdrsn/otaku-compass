"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Flame, Sparkles } from "lucide-react";
import SearchBar from "@/components/search/SearchBar";
import { POPULAR_TAG_COMBOS } from "@/lib/data/tagList";
import { useAppStore } from "@/lib/store/useAppStore";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const setSelectedTags = useAppStore((s) => s.setSelectedTags);

  const goToCombo = (tags: string[]) => {
    setSelectedTags(tags);
    router.push(`/recommendations?tags=${tags.join(",")}`);
  };

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 md:pt-24 lg:px-8">
      <div className="grid-overlay absolute inset-0 -z-10" />

      {/* Ambient floating glow orbs */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-72 w-72 animate-pulse-glow rounded-full bg-neon-purple/30 blur-3xl" />
      <div className="pointer-events-none absolute top-40 right-1/4 h-96 w-96 animate-float-slow rounded-full bg-neon-blue/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-60 w-60 animate-float rounded-full bg-neon-pink/25 blur-3xl" />

      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-1.5 text-xs font-medium text-cyan-200"
        >
          <Sparkles className="h-3.5 w-3.5" /> Powered by tag-intelligence, not generic filters
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          Find your next{" "}
          <span className="text-neon-gradient">anime obsession</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-5 max-w-2xl text-base text-muted sm:text-lg"
        >
          Stop scrolling generic genre lists. Describe the vibe, stack up tags like{" "}
          <span className="text-neon-purple font-medium">OP MC</span> +{" "}
          <span className="text-neon-blue font-medium">Isekai</span> +{" "}
          <span className="text-neon-pink font-medium">Comedy</span>, or just type what you want —
          in plain English.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-8 max-w-2xl"
        >
          <SearchBar />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="flex items-center gap-1 text-xs font-medium text-muted">
            <Flame className="h-3.5 w-3.5 text-neon-pink" /> Popular:
          </span>
          {POPULAR_TAG_COMBOS.map((combo) => (
            <button
              key={combo.label}
              onClick={() => goToCombo(combo.tags)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-muted transition-all hover:border-neon-purple/50 hover:text-foreground hover:shadow-glow"
            >
              {combo.label}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10"
        >
          <Link
            href="/recommendations"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-neon-cyan transition-colors hover:text-white"
          >
            Or build your own tag combo
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
