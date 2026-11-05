import type { Metadata } from "next";
import Link from "next/link";
import { BossieMark } from "@/components/brand/BossieMark";
import { PageShell } from "@/components/SiteChrome";
import { getCatalog } from "@/lib/repository/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Music Licensing, Production & Collaborations",
  description:
    "Music licensing, custom production and collaborations with Bossie on that beat for film, advertising, games and brands.",
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
        <h1>MUSIC FOR YOUR STORY</h1>
        <p>Original productions, existing-track licensing and creative collaborations for artists, filmmakers, games and brands.</p>
        <Link className="button button-gold" href="/request">
          Build your world ↗
        </Link>
      </section>

      <section className="industry-capabilities section-pad">
        <article>
          <BossieMark size="sm" />
          <span>01</span>
          <h2>Music licensing</h2>
          <p>Ask about using an existing Bossie release in film, advertising, games or digital campaigns. Usage rights are agreed per project.</p>
        </article>
        <article>
          <BossieMark size="sm" />
          <span>02</span>
          <h2>Custom music</h2>
          <p>New tracks, brand music, personal commissions and cinematic scores — developed from a brief with clear deliverables.</p>
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
        <p>Tell us about your use case, deadline and budget. We will review availability, scope, rights and next steps before any commitment.</p>
        <Link className="button button-gold" href="/request">
          Build your world ↗
        </Link>
      </section>
    </PageShell>
  );
}
