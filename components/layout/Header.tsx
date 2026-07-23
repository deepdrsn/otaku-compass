"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Compass, Heart, Bookmark, Menu, X, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/recommendations", label: "Discover" },
  { href: "/top100", label: "Top 100" },
  { href: "/collections", label: "Collections" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const favorites = useAppStore((s) => s.favorites);
  const bookmarks = useAppStore((s) => s.bookmarks);

  return (
    <header className="sticky top-0 z-50">
      <div className="glass-strong border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 20 }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan shadow-glow"
            >
              <Compass className="h-5 w-5 text-white" />
            </motion.div>
            <span className="font-display text-lg font-bold tracking-tight">
              Otaku<span className="text-neon-gradient">Compass</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/favorites"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:border-neon-pink/50"
            >
              <Heart className="h-4 w-4" />
              {favorites.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-neon-pink text-[10px] font-bold">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              href="/bookmarks"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:border-neon-cyan/50"
            >
              <Bookmark className="h-4 w-4" />
              {bookmarks.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-neon-cyan text-[10px] font-bold text-black">
                  {bookmarks.length}
                </span>
              )}
            </Link>
            <Link
              href="/recommendations?surprise=1"
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink px-4 py-2 text-sm font-semibold shadow-glow-pink transition-transform hover:scale-105"
            >
              <Sparkles className="h-3.5 w-3.5" /> Surprise Me
            </Link>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className={cn("overflow-hidden glass-strong md:hidden", open && "border-b border-white/5")}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/favorites" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/5">
            Favorites ({favorites.length})
          </Link>
          <Link href="/bookmarks" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/5">
            Bookmarks ({bookmarks.length})
          </Link>
        </div>
      </motion.div>
    </header>
  );
}
