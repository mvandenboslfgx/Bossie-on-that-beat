import type { Metadata } from "next";
import RequestWizard from "@/components/RequestWizard";
import { BossieLogo } from "@/components/brand/BossieLogo";
import { PageShell } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Commission Original Music",
  description: "Request original songs, custom productions and commercial music licensing from Bossie on that beat.",
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
          <p>Commission a personal song, an original production or music for commercial use. Tell us what you have in mind.</p>
        </div>
      </header>
      <section className="request-section section-pad">
        <RequestWizard />
      </section>
    </PageShell>
  );
}
