"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { RecommendationResult } from "@/types/anime";

export default function RecommendationReason({ result }: { result: RecommendationResult }) {
  const { score, matchedTags, matchBreakdown } = result;

  const bars = [
    { label: "Genre Match", value: matchBreakdown.genreMatch, max: 40, color: "from-neon-purple to-neon-blue" },
    { label: "Tag Match", value: matchBreakdown.tagMatch, max: 35, color: "from-neon-pink to-neon-purple" },
    { label: "Rating Boost", value: matchBreakdown.ratingBoost, max: 15, color: "from-yellow-400 to-orange-400" },
    { label: "Popularity", value: matchBreakdown.popularityBoost, max: 10, color: "from-neon-cyan to-neon-blue" },
  ];

  return (
    <div className="glass rounded-xl2 border border-white/10 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-display text-sm font-semibold">Why this recommendation?</h4>
        <span className="font-display text-lg font-bold text-neon-cyan">{score}% match</span>
      </div>

      {matchedTags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {matchedTags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      )}

      <div className="space-y-2.5">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1 flex justify-between text-[11px] text-muted">
              <span>{bar.label}</span>
              <span>{bar.value}/{bar.max}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(bar.value / bar.max) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${bar.color}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
