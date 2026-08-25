import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Industry",
  description:
    "Music licensing, custom production and collaborations with Bossie on the beat for film, advertising, games and brands.",
  alternates: { canonical: "/industry" },
};

export default function IndustryPage() {
  return (
    <PageShell>
      <section className="page-hero compact-hero">
        <p className="eyebrow">INDUSTRY / COLLABORATION</p>
        <h1>INDUSTRY</h1>
        <p>Licensing, custom music and collaborations for serious creative partners.</p>
        <Link className="button button-gold" href="/request">
          Work with Bossie ↗
        </Link>
      </section>

      <section className="industry-page">
        <article>
          <span>01</span>
          <h2>Music licensing</h2>
          <p>Original music for:</p>
          <ul>
            <li>Film</li>
            <li>Advertising</li>
            <li>Games</li>
            <li>Digital projects</li>
          </ul>
        </article>
        <article>
          <span>02</span>
          <h2>Custom music</h2>
          <p>Original songs, soundtracks and release-world production tailored to the brief.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Collaborations</h2>
          <p>For artists, vocalists, producers, creators, labels and brands ready to build a complete world together.</p>
        </article>
      </section>

      <section className="section-pad">
        <p className="eyebrow">NEXT STEP</p>
        <h2>Start with a clear brief.</h2>
        <p>Use the request form with business context. Response scope is confirmed per project.</p>
        <Link className="button button-gold" href="/request">
          Work with Bossie ↗
        </Link>
      </section>
    </PageShell>
  );
}
