"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

type TrackedLinkProps = {
  href: string;
  releaseId?: string;
  platform?: string;
  className?: string;
  target?: string;
  rel?: string;
  children: ReactNode;
  ariaLabel?: string;
};

function recordClick(releaseId?: string, platform?: string) {
  if (typeof window === "undefined") return;
  const query = new URLSearchParams(window.location.search);
  const payload = JSON.stringify({
    releaseId,
    platform,
    source: (query.get("utm_source") ?? document.referrer) || undefined,
    medium: query.get("utm_medium") ?? undefined,
    campaign: query.get("utm_campaign") ?? undefined,
    deviceType: window.matchMedia("(max-width: 760px)").matches ? "mobile" : "desktop",
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/smartlink/track", new Blob([payload], { type: "application/json" }));
    return;
  }
  void fetch("/api/smartlink/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  });
}

export function TrackedLink({
  href,
  releaseId,
  platform,
  className,
  target,
  rel,
  children,
  ariaLabel,
}: TrackedLinkProps) {
  const onClick = (_event: MouseEvent<HTMLAnchorElement>) => recordClick(releaseId, platform);
  const data = { "data-analytics-event": "release-click", "data-release-id": releaseId, "data-platform": platform };

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} onClick={onClick} aria-label={ariaLabel} {...data}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={onClick}
      aria-label={ariaLabel}
      {...data}
    >
      {children}
    </a>
  );
}
