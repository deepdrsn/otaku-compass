"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CURATED_COLLECTIONS } from "@/lib/data/tagList";

const GRADIENTS = [
  "from-neon-purple/40 to-neon-blue/20",
  "from-neon-pink/40 to-neon-purple/20",
  "from-neon-blue/40 to-neon-cyan/20",
  "from-neon-cyan/40 to-neon-blue/20",
  "from-neon-pink/40 to-neon-cyan/20",
];

export default function CollectionsGrid() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 font-display text-2xl font-bold">Curated Collections</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CURATED_COLLECTIONS.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={`/recommendations?tags=${c.tags.join(",")}`}
                className={`card-glow-hover glass relative flex h-32 items-end overflow-hidden rounded-xl2 border border-white/10 bg-gradient-to-br p-4 ${GRADIENTS[i % GRADIENTS.length]}`}
              >
                <span className="font-display text-sm font-bold">{c.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
