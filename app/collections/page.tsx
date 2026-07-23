"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Library } from "lucide-react";
import { CURATED_COLLECTIONS } from "@/lib/data/tagList";

const GRADIENTS = [
  "from-neon-purple/40 to-neon-blue/20",
  "from-neon-pink/40 to-neon-purple/20",
  "from-neon-blue/40 to-neon-cyan/20",
  "from-neon-cyan/40 to-neon-blue/20",
  "from-neon-pink/40 to-neon-cyan/20",
];

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="flex items-center gap-2 font-display text-3xl font-bold sm:text-4xl">
          <Library className="h-8 w-8 text-neon-purple" /> Collections
        </h1>
        <p className="mt-2 text-sm text-muted">Hand-picked tag combos for every mood.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CURATED_COLLECTIONS.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              href={`/recommendations?tags=${c.tags.join(",")}`}
              className={`card-glow-hover glass relative flex h-40 flex-col justify-end overflow-hidden rounded-xl2 border border-white/10 bg-gradient-to-br p-6 ${GRADIENTS[i % GRADIENTS.length]}`}
            >
              <span className="font-display text-xl font-bold">{c.label}</span>
              <span className="mt-1 text-xs text-muted">{c.tags.join(" · ") || "Curated picks"}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
