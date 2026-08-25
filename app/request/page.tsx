import type { Metadata } from "next";
import RequestWizard from "@/components/RequestWizard";
import { BossieLogo } from "@/components/brand/BossieLogo";
import { PageShell } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Build Your World",
  description: "Request a custom Bossie production — build your world with cinematic music production.",
  alternates: { canonical: "/request" },
};

export default function RequestPage() {
  return (
    <PageShell>
      <header className="page-hero section-pad request-hero">
        <BossieLogo variant="primary" href="/" className="request-hero-logo" />
        <div className="page-hero-inner">
          <p className="eyebrow">COMMISSION</p>
          <h1>BUILD YOUR WORLD</h1>
          <p>Tell Bossie your story — every track is a new world.</p>
        </div>
      </header>
      <section className="request-section section-pad">
        <RequestWizard />
      </section>
    </PageShell>
  );
}
