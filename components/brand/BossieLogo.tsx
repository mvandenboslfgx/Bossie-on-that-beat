import Link from "next/link";
import { brandAssets } from "@/lib/brand/assets";
import { siteSettings } from "@/lib/site-settings";

type BossieLogoVariant = "primary" | "mark" | "wordmark";

const sizes: Record<BossieLogoVariant, { width: number; height: number; className: string }> = {
  primary: { width: 640, height: 640, className: "bossie-logo bossie-logo-primary" },
  mark: { width: 44, height: 44, className: "bossie-logo bossie-logo-mark" },
  wordmark: { width: 0, height: 0, className: "bossie-logo bossie-logo-wordmark" },
};

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
  const cfg = sizes[variant];

  const inner =
    variant === "wordmark" ? (
      <span className={`${cfg.className} ${className ?? ""}`.trim()} aria-label={siteSettings.artistName}>
        <span className="bossie-wordmark-name">BOSSIE</span>
        <span className="bossie-wordmark-tail">ON THAT BEAT</span>
      </span>
    ) : variant === "primary" && brandAssets.primary.available ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={brandAssets.primary.src}
        alt={brandAssets.primary.alt}
        width={cfg.width}
        height={cfg.height}
        className={`${cfg.className} ${className ?? ""}`.trim()}
        style={{ width: "min(100%, 320px)", height: "auto" }}
        fetchPriority={priority ? "high" : undefined}
      />
    ) : brandAssets.mark.available ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={brandAssets.mark.src}
        alt={brandAssets.mark.alt}
        width={sizes.mark.width}
        height={sizes.mark.height}
        className={`${sizes.mark.className} ${className ?? ""}`.trim()}
        fetchPriority={priority ? "high" : undefined}
      />
    ) : (
      <span className={`bossie-logo-wordmark ${className ?? ""}`.trim()} aria-label={siteSettings.artistName}>
        <span className="bossie-wordmark-name">BOSSIE</span>
        <span className="bossie-wordmark-tail">ON THAT BEAT</span>
      </span>
    );

  if (!href) return inner;
  return (
    <Link href={href} className="bossie-logo-link">
      {inner}
    </Link>
  );
}
