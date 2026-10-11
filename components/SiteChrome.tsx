import type { ReactNode } from "react";
import { BossieLogo } from "@/components/brand/BossieLogo";
import { FooterSocialGrid } from "@/components/brand/SocialLinks";
import { SiteNav } from "@/components/SiteNavClient";
import { siteSettings } from "@/lib/site-settings";

export { SiteNav };

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand-block">
        <BossieLogo variant="wordmark" href="/" />
        <p className="footer-tagline">{siteSettings.slogan}</p>
      </div>
      <FooterSocialGrid />
      <div className="footer-copy">
        <small>
          © 2026 BOSSIE ON THAT BEAT · <a href="/privacy">PRIVACY</a>
        </small>
      </div>
      <a className="vdb-credit" href="https://vdbdigital.nl" target="_blank" rel="noreferrer">
        Site by VDB Digital
      </a>
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
