import { ALL_TAGS } from "@/lib/data/tagList";

// Local, dependency-free NL -> tag mapper. Matches phrases/synonyms in
// free text to our tag taxonomy. This is the fallback (and default)
// path — no API key required. If NEXT_PUBLIC_ENABLE_AI_NLP is set and
// an OpenAI/Gemini key is configured server-side, `/api/nlp` can be
// used instead for richer understanding (see app/api/nlp/route.ts).
const SYNONYM_MAP: Record<string, string[]> = {
  "OP MC": ["overpowered", "op mc", "overpowered protagonist", "strongest", "op protagonist"],
  "Weak to Strong": ["weak to strong", "underdog", "comes back overpowered", "grows stronger", "power up"],
  "Betrayal": ["betrayed", "betrayal", "backstab", "backstabbed"],
  "Revenge": ["revenge", "get back at", "vengeance"],
  "Isekai": ["isekai", "transported to another world", "reborn in another world", "summoned to another world"],
  "Reincarnation": ["reincarnat", "reborn"],
  "Time Travel": ["time travel", "time loop", "looping time"],
  "School": ["school", "high school", "classroom"],
  "Academy": ["academy"],
  "Magic Academy": ["magic academy", "magic school"],
  "Romance": ["romance", "romantic", "love story"],
  "Slow Romance": ["slow burn", "slow romance"],
  "Sad": ["sad", "cry", "crying", "tearjerker", "heartbreak", "heartbreaking"],
  "Emotional": ["emotional", "touching", "moving story"],
  "Happy": ["happy", "feel good", "wholesome", "uplifting"],
  "Comedy": ["funny", "comedy", "hilarious", "humor"],
  "Slice of Life": ["slice of life", "chill", "relaxing", "calm"],
  "Dark": ["dark", "grim", "bleak"],
  "Psychological": ["psychological", "mind games", "mind-bending", "thriller"],
  "Gore": ["gore", "gory", "violent", "graphic violence"],
  "Horror": ["horror", "scary", "creepy"],
  "Tournament Arc": ["tournament", "fighting competition"],
  "Group Battles": ["group battle", "team fights", "war between", "army vs"],
  "Solo MC": ["solo", "lone protagonist", "works alone"],
  "Smart MC": ["smart", "genius", "clever protagonist", "strategist"],
  "Villain MC": ["villain protagonist", "villain mc", "evil mc", "antagonist protagonist"],
  "Hero": ["hero", "chosen one", "savior"],
  "Assassin": ["assassin", "hitman"],
  "Mafia": ["mafia", "yakuza", "gang"],
  "Demon King": ["demon king", "demon lord"],
  "Military": ["military", "war anime", "soldiers", "army"],
  "Fantasy": ["fantasy", "magical world"],
  "Sci-Fi": ["sci-fi", "science fiction", "futuristic"],
  "Mecha": ["mecha", "robots", "giant robot"],
  "Vampire": ["vampire"],
  "Zombie": ["zombie", "undead"],
  "Survival": ["survival", "survive", "apocalypse"],
  "Game World": ["game world", "video game world", "trapped in a game", "vrmmo"],
  "Dungeon": ["dungeon"],
  "Guild": ["guild"],
  "Hunter": ["hunter"],
  "Cultivation": ["cultivation", "xianxia"],
  "Martial Arts": ["martial arts", "kung fu"],
  "Ninja": ["ninja"],
  "Samurai": ["samurai"],
  "Detective": ["detective", "investigator"],
  "Mystery": ["mystery", "whodunit", "solve a case"],
  "Ecchi": ["ecchi", "fan service"],
  "Harem": ["harem"],
  "Reverse Harem": ["reverse harem"],
  "Love Triangle": ["love triangle"],
  "Childhood Friends": ["childhood friend"],
  "Monster Girl": ["monster girl"],
  "Gods": ["god", "gods", "deity"],
  "Angels": ["angel"],
  "Demons": ["demon"],
  "Space": ["space", "space opera", "outer space"],
  "Pirates": ["pirate"],
  "Cooking": ["cooking", "food anime", "chef"],
  "Sports": ["sports", "volleyball", "basketball anime", "soccer anime"],
  "Music": ["music anime", "band", "orchestra"],
  "Idols": ["idol", "idols"],
  "Kingdom Building": ["kingdom building", "build a nation", "founding a kingdom"],
  "Politics": ["politics", "political intrigue", "court intrigue"],
  "Mind Games": ["mind game", "psychological battle", "outsmart"],
  "Superpower": ["superpower", "super power", "quirks", "abilities"],
  "Female MC": ["female lead", "female protagonist", "female mc"],
  "Male MC": ["male lead", "male protagonist", "male mc"],
  "Tsundere": ["tsundere"],
  "Yandere": ["yandere"],
  "Kuudere": ["kuudere"],
};

export interface ParsedQuery {
  tags: string[];
  confidence: number;
}

/**
 * Purely local, offline NL parser. Scans the free-text query for
 * synonym phrases and returns the matched tag set. No network call —
 * works instantly and requires no API key.
 */
export function parseQueryLocal(query: string): ParsedQuery {
  const text = query.toLowerCase();
  const found = new Set<string>();

  Object.entries(SYNONYM_MAP).forEach(([tag, phrases]) => {
    if (phrases.some((p) => text.includes(p))) found.add(tag);
  });

  // Direct tag name mentions (e.g. user literally typed "isekai")
  ALL_TAGS.forEach((tag) => {
    if (text.includes(tag.toLowerCase())) found.add(tag);
  });

  const tags = Array.from(found);
  const confidence = Math.min(1, tags.length / 4);

  return { tags, confidence };
}

/**
 * Tries the server AI route first (if configured), falls back to the
 * local parser on any failure — so the feature never breaks if no
 * OPENAI/GEMINI key is set.
 */
export async function parseQuerySmart(query: string): Promise<ParsedQuery> {
  try {
    const res = await fetch("/api/nlp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error("no ai route");
    const data = await res.json();
    if (Array.isArray(data.tags) && data.tags.length > 0) {
      return { tags: data.tags, confidence: 0.95 };
    }
    throw new Error("empty ai response");
  } catch {
    return parseQueryLocal(query);
  }
}
