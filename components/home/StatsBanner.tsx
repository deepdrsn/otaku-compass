"use client";

import { motion } from "framer-motion";
import { Sparkles, Tags, Brain, Zap } from "lucide-react";

const STATS = [
  { icon: Tags, label: "Descriptive Tags", value: "80+" },
  { icon: Brain, label: "NL Understanding", value: "Instant" },
  { icon: Zap, label: "Confidence Scoring", value: "Explained" },
  { icon: Sparkles, label: "Curated Smart Tags", value: "Hand-tagged" },
];

export default function StatsBanner() {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="glass grid grid-cols-2 gap-4 rounded-xl2 border border-white/10 p-6 sm:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center text-center"
            >
              <stat.icon className="mb-2 h-5 w-5 text-neon-purple" />
              <span className="font-display text-lg font-bold text-neon-gradient">{stat.value}</span>
              <span className="text-[11px] text-muted">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
