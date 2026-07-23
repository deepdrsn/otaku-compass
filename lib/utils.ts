import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n?: number | null): string {
  if (!n) return "N/A";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function truncate(str?: string | null, len = 160): string {
  if (!str) return "No synopsis available.";
  const clean = str.replace(/\[Written by.*?\]/gi, "").trim();
  return clean.length > len ? `${clean.slice(0, len).trim()}…` : clean;
}
