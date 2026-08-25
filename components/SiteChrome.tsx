import Link from "next/link";
import { siteSettings } from "@/lib/site-settings";

const primaryNav = [
  ["Music", "/music"],
  ["Worlds", "/worlds"],
  ["Cinema", "/cinema"],
  ["Create", "/request"],
  ["About", "/about"],
] as const;

const secondaryNav = [
  ["EPK", "/epk"],
  ["Industry", "/industry"],
  ["Links", "/links"],
] as const;

export function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <div className="nav-inner">
        <Link className="site-brand" href="/">
          BOSSIE <span>ON THE BEAT</span>
        </Link>
        <div className="site-links">
          {primaryNav.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
        <div className="site-links secondary">
          {secondaryNav.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
        <a
          className="site-listen"
          href={siteSettings.streaming.spotify}
          target="_blank"
          rel="noreferrer"
        >
          Listen ↗
        </a>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>BOSSIE</strong>
        <span>ON THE BEAT</span>
      </div>
      <div className="footer-copy">
        {siteSettings.slogan}
        <br />
        <small>
          © 2026 BOSSIE ON THE BEAT · <Link href="/privacy">PRIVACY</Link>
        </small>
      </div>
      <a className="vdb-credit" href="https://vdbdigital.nl" target="_blank" rel="noreferrer">
        <small>BUILT BY</small>
        <strong>VDB DIGITAL ↗</strong>
      </a>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main className="subpage">{children}</main>
      <SiteFooter />
    </>
  );
}
