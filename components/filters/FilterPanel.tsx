"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import type { FilterState } from "@/types/anime";
import { cn } from "@/lib/utils";

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery",
  "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Suspense",
];
const FORMATS: FilterState["format"][] = ["ANY", "TV", "Movie", "OVA", "ONA", "Special"];
const STATUSES: FilterState["status"][] = ["ANY", "Finished Airing", "Currently Airing", "Not yet aired"];

interface Props {
  filters: Partial<FilterState>;
  onChange: (f: Partial<FilterState>) => void;
}

export default function FilterPanel({ filters, onChange }: Props) {
  const [open, setOpen] = useState(true);

  const toggleGenre = (g: string) => {
    const current = filters.genres ?? [];
    onChange({
      ...filters,
      genres: current.includes(g) ? current.filter((x) => x !== g) : [...current, g],
    });
  };

  return (
    <div className="glass rounded-xl2 border border-white/10 p-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="flex items-center gap-2 font-display text-sm font-semibold">
          <SlidersHorizontal className="h-4 w-4 text-neon-cyan" /> Filters
        </span>
        <span className="text-xs text-muted">{open ? "Hide" : "Show"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-5 space-y-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Genre</p>
                <div className="flex flex-wrap gap-1.5">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      onClick={() => toggleGenre(g)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs transition-all",
                        filters.genres?.includes(g)
                          ? "border-neon-purple/60 bg-neon-purple/20 text-purple-100"
                          : "border-white/10 bg-white/5 text-muted hover:border-white/20"
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Format</p>
                <div className="flex flex-wrap gap-1.5">
                  {FORMATS.map((f) => (
                    <button
                      key={f}
                      onClick={() => onChange({ ...filters, format: f })}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs transition-all",
                        filters.format === f
                          ? "border-neon-cyan/60 bg-neon-cyan/20 text-cyan-100"
                          : "border-white/10 bg-white/5 text-muted hover:border-white/20"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Status</p>
                <div className="flex flex-wrap gap-1.5">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => onChange({ ...filters, status: s })}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs transition-all",
                        filters.status === s
                          ? "border-neon-pink/60 bg-neon-pink/20 text-pink-100"
                          : "border-white/10 bg-white/5 text-muted hover:border-white/20"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-wider text-muted">
                  <span>Min Score</span>
                  <span className="text-foreground">{filters.minScore ?? 0}</span>
                </p>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.5}
                  value={filters.minScore ?? 0}
                  onChange={(e) => onChange({ ...filters, minScore: Number(e.target.value) })}
                  className="w-full accent-neon-purple"
                />
              </div>

              <div>
                <p className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-wider text-muted">
                  <span>Year</span>
                  <span className="text-foreground">
                    {filters.years?.[0] ?? 1990} – {filters.years?.[1] ?? 2026}
                  </span>
                </p>
                <input
                  type="range"
                  min={1990}
                  max={2026}
                  value={filters.years?.[1] ?? 2026}
                  onChange={(e) =>
                    onChange({ ...filters, years: [filters.years?.[0] ?? 1990, Number(e.target.value)] })
                  }
                  className="w-full accent-neon-cyan"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
