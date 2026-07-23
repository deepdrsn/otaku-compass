import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EnrichedAnime, SearchHistoryItem } from "@/types/anime";

interface AppState {
  favorites: EnrichedAnime[];
  bookmarks: EnrichedAnime[];
  recentlyViewed: EnrichedAnime[];
  searchHistory: SearchHistoryItem[];
  trendingSearches: string[];
  selectedTags: string[];
  badges: string[];

  toggleFavorite: (anime: EnrichedAnime) => void;
  toggleBookmark: (anime: EnrichedAnime) => void;
  addRecentlyViewed: (anime: EnrichedAnime) => void;
  addSearchHistory: (query: string, tags: string[]) => void;
  clearHistory: () => void;
  setSelectedTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  isFavorite: (id: number) => boolean;
  isBookmarked: (id: number) => boolean;
  unlockBadge: (badge: string) => void;
}

const MAX_HISTORY = 20;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      favorites: [],
      bookmarks: [],
      recentlyViewed: [],
      searchHistory: [],
      trendingSearches: [
        "OP MC isekai comedy",
        "sad romance that will make me cry",
        "dark psychological thriller",
        "villain mc revenge fantasy",
        "funny school anime overpowered protagonist",
      ],
      selectedTags: [],
      badges: [],

      toggleFavorite: (anime) => {
        const exists = get().favorites.some((a) => a.mal_id === anime.mal_id);
        set({
          favorites: exists
            ? get().favorites.filter((a) => a.mal_id !== anime.mal_id)
            : [...get().favorites, anime],
        });
        if (!exists && get().favorites.length + 1 >= 10) {
          get().unlockBadge("Collector: 10 Favorites");
        }
      },

      toggleBookmark: (anime) => {
        const exists = get().bookmarks.some((a) => a.mal_id === anime.mal_id);
        set({
          bookmarks: exists
            ? get().bookmarks.filter((a) => a.mal_id !== anime.mal_id)
            : [...get().bookmarks, anime],
        });
      },

      addRecentlyViewed: (anime) => {
        const filtered = get().recentlyViewed.filter((a) => a.mal_id !== anime.mal_id);
        set({ recentlyViewed: [anime, ...filtered].slice(0, MAX_HISTORY) });
      },

      addSearchHistory: (query, tags) => {
        const item: SearchHistoryItem = {
          id: `${Date.now()}`,
          query,
          tags,
          timestamp: Date.now(),
        };
        set({ searchHistory: [item, ...get().searchHistory].slice(0, MAX_HISTORY) });
      },

      clearHistory: () => set({ searchHistory: [] }),

      setSelectedTags: (tags) => set({ selectedTags: tags }),

      toggleTag: (tag) => {
        const has = get().selectedTags.includes(tag);
        set({
          selectedTags: has
            ? get().selectedTags.filter((t) => t !== tag)
            : [...get().selectedTags, tag],
        });
      },

      isFavorite: (id) => get().favorites.some((a) => a.mal_id === id),
      isBookmarked: (id) => get().bookmarks.some((a) => a.mal_id === id),

      unlockBadge: (badge) => {
        if (!get().badges.includes(badge)) {
          set({ badges: [...get().badges, badge] });
        }
      },
    }),
    { name: "otaku-compass-storage" }
  )
);
