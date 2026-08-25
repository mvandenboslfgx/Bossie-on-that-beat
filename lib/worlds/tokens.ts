/** Per-world art direction tokens — applied via `world-skin-{slug}` on page shell. */
export const worldSkinTokens: Record<
  string,
  { label: string; accent: string; glow: string; markOpacity: number; navTone: "dark" | "light" }
> = {
  "the-abyss": {
    label: "THE ABYSS",
    accent: "#8b1a1a",
    glow: "rgba(180, 120, 40, 0.35)",
    markOpacity: 0.12,
    navTone: "dark",
  },
  "the-night": {
    label: "THE NIGHT",
    accent: "#3d6bff",
    glow: "rgba(61, 107, 255, 0.25)",
    markOpacity: 0.1,
    navTone: "dark",
  },
  "the-club": {
    label: "THE CLUB",
    accent: "#ff6a2b",
    glow: "rgba(255, 106, 43, 0.3)",
    markOpacity: 0.11,
    navTone: "dark",
  },
  "the-mountain": {
    label: "THE MOUNTAIN",
    accent: "#a8c4d9",
    glow: "rgba(168, 196, 217, 0.2)",
    markOpacity: 0.08,
    navTone: "light",
  },
  "the-storm": {
    label: "THE STORM",
    accent: "#7a8a9a",
    glow: "rgba(200, 210, 220, 0.25)",
    markOpacity: 0.1,
    navTone: "dark",
  },
  "the-door": {
    label: "THE DOOR",
    accent: "#5c4a6e",
    glow: "rgba(92, 74, 110, 0.3)",
    markOpacity: 0.1,
    navTone: "dark",
  },
  "the-streets": {
    label: "THE STREETS",
    accent: "#c9a227",
    glow: "rgba(201, 162, 39, 0.2)",
    markOpacity: 0.09,
    navTone: "dark",
  },
  global: {
    label: "GLOBAL",
    accent: "#d9b35f",
    glow: "rgba(217, 179, 95, 0.25)",
    markOpacity: 0.08,
    navTone: "dark",
  },
};

export function getWorldSkin(slug?: string) {
  if (!slug) return null;
  return worldSkinTokens[slug] ?? null;
}
