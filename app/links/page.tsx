import type { Metadata } from "next";
import Link from "next/link";
import { BossieLogo } from "@/components/brand/BossieLogo";
import { FollowSocialBlock, ListenSocialBlock } from "@/components/brand/SocialLinks";
import { getCatalog } from "@/lib/repository/catalog";
import { ReleaseArtwork, ReleaseActions } from "@/components/release/ReleaseUI";
import { PageShell } from "@/components/SiteChrome";
import { siteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Links",
  description: "Official Bossie on the beat links — listen, watch, follow and explore the universe.",
  alternates: { canonical: "/links" },
};

export default async function LinksPage() {
  const { latest } = await getCatalog();

  return (
    <PageShell>
      <section className="links-hub section-pad">
        <BossieLogo variant="primary" href="/" className="links-hub-logo" priority />

        {latest && (
          <div className="links-current-signal">
            <p className="eyebrow">CURRENT SIGNAL</p>
            <h1>{latest.title}</h1>
            <ReleaseArtwork release={latest} large />
            <ReleaseActions release={latest} />
          </div>
        )}

        <ListenSocialBlock title="Listen" />

        <hr className="links-divider" />

        <FollowSocialBlock title="Follow Bossie" />

        <hr className="links-divider" />

        <section className="social-block">
          <p className="eyebrow">ENTER THE UNIVERSE</p>
          <ul className="social-links">
            <li>
              <Link href="/music">Music ↗</Link>
            </li>
            <li>
              <Link href="/worlds">Worlds ↗</Link>
            </li>
            <li>
              <Link href="/cinema">Cinema ↗</Link>
            </li>
            <li>
              <Link href="/request">Create Your Song ↗</Link>
            </li>
          </ul>
        </section>

        <p className="links-hub-artist">{siteSettings.artistName}</p>
      </section>
    </PageShell>
  );
}
