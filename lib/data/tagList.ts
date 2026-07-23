// Master list of descriptive "weeb tags" the whole app understands.
// Grouped for the tag-builder UI; flattened export for fast lookups.

export const TAG_GROUPS: Record<string, string[]> = {
  "Protagonist": [
    "OP MC", "Weak to Strong", "Solo MC", "Smart MC", "Villain MC",
    "Female MC", "Male MC", "Assassin", "Hero",
  ],
  "Setting": [
    "School", "Academy", "Magic Academy", "Fantasy", "Sci-Fi", "Space",
    "Military", "Kingdom Building", "Game World", "Dungeon", "Guild",
    "Isekai", "Reincarnation", "Time Travel",
  ],
  "Romance": [
    "Romance", "Tsundere", "Yandere", "Kuudere", "Harem", "Reverse Harem",
    "Slow Romance", "Love Triangle", "Childhood Friends",
  ],
  "Tone": [
    "Psychological", "Dark", "Sad", "Emotional", "Happy", "Comedy",
    "Slice of Life", "Horror", "Gore", "Mystery", "Mind Games",
  ],
  "Conflict": [
    "Tournament Arc", "Group Battles", "Revenge", "Betrayal",
    "Overpowered Villain", "Demon King", "Villain MC", "Superpower",
  ],
  "Fantasy Beings": [
    "Vampire", "Zombie", "Monster Girl", "Gods", "Angels", "Demons",
  ],
  "Skills": [
    "Hunter", "Cultivation", "Martial Arts", "Ninja", "Samurai",
    "Detective", "Survival", "Mafia",
  ],
  "Vibe": [
    "Ecchi", "Cooking", "Sports", "Music", "Idols", "Politics", "Pirates",
    "Mecha",
  ],
};

export const ALL_TAGS: string[] = Array.from(
  new Set(Object.values(TAG_GROUPS).flat())
).sort();

// Popular combos shown on the homepage as one-click chips.
export const POPULAR_TAG_COMBOS: { label: string; tags: string[] }[] = [
  { label: "Peak Isekai", tags: ["Isekai", "OP MC", "Fantasy"] },
  { label: "Cry Tonight", tags: ["Sad", "Emotional", "Romance"] },
  { label: "Mind Games", tags: ["Psychological", "Dark", "Mystery"] },
  { label: "Weekend Binge", tags: ["Comedy", "Slice of Life", "School"] },
  { label: "Revenge Arc", tags: ["Villain MC", "Revenge", "Betrayal"] },
  { label: "Tournament Hype", tags: ["Tournament Arc", "OP MC", "Group Battles"] },
];

export const CURATED_COLLECTIONS: { label: string; slug: string; tags: string[] }[] = [
  { label: "Peak Isekai", slug: "peak-isekai", tags: ["Isekai", "OP MC"] },
  { label: "Mind Games", slug: "mind-games", tags: ["Psychological", "Mind Games"] },
  { label: "Cry Tonight", slug: "cry-tonight", tags: ["Sad", "Emotional"] },
  { label: "Hidden Gems", slug: "hidden-gems", tags: [] },
  { label: "Weekend Binge", slug: "weekend-binge", tags: ["Comedy", "Slice of Life"] },
];
