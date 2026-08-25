import Link from "next/link";
import { siteSettings } from "@/lib/site-settings";
import { PageShell } from "@/components/SiteChrome";

export default function LinksPage() {
  return (
    <PageShell>
      <section className="page-hero">
        <p className="eyebrow">BOSSIE LINK</p>
        <h1>LINKS</h1>
        <p>Your gateway into the Bossie universe.</p>
      </section>

      <section className="section-pad links-section">
        <h2>Listen</h2>
        <div className="links-grid">
          {Object.entries(siteSettings.streaming).map(([key, href]) => (
            <a key={key} href={href} target="_blank" rel="noreferrer">
              {key.replace(/([A-Z])/g, " $1").trim()} ↗
            </a>
          ))}
        </div>
      </section>

      <section className="section-pad links-section">
        <h2>Follow</h2>
        <div className="links-grid">
          {Object.entries(siteSettings.social).map(([key, href]) => (
            <a key={key} href={href} target="_blank" rel="noreferrer">
              {key.charAt(0).toUpperCase() + key.slice(1)} ↗
            </a>
          ))}
        </div>
      </section>

      <section className="section-pad links-section">
        <h2>Explore</h2>
        <div className="links-grid">
          <Link href="/music">Music ↗</Link>
          <Link href="/cinema">Cinema ↗</Link>
          <Link href="/worlds">Worlds ↗</Link>
          <Link href="/request">Create Your Song ↗</Link>
          <Link href="/go/latest">Latest Release ↗</Link>
        </div>
      </section>
    </PageShell>
  );
}
