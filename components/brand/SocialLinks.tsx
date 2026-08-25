import Link from "next/link";
import {
  getFollowSocials,
  getHeaderSocials,
  getListenSocials,
  type SocialEntry,
} from "@/lib/brand/socials";

function SocialList({
  items,
  className,
  compact,
}: {
  items: SocialEntry[];
  className?: string;
  compact?: boolean;
}) {
  if (!items.length) return null;
  return (
    <ul className={`social-links ${compact ? "social-links-compact" : ""} ${className ?? ""}`.trim()}>
      {items.map(({ key, href, label }) => (
        <li key={key}>
          <a href={href} target="_blank" rel="noreferrer">
            {compact ? label : `${label} ↗`}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function HeaderSocialStrip() {
  const items = getHeaderSocials();
  if (!items.length) return null;
  return (
    <div className="header-social-strip desktop-only" aria-label="Official profiles">
      {items.map(({ key, href, label }, i) => (
        <span key={key} className="header-social-item">
          {i > 0 && <span className="header-social-sep" aria-hidden="true">·</span>}
          <a href={href} target="_blank" rel="noreferrer">
            {label}
          </a>
        </span>
      ))}
    </div>
  );
}

export function MobileSocialLinks() {
  return <SocialList items={[...getListenSocials(), ...getFollowSocials()]} className="mobile-social-links" />;
}

export function FooterSocialGrid() {
  const listen = getListenSocials();
  const follow = getFollowSocials();
  const explore = [
    { href: "/music", label: "Music" },
    { href: "/worlds", label: "Worlds" },
    { href: "/cinema", label: "Cinema" },
    { href: "/request", label: "Create" },
  ] as const;

  return (
    <div className="footer-social-grid">
      {listen.length > 0 && (
        <div>
          <p className="footer-social-heading">Listen</p>
          <SocialList items={listen} />
        </div>
      )}
      {follow.length > 0 && (
        <div>
          <p className="footer-social-heading">Follow</p>
          <SocialList items={follow} />
        </div>
      )}
      <div>
        <p className="footer-social-heading">Explore</p>
        <ul className="social-links">
          {explore.map(({ href, label }) => (
            <li key={href}>
              <Link href={href}>{label} ↗</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ListenSocialBlock({ title = "Listen" }: { title?: string }) {
  const items = getListenSocials();
  if (!items.length) return null;
  return (
    <section className="social-block">
      <p className="eyebrow">{title.toUpperCase()}</p>
      <SocialList items={items} />
    </section>
  );
}

export function FollowSocialBlock({ title = "Follow Bossie" }: { title?: string }) {
  const items = getFollowSocials();
  if (!items.length) return null;
  return (
    <section className="social-block">
      <p className="eyebrow">{title.toUpperCase()}</p>
      <SocialList items={items} />
    </section>
  );
}
