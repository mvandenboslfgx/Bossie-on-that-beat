/** Canonical Bossie brand registry: only original approved artwork is displayed. */
export type BrandAssetVariant = "primary" | "mark" | "wordmark" | "favicon" | "socialShare";

export interface BrandAsset {
  variant: BrandAssetVariant;
  src: string;
  alt: string;
  available: boolean;
  downloadLabel?: string;
  mimeType?: string;
}

/** Original approved gold crown/B/palm logo, not the fabricated B vectors. */
const ORIGINAL_BOSSIE_LOGO = "/brand/logo-primary.jpg";

export const brandAssets = {
  primary: {
    variant: "primary",
    src: ORIGINAL_BOSSIE_LOGO,
    alt: "Bossie on that beat — original gold crowned B logo and artist wordmark",
    available: true,
    downloadLabel: "Original Bossie Logo (JPG)",
    mimeType: "image/jpeg",
  },
  mark: {
    variant: "mark",
    src: ORIGINAL_BOSSIE_LOGO,
    alt: "Bossie on that beat original crowned B emblem",
    available: true,
    mimeType: "image/jpeg",
  },
  favicon: {
    variant: "favicon",
    src: ORIGINAL_BOSSIE_LOGO,
    alt: "Bossie on that beat original logo",
    available: true,
    mimeType: "image/jpeg",
  },
  wordmark: {
    variant: "wordmark",
    src: ORIGINAL_BOSSIE_LOGO,
    alt: "Bossie on that beat official wordmark",
    available: true,
    mimeType: "image/jpeg",
  },
  socialShare: {
    variant: "socialShare",
    src: ORIGINAL_BOSSIE_LOGO,
    alt: "Bossie on that beat",
    available: true,
    mimeType: "image/jpeg",
  },
} as const satisfies Record<string, BrandAsset>;

export function getDownloadableBrandAssets() {
  return (Object.values(brandAssets) as BrandAsset[]).filter(
    (asset) => asset.available && asset.downloadLabel && asset.src,
  );
}

export function getBrandAsset(variant: BrandAssetVariant): BrandAsset | undefined {
  return Object.values(brandAssets).find((asset) => asset.variant === variant && asset.available);
}

export function getBrandAssetUrl(variant: BrandAssetVariant, siteUrl: string): string | undefined {
  const asset = getBrandAsset(variant);
  if (!asset?.src) return undefined;
  return `${siteUrl.replace(/\/$/, "")}${asset.src}`;
}
