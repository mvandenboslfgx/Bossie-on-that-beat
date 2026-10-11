import Link from "next/link";
import { brandAssets } from "@/lib/brand/assets";
import { siteSettings } from "@/lib/site-settings";

type BossieLogoVariant = "primary" | "mark" | "wordmark";

const sizes: Record<BossieLogoVariant, { width: number; height: number; className: string }> = {
  primary: { width: 0, height: 0, className: "bossie-logo bossie-logo-primary" },
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
    ) : variant === "primary" ? (
      <span className={`${cfg.className} bossie-lockup ${className ?? ""}`.trim()} aria-label={siteSettings.artistName}>
        <span className="bossie-lockup-monogram" aria-hidden="true">B</span>
        <span className="bossie-lockup-copy">
          <span className="bossie-lockup-name">BOSSIE</span>
          <span className="bossie-lockup-tail">ON THAT BEAT</span>
        </span>
      </span>
    ) : brandAssets.mark.available ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={brandAssets.mark.src}
        alt={brandAssets.mark.alt}
        width={cfg.width}
        height={cfg.height}
        className={`${cfg.className} ${className ?? ""}`.trim()}
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
    <Link
      href={href}
      className={`bossie-logo-link bossie-logo-link-${variant}`}
      aria-label={`${siteSettings.artistName} — home`}
    >
      {inner}
    </Link>
  );
}
