import type { Metadata } from "next";
import Link from "next/link";
import { BossieLogo } from "@/components/brand/BossieLogo";
import { FollowSocialBlock, ListenSocialBlock } from "@/components/brand/SocialLinks";
import { getCatalog } from "@/lib/repository/catalog";
import { ReleaseArtwork, ReleaseActions } from "@/components/release/ReleaseUI";
import { PageShell } from "@/components/SiteChrome";
import { CatalogProof } from "@/components/v3/BossieV3";
import { getTransmissionNumber } from "@/lib/catalog/transmission";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Links",
  description: "Official Bossie on the beat hub — current signal, listen and enter the universe.",
  alternates: { canonical: "/links" },
};

export default async function LinksPage() {
  const catalog = await getCatalog();
  const { latest, live, refreshedAt } = catalog;
  const tx = latest ? getTransmissionNumber(live, latest.slug) : "000";

  return (
    <PageShell>
      <CatalogProof refreshedAt={refreshedAt} liveCount={live.length} latestSlug={latest?.slug} />
      <section className="links-hub links-hub-v3 section-pad">
        <BossieLogo variant="primary" href="/" className="links-hub-logo" priority />

        {latest && (
          <>
            <p className="links-signal-label">CURRENT SIGNAL // {tx}</p>
            <h1 className="links-signal-title">{latest.title}</h1>
            <ReleaseArtwork release={latest} large />
            <ReleaseActions release={latest} />
          </>
        )}

        <ListenSocialBlock title="Listen now" />

        <section className="social-block">
          <p className="eyebrow">ENTER THE UNIVERSE</p>
          <ul className="social-links">
            <li><Link href="/music">Music ↗</Link></li>
            <li><Link href="/worlds">Worlds ↗</Link></li>
            <li><Link href="/cinema">Cinema ↗</Link></li>
            <li><Link href="/request">Create Your Song ↗</Link></li>
          </ul>
        </section>

        <FollowSocialBlock title="Follow the signal" />
      </section>
    </PageShell>
  );
}
