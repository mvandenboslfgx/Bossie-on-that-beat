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
      <section className="studio-services section-pad" aria-labelledby="request-faq-heading">
        <div className="studio-section-top">
          <div>
            <p className="studio-kicker">BEFORE YOU REQUEST</p>
            <h2 id="request-faq-heading">Clear answers. No surprises.</h2>
          </div>
          <p>Your enquiry is free. We only begin a project after agreeing the scope, price and rights in writing.</p>
        </div>
        <div className="studio-service-grid">
          <article className="studio-service">
            <span className="studio-service-index">01</span>
            <h3>How much will it cost?</h3>
            <p>Every song or soundtrack is quoted for its actual requirements. Share your budget in the form; we will discuss a proposal before you commit.</p>
          </article>
          <article className="studio-service">
            <span className="studio-service-index">02</span>
            <h3>When will it be ready?</h3>
            <p>Delivery depends on the brief and production scope. Tell us your preferred deadline and we will confirm whether it is feasible.</p>
          </article>
          <article className="studio-service">
            <span className="studio-service-index">03</span>
            <h3>Can I use it commercially?</h3>
            <p>Personal, business and advertising rights differ. Intended channels, territory and duration are reviewed before licensing terms are agreed.</p>
            <Link href="/industry#licensing">Explore licensing ↗</Link>
          </article>
          <article className="studio-service">
            <span className="studio-service-index">04</span>
            <h3>Are revisions included?</h3>
            <p>Deliverables, feedback rounds and any revisions are agreed in your proposal. An enquiry alone does not create a paid order.</p>
          </article>
        </div>
      </section>
    </PageShell>
  );
}
