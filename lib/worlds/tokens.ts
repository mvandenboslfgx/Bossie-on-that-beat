/** Per-world art direction — skins, lore, B-mark treatment, typography. */

export type WorldMarkTreatment = "seal" | "streetlight" | "stamp" | "crown" | "pulse" | "portal" | "grid" | "globe";
export type WorldTypography = "gothic" | "noir" | "alpine" | "neon" | "storm" | "ritual" | "street" | "anthem";
export type WorldNavTone = "dark" | "light";
/** Overview card composition — different mobile posters per world. */
export type WorldOverviewLayout = "noir" | "seal" | "alpine" | "neon" | "storm" | "street" | "ritual" | "anthem";

export interface WorldSkin {
  slug: string;
  label: string;
  number: string;
  accent: string;
  glow: string;
  markOpacity: number;
  navTone: WorldNavTone;
  markTreatment: WorldMarkTreatment;
  typography: WorldTypography;
  overviewLayout: WorldOverviewLayout;
  /** Short manifesto / lore shown on world detail. */
  lore: string;
  /** Max ~55–70 chars for Worlds overview. */
  teaser: string;
  ctaLabel: string;
  listenLabel: string;
  watchLabel: string;
  /**
   * Cover art already carries Bossie branding — suppress/soften UI B-mark on overview.
   */
  artworkContainsBrandMark?: boolean;
  /** Overview: hide teaser line (artwork speaks). */
  overviewMinimalCopy?: boolean;
}

export const worldSkinTokens: Record<string, WorldSkin> = {
  "the-door": {
    slug: "the-door",
    label: "THE DOOR",
    number: "001",
    accent: "#b08d57",
    glow: "rgba(92, 74, 110, 0.3)",
    markOpacity: 0.1,
    navTone: "dark",
    markTreatment: "portal",
    typography: "ritual",
    overviewLayout: "ritual",
    lore: "A threshold that was never meant to keep anything out. Memory, war, ritual and loss — gothic psychological cinema.",
    teaser: "A threshold that never closes.",
    ctaLabel: "ENTER THE DOOR",
    listenLabel: "LISTEN TO THIS WORLD",
    watchLabel: "WATCH THIS WORLD",
  },
  "the-abyss": {
    slug: "the-abyss",
    label: "THE ABYSS",
    number: "002",
    accent: "#b8860b",
    glow: "rgba(139, 26, 26, 0.45)",
    markOpacity: 0.14,
    navTone: "dark",
    markTreatment: "seal",
    typography: "gothic",
    overviewLayout: "seal",
    lore: "Descend. Angelic voices collide with subterranean choirs. Burned gold over black stone. Every note is a cathedral collapsing in slow motion.",
    teaser: "Burned gold. Descend.",
    ctaLabel: "DESCEND",
    listenLabel: "LISTEN TO THIS WORLD",
    watchLabel: "WATCH THIS WORLD",
    artworkContainsBrandMark: true,
    overviewMinimalCopy: true,
  },
  "the-mountain": {
    slug: "the-mountain",
    label: "THE MOUNTAIN",
    number: "003",
    accent: "#c9a227",
    glow: "rgba(168, 196, 217, 0.28)",
    markOpacity: 0.06,
    navTone: "light",
    markTreatment: "stamp",
    typography: "alpine",
    overviewLayout: "alpine",
    lore: "Altitude. Snow. Remembrance. Human scale against infinite white. The mountain does not speak — it remembers.",
    teaser: "It remembers.",
    ctaLabel: "EXPLORE",
    listenLabel: "LISTEN TO THIS WORLD",
    watchLabel: "WATCH THIS WORLD",
    artworkContainsBrandMark: true,
    overviewMinimalCopy: true,
  },
  "the-club": {
    slug: "the-club",
    label: "THE CLUB",
    number: "004",
    accent: "#ff6a2b",
    glow: "rgba(255, 106, 43, 0.3)",
    markOpacity: 0.11,
    navTone: "dark",
    markTreatment: "pulse",
    typography: "neon",
    overviewLayout: "neon",
    lore: "Heat, velocity, neon and replay energy. Built for midnight rooms and bodies that refuse to stop.",
    teaser: "Heat. Velocity. Neon.",
    ctaLabel: "ENTER THE CLUB",
    listenLabel: "LISTEN TO THIS WORLD",
    watchLabel: "WATCH THIS WORLD",
    artworkContainsBrandMark: true,
  },
  "the-storm": {
    slug: "the-storm",
    label: "THE STORM",
    number: "005",
    accent: "#7a8a9a",
    glow: "rgba(200, 210, 220, 0.25)",
    markOpacity: 0.1,
    navTone: "dark",
    markTreatment: "crown",
    typography: "storm",
    overviewLayout: "storm",
    lore: "Storm-scale dynamics. Cinematic force. Orchestral power that arrives like weather — sudden, total, unforgettable.",
    teaser: "Power that arrives like weather.",
    ctaLabel: "ENTER THE STORM",
    listenLabel: "LISTEN TO THIS WORLD",
    watchLabel: "WATCH THIS WORLD",
    artworkContainsBrandMark: true,
  },
  "the-streets": {
    slug: "the-streets",
    label: "THE STREETS",
    number: "006",
    accent: "#c9a227",
    glow: "rgba(201, 162, 39, 0.2)",
    markOpacity: 0.09,
    navTone: "dark",
    markTreatment: "grid",
    typography: "street",
    overviewLayout: "street",
    lore: "City velocity. Dutch energy. Street-level impact — concrete, gold and motion that never asks permission.",
    teaser: "Concrete. Gold. Motion without permission.",
    ctaLabel: "ENTER THE STREETS",
    listenLabel: "LISTEN TO THIS WORLD",
    watchLabel: "WATCH THIS WORLD",
  },
  "the-night": {
    slug: "the-night",
    label: "THE NIGHT",
    number: "007",
    accent: "#3d6bff",
    glow: "rgba(61, 107, 255, 0.28)",
    markOpacity: 0.1,
    navTone: "dark",
    markTreatment: "streetlight",
    typography: "noir",
    overviewLayout: "noir",
    lore: "After hours. Black glass and blue neon. European noir where every transmission arrives after midnight — and never leaves the street.",
    teaser: "After midnight, every signal changes.",
    ctaLabel: "ENTER THE NIGHT",
    listenLabel: "LISTEN TO THIS WORLD",
    watchLabel: "WATCH THIS WORLD",
    artworkContainsBrandMark: true,
  },
  global: {
    slug: "global",
    label: "GLOBAL",
    number: "008",
    accent: "#d9b35f",
    glow: "rgba(217, 179, 95, 0.25)",
    markOpacity: 0.08,
    navTone: "dark",
    markTreatment: "globe",
    typography: "anthem",
    overviewLayout: "anthem",
    lore: "Stadium-scale songwriting. International unity. One signal, many flags — Bossie for the world stage.",
    teaser: "One signal. Many flags.",
    ctaLabel: "ENTER GLOBAL",
    listenLabel: "LISTEN TO THIS WORLD",
    watchLabel: "WATCH THIS WORLD",
    artworkContainsBrandMark: true,
  },
};

export function getWorldSkin(slug?: string): WorldSkin | null {
  if (!slug) return null;
  return worldSkinTokens[slug] ?? null;
}

export function getWorldOrder(): string[] {
  return Object.keys(worldSkinTokens);
}

export function getAdjacentWorlds(slug: string): { prev?: WorldSkin; next?: WorldSkin } {
  const order = getWorldOrder();
  const i = order.indexOf(slug);
  if (i < 0) return {};
  const prevSlug = order[(i - 1 + order.length) % order.length];
  const nextSlug = order[(i + 1) % order.length];
  return {
    prev: prevSlug && prevSlug !== slug ? worldSkinTokens[prevSlug] : undefined,
    next: nextSlug && nextSlug !== slug ? worldSkinTokens[nextSlug] : undefined,
  };
}

export function splitWorldTitle(label: string): [string, string] | [string] {
  const parts = label.trim().split(/\s+/);
  if (parts.length >= 2) return [parts[0]!, parts.slice(1).join(" ")];
  return [label];
}
