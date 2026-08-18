import { notFound } from "next/navigation";
import { releases, getRelease } from "@/data/catalog";
import { ReleaseCover } from "@/components/ReleaseCard";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";

export function generateStaticParams(){ return releases.map(r=>({slug:r.slug})); }

export default async function ReleasePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const r=getRelease(slug); if(!r) notFound();
 return <><SiteNav/><main className="subpage release-detail"><section className="release-detail-grid"><ReleaseCover release={r}/><div className="release-detail-copy"><p className="eyebrow">{r.status === "live" ? "OFFICIAL RELEASE" : "BOSSIE WORLD"}</p><h1>{r.title}</h1><p className="release-world">{r.mood} · {r.year}</p><p>{r.subtitle}. Part of the {r.world} world within Bossie on the beat.</p><div className="release-actions">{r.spotify&&<a href={r.spotify} target="_blank" rel="noreferrer">Spotify ↗</a>}{r.youtube&&<a href={r.youtube} target="_blank" rel="noreferrer">YouTube ↗</a>}{r.amazon&&<a href={r.amazon} target="_blank" rel="noreferrer">Amazon Music ↗</a>}</div><a className="back-link" href="/music">← Back to catalogue</a></div></section></main><SiteFooter/></>
}
