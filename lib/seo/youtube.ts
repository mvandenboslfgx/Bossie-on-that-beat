/** Convert a known YouTube watch URL to its actual embeddable player URL.
 * VideoObject.embedUrl must point to the player, not a watch page.
 * Unknown hosts, playlists, malformed IDs and unsupported paths return null.
 */
export function getYouTubeEmbedUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  try {
    const url = new URL(input);
    if (url.protocol !== "https:") return null;
    const hostname = url.hostname.toLowerCase();
    let id: string | null = null;
    if (hostname === "youtu.be") {
      id = url.pathname.split("/")[1] ?? null;
    } else if (["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com"].includes(hostname)) {
      if (url.pathname === "/watch") id = url.searchParams.get("v");
      else if (/^\/(shorts|embed|live)\//.test(url.pathname)) id = url.pathname.split("/")[2] ?? null;
    }
    if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) return null;
    return `https://www.youtube-nocookie.com/embed/${id}`;
  } catch {
    return null;
  }
}
