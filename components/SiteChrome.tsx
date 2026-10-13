import Link from "next/link";
import type { ReactNode } from "react";
import { BossieLogo } from "@/components/brand/BossieLogo";
import { FooterSocialGrid } from "@/components/brand/SocialLinks";
import { SiteNav } from "@/components/SiteNavClient";
import { siteSettings } from "@/lib/site-settings";
import { distributionPlatformCount } from "@/lib/music/distribution-platforms";

export { SiteNav };

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand-block">
        <BossieLogo variant="wordmark" href="/" />
        <p className="footer-tagline">{siteSettings.slogan}</p>
      </div>

      <FooterSocialGrid />

      <div className="footer-proof-column">
        <Link className="footer-platform-proof" href="/music#platforms" aria-label={`See all ${distributionPlatformCount} distribution platforms`}>
          <strong>{distributionPlatformCount}</strong>
          <span>
            <small>GLOBAL DISTRIBUTION</small>
            <b>Platforms worldwide</b>
          </span>
          <i aria-hidden="true">↘</i>
        </Link>

        <a
          className="vdb-credit"
          href="https://vdbdigital.nl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Website designed and developed by VDB Digital Software"
        >
          <span className="vdb-credit-mark" aria-hidden="true">VDB</span>
          <span className="vdb-credit-copy">
            <small>DESIGNED &amp; DEVELOPED BY</small>
            <strong>VDB DIGITAL</strong>
            <span>WEB · SOFTWARE · AI</span>
          </span>
          <span className="vdb-credit-arrow" aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="footer-copy">
        <small>
          © 2026 BOSSIE ON THAT BEAT · <Link href="/privacy">PRIVACY</Link>
        </small>
      </div>
    </footer>
  );
}

export function PageShell({
  children,
  worldSlug,
  tone,
}: {
  children: ReactNode;
  worldSlug?: string;
  /** Light alpine tone — only for World detail, never release pages. */
  tone?: "light" | "dark";
}) {
  const skin = worldSlug ? `page-world-skin world-skin-${worldSlug}` : "";
  const light = tone === "light" ? " world-tone-light" : "";
  return (
    <>
      <SiteNav />
      <main id="main-content" className={`subpage ${skin}${light}`} data-world={worldSlug || undefined}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
