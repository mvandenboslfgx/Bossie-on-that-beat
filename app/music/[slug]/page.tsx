import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { releases, getRelease } from "@/data/catalog";
import { ReleaseCover } from "@/components/ReleaseCard";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";

const base = "https://bossieonthatbeat.com";

export function generateStaticParams(){ return releases.map(r=>({slug:r.slug})); }

export async function generateMetadata({params}:{params:Promise<{slug:string}>}): Promise<Metadata> {
  const { slug } = await params;
  const r = getRelease(slug);
  if (!r) return {};
  const description = `${r.title} by Bossie on the beat — ${r.subtitle}. ${r.mood} from the ${r.world} world. Listen, watch and explore the official release page.`;
  return {
    title: `${r.title} — Official Release`,
    description,
    alternates: { canonical: `/music/${r.slug}` },
    openGraph: {
      type: "music.song",
      url: `${base}/music/${r.slug}`,
      title: `${r.title} | Bossie on the beat`,
      description,
      images: r.artwork ? [{ url: r.artwork, alt: `${r.title} cover artwork` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${r.title} | Bossie on the beat`,
      description,
      images: r.artwork ? [r.artwork] : undefined,
    },
  };
}

export default async function ReleasePage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const r=getRelease(slug);
  if(!r) notFound();

  const sameAs = [r.spotify, r.youtube, r.amazon].filter(Boolean);
  const recordingSchema = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    "@id": `${base}/music/${r.slug}#recording`,
    name: r.title,
    url: `${base}/music/${r.slug}`,
    datePublished: r.year,
    genre: r.mood,
    description: `${r.subtitle}. ${r.mood} from the ${r.world} world by Bossie on the beat.`,
    byArtist: {
      "@type": "MusicGroup",
      "@id": `${base}/#artist`,
      name: "Bossie on the beat",
      url: base,
    },
    image: r.artwork || undefined,
    sameAs,
  };

  return <>
    <SiteNav/>
    <main className="subpage release-detail">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(recordingSchema)}} />
      <section className="release-detail-grid">
        <ReleaseCover release={r}/>
        <div className="release-detail-copy">
          <p className="eyebrow">{r.status === "live" ? "OFFICIAL RELEASE" : "BOSSIE WORLD"}</p>
          <h1>{r.title}</h1>
          <p className="release-world">{r.mood} · {r.year}</p>
          <p>{r.subtitle}. Part of the {r.world} world within Bossie on the beat. This official page collects the release context, listening destinations and visual identity in one canonical location.</p>
          <div className="release-actions">
            {r.spotify&&<a href={r.spotify} target="_blank" rel="noreferrer">Spotify ↗</a>}
            {r.youtube&&<a href={r.youtube} target="_blank" rel="noreferrer">YouTube ↗</a>}
            {r.amazon&&<a href={r.amazon} target="_blank" rel="noreferrer">Amazon Music ↗</a>}
          </div>
          <a className="back-link" href="/music">← Back to catalogue</a>
        </div>
      </section>
    </main>
    <SiteFooter/>
  </>
}
