import type { Metadata } from "next";
import Link from "next/link";
import { BossieMark } from "@/components/brand/BossieMark";
import { PageShell } from "@/components/SiteChrome";
import { getCatalog } from "@/lib/repository/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Industry",
  description:
    "Music licensing, custom production and collaborations with Bossie on the beat for film, advertising, games and brands.",
  alternates: { canonical: "/industry" },
};

export default async function IndustryPage() {
  const { live } = await getCatalog();
  const showcase = live.slice(0, 4);

  return (
    <PageShell>
      <section className="page-hero compact-hero industry-hero">
        <BossieMark size="lg" className="section-mark" />
        <p className="eyebrow">INDUSTRY / COLLABORATION</p>
        <h1>CAPABILITY SHOWCASE</h1>
        <p>Licensing, custom music and collaborations — proven through real Bossie worlds.</p>
        <Link className="button button-gold" href="/request">
          Build your world ↗
        </Link>
      </section>

      <section className="industry-capabilities section-pad">
        <article>
          <BossieMark size="sm" />
          <span>01</span>
          <h2>Music licensing</h2>
          <p>Original Bossie productions for film, advertising, games and digital campaigns.</p>
        </article>
        <article>
          <BossieMark size="sm" />
          <span>02</span>
          <h2>Custom music</h2>
          <p>Company songs, cinematic scores and release-world production scoped per brief.</p>
        </article>
        <article>
          <BossieMark size="sm" />
          <span>03</span>
          <h2>Collaborations</h2>
          <p>For artists, vocalists, producers, creators, labels and brands ready to build a complete world.</p>
        </article>
      </section>

      {showcase.length > 0 && (
        <section className="section-pad industry-showcase">
          <p className="eyebrow">PROOF OF WORK</p>
          <h2>Selected Bossie worlds</h2>
          <div className="industry-showcase-grid">
            {showcase.map((release) => (
              <Link key={release.slug} href={`/music/${release.slug}`} className="industry-showcase-card">
                {release.artworkUrl && (
                  <div
                    className="industry-showcase-art"
                    style={{ backgroundImage: `url(${release.artworkUrl})` }}
                    role="img"
                    aria-label={`${release.title} artwork`}
                  />
                )}
                <div>
                  <p className="eyebrow">{release.worldSlug?.replace(/-/g, " ").toUpperCase() ?? "WORLD"}</p>
                  <h3>{release.title}</h3>
                  <p>{release.tagline ?? release.genres.join(" · ")}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="section-pad industry-cta">
        <p className="eyebrow">NEXT STEP</p>
        <h2>Start with a clear brief.</h2>
        <p>Use the request form with business context. Response scope is confirmed per project.</p>
        <Link className="button button-gold" href="/request">
          Build your world ↗
        </Link>
      </section>
    </PageShell>
  );
}
