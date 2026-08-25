/** Production rule: never surface search/results URLs as official listen/follow links. */
export function isPublicHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (parsed.protocol === "https:" || parsed.protocol === "http:") && Boolean(parsed.hostname) && parsed.pathname !== "#";
  } catch {
    return false;
  }
}

export function isSearchOrPlaceholderUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const href = parsed.href.toLowerCase();
    const path = parsed.pathname.toLowerCase();
    if (url === "#" || !url.trim()) return true;
    if (path.includes("/search") || path.includes("/results")) return true;
    if (href.includes("search_query=") || href.includes("?q=") || href.includes("&q=")) return true;
    if (href.includes("explore/search")) return true;
    if (href.includes("search/top") || href.includes("search/keyword")) return true;
    return false;
  } catch {
    return true;
  }
}

export function isVerifiedListenUrl(url: string): boolean {
  return isPublicHttpUrl(url) && !isSearchOrPlaceholderUrl(url);
}
