import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/SiteChrome";
import { getOfficialProfileEntries, siteSettings } from "@/lib/site-settings";
import { serializeJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "About Bossie | Independent Music Producer & Composer",
  description:
    "Learn who Bossie on that beat is, what music we make and how to request a personal song, original production or music licensing collaboration.",
  alternates: { canonical: "/about" },
};

const roles = [
  {
    number: "01",
    heading: "Original artist releases",
    text: "Bossie makes independent music across cinematic, electronic, pop, rap, metal, orchestral and international influences. Each release is available through verified listening links.",
  },
  {
    number: "02",
    heading: "Music on request",
    text: "A personal song for an important moment or an original production for an artist or brand. Every project begins with a brief and a clear written proposal.",
  },
  {
    number: "03",
    heading: "Creative rights and licensing",
    text: "For existing recordings, we assess what rights can be licensed for your proposed use. No commercial usage is permitted until the applicable terms have been agreed.",
  },
] as const;

export default function AboutPage() {
  const official = getOfficialProfileEntries("all");

  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteSettings.siteUrl}/about#page`,
    url: `${siteSettings.siteUrl}/about`,
    name: "About Bossie on that beat",
    description: "Independent music producer, composer and artist project creating original releases and music to order.",
    mainEntity: { "@id": `${siteSettings.siteUrl}/#artist` },
  };

  return (
    <PageShell>
      <div className="studio-about-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
        <header className="studio-about-header section-pad">
          <p className="studio-kicker">ABOUT THE ARTIST &amp; STUDIO</p>
          <h1>Behind the sound.<br /><em>Meet Bossie.</em></h1>
          <p>
            Bossie on that beat is an independent music producer, composer and artist project.
            We create original music, produce tracks from individual briefs and explore different
            styles without being tied to one genre.
          </p>
          <div className="studio-hero-actions">
            <Link className="studio-btn studio-btn-primary" href="/request">Request a song ↗</Link>
            <Link className="studio-btn studio-btn-outline" href="/music">Listen to releases ↗</Link>
          </div>
        </header>

        <section className="studio-about-details section-pad" aria-labelledby="studio-about-details-title">
          <div className="studio-section-top">
            <div>
              <p className="studio-kicker">WHAT WE DO</p>
              <h2 id="studio-about-details-title">Music for listeners and creators.</h2>
            </div>
            <p>Three straightforward ways to discover the Bossie sound or start a project.</p>
          </div>
          <div className="studio-about-roles">
            {roles.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.heading}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="studio-about-story section-pad" aria-labelledby="studio-about-story-title">
          <div className="studio-about-letter-panel" aria-hidden="true">B</div>
          <div>
            <p className="studio-kicker">OUR APPROACH</p>
            <h2 id="studio-about-story-title">Different genres. One identity.</h2>
            <p>
              Some ideas call for emotional vocals. Others need cinematic scale, hard-edged
              guitars, electronic energy or a song that feels personal. Bossie works across
              genres to shape the sound around the idea, not the other way around.
            </p>
            <p>
              The official releases demonstrate the creative range. For commissions, every
              project is scoped individually, including any required revisions, delivery
              expectations and usage rights.
            </p>
            <Link className="studio-inline-link" href="/music">Discover the catalogue ↗</Link>
          </div>
        </section>

        <section className="studio-about-contact section-pad" aria-labelledby="studio-about-contact-title">
          <div>
            <p className="studio-kicker">WORK WITH BOSSIE</p>
            <h2 id="studio-about-contact-title">Let's create something together.</h2>
            <p>
              Send a personal or professional music brief via the official request form. For
              business and licensing enquiries, include intended use, timeframe and project details.
            </p>
            <div className="studio-hero-actions">
              <Link className="studio-btn studio-btn-primary" href="/request">Start a project ↗</Link>
              <Link className="studio-btn studio-btn-outline" href="/industry">Business services ↗</Link>
              <Link className="studio-inline-link" href="/epk">Official press kit ↗</Link>
            </div>
          </div>
          <aside className="studio-about-business">
            <span>OFFICIAL BUSINESS INFORMATION</span>
            <strong>Bossie on that beat</strong>
            <p>Independent music project operated by VDB Digital Software in the Netherlands.</p>
            <p>Chamber of Commerce (KvK): 99981440</p>
            <a href="mailto:algemeen@vdbdigital.nl?subject=Bossie%20business%20enquiry">algemeen@vdbdigital.nl ↗</a>
          </aside>
        </section>

        {official.length > 0 && (
          <section className="studio-about-profiles section-pad" aria-label="Verified official music and social profiles">
            <p className="studio-kicker">FOLLOW &amp; LISTEN</p>
            <div className="studio-platform-list">
              {official.map((entry) => (
                <a href={entry.href} key={entry.key} target="_blank" rel="noopener noreferrer">{entry.label} ↗</a>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
