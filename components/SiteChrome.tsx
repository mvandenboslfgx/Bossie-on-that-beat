"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { BossieLogo } from "@/components/brand/BossieLogo";
import { FooterSocialGrid, HeaderSocialStrip, MobileSocialLinks } from "@/components/brand/SocialLinks";
import { getListenSocials } from "@/lib/brand/socials";
import { siteSettings } from "@/lib/site-settings";

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
  const first = getListenSocials()[0];
  return first?.href ?? "/go/latest";
}

function listenLabel() {
  const first = getListenSocials()[0];
  return first?.label ?? "Listen";
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
        <BossieLogo variant="mark" href="/" />

        <HeaderSocialStrip />

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
            <BossieLogo variant="primary" href="/" className="mobile-nav-logo" />
            <ul className="mobile-nav-list">
              {[...primaryNav, ...secondaryNav].map(([label, itemHref]) => (
                <li key={itemHref}>
                  <Link href={itemHref} className={isActive(itemHref) ? "active" : undefined} onClick={() => setOpen(false)}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <MobileSocialLinks />
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
      <div className="footer-brand-block">
        <BossieLogo variant="wordmark" href="/" />
        <p className="footer-tagline">{siteSettings.slogan}</p>
      </div>
      <FooterSocialGrid />
      <div className="footer-copy">
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

export function PageShell({
  children,
  worldSlug,
}: {
  children: React.ReactNode;
  worldSlug?: string;
}) {
  const skin = worldSlug ? `page-world-skin world-skin-${worldSlug}` : "";
  const tone = worldSlug === "the-mountain" ? " world-tone-light" : "";
  return (
    <>
      <SiteNav />
      <main className={`subpage ${skin}${tone}`} data-world={worldSlug || undefined}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
