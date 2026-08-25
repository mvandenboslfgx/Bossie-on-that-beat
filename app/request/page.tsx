import type { Metadata } from "next";
import RequestWizard from "@/components/RequestWizard";
import { PageShell } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Create Your Song",
  description: "Request a custom production, song, beat, remix, cinematic score or collaboration from Bossie on the beat.",
  alternates: { canonical: "/request" },
};

export default function RequestPage() {
  return (
    <PageShell>
      <header className="page-hero section-pad request-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">CREATE YOUR OWN SONG</p>
          <h1>
            CREATE YOUR
            <br />
            <span>SONG.</span>
          </h1>
          <p>Premium custom music production. Tell Bossie your story — every track is a new world.</p>
        </div>
      </header>
      <section className="request-section section-pad">
        <RequestWizard />
      </section>
    </PageShell>
  );
}
