"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { ALL_TAGS, TAG_GROUPS } from "@/lib/data/tagList";
import { cn } from "@/lib/utils";

interface Props {
  selected: string[];
  onChange: (tags: string[]) => void;
  compact?: boolean;
}

export default function TagBuilder({ selected, onChange, compact = false }: Props) {
  const [query, setQuery] = useState("");
  const fuse = useMemo(() => new Fuse(ALL_TAGS, { threshold: 0.35 }), []);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).slice(0, 6).map((r) => r.item);
  }, [query, fuse]);

  const addTag = (tag: string) => {
    if (!selected.includes(tag)) onChange([...selected, tag]);
    setQuery("");
  };
  const removeTag = (tag: string) => onChange(selected.filter((t) => t !== tag));

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
          <AnimatePresence>
            {selected.map((tag) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                className="flex items-center gap-1 rounded-full bg-gradient-to-r from-neon-purple/30 to-neon-blue/30 px-3 py-1 text-xs font-medium text-purple-100 border border-neon-purple/40"
              >
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-neon-pink">
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a tag (Isekai, OP MC, Tsundere...)"
            className="min-w-[160px] flex-1 bg-transparent text-sm placeholder:text-muted focus:outline-none"
          />
        </div>

        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/10"
          >
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addTag(s)}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-neon-purple/20"
              >
                <Plus className="h-3.5 w-3.5 text-neon-cyan" /> {s}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {!compact && (
        <div className="space-y-3">
          {Object.entries(TAG_GROUPS).map(([group, tags]) => (
            <div key={group}>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                {group}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => {
                  const active = selected.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => (active ? removeTag(tag) : addTag(tag))}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                        active
                          ? "border-neon-pink/60 bg-neon-pink/20 text-pink-100 shadow-glow-pink"
                          : "border-white/10 bg-white/5 text-muted hover:border-neon-cyan/50 hover:text-foreground"
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
