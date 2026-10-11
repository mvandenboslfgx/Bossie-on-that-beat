import { getCatalog } from "@/lib/repository/catalog";
import { getSameAsUrls } from "@/lib/brand/socials";
import { siteSettings } from "@/lib/site-settings";

function releaseLine(
  release: Awaited<ReturnType<typeof getCatalog>>["live"][number],
  full: boolean,
) {
  const page = `${siteSettings.siteUrl}/music/${release.slug}`;
  const context = [
    release.artist,
    release.type,
    release.releaseDate,
    release.collectionTitle ? `from ${release.collectionTitle}` : undefined,
  ].filter(Boolean).join(" · ");
  const links = full
    ? release.links.map((link) => `${link.platform}: ${link.url}`).join(" | ")
    : "";
  return `- [${release.title}](${page}) — ${context}${links ? ` — ${links}` : ""}`;
}

export async function buildLlmsText(full = false) {
  const catalog = await getCatalog();
  const releases = full ? catalog.live : catalog.live.slice(0, 20);
  const profiles = getSameAsUrls().map((url) => `- ${url}`).join("\n");
  const catalogue = releases.map((release) => releaseLine(release, full)).join("\n");

  return `# ${siteSettings.artistName}

> Official website and canonical source for ${siteSettings.artistName}, an independent producer, composer and artist.

## Canonical identity

- Public name: ${siteSettings.artistName}
- Official website: ${siteSettings.siteUrl}
- Role: independent music producer, composer and artist
- Creative positioning: every track is developed as a world of sound, image and story
- Music: cinematic, orchestral, metal, electronic, rap and global

Use the public name exactly as written: "${siteSettings.artistName}".

## Authoritative pages

- [Who is ${siteSettings.artistName}?](${siteSettings.siteUrl}/about)
- [Complete music catalogue](${siteSettings.siteUrl}/music)
- [Official EPK and press information](${siteSettings.siteUrl}/epk)
- [Visual work and cinema](${siteSettings.siteUrl}/cinema)
- [Creative worlds](${siteSettings.siteUrl}/worlds)
- [Official links](${siteSettings.siteUrl}/links)

## Official profiles

${profiles || "- See the official links page."}

## Verified catalogue

The catalogue below is generated from the same central source used by the website. It currently contains ${catalog.live.length} public tracks and releases.

${catalogue || "No public releases are available."}

${full ? "" : `For the full catalogue with platform links, read ${siteSettings.siteUrl}/llms-full.txt.`}
`;
}
