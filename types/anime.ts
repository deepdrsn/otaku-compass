// Core anime data shape, normalized from the Jikan (MyAnimeList) API
// and enriched with our local smart-tag mapping.

export interface AnimeGenre {
  mal_id: number;
  name: string;
}

export interface AnimeTitle {
  type: string;
  title: string;
}

export interface JikanAnime {
  mal_id: number;
  title: string;
  title_english?: string | null;
  images: {
    jpg: { image_url: string; large_image_url: string };
    webp?: { image_url: string; large_image_url: string };
  };
  synopsis?: string | null;
  score?: number | null;
  scored_by?: number | null;
  rank?: number | null;
  popularity?: number | null;
  members?: number | null;
  favorites?: number | null;
  episodes?: number | null;
  status?: string | null;
  airing?: boolean;
  type?: string | null; // TV, Movie, OVA...
  year?: number | null;
  season?: string | null;
  duration?: string | null;
  rating?: string | null;
  studios?: { name: string }[];
  genres?: AnimeGenre[];
  themes?: AnimeGenre[];
  demographics?: AnimeGenre[];
  trailer?: { youtube_id?: string | null };
  streaming?: { name: string; url: string }[];
}

// Our enriched, app-wide anime record used throughout the UI.
export interface EnrichedAnime extends JikanAnime {
  smartTags: string[]; // custom weeb tags (OP MC, Isekai, Tsundere, etc)
}

export interface RecommendationResult {
  anime: EnrichedAnime;
  score: number; // 0 - 100 confidence
  matchedTags: string[];
  matchBreakdown: {
    genreMatch: number;
    tagMatch: number;
    popularityBoost: number;
    ratingBoost: number;
  };
}

export interface FilterState {
  genres: string[];
  years: [number, number];
  episodesRange: [number, number];
  format: "ANY" | "TV" | "Movie" | "OVA" | "ONA" | "Special";
  status: "ANY" | "Finished Airing" | "Currently Airing" | "Not yet aired";
  minScore: number;
  studios: string[];
  themes: string[];
  demographic: string;
  season: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  tags: string[];
  timestamp: number;
}
