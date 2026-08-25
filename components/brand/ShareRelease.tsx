"use client";

import { useCallback, useState } from "react";

export function ShareRelease({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/music/${slug}` : `/music/${slug}`;

  const share = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [title, url]);

  return (
    <section className="social-block share-block">
      <p className="eyebrow">SHARE THIS WORLD</p>
      <div className="share-actions">
        <button type="button" className="button button-ghost" onClick={() => void share()}>
          {copied ? "Link copied" : "Share / copy link ↗"}
        </button>
      </div>
    </section>
  );
}
