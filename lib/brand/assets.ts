/**
 * Central Bossie brand asset registry.
 * Components must import paths from here — never hardcode /brand/* elsewhere.
 *
 * INVENTORY (2026-08-26):
 * ✅ logo-primary.jpg     — full gold logo (crown + B + BOSSIE + ON THAT BEAT + palm)
 * ✅ logo-mark.svg        — compact B monogram (favicon source)
 * ✅ favicon.svg          — browser/app icon
 * ⬜ logo-wordmark.svg    — not yet exported
 * ⬜ logo-light.*         — not yet exported
 * ⬜ logo-dark.*          — not yet exported
 * ⬜ logo-horizontal.*    — not yet exported
 * ⬜ social-share.png     — dedicated OG card not yet exported (falls back to logo-primary)
 */

export type BrandAssetVariant =
  | "primary"
  | "mark"
  | "wordmark"
  | "favicon"
  | "socialShare";

export interface BrandAsset {
  variant: BrandAssetVariant;
  src: string;
  alt: string;
  /** File exists in public/ — only these appear in EPK downloads. */
  available: boolean;
  downloadLabel?: string;
  mimeType?: string;
}

export const brandAssets = {
  primary: {
    variant: "primary",
    src: "/brand/logo-primary.jpg",
    alt: "Bossie on the beat — official logo",
    available: true,
    downloadLabel: "Primary Logo (JPG)",
    mimeType: "image/jpeg",
  },
  mark: {
    variant: "mark",
    src: "/brand/logo-mark.svg",
    alt: "Bossie mark",
    available: true,
    downloadLabel: "Symbol / B Mark (SVG)",
    mimeType: "image/svg+xml",
  },
  favicon: {
    variant: "favicon",
    src: "/brand/favicon.svg",
    alt: "Bossie favicon",
    available: true,
    downloadLabel: "Favicon (SVG)",
    mimeType: "image/svg+xml",
  },
  wordmark: {
    variant: "wordmark",
    src: "",
    alt: "Bossie wordmark",
    available: false,
    downloadLabel: "Wordmark",
  },
  socialShare: {
    variant: "socialShare",
    src: "/brand/logo-primary.jpg",
    alt: "Bossie on the beat",
    available: true,
    mimeType: "image/jpeg",
  },
} as const satisfies Record<string, BrandAsset>;

/** Assets safe to list on EPK / press download section. */
export function getDownloadableBrandAssets() {
  return (Object.values(brandAssets) as BrandAsset[]).filter(
    (a) => a.available && a.src && a.variant !== "socialShare" && "downloadLabel" in a && a.downloadLabel,
  );
}

export function getBrandAsset(variant: BrandAssetVariant): BrandAsset | undefined {
  return Object.values(brandAssets).find((a) => a.variant === variant && a.available);
}

/** Absolute URL for OpenGraph / JSON-LD. */
export function getBrandAssetUrl(variant: BrandAssetVariant, siteUrl: string): string | undefined {
  const asset = getBrandAsset(variant);
  if (!asset?.src) return undefined;
  return `${siteUrl.replace(/\/$/, "")}${asset.src}`;
}
