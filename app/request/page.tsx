import type { Metadata } from "next";
import Link from "next/link";
import RequestWizard from "@/components/RequestWizard";
import { PageShell } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Create Your Song | Request Custom Music & Licensing",
  description:
    "Create a personal song, request custom music or enquire about licensing an existing Bossie recording. Tell us your idea using the guided project form.",
  alternates: { canonical: "/request" },
};

export default function RequestPage() {
  return (
    <PageShell>
      <header className="studio-request-header section-pad">
        <div className="studio-request-heading">
          <p className="studio-kicker">CREATE YOUR SONG / REQUEST MUSIC</p>
          <h1>Let&apos;s turn your idea<br />into <em>music.</em></h1>
          <p>
            From a personalised song to music for your company, film or artist project:
            tell Bossie what you need. We review every brief individually before discussing a proposal.
          </p>
          <div className="studio-request-jump">
            <Link href="/music">Hear our music ↗</Link>
            <Link href="/industry">How licensing works ↗</Link>
          </div>
        </div>
        <div className="studio-request-side">
          <p>WHAT HAPPENS NEXT?</p>
          <ol>
            <li><span>01</span> Choose your type of music</li>
            <li><span>02</span> Describe your sound and story</li>
            <li><span>03</span> Send your brief for review</li>
          </ol>
          <small>No purchase is made by submitting this form. Pricing, rights and delivery are confirmed separately.</small>
        </div>
      </header>
      <section className="request-section section-pad studio-request-body" id="project-form" aria-labelledby="request-form-heading">
        <div className="studio-request-intro">
          <div>
            <p className="studio-kicker">YOUR MUSIC, YOUR BRIEF</p>
            <h2 id="request-form-heading">Start your request.</h2>
          </div>
          <p>Not sure what to choose? Pick the closest option and explain your idea. You can ask about personal music, commercial productions or an existing track.</p>
        </div>
        <RequestWizard />
      </section>
      <section className="studio-request-faq section-pad" aria-labelledby="request-faq-heading">
        <div className="studio-request-faq-inner">
          <div className="studio-request-faq-heading">
            <p className="studio-kicker">THE PRACTICAL DETAILS</p>
            <h2 id="request-faq-heading">Good to know<br />before we begin.</h2>
            <p>A request is free and does not constitute a purchase. All commercial terms are confirmed in writing before work begins.</p>
            <Link className="studio-inline-link" href="/industry#licensing">Read about licensing ↗</Link>
          </div>
          <div className="studio-request-faq-questions">
            <details>
              <summary>How much does a custom song cost?</summary>
              <p>Pricing depends on the arrangement, production requirements and usage. Share your budget and brief; you will receive a proposal before committing.</p>
            </details>
            <details>
              <summary>How long does production take?</summary>
              <p>Timing depends on the concept, revisions and agreed deliverables. Include your preferred deadline so feasibility can be reviewed.</p>
            </details>
            <details>
              <summary>Can I use the music commercially?</summary>
              <p>Commercial, advertising and distribution rights are agreed separately. Share intended platforms, territory and duration so the right licence can be considered.</p>
            </details>
            <details>
              <summary>What about revisions and ownership?</summary>
              <p>Feedback rounds, files delivered, credits and any ownership or licence terms are recorded in your written proposal before a project begins.</p>
            </details>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
