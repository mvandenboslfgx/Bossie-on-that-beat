import type { Metadata } from "next";
import { AdminReviewQueue } from "@/components/AdminReviewQueue";
import { PageShell } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <PageShell>
      <div className="page-intro">
        <p className="eyebrow">INTERNAL</p>
        <h1>Bossie administration</h1>
        <p>Review incoming project briefs, release quality and synced cinema items.</p>
      </div>
      <AdminReviewQueue />
    </PageShell>
  );
}
