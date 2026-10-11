import type { ReactNode } from "react";

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
  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      data-analytics-event="release-click"
      data-release-id={releaseId}
      data-platform={platform}
    >
      {children}
    </a>
  );
}
