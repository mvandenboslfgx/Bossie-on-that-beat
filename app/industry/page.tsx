import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/SiteChrome";
import { getCatalog } from "@/lib/repository/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Music Production, Sync Licensing & Collaborations",
  description:
    "Commission original music, enquire about sync licensing for existing Bossie tracks or discuss a creative partnership. Clear briefs, rights review and written proposals.",
  alternates: { canonical: "/industry" },
};

const services = [
  {
    id: "licensing",
    number: "01 / MUSIC RIGHTS",
    title: "Sync & music licensing",
    text: "Explore the use of an existing Bossie recording in a film, trailer, game, podcast, advertisement or digital campaign. Every request is reviewed against the actual rights and intended usage.",
    points: ["Existing catalogue", "Film, games and advertising", "Usage and territory review"],
  },
  {
    id: "production",
    number: "02 / COMMISSIONS",
    title: "Original music production",
    text: "Bespoke tracks developed around your creative brief — from cinematic sound and campaign music to original songs and artist projects. Scope and revisions are agreed before production.",
    points: ["Custom composition", "Brand and campaign music", "Artist-led projects"],
  },
  {
    id: "collaborations",
    number: "03 / PARTNERSHIPS",
    title: "Creative collaborations",
    text: "Selected projects with artists, vocalists, filmmakers, labels and creative teams. A collaboration starts with a defined concept, responsibilities and an agreement on credits and rights.",
    points: ["Artists and vocalists", "Film and creative teams", "Project-specific agreements"],
  },
] as const;

const questions = [
  {
    question: "Can I use a Bossie track in a commercial project?",
    answer:
      "Possibly. Please submit the track title and describe the format, channels, territory, duration and any paid advertising. Use is not authorised until the applicable rights are checked and agreed in writing.",
  },
  {
    question: "Does a music request guarantee that I own the recording?",
    answer:
      "No. Ownership, master rights, publishing rights, permitted uses, exclusivity and any revenue participation depend on the specific written agreement. Submitting a request does not grant a licence.",
  },
  {
    question: "Can I request a custom track for my brand or video?",
    answer:
      "Yes. Share your references, desired sound, intended use, budget indication and deadline. We assess the brief before confirming whether a production is feasible.",
  },
  {
    question: "Are rates and delivery times fixed?",
    answer:
      "No universal price or turnaround applies to every brief. Project scope, revisions, rights, deliverables, fees and scheduling are confirmed in the written proposal.",
  },
] as const;

export default async function IndustryPage() {
  const { live } = await getCatalog();
  const showcase = live.slice(0, 4);

  return (
    <PageShell>
      <header className="page-hero business-hero section-pad">
        <div className="business-hero-inner">
          <p className="eyebrow">BOSSIE / PROFESSIONAL MUSIC STUDIO</p>
          <h1>Original music. Clear rights. Creative partnerships.</h1>
          <p>
            Music production, existing-track licensing and selected collaborations for filmmakers, agencies,
            creators, artists and brands. The creative ambition is big; the way we work is clear and professional.
          </p>
          <div className="business-hero-actions">
            <Link className="button button-gold" href="/request">Submit a project brief ↗</Link>
            <Link className="text-link" href="/epk">Explore the official press kit ↗</Link>
          </div>
        </div>
      </header>

      <section className="business-detail-section section-pad" aria-labelledby="business-service-title">
        <div className="business-section-heading">
          <div>
            <p className="eyebrow">WHAT WE OFFER</p>
            <h2 id="business-service-title">Music with a purpose.</h2>
          </div>
          <Link className="text-link" href="/music">Hear the catalogue ↗</Link>
        </div>
        <div className="business-detail-grid">
          {services.map((service) => (
            <article key={service.id} id={service.id} className="business-detail-card">
              <span className="business-card-index">{service.number}</span>
              <h2>{service.title}</h2>
              <p>{service.text}</p>
              <ul>{service.points.map((point) => <li key={point}>{point}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="business-explainer section-pad" aria-labelledby="brief-title">
        <div className="business-two-col">
          <div>
            <p className="eyebrow">A GOOD BRIEF MAKES THE DIFFERENCE</p>
            <h2 id="brief-title">Tell us what the music needs to do.</h2>
            <p>
              Whether you need an existing recording or an original composition, we need enough context
              to assess your project properly. You can submit a request without committing to a purchase.
            </p>
            <Link className="text-link" href="/request">Start a music enquiry ↗</Link>
          </div>
          <div>
            <p className="eyebrow">WHAT TO INCLUDE</p>
            <ul className="business-brief-list">
              <li><strong>Project:</strong> film, series, commercial, social campaign, game or artist release</li>
              <li><strong>Music:</strong> existing track and link, or a reference for new production</li>
              <li><strong>Usage:</strong> platforms, paid advertising, territory and intended licence duration</li>
              <li><strong>Practical details:</strong> deadline, deliverables and approximate budget</li>
              <li><strong>People:</strong> company or artist, primary contact and any relevant stakeholders</li>
            </ul>
          </div>
        </div>
      </section>

      {showcase.length > 0 && (
        <section className="section-pad industry-showcase" aria-labelledby="industry-work-title">
          <div className="business-section-heading">
            <div>
              <p className="eyebrow">SELECTED ORIGINAL RELEASES</p>
              <h2 id="industry-work-title">Hear the work.</h2>
            </div>
            <Link className="text-link" href="/music">Full music archive ↗</Link>
          </div>
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
                  <p className="eyebrow">OFFICIAL RELEASE</p>
                  <h3>{release.title}</h3>
                  <p>{release.tagline ?? release.genres.join(" · ")}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="business-services-intro">
            These are examples from the official catalogue, not claimed third-party commissions or
            client endorsements. Licensing eligibility is assessed separately for each request.
          </p>
        </section>
      )}

      <section className="business-process section-pad" aria-labelledby="process-title">
        <p className="eyebrow">HOW WE WORK</p>
        <h2 id="process-title">A clear route from idea to agreement.</h2>
        <div className="business-process-grid">
          <article><span>01 / BRIEF</span><h3>Share the project.</h3><p>Send your concept, desired sound or recording, usage, timing and budget range.</p></article>
          <article><span>02 / REVIEW</span><h3>Define the scope.</h3><p>We review feasibility and rights, then discuss deliverables, pricing, revisions and timing.</p></article>
          <article><span>03 / AGREEMENT</span><h3>Proceed with clarity.</h3><p>Production or licensing begins only after the relevant terms have been agreed in writing.</p></article>
        </div>
      </section>

      <section className="business-faq section-pad" aria-labelledby="business-faq-title">
        <p className="eyebrow">PRACTICAL ANSWERS</p>
        <h2 id="business-faq-title">Before you enquire.</h2>
        {questions.map(({ question, answer }) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>

      <section className="business-contact-band section-pad">
        <p className="eyebrow">WORK WITH BOSSIE</p>
        <h2>Have a project in mind?</h2>
        <p>Send the essentials through the official request form. For media information, use the EPK. No booking or licence is confirmed merely by making an enquiry.</p>
        <div className="business-contact-actions">
          <Link className="button button-gold" href="/request">Request a proposal ↗</Link>
          <Link className="text-link" href="/epk">View press material ↗</Link>
          <a className="text-link" href="mailto:algemeen@vdbdigital.nl?subject=Bossie%20business%20enquiry">Email business contact ↗</a>
        </div>
      </section>
    </PageShell>
  );
}
