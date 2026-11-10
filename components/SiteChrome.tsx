import Link from "next/link";
import type { ReactNode } from "react";
import { BossieLogo } from "@/components/brand/BossieLogo";
import { FooterSocialGrid } from "@/components/brand/SocialLinks";
import { SiteNav } from "@/components/SiteNavClient";
import { siteSettings } from "@/lib/site-settings";
import { PrivacySettingsButton } from "@/components/analytics/MetricoolTracker";

export { SiteNav };

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand-block">
        <BossieLogo variant="primary" href="/" />
        <p className="footer-tagline">Original music · Custom songs · Licensing</p>
        <p className="footer-short-intro">Independent music production for people, artists and creative projects.</p>
      </div>

      <FooterSocialGrid />

      <div className="footer-proof-column">
        <div className="footer-action-card">
          <span>HAVE AN IDEA?</span>
          <strong>Let's create something worth hearing.</strong>
          <Link href="/request?type=personal">Request your music ↗</Link>
        </div>
        <a
          className="vdb-credit"
          href="https://vdbdigital.nl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Website designed and developed by VDB Digital Software"
        >
          <span className="vdb-credit-mark" aria-hidden="true">VDB</span>
          <span className="vdb-credit-copy">
            <small>WEBSITE BY</small>
            <strong>VDB DIGITAL SOFTWARE</strong>
          </span>
          <span className="vdb-credit-arrow" aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="footer-copy">
        <nav className="footer-business-links" aria-label="Business and legal information">
          <Link href="/industry">Music licensing &amp; services</Link>
          <Link href="/request">Project enquiries</Link>
          <Link href="/epk">Press &amp; EPK</Link>
          <Link href="/privacy">Privacy</Link>
          <PrivacySettingsButton />
          <a href="mailto:algemeen@vdbdigital.nl?subject=Bossie%20on%20that%20beat%20enquiry">Business contact</a>
        </nav>
        <p className="footer-legal-note">
          Bossie on that beat is an independent music project operated by VDB Digital Software, the Netherlands · KvK 99981440.
          Music use, licensing terms and delivery are agreed in writing per project.
        </p>
        <small>© {new Date().getFullYear()} BOSSIE ON THAT BEAT</small>
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
      <main id="main-content" className={`subpage brand-unified ${skin}${light}`} data-world={worldSlug || undefined}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
