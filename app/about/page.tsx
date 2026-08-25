import type { Metadata } from "next";
import Link from "next/link";
import { BossieMark } from "@/components/brand/BossieMark";
import { PageShell } from "@/components/SiteChrome";
import { siteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "About",
  description: "Bossie on the beat — I don't build a genre. I build worlds.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PageShell>
      <section className="manifesto-hero">
        <BossieMark size="xl" />
        <p className="eyebrow">MANIFESTO</p>
        <h1>
          I DON&apos;T BUILD A GENRE.
          <br />I BUILD WORLDS.
        </h1>
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
