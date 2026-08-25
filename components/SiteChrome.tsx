"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { platformDisplayNames, siteSettings } from "@/lib/site-settings";
import { isVerifiedListenUrl } from "@/lib/links/url";

const primaryNav = [
  ["Music", "/music"],
  ["Worlds", "/worlds"],
  ["Cinema", "/cinema"],
  ["Create Your Song", "/request"],
] as const;

const secondaryNav = [
  ["About", "/about"],
  ["EPK", "/epk"],
  ["Industry", "/industry"],
  ["Links", "/links"],
] as const;

function listenHref() {
  const preferred = ["spotify", "appleMusic", "youtube", "youtubeMusic"] as const;
  for (const key of preferred) {
    const href = siteSettings.streaming[key] || siteSettings.social[key];
    if (href && isVerifiedListenUrl(href)) return href;
  }
  const entries = [...Object.values(siteSettings.streaming), ...Object.values(siteSettings.social)].filter(
    isVerifiedListenUrl,
  );
  return entries[0] ?? "/go/latest";
}

function listenLabel() {
  const preferred = ["spotify", "appleMusic", "youtube", "youtubeMusic"] as const;
  for (const key of preferred) {
    const href = siteSettings.streaming[key] || siteSettings.social[key];
    if (href && isVerifiedListenUrl(href)) return platformDisplayNames[key] ?? "Listen";
  }
  return "Listen";
}

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const href = listenHref();
  const external = href.startsWith("http");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (hrefPath: string) =>
    pathname === hrefPath || (hrefPath !== "/" && pathname.startsWith(`${hrefPath}/`));

  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <div className="nav-inner">
        <Link className="site-brand" href="/">
          BOSSIE <span>ON THE BEAT</span>
        </Link>

        <div className="site-links desktop-nav" aria-hidden={open}>
          {primaryNav.map(([label, itemHref]) => (
            <Link key={itemHref} href={itemHref} className={isActive(itemHref) ? "active" : undefined}>
              {label === "Create Your Song" ? "Create" : label}
            </Link>
          ))}
          {secondaryNav.map(([label, itemHref]) => (
            <Link key={itemHref} href={itemHref} className={isActive(itemHref) ? "active" : undefined}>
              {label}
            </Link>
          ))}
        </div>

        <a
          className="site-listen desktop-only"
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
        >
          {listenLabel()} ↗
        </a>

        <button
          type="button"
          className="nav-menu-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="mobile-nav-overlay" role="presentation" onClick={() => setOpen(false)}>
          <div
            id={panelId}
            className="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            onClick={(e) => e.stopPropagation()}
          >
            <button ref={closeBtnRef} type="button" className="mobile-nav-close" onClick={() => setOpen(false)}>
              Close
            </button>
            <ul className="mobile-nav-list">
              {[...primaryNav, ...secondaryNav].map(([label, itemHref]) => (
                <li key={itemHref}>
                  <Link href={itemHref} className={isActive(itemHref) ? "active" : undefined} onClick={() => setOpen(false)}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              className="button button-gold mobile-nav-listen"
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              onClick={() => setOpen(false)}
            >
              {listenLabel()} ↗
            </a>
          </div>
        </div>
      )}
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
