"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

const METRICOOL_HASH = "33adbeb911d57e6534bfdda3a6802361";

declare global {
  interface Window {
    beTracker?: {
      t: (options: { hash: string }) => void;
    };
  }
}

/**
 * Loads Metricool once for the entire site and records client-side page changes.
 * Keeping the last tracked URL prevents duplicate views on hydration/remounts.
 */
export function MetricoolTracker() {
  const pathname = usePathname();
  const lastTrackedUrl = useRef<string | null>(null);

  const trackPage = useCallback(() => {
    if (typeof window === "undefined" || typeof window.beTracker?.t !== "function") return;

    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl === lastTrackedUrl.current) return;

    window.beTracker.t({ hash: METRICOOL_HASH });
    lastTrackedUrl.current = currentUrl;
  }, []);

  useEffect(() => {
    trackPage();
  }, [pathname, trackPage]);

  return (
    <Script
      id="metricool-tracker"
      src="https://tracker.metricool.com/resources/be.js"
      strategy="afterInteractive"
      onReady={trackPage}
    />
  );
}
