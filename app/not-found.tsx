import Link from "next/link";
import { BossieMark } from "@/components/brand/BossieMark";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";

export default function NotFound() {
  return (
    <main>
      <SiteNav />
      <section className="page-hero error-hero">
        <BossieMark size="xl" className="error-mark" decorative={false} />
        <div className="page-shell">
          <p className="eyebrow">404 / Lost transmission</p>
          <h1>
            THIS WORLD
            <br />
            DOESN&apos;T EXIST.
          </h1>
          <p>The page may have moved, changed or not been released yet.</p>
          <div className="error-actions">
            <Link className="request-submit inline-button" href="/">
              Return home ↗
            </Link>
            <Link className="gold-link" href="/music">
              Explore music ↗
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
