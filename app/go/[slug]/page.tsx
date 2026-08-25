import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  getReleaseBySlug,
  getLatestRelease,
  getPrimaryListenLink,
} from "@/lib/repository/release-repository";
import { BossieLogo } from "@/components/brand/BossieLogo";
import { FollowSocialBlock } from "@/components/brand/SocialLinks";
import { ReleaseArtwork, PlatformLinks } from "@/components/release/ReleaseUI";
import { PageShell } from "@/components/SiteChrome";
import { siteSettings } from "@/lib/site-settings";
import { isVerifiedListenUrl } from "@/lib/links/url";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "latest") {
    return { title: "Latest Release", alternates: { canonical: "/go/latest" } };
  }
  const release = await getReleaseBySlug(slug);
  if (!release) return {};
  return {
    title: `Listen — ${release.title}`,
    description: `Listen to ${release.title} by ${siteSettings.artistName} on your preferred platform.`,
    alternates: { canonical: `/go/${release.slug}` },
    openGraph: {
      title: release.title,
      description: `Listen now — ${siteSettings.artistName}`,
      images: release.artworkUrl ? [{ url: release.artworkUrl }] : undefined,
    },
  };
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
    const link = release.links.find((l) => l.platform === platform && l.url && isVerifiedListenUrl(l.url));
    if (link?.url) redirect(link.url);
  }

  const primary = getPrimaryListenLink(release);

  return (
    <PageShell>
      <section className="smartlink-page section-pad">
        <BossieLogo variant="primary" href="/" className="smartlink-logo" />
        <ReleaseArtwork release={release} large />
        <div className="smartlink-copy">
          <h1>{release.title}</h1>
          <p>{siteSettings.artistName}</p>
          {primary && (
            <a className="button button-gold" href={primary.url} target="_blank" rel="noreferrer">
              LISTEN NOW ↗
            </a>
          )}
          <PlatformLinks release={release} />
          <FollowSocialBlock title="Follow Bossie" />
          <div className="smartlink-secondary">
            <Link className="text-link" href={`/music/${release.slug}`}>
              Explore release ↗
            </Link>
            <Link className="text-link" href="/links">
              Follow Bossie ↗
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
