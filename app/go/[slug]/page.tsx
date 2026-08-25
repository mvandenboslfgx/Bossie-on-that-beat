import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAllReleases, getReleaseBySlug, getLatestRelease, getPrimaryListenLink } from "@/lib/repository/release-repository";
import { ReleaseArtwork, PlatformLinks } from "@/components/release/ReleaseUI";
import { PageShell } from "@/components/SiteChrome";

export async function generateStaticParams() {
  const releases = await getAllReleases();
  return [...releases.map((r) => ({ slug: r.slug })), { slug: "latest" }];
}

export default async function GoPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;

  if (slug === "latest") {
    const latest = await getLatestRelease();
    if (!latest) redirect("/links");
    redirect(`/go/${latest.slug}`);
  }

  const release = await getReleaseBySlug(slug);
  if (!release || release.status !== "live") notFound();

  const platform = query.platform;
  if (platform) {
    const link = release.links.find((l) => l.platform === platform);
    if (link?.url) redirect(link.url);
  }

  const primary = getPrimaryListenLink(release);

  return (
    <PageShell>
      <section className="smartlink-page section-pad">
        <ReleaseArtwork release={release} large />
        <div className="smartlink-copy">
          <p className="eyebrow">LISTEN NOW</p>
          <h1>{release.title}</h1>
          <p>{release.artist}</p>
          {primary && (
            <a className="button button-gold" href={primary.url} target="_blank" rel="noreferrer">
              LISTEN NOW ↗
            </a>
          )}
          <PlatformLinks release={release} />
        </div>
        <Link className="back-link" href={`/music/${release.slug}`}>
          Full release page ↗
        </Link>
      </section>
    </PageShell>
  );
}
