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
    </PageShell>
  );
}
