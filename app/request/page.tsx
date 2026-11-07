import type { Metadata } from "next";
import RequestWizard from "@/components/RequestWizard";
import { BossieLogo } from "@/components/brand/BossieLogo";
import { PageShell } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Request Music Production or Licensing",
  description: "Submit a professional brief for original music production, existing-track licensing or artist collaboration. Each enquiry is assessed before any commitment.",
  alternates: { canonical: "/request" },
};

export default function RequestPage() {
  return (
    <PageShell>
      <header className="page-hero section-pad request-hero">
        <BossieLogo variant="primary" href="/" className="request-hero-logo" />
        <div className="page-hero-inner">
          <p className="eyebrow">PROJECT ENQUIRY / MUSIC LICENSING</p>
          <h1>LET\u0027S TALK MUSIC</h1>
          <p>Tell us what you need: an original song, music for a film or brand, an artist collaboration or a licence for an existing Bossie recording.</p>
        </div>
      </header>
      <section className="request-section section-pad">
        <div className="business-request-note">
          <h2>A clear brief is the starting point.</h2>
          <p>Choose <strong>Existing Track Licensing</strong> to ask about rights to an existing release, or select a custom project type for new music. Submitting a brief is not a purchase or a licence. Scope, rights, pricing and timing are agreed separately before work begins.</p>
        </div>
        <RequestWizard />
      </section>
    </PageShell>
  );
}
