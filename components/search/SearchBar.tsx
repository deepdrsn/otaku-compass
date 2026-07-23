"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store/useAppStore";
import { parseQuerySmart } from "@/lib/nlp/parseQuery";

const PLACEHOLDER_EXAMPLES = [
  "I want an anime where the MC gets betrayed and comes back overpowered...",
  "Give me emotional romance that will make me cry...",
  "Funny school anime with an overpowered protagonist...",
  "I need something hype after a long day...",
];

export default function SearchBar({ large = true }: { large?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const addSearchHistory = useAppStore((s) => s.addSearchHistory);
  const setSelectedTags = useAppStore((s) => s.setSelectedTags);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const { tags } = await parseQuerySmart(query);
    addSearchHistory(query, tags);
    setSelectedTags(tags);
    setLoading(false);
    router.push(`/recommendations?q=${encodeURIComponent(query)}&tags=${tags.join(",")}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <motion.div
        whileFocus={{ scale: 1.01 }}
        className={`glass-strong flex items-center gap-3 rounded-full border border-white/10 px-5 shadow-glow transition-all focus-within:border-neon-purple/60 focus-within:shadow-[0_0_40px_rgba(168,85,247,0.45)] ${
          large ? "py-2" : "py-1"
        }`}
      >
        <Search className={`shrink-0 text-neon-purple ${large ? "h-6 w-6" : "h-5 w-5"}`} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={PLACEHOLDER_EXAMPLES[0]}
          className={`w-full bg-transparent text-foreground placeholder:text-muted/70 focus:outline-none ${
            large ? "py-3 text-base md:text-lg" : "py-2 text-sm"
          }`}
        />
        <Button type="submit" size={large ? "default" : "sm"} disabled={loading} className="shrink-0">
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Wand2 className="h-4 w-4" />
            </motion.div>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> {large ? "Find My Anime" : "Search"}
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
}
