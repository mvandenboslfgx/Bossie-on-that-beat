"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { BossieLogo } from "@/components/brand/BossieLogo";
import { MobileSocialLinks } from "@/components/brand/SocialLinks";
import { getListenSocials } from "@/lib/brand/socials";
import { siteSettings } from "@/lib/site-settings";

const primaryNav = [
  ["Music", "/music"],
  ["Worlds", "/worlds"],
  ["Cinema", "/cinema"],
  ["EPK", "/epk"],
] as const;

const secondaryNav = [
  ["About", "/about"],
  ["Industry", "/industry"],
  ["Links", "/links"],
  ["Create Your Song", "/request"],
] as const;

const menuNav = [...primaryNav, ...secondaryNav] as const;

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
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const href = listenHref();
  const external = href.startsWith("http");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        requestAnimationFrame(() => menuBtnRef.current?.focus());
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (hrefPath: string) =>
    pathname === hrefPath || (hrefPath !== "/" && pathname.startsWith(`${hrefPath}/`));

  const closeAndRestoreFocus = () => {
    setOpen(false);
    requestAnimationFrame(() => menuBtnRef.current?.focus());
  };

  return (
    <>
      <nav className="site-nav" aria-label="Primary navigation">
        <div className="nav-inner">
          <BossieLogo variant="mark" href="/" />
          <BossieLogo variant="wordmark" href="/" className="nav-wordmark" />

          <div className="site-links desktop-nav" aria-hidden={open}>
            {primaryNav.map(([label, itemHref]) => {
              const active = isActive(itemHref);
              return (
                <Link
                  key={itemHref}
                  href={itemHref}
                  className={active ? "active" : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="nav-actions">
            <a
              className="site-listen desktop-only"
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
            >
              {listenLabel()} <span aria-hidden="true">↗</span>
            </a>

            <button
              ref={menuBtnRef}
              type="button"
              className="nav-menu-toggle"
              aria-expanded={open}
              aria-controls={panelId}
              aria-haspopup="dialog"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              <span className="nav-menu-toggle-text">{open ? "Close" : "Menu"}</span>
              <span className="nav-menu-bars" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="mobile-nav-overlay" role="presentation" onClick={closeAndRestoreFocus}>
          <div
            id={panelId}
            ref={panelRef}
            className="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-nav-head">
              <BossieLogo variant="primary" href="/" className="mobile-nav-logo" />
              <button ref={closeBtnRef} type="button" className="mobile-nav-close" onClick={closeAndRestoreFocus}>
                Close
              </button>
            </div>
            <p className="menu-kicker">Explore the universe</p>
            <ul className="mobile-nav-list">
              {menuNav.map(([label, itemHref], index) => {
                const active = isActive(itemHref);
                return (
                  <li key={itemHref}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <Link
                      href={itemHref}
                      className={active ? "active" : undefined}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mobile-nav-foot">
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
              <p>{siteSettings.slogan}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
