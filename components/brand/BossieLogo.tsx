import Link from "next/link";
import { brandAssets } from "@/lib/brand/assets";
import { siteSettings } from "@/lib/site-settings";

type BossieLogoVariant = "primary" | "mark" | "wordmark";

/** Crop the EXISTING genuine Bossie image to its original emblem and lettering. */
export function BossieLogo({
  variant = "mark",
  href = "/",
  priority,
  className,
}: {
  variant?: BossieLogoVariant;
  href?: string;
  priority?: boolean;
  className?: string;
}) {
  const src = brandAssets.primary.src;
  const mark = (
    <span className="bossie-authentic-emblem" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={1024} height={1024} fetchPriority={priority ? "high" : undefined} />
    </span>
  );
  const wordmark = (
    <span className="bossie-authentic-name" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={1024} height={1024} fetchPriority={priority ? "high" : undefined} />
    </span>
  );
  const inner =
    variant === "mark" ? (
      <span className={`bossie-logo-mark bossie-authentic-mark ${className ?? ""}`.trim()}
        role="img" aria-label={brandAssets.mark.alt}>
        {mark}
      </span>
    ) : (
      <span
        className={`bossie-logo-primary bossie-authentic-lockup ${className ?? ""}`.trim()}
        role="img"
        aria-label={siteSettings.artistName}
      >
        {mark}
        {wordmark}
      </span>
    );

  if (!href) return inner;
  return <Link href={href} className="bossie-logo-link" aria-label={siteSettings.artistName}>{inner}</Link>;
}
