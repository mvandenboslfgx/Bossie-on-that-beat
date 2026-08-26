import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getWorldBySlug,
  getReleasesByWorld,
  getAllCinema,
} from "@/lib/repository/release-repository";
import { WorldExperience } from "@/components/v3/WorldExperience";
import { PageShell } from "@/components/SiteChrome";
import { getWorldSkin } from "@/lib/worlds/tokens";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const world = await getWorldBySlug(slug);
  if (!world) return {};
  const skin = getWorldSkin(slug);
  return {
    title: `${world.title} — World`,
    description: skin?.lore ?? world.description,
    alternates: { canonical: `/worlds/${world.slug}` },
    openGraph: {
      title: `${world.title} | Bossie on the beat`,
      description: skin?.lore ?? world.description,
      images: world.heroImage ? [{ url: world.heroImage }] : undefined,
    },
  };
}

export default async function WorldDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const world = await getWorldBySlug(slug);
  if (!world) notFound();

  const [releases, cinemaAll] = await Promise.all([getReleasesByWorld(slug), getAllCinema()]);
  const cinema = cinemaAll.filter((c) => c.worldSlug === slug);

  return (
    <PageShell worldSlug={slug} tone={slug === "the-mountain" ? "light" : undefined}>
      <WorldExperience world={world} releases={releases} cinema={cinema} />
    </PageShell>
  );
}
