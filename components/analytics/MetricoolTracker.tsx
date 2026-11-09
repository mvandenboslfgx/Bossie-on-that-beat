"use client";

import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./AnalyticsConsent.module.css";

const METRICOOL_HASH = "33adbeb911d57e6534bfdda3a6802361";
const CONSENT_KEY = "bossie-analytics-consent-v1";
const SETTINGS_EVENT = "bossie-open-privacy-settings";

declare global {
  interface Window {
    beTracker?: {
      t: (options: { hash: string }) => void;
    };
  }
}

/**
 * Non-essential third-party tracking is disabled by default. It is only
 * loaded after a visitor chooses analytics. No analytics search terms, form
 * content or project brief are read by this component.
 */
export function MetricoolTracker() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const lastTrackedUrl = useRef<string | null>(null);

  useEffect(() => {
    try {
      const choice = window.localStorage.getItem(CONSENT_KEY);
      setConsent(choice === "allow" ? true : choice === "deny" ? false : null);
    } catch {
      // Private browsing may disable storage. Do not track by default.
      setConsent(null);
    }
    setReady(true);

    const showSettings = () => setSettingsOpen(true);
    window.addEventListener(SETTINGS_EVENT, showSettings);
    return () => window.removeEventListener(SETTINGS_EVENT, showSettings);
  }, []);

  const trackPage = useCallback(() => {
    if (consent !== true || typeof window.beTracker?.t !== "function") return;
    const currentUrl = window.location.pathname + window.location.search;
    if (lastTrackedUrl.current === currentUrl) return;
    window.beTracker.t({ hash: METRICOOL_HASH });
    lastTrackedUrl.current = currentUrl;
  }, [consent]);

  useEffect(() => {
    trackPage();
  }, [pathname, trackPage]);

  function saveChoice(value: boolean) {
    const wasAllowed = consent === true;
    try {
      window.localStorage.setItem(CONSENT_KEY, value ? "allow" : "deny");
    } catch {
      // Explicit choice stays effective for the current visit.
    }
    if (!value) lastTrackedUrl.current = null;
    setConsent(value);
    setSettingsOpen(false);
    // Scripts already loaded into the page cannot be unloaded by React. A
    // reload is necessary to honour withdrawal without residual trackers.
    if (!value && wasAllowed) window.location.reload();
  }

  return (
    <>
      {ready && consent === true && (
        <Script
          id="metricool-tracker"
          src="https://tracker.metricool.com/resources/be.js"
          strategy="afterInteractive"
          onReady={trackPage}
        />
      )}
      {ready && (consent === null || settingsOpen) && (
        <aside className={styles.notice} role="region" aria-label="Analytics preferences">
          <div className={styles.copy}>
            <span className={styles.eyebrow}>YOUR PRIVACY MATTERS</span>
            <p>We use optional Metricool analytics to understand website visits. The website works without them.</p>
            <Link href="/privacy">Read our privacy notice</Link>
          </div>
          <div className={styles.actions}>
            <button className={styles.essential} type="button" onClick={() => saveChoice(false)}>Essential only</button>
            <button className={styles.allow} type="button" onClick={() => saveChoice(true)}>Allow analytics</button>
            {settingsOpen && consent !== null && (
              <button className={styles.close} type="button" onClick={() => setSettingsOpen(false)} aria-label="Close privacy settings">×</button>
            )}
          </div>
        </aside>
      )}
    </>
  );
}

/** Accessible footer control for revisiting a previously stored analytics choice. */
export function PrivacySettingsButton() {
  return (
    <button
      type="button"
      className={styles.footerButton}
      onClick={() => window.dispatchEvent(new Event(SETTINGS_EVENT))}
    >
      Privacy preferences
    </button>
  );
}
