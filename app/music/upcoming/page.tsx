import type { Metadata } from "next";
import { getCatalog } from "@/lib/repository/catalog";
import { ReleaseCard } from "@/components/release/ReleaseUI";
import { PageShell } from "@/components/SiteChrome";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Upcoming music",
  description: "Official announced and upcoming music from Bossie on that beat.",
  alternates: { canonical: "/music/upcoming" },
};

export default async function MusicUpcomingPage() {
  const { upcoming } = await getCatalog();

  return (
    <PageShell>
      <header className="page-hero brand-standard-hero">
        <p className="eyebrow">COMING NEXT</p>
        <h1>What's coming<br /><em>next.</em></h1>
        <p>Explore announced music from Bossie on that beat. New tracks appear here when a release is confirmed.</p>
      </header>
      <section className="section-pad">
        <div className="release-grid-v2">
          {upcoming.length ? (
            upcoming.map((r) => <ReleaseCard key={r.id} release={r} />)
          ) : (
            <p className="empty-state">No upcoming releases announced yet.</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
