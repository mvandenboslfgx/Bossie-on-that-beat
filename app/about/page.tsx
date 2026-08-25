import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/SiteChrome";
import { siteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Bossie on the beat — independent producer, composer and artist building music as complete cinematic worlds.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PageShell>
      <section className="page-hero compact-hero">
        <p className="eyebrow">ABOUT THE PRODUCER</p>
        <h1>ABOUT</h1>
        <p>
          {siteSettings.artistName} is an independent producer, composer and artist project built around contrast,
          cinematic thinking and world-building rather than one fixed genre.
        </p>
      </section>

      <section className="about-page">
        <div>
          <p className="eyebrow">THE PHILOSOPHY</p>
          <h2>Every track is a new world.</h2>
        </div>
        <div>
          <p>
            From orchestral darkness and metal to electronic music, cinematic tribute records and global club energy, the
            sound is allowed to change whenever the idea demands it.
          </p>
          <p>
            The constant is the identity: scale, emotion, visual storytelling and a production mindset that treats every
            release as a complete creative system — music, world and cinema together.
          </p>
          <p>
            That is why the catalogue is organized as Worlds: The Abyss, The Mountain, The Club, The Streets and beyond —
            each with its own atmosphere, not as marketing labels but as creative homes.
          </p>
          <blockquote>“Never make the next track because it sounds like the last one.”</blockquote>
          <div className="cta-row">
            <Link className="button button-ghost" href="/music">
              Explore music ↗
            </Link>
            <Link className="button button-ghost" href="/worlds">
              Enter worlds ↗
            </Link>
            <Link className="button button-gold" href="/request">
              Create your song ↗
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
