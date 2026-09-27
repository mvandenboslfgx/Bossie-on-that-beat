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
      <section className="page-hero">
        <p className="eyebrow">COMING NEXT</p>
        <h1>UPCOMING</h1>
        <p>Announced and upcoming Bossie releases.</p>
      </section>
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
