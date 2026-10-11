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
const menuId = "bossie-site-menu";

export function SiteNav() {
  const listen = getListenSocials()[0];
  const href = listen?.href ?? "/go/latest";
  const label = listen?.label ?? "Listen";
  const external = href.startsWith("http");

  return (
    <>
      <nav className="site-nav" aria-label="Primary navigation">
        <div className="nav-inner">
          <BossieLogo variant="mark" href="/" />
          <BossieLogo variant="wordmark" href="/" className="nav-wordmark" />

          <div className="site-links desktop-nav">
            {primaryNav.map(([itemLabel, itemHref]) => (
              <a key={itemHref} href={itemHref}>
                {itemLabel}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <a
              className="site-listen desktop-only"
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
            >
              {label} <span aria-hidden="true">↗</span>
            </a>

            <button
              type="button"
              className="nav-menu-toggle"
              aria-haspopup="dialog"
              aria-controls={menuId}
              popoverTarget={menuId}
              popoverTargetAction="toggle"
            >
              <span className="nav-menu-toggle-text">Menu</span>
              <span className="nav-menu-bars" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div id={menuId} popover="auto" className="mobile-nav-overlay" aria-label="Site menu">
        <div className="mobile-nav-panel" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="mobile-nav-head">
            <BossieLogo variant="primary" href="/" className="mobile-nav-logo" />
            <button
              type="button"
              className="mobile-nav-close"
              popoverTarget={menuId}
              popoverTargetAction="hide"
            >
              Close
            </button>
          </div>
          <p className="menu-kicker">Explore the universe</p>
          <ul className="mobile-nav-list">
            {menuNav.map(([itemLabel, itemHref], index) => (
              <li key={itemHref}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <a href={itemHref}>{itemLabel}</a>
              </li>
            ))}
          </ul>
          <div className="mobile-nav-foot">
            <MobileSocialLinks />
            <a
              className="button button-gold mobile-nav-listen"
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
            >
              {label} ↗
            </a>
            <p>{siteSettings.slogan}</p>
          </div>
        </div>
      </div>
    </>
  );
}
