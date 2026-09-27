import type { Metadata } from "next";
import Link from "next/link";
import { BossieMark } from "@/components/brand/BossieMark";
import { PageShell } from "@/components/SiteChrome";
import { getSameAsUrls } from "@/lib/brand/socials";
import { serializeJsonLd } from "@/lib/seo/json-ld";
import { siteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Who is Bossie on that beat?",
  description:
    "Meet Bossie on that beat: an independent producer, composer and artist creating cinematic, electronic, metal, rap, orchestral and global music.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${siteSettings.siteUrl}/about#page`,
        url: `${siteSettings.siteUrl}/about`,
        name: `Who is ${siteSettings.artistName}?`,
        mainEntity: { "@id": `${siteSettings.siteUrl}/#artist` },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteSettings.siteUrl}/about#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: `Who is ${siteSettings.artistName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${siteSettings.artistName} is an independent producer, composer and artist creating genre-fluid music as complete worlds of sound, image and story.`,
            },
          },
          {
            "@type": "Question",
            name: `What kind of music does ${siteSettings.artistName} make?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: "The catalogue spans cinematic, orchestral, metal, electronic, rap and global music. Each release has its own sound while remaining part of one creative identity.",
            },
          },
          {
            "@type": "Question",
            name: `Where can I hear ${siteSettings.artistName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `The complete official catalogue and verified listening links are available at ${siteSettings.siteUrl}/music.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
      <section className="manifesto-hero about-identity-hero">
        <BossieMark size="xl" />
        <p className="eyebrow">OFFICIAL ARTIST PROFILE</p>
        <h1>WHO IS<br />BOSSIE ON THAT BEAT?</h1>
        <p className="about-identity-lede">
          An independent producer, composer and artist building genre-fluid music as complete worlds of sound, image and
          story.
        </p>
      </section>

      <section className="section-pad about-definition">
        <p className="eyebrow">THE SHORT ANSWER</p>
        <h2>One identity. No fixed genre.</h2>
        <p>
          Bossie on that beat moves between cinematic scale, orchestral detail, metal weight, electronic energy, rap and
          global influences. The style changes with the idea; the creative signature stays focused on contrast, atmosphere
          and a strong visual world around every track.
        </p>
        <div className="about-profile-links">
          {getSameAsUrls().map((href) => (
            <a className="text-link" href={href} key={href} target="_blank" rel="noreferrer">Official profile ↗</a>
          ))}
        </div>
      </section>

      <section className="section-pad about-statements">
        <article>
          <BossieMark size="sm" />
          <h2>SOUND CHANGES. IDENTITY DOESN&apos;T.</h2>
          <p>Metal today. Cinematic tomorrow. Club at midnight. The lane shifts — the Bossie lens stays.</p>
        </article>
        <article>
          <BossieMark size="sm" />
          <h2>MUSIC NEEDS AN IMAGE.</h2>
          <p>Every release is sound, world and cinema together — not a track with a JPEG attached.</p>
        </article>
        <article>
          <BossieMark size="sm" />
          <h2>EVERY RELEASE STARTS FROM ZERO.</h2>
          <p>{siteSettings.slogan}. No copy-paste formulas. No sequel-by-default thinking.</p>
        </article>
      </section>

      <section className="section-pad about-faq" aria-labelledby="about-faq-title">
        <p className="eyebrow">QUICK FACTS</p>
        <h2 id="about-faq-title">The essentials.</h2>
        <dl>
          <div><dt>What is Bossie on that beat?</dt><dd>An independent producer, composer and artist project.</dd></div>
          <div><dt>What is the sound?</dt><dd>Cinematic, orchestral, metal, electronic, rap and global — built without one fixed genre lane.</dd></div>
          <div><dt>What makes it different?</dt><dd>Every release is developed as sound, image and story: a complete world rather than an isolated track.</dd></div>
          <div><dt>Where is the complete catalogue?</dt><dd><Link href="/music">The official Music archive contains every verified track and release.</Link></dd></div>
        </dl>
      </section>

      <section className="section-pad">
        <div className="cta-row">
          <Link className="button button-ghost" href="/worlds">
            Enter worlds ↗
          </Link>
          <Link className="button button-gold" href="/request">
            Build your world ↗
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
